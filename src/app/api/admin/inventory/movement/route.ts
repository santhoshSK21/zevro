import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { assertAdminAccess } from '@/lib/adminAuth';
import { Product } from '@/models/Product';
import { Order } from '@/models/Order';
import { InventoryTransaction } from '@/models/InventoryTransaction';
import { Seller } from '@/models/Seller';

export type MovementClass = 'MOVING' | 'SLOW' | 'NO_MOVEMENT' | 'OUT_OF_STOCK' | 'NEW_ARRIVAL';

export interface VariantSizeMovement {
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  category: string;
  brand: string;
  variantId: string;
  color: string;
  colorHex?: string;
  size: string;
  sku: string;
  pricePaise: number;
  availableStock: number;
  reservedStock: number;
  totalSold: number;
  soldLast30d: number;
  soldLast90d: number;
  lastSaleDate: string | null;
  daysSinceLastSale: number | null;
  stockReceiptDate: string;
  stockAgeingDays: number;
  velocityDaily: number;
  velocityWeekly: number;
  daysOfInventory: number;
  movementStatus: MovementClass;
  actionRecommendation: string;
}

export async function GET(request: Request) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const movementFilter = searchParams.get('movement'); // 'ALL' | 'MOVING' | 'SLOW' | 'NO_MOVEMENT' | 'OUT_OF_STOCK' | 'NEW_ARRIVAL'
    const categoryFilter = searchParams.get('category');
    const brandFilter = searchParams.get('brand');
    const colorFilter = searchParams.get('color');
    const sizeFilter = searchParams.get('size');
    const ageingFilter = searchParams.get('ageing'); // 'all' | '0-30' | '31-60' | '61-90' | '90+'
    const search = searchParams.get('search');

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    // 1. Fetch All Products
    const products = await Product.find({ status: { $ne: 'ARCHIVED' } }).lean();

    // 2. Fetch Orders for Sales & Reserved Stock Analysis
    const orders = await Order.find({ status: { $ne: 'cancelled' } })
      .select('items status createdAt orderId')
      .lean();

    // 3. Fetch Inventory Transactions for Stock Receipt Dates
    const transactions = await InventoryTransaction.find({ type: 'STOCK_RECEIVED' })
      .select('productId variantId size createdAt')
      .sort({ createdAt: -1 })
      .lean();

    // Map: receipt date by `productId_size`
    const receiptDateMap = new Map<string, Date>();
    transactions.forEach((tx: any) => {
      const key = `${tx.productId}_${tx.size}`;
      if (!receiptDateMap.has(key)) {
        receiptDateMap.set(key, new Date(tx.createdAt));
      }
    });

    // Maps for Sales Aggregations
    interface ItemSalesMeta {
      totalSold: number;
      sold30d: number;
      sold90d: number;
      lastSaleDate: Date | null;
      reservedStock: number;
    }

    const salesMap = new Map<string, ItemSalesMeta>();

    orders.forEach((order: any) => {
      const isReserved = ['placed', 'confirmed', 'processing', 'packed', 'ready_to_ship'].includes(order.status);
      const isDeliveredOrSold = !['cancelled', 'returned'].includes(order.status);
      const orderDate = new Date(order.createdAt);

      if (Array.isArray(order.items)) {
        order.items.forEach((it: any) => {
          const qty = it.quantity || 1;
          const pId = it.productId?.toString();
          const sku = it.sku;
          const color = (it.color || '').trim().toLowerCase();
          const size = (it.size || '').trim().toUpperCase();

          // Key by SKU, and also by ProductId_Color_Size as fallback
          const keys = [
            sku ? `sku:${sku}` : null,
            pId ? `p:${pId}_${color}_${size}` : null,
          ].filter(Boolean) as string[];

          keys.forEach((k) => {
            let meta = salesMap.get(k);
            if (!meta) {
              meta = {
                totalSold: 0,
                sold30d: 0,
                sold90d: 0,
                lastSaleDate: null,
                reservedStock: 0,
              };
              salesMap.set(k, meta);
            }

            if (isReserved) {
              meta.reservedStock += qty;
            }

            if (isDeliveredOrSold) {
              meta.totalSold += qty;
              if (orderDate >= thirtyDaysAgo) {
                meta.sold30d += qty;
              }
              if (orderDate >= ninetyDaysAgo) {
                meta.sold90d += qty;
              }
              if (!meta.lastSaleDate || orderDate > meta.lastSaleDate) {
                meta.lastSaleDate = orderDate;
              }
            }
          });
        });
      }
    });

    // 4. Transform into Variant-Level Movement Records
    const allVariantRows: VariantSizeMovement[] = [];
    let movingCount = 0;
    let slowCount = 0;
    let noMovementCount = 0;
    let outOfStockCount = 0;
    let newArrivalCount = 0;
    let totalAvailableUnits = 0;
    let totalReservedUnits = 0;
    let capitalInDeadStockPaise = 0;

    const uniqueCategories = new Set<string>();
    const uniqueBrands = new Set<string>();
    const uniqueColors = new Set<string>();
    const uniqueSizes = new Set<string>();

    products.forEach((p: any) => {
      const pId = p._id.toString();
      const pName = p.name || 'Untitled Garment';
      const pSlug = p.slug || '';
      const pCategory = p.category || 'General';
      const pBrand = p.sellerStoreName || 'ZEVRO Signature Atelier';
      const pPrice = p.price || 0;
      const pDefaultImage = p.variants?.[0]?.images?.[0] || '/pdp_hero_1.png';
      const pCreatedAt = new Date(p.createdAt || Date.now());

      uniqueCategories.add(pCategory);
      uniqueBrands.add(pBrand);

      if (Array.isArray(p.variants)) {
        p.variants.forEach((v: any, vIdx: number) => {
          const vColor = v.colorName || `Color ${vIdx + 1}`;
          const vColorHex = v.colorHex;
          const vImage = v.images?.[0] || pDefaultImage;
          uniqueColors.add(vColor);

          if (Array.isArray(v.sizes)) {
            v.sizes.forEach((sObj: any) => {
              const sSize = sObj.size || 'M';
              const sSku = sObj.sku || `${pSlug.toUpperCase().slice(0, 8)}-${vColor.slice(0, 3).toUpperCase()}-${sSize}`;
              const availableStock = Math.max(0, sObj.stock || 0);

              uniqueSizes.add(sSize);

              // Lookup sales metrics
              const skuKey = `sku:${sSku}`;
              const fallbackKey = `p:${pId}_${vColor.trim().toLowerCase()}_${sSize.trim().toUpperCase()}`;
              const salesMeta = salesMap.get(skuKey) || salesMap.get(fallbackKey) || {
                totalSold: 0,
                sold30d: 0,
                sold90d: 0,
                lastSaleDate: null,
                reservedStock: 0,
              };

              // Determine Stock Receipt Date & Ageing
              const receiptLookupKey = `${pId}_${sSize}`;
              const stockReceiptDate = receiptDateMap.get(receiptLookupKey) || pCreatedAt;
              const stockAgeingDays = Math.max(0, Math.floor((now.getTime() - stockReceiptDate.getTime()) / (1000 * 60 * 60 * 24)));

              // Sales Velocity
              const velocityDaily = Number((salesMeta.sold30d / 30).toFixed(2));
              const velocityWeekly = Number(((salesMeta.sold30d / 30) * 7).toFixed(1));
              const daysOfInventory = velocityDaily > 0
                ? Math.round(availableStock / velocityDaily)
                : (availableStock > 0 ? 999 : 0);

              // Days Since Last Sale
              const daysSinceLastSale = salesMeta.lastSaleDate
                ? Math.floor((now.getTime() - salesMeta.lastSaleDate.getTime()) / (1000 * 60 * 60 * 24))
                : null;

              // INDEPENDENT VARIANT-LEVEL MOVEMENT CLASSIFICATION RULE
              let movementStatus: MovementClass;
              let actionRecommendation = '';

              if (availableStock === 0) {
                movementStatus = 'OUT_OF_STOCK';
                if (salesMeta.sold30d > 0) {
                  actionRecommendation = 'High Demand OOS: Urgent re-stock recommended from workshop.';
                } else {
                  actionRecommendation = 'Zero stock. Review whether to archive or replenish.';
                }
                outOfStockCount++;
              } else {
                // Available Stock > 0
                if (salesMeta.sold30d >= 3 || (salesMeta.sold90d >= 5 && daysSinceLastSale !== null && daysSinceLastSale <= 21)) {
                  movementStatus = 'MOVING';
                  if (daysOfInventory <= 14) {
                    actionRecommendation = `Fast Mover with only ${daysOfInventory} days of stock remaining. Place replenishment order.`;
                  } else {
                    actionRecommendation = 'Strong steady movement. Maintain standard stock buffer.';
                  }
                  movingCount++;
                } else if (salesMeta.sold30d >= 1 || (salesMeta.totalSold > 0 && daysSinceLastSale !== null && daysSinceLastSale <= 60)) {
                  movementStatus = 'SLOW';
                  actionRecommendation = 'Sluggish demand. Feature in curated editorial collections or consider a 10-15% incentive.';
                  slowCount++;
                  capitalInDeadStockPaise += availableStock * pPrice;
                } else if (stockAgeingDays >= 30 && (salesMeta.totalSold === 0 || (daysSinceLastSale !== null && daysSinceLastSale > 60))) {
                  movementStatus = 'NO_MOVEMENT';
                  actionRecommendation = `Zero sales in ${stockAgeingDays} days. Dead stock alert: Reposition on storefront, apply clearance discount, or bundle.`;
                  noMovementCount++;
                  capitalInDeadStockPaise += availableStock * pPrice;
                } else {
                  movementStatus = 'NEW_ARRIVAL';
                  actionRecommendation = `Fresh inventory received ${stockAgeingDays} days ago. Currently monitoring initial velocity.`;
                  newArrivalCount++;
                }
              }

              totalAvailableUnits += availableStock;
              totalReservedUnits += salesMeta.reservedStock;

              allVariantRows.push({
                productId: pId,
                productName: pName,
                productSlug: pSlug,
                productImage: vImage,
                category: pCategory,
                brand: pBrand,
                variantId: v._id ? v._id.toString() : vColor,
                color: vColor,
                colorHex: vColorHex,
                size: sSize,
                sku: sSku,
                pricePaise: pPrice,
                availableStock,
                reservedStock: salesMeta.reservedStock,
                totalSold: salesMeta.totalSold,
                soldLast30d: salesMeta.sold30d,
                soldLast90d: salesMeta.sold90d,
                lastSaleDate: salesMeta.lastSaleDate ? salesMeta.lastSaleDate.toISOString() : null,
                daysSinceLastSale,
                stockReceiptDate: stockReceiptDate.toISOString(),
                stockAgeingDays,
                velocityDaily,
                velocityWeekly,
                daysOfInventory,
                movementStatus,
                actionRecommendation,
              });
            });
          }
        });
      }
    });

    // 5. Apply User Filters to Flat List
    let filteredRows = allVariantRows;

    if (movementFilter && movementFilter !== 'ALL') {
      filteredRows = filteredRows.filter((r) => r.movementStatus === movementFilter);
    }

    if (categoryFilter && categoryFilter !== 'ALL') {
      filteredRows = filteredRows.filter(
        (r) => r.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    if (brandFilter && brandFilter !== 'ALL') {
      filteredRows = filteredRows.filter(
        (r) => r.brand.toLowerCase() === brandFilter.toLowerCase()
      );
    }

    if (colorFilter && colorFilter !== 'ALL') {
      filteredRows = filteredRows.filter(
        (r) => r.color.toLowerCase() === colorFilter.toLowerCase()
      );
    }

    if (sizeFilter && sizeFilter !== 'ALL') {
      filteredRows = filteredRows.filter(
        (r) => r.size.toUpperCase() === sizeFilter.toUpperCase()
      );
    }

    if (ageingFilter && ageingFilter !== 'all') {
      if (ageingFilter === '0-30') filteredRows = filteredRows.filter((r) => r.stockAgeingDays <= 30);
      else if (ageingFilter === '31-60') filteredRows = filteredRows.filter((r) => r.stockAgeingDays > 30 && r.stockAgeingDays <= 60);
      else if (ageingFilter === '61-90') filteredRows = filteredRows.filter((r) => r.stockAgeingDays > 60 && r.stockAgeingDays <= 90);
      else if (ageingFilter === '90+') filteredRows = filteredRows.filter((r) => r.stockAgeingDays > 90);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filteredRows = filteredRows.filter(
        (r) =>
          r.productName.toLowerCase().includes(q) ||
          r.sku.toLowerCase().includes(q) ||
          r.color.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      );
    }

    // 6. Build Hierarchical Product Grouping (Product -> Color -> Sizes)
    // Directly addressing:
    // Product: Cotton T-shirt
    // Black: S: Moving, M: Moving, L: Slow, XL: No movement
    // White: S: Moving, M: Slow, L: No movement
    const hierarchicalMap = new Map<string, any>();

    filteredRows.forEach((row) => {
      let productGroup = hierarchicalMap.get(row.productId);
      if (!productGroup) {
        productGroup = {
          productId: row.productId,
          productName: row.productName,
          productSlug: row.productSlug,
          productImage: row.productImage,
          category: row.category,
          brand: row.brand,
          colors: new Map<string, any>(),
        };
        hierarchicalMap.set(row.productId, productGroup);
      }

      let colorGroup = productGroup.colors.get(row.color);
      if (!colorGroup) {
        colorGroup = {
          colorName: row.color,
          colorHex: row.colorHex,
          sizes: [],
        };
        productGroup.colors.set(row.color, colorGroup);
      }

      colorGroup.sizes.push({
        size: row.size,
        sku: row.sku,
        availableStock: row.availableStock,
        reservedStock: row.reservedStock,
        totalSold: row.totalSold,
        soldLast30d: row.soldLast30d,
        stockAgeingDays: row.stockAgeingDays,
        velocityWeekly: row.velocityWeekly,
        movementStatus: row.movementStatus,
        actionRecommendation: row.actionRecommendation,
      });
    });

    const hierarchicalProducts = Array.from(hierarchicalMap.values()).map((p) => ({
      ...p,
      colors: Array.from(p.colors.values()),
    }));

    return NextResponse.json({
      summary: {
        totalVariants: allVariantRows.length,
        movingCount,
        slowCount,
        noMovementCount,
        outOfStockCount,
        newArrivalCount,
        totalAvailableUnits,
        totalReservedUnits,
        capitalInDeadStockPaise,
      },
      hierarchicalProducts,
      flatVariants: filteredRows,
      filterOptions: {
        categories: Array.from(uniqueCategories),
        brands: Array.from(uniqueBrands),
        colors: Array.from(uniqueColors),
        sizes: Array.from(uniqueSizes),
      },
    });
  } catch (error) {
    console.error('Fetch movement intelligence error:', error);
    return NextResponse.json({ error: 'Failed to analyze product movement intelligence' }, { status: 500 });
  }
}

