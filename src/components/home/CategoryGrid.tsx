import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CategoryGrid() {
  const categories = [
    {
      title: 'WESTERN WEAR',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
      link: '/products?category=western-wear',
      desc: 'Chic. Confident. Unapologetically You.',
      textColor: '#1A110B'
    },
    {
      title: 'ETHNIC WEAR',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
      link: '/products?category=ethnic-wear',
      desc: 'Tradition that never goes out of style.',
      textColor: '#F8F5F0'
    },
    {
      title: 'INDO-WESTERN',
      image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80',
      link: '/products?category=indo-western',
      desc: 'Where tradition meets contemporary elegance.',
      textColor: '#1A110B'
    }
  ];

  return (
    <section style={{ width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      {categories.map((cat, i) => (
        <Link key={i} href={cat.link} style={{ display: 'block', position: 'relative', flex: '1 1 300px', aspectRatio: '4/3', overflow: 'hidden' }} className="cat-card">
          <Image 
            src={cat.image} 
            alt={cat.title} 
            fill 
            style={{ objectFit: 'cover', transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }} 
            className="cat-img"
          />
          <div style={{ 
            position: 'absolute', inset: 0, 
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: '12%',
            color: cat.textColor
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 2.5vw, 32px)', letterSpacing: '0.1em', marginBottom: '16px', fontWeight: 400 }}>
              {cat.title}
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', lineHeight: 1.8, maxWidth: '200px', marginBottom: '32px', opacity: 0.9 }}>
              {cat.desc}
            </p>
            <span className="shop-link" style={{ 
              fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.2em', 
              fontWeight: 600, borderBottom: `1px solid ${cat.textColor}`, paddingBottom: '4px',
              alignSelf: 'flex-start', transition: 'color 0.3s, border-color 0.3s'
            }}>
              SHOP NOW →
            </span>
          </div>
        </Link>
      ))}
      <style dangerouslySetInnerHTML={{__html: `
        .cat-card:hover .cat-img { transform: scale(1.05); }
        .cat-card:hover .shop-link { color: var(--gold) !important; border-color: var(--gold) !important; }
      `}} />
    </section>
  );
}
