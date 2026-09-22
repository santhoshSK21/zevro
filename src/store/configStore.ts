import { create } from 'zustand';

interface StoreConfig {
  storeName: string;
  storeLogoUrl: string;
  storeDescription: string;
  supportEmail: string;
  supportPhone: string;
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  xUrl: string;
  pinterestUrl: string;
  currency: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  shippingCharge: number;
  codEnabled: boolean;
  demoMode: boolean;
  catalogBatchSize?: number;
  announcementText: string;
  footerCopyright: string;
  supportHours: string;
}

interface ConfigStore {
  config: StoreConfig | null;
  loading: boolean;
  fetchConfig: () => Promise<void>;
}

export const useConfigStore = create<ConfigStore>((set) => ({
  config: null,
  loading: true,
  fetchConfig: async () => {
    try {
      const res = await fetch('/api/settings/public');
      if (res.ok) {
        const data = await res.json();
        set({ config: data, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      set({ loading: false });
    }
  }
}));
