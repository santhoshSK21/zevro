'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function InAppNavigationGuard() {
  const pathname = usePathname();

  useEffect(() => {
    // Mark in-app browsing session
    if (typeof document !== 'undefined') {
      document.cookie = 'zevro_in_app=1; path=/; SameSite=Lax';
    }
  }, [pathname]);

  return null;
}
