'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useCartStore } from '../../store/cartStore';

export default function CartSync() {
  const { data: session, status } = useSession();
  const { items, clearCart } = useCartStore();
  const initialized = useRef(false);
  const isSyncing = useRef(false);

  // Sync logic when user logs in or refreshes
  useEffect(() => {
    if (status === 'loading') return;
    
    if (session?.user?.id) {
      // User is logged in
      const syncCart = async () => {
        if (isSyncing.current) return;
        isSyncing.current = true;
        
        try {
          // If we haven't initialized this session, we need to merge
          if (!initialized.current) {
            initialized.current = true;
            const res = await fetch('/api/cart');
            if (res.ok) {
              const data = await res.json();
              const serverItems = data.items || [];
              
              // Merge logic: local items take precedence or combine quantities
              const mergedItems = [...serverItems];
              let hasChanges = false;
              
              items.forEach(localItem => {
                const existing = mergedItems.find(i => i.sku === localItem.sku);
                if (existing) {
                  // Keep server item but we could combine qty if we want
                  // For simplicity, we just use local if it differs, or add to server
                  hasChanges = true;
                } else {
                  mergedItems.push(localItem);
                  hasChanges = true;
                }
              });

              // Overwrite local cart with merged items
              useCartStore.setState({ items: mergedItems });
              
              // Push merged cart back to server if it changed
              if (hasChanges || items.length > 0) {
                await fetch('/api/cart', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ items: mergedItems })
                });
              }
            }
          } else {
            // Already initialized, so local changes should push to server
            await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items })
            });
          }
        } catch (e) {
          console.error("Cart sync failed", e);
        } finally {
          isSyncing.current = false;
        }
      };
      
      syncCart();
    } else {
      // Guest user: do nothing, rely on local storage
      // Note: If they just logged out, we might want to clear the cart or keep it. We'll keep it as guest cart.
      initialized.current = false;
    }
  }, [session, status, items]);

  return null;
}
