'use client';

import React from 'react';
import WishlistView from '../../components/wishlist/WishlistView';

export default function StandaloneWishlistPage() {
  return (
    <div className="wishlist-page-wrap">
      <div className="wishlist-page-inner">
        <WishlistView />
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .wishlist-page-wrap {
          background-color: var(--color-bg, #FAF8F5);
          min-height: 100vh;
          padding-top: 50px;
          padding-bottom: 80px;
        }
        .wishlist-page-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
      `}} />
    </div>
  );
}
