import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const MENUS: Record<string, any> = {
  'WESTERN WEAR': {
    col1: {
      title: 'CLOTHING',
      links: [
        { label: 'Tops & Tees', href: '/products?category=western-wear&sub=tops' },
        { label: 'Dresses', href: '/products?category=western-wear&sub=dresses' },
        { label: 'Co-ord Sets', href: '/products?category=western-wear&sub=co-ords' },
        { label: 'Jumpsuits', href: '/products?category=western-wear&sub=jumpsuits' },
        { label: 'Trousers', href: '/products?category=western-wear&sub=trousers' },
        { label: 'Blazers', href: '/products?category=western-wear&sub=blazers' },
      ]
    },
    col2: {
      title: 'TRENDING',
      links: [
        { label: 'New Arrivals', href: '/products?category=western-wear&offers=new' },
        { label: 'Bestsellers', href: '/products?category=western-wear&offers=bestseller' },
        { label: 'Under ₹999', href: '/products?category=western-wear&maxPrice=999' },
        { label: 'Under ₹1,999', href: '/products?category=western-wear&maxPrice=1999' },
        { label: 'Sale', href: '/products?category=western-wear&offers=discount' },
      ]
    },
    featured: {
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
      title: 'THE WESTERN EDIT',
      btn: 'SHOP NOW',
      href: '/products?category=western-wear'
    }
  },
  'ETHNIC WEAR': {
    col1: {
      title: 'CLOTHING',
      links: [
        { label: 'Sarees', href: '/products?category=ethnic-wear&sub=sarees' },
        { label: 'Salwar Suits', href: '/products?category=ethnic-wear&sub=suits' },
        { label: 'Anarkalis', href: '/products?category=ethnic-wear&sub=anarkalis' },
        { label: 'Lehengas', href: '/products?category=ethnic-wear&sub=lehengas' },
        { label: 'Kurtis', href: '/products?category=ethnic-wear&sub=kurtis' },
        { label: 'Dupattas', href: '/products?category=ethnic-wear&sub=dupattas' },
      ]
    },
    col2: {
      title: 'OCCASION',
      links: [
        { label: 'Festive', href: '/products?category=ethnic-wear&occasion=festive' },
        { label: 'Wedding', href: '/products?category=ethnic-wear&occasion=wedding' },
        { label: 'Casual', href: '/products?category=ethnic-wear&occasion=casual' },
        { label: 'Office Wear', href: '/products?category=ethnic-wear&occasion=office' },
        { label: 'Party Wear', href: '/products?category=ethnic-wear&occasion=party' },
      ]
    },
    featured: {
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
      title: 'FESTIVE EDIT',
      btn: 'SHOP ETHNIC',
      href: '/products?category=ethnic-wear'
    }
  },
  'INDO-WESTERN': {
    col1: {
      title: 'CLOTHING',
      links: [
        { label: 'Fusion Sets', href: '/products?category=indo-western&sub=fusion-sets' },
        { label: 'Indo Gowns', href: '/products?category=indo-western&sub=indo-gowns' },
        { label: 'Dhoti Sets', href: '/products?category=indo-western&sub=dhoti-sets' },
      ]
    },
    col2: {
      title: 'TRENDING',
      links: [
        { label: 'New Arrivals', href: '/products?category=indo-western&offers=new' },
        { label: 'Bestsellers', href: '/products?category=indo-western&offers=bestseller' },
      ]
    },
    featured: {
      image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80',
      title: 'FUSION EDIT',
      btn: 'EXPLORE',
      href: '/products?category=indo-western'
    }
  },
  'ACCESSORIES': {
    col1: {
      title: 'SHOP BY TYPE',
      links: [
        { label: 'Bags', href: '/products?category=accessories&sub=bags' },
        { label: 'Jewellery', href: '/products?category=accessories&sub=jewellery' },
        { label: 'Footwear', href: '/products?category=accessories&sub=footwear' },
      ]
    },
    col2: {
      title: 'CURATIONS',
      links: [
        { label: 'Wedding Collection', href: '/products?category=accessories&occasion=wedding' },
        { label: 'Everyday Essentials', href: '/products?category=accessories&occasion=casual' },
      ]
    },
    featured: {
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
      title: 'ACCESSORY EDIT',
      btn: 'SHOP NOW',
      href: '/products?category=accessories'
    }
  }
};

export default function MegaMenu({ category, close }: { category: string, close: () => void }) {
  const data = MENUS[category];
  if (!data) return null;

  return (
    <div className="container" style={{ padding: '40px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '48px' }}>
      
      {/* Column 1 */}
      <div>
        <h4 style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.2em', color: 'var(--gold)', marginBottom: '20px' }}>{data.col1.title}</h4>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {data.col1.links.map((link: any) => (
            <li key={link.label}>
              <Link href={link.href} onClick={close} style={{ fontSize: '13px', color: 'var(--espresso)' }} className="mega-link">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 2 */}
      <div>
        <h4 style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.2em', color: 'var(--gold)', marginBottom: '20px' }}>{data.col2.title}</h4>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {data.col2.links.map((link: any) => (
            <li key={link.label}>
              <Link href={link.href} onClick={close} style={{ fontSize: '13px', color: 'var(--espresso)' }} className="mega-link">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 3 - Featured */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center', backgroundColor: 'var(--beige)', padding: '24px' }}>
        <div style={{ position: 'relative', width: '200px', height: '260px' }}>
          <Image src={data.featured.image} alt={data.featured.title} fill style={{ objectFit: 'cover' }} />
        </div>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '16px' }}>{data.featured.title}</h3>
          <Link href={data.featured.href} onClick={close} className="btn btn-outline-gold btn-sm" style={{ border: '1px solid var(--gold)', color: 'var(--espresso)', padding: '8px 16px' }}>
            {data.featured.btn}
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .mega-link { transition: color 0.2s; }
        .mega-link:hover { color: var(--gold) !important; }
      `}} />
    </div>
  );
}
