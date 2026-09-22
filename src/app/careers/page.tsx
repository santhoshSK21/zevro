import React from 'react';
import Link from 'next/link';

export default function CareersPage() {
  const departments = [
    {
      title: 'Haute Couture & Apparel Design',
      location: 'Bengaluru Atelier',
      type: 'Full-time',
      desc: 'Pattern cutters, drape specialists, and visionary textile innovators who revere both heritage weaves and modern tailoring.'
    },
    {
      title: 'Brand Styling & Creative Direction',
      location: 'Mumbai Studio / Hybrid',
      type: 'Full-time',
      desc: 'Editorial stylists and visual storytellers sculpting digital campaigns, lookbooks, and runway narratives.'
    },
    {
      title: 'Client Concierge & VIP Relations',
      location: 'Bengaluru Flagship',
      type: 'Full-time',
      desc: 'White-glove shopping advisors delivering bespoke styling experiences to our global clientele.'
    },
    {
      title: 'Ethical Sourcing & Handloom Curation',
      location: 'New Delhi / Field Travel',
      type: 'Full-time',
      desc: 'Liaison with master artisan cooperatives, ensuring sustainable material integrity and artisan empowerment.'
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--ivory, #FAF8F5)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Hero Banner */}
      <div style={{ position: 'relative', height: '48vh', minHeight: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img 
          src="https://images.unsplash.com/photo-1534126511673-b6899657816a?w=1600&auto=format&fit=crop&q=80" 
          alt="ZEVRO Design Studio" 
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65)' }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.4), rgba(15,23,42,0.8))' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#FFF', padding: '0 24px', maxWidth: '800px' }}>
          <span style={{ fontFamily: 'var(--font-ui, sans-serif)', fontSize: '11px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C5A880', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
            JOIN THE MAISON
          </span>
          <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: 'clamp(32px, 5vw, 54px)', letterSpacing: '0.06em', margin: '0 0 12px 0' }}>
            CRAFT THE FUTURE OF LUXURY
          </h1>
          <p style={{ fontFamily: 'var(--font-display, serif)', fontStyle: 'italic', fontSize: '18px', color: '#E2E8F0' }}>
            Work alongside master artisans, visionary stylists, and forward-thinking creators.
          </p>
        </div>
      </div>

      <main className="container" style={{ padding: '64px 24px 80px', flex: 1, maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
        
        {/* Culture & Atelier Values */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#B49A68', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              OUR CULTURE
            </span>
            <h2 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '32px', color: '#0F172A', margin: 0 }}>
              The Spirit of the Atelier
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '28px', borderRadius: '4px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
              <div style={{ width: '40px', height: '40px', background: '#F8F6F0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '16px' }}>✨</div>
              <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '18px', color: '#0F172A', marginBottom: '8px' }}>Obsession with Detail</h3>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>We value craftsmanship at every tier—from individual silk hand-stitches to the elegance of our digital checkout.</p>
            </div>

            <div style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '28px', borderRadius: '4px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
              <div style={{ width: '40px', height: '40px', background: '#F8F6F0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '16px' }}>🌿</div>
              <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '18px', color: '#0F172A', marginBottom: '8px' }}>Conscious Heritage</h3>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>We balance progressive, editorial silhouettes with profound respect for Indian loom artisans and ethical ecosystems.</p>
            </div>

            <div style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '28px', borderRadius: '4px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
              <div style={{ width: '40px', height: '40px', background: '#F8F6F0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '16px' }}>💫</div>
              <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '18px', color: '#0F172A', marginBottom: '8px' }}>Creative Autonomy</h3>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>We cultivate an environment where ambitious ideas are celebrated, prototypes are encouraged, and passion leads the way.</p>
            </div>
          </div>
        </section>

        {/* Open Opportunities */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#B49A68', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                OPPORTUNITIES
              </span>
              <h2 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '28px', color: '#0F172A', margin: 0 }}>
                Open Atelier Roles
              </h2>
            </div>
            <a href="mailto:careers@zevro.in" style={{ fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B49A68', fontWeight: 600, textDecoration: 'none' }}>
              General Application →
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {departments.map((dept, idx) => (
              <div 
                key={idx} 
                style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '24px 28px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', transition: 'all 0.2s ease' }}
              >
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '6px' }}>
                    <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '18px', color: '#0F172A', margin: 0 }}>{dept.title}</h3>
                    <span style={{ fontSize: '10px', padding: '3px 8px', background: '#F1F5F9', color: '#475569', borderRadius: '2px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{dept.type}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 4px 0' }}>{dept.desc}</p>
                  <span style={{ fontSize: '12px', color: '#B49A68', fontWeight: 500 }}>📍 {dept.location}</span>
                </div>

                <a 
                  href={`mailto:careers@zevro.in?subject=Application for ${encodeURIComponent(dept.title)}`}
                  className="btn btn-primary"
                  style={{ padding: '12px 20px', background: '#0F172A', color: '#FAF8F5', textDecoration: 'none', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap' }}
                >
                  APPLY NOW
                </a>
              </div>
            ))}
          </div>

          <div style={{ background: '#F8F6F0', border: '1px solid #EAE6DF', padding: '32px', borderRadius: '4px', marginTop: '40px', textAlign: 'center' }}>
            <h4 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '20px', color: '#0F172A', marginBottom: '8px' }}>Don’t See Your Exact Discipline?</h4>
            <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '600px', margin: '0 auto 20px', lineHeight: 1.6 }}>
              We are perpetually welcoming extraordinary talent across styling, photography, technology, and garment manufacturing. Send your portfolio to our executive talent team.
            </p>
            <a 
              href="mailto:careers@zevro.in?subject=Speculative Talent Portfolio - ZEVRO"
              style={{ display: 'inline-block', padding: '12px 24px', border: '1px solid #0F172A', color: '#0F172A', textDecoration: 'none', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600 }}
            >
              SEND PORTFOLIO & CV
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}