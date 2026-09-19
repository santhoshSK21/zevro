import { create } from 'zustand'

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface UiStore {
  isSearchOpen: boolean
  isMobileMenuOpen: boolean
  isAnyModalOpen: boolean
  announcementBarVisible: boolean
  toasts: ToastMessage[]
  
  setSearchOpen: (open: boolean) => void
  setMobileMenuOpen: (open: boolean) => void
  setModalOpen: (open: boolean) => void
  hideAnnouncementBar: () => void
  initAnnouncementBar: () => void
  
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void
  removeToast: (id: string) => void
}

export const useUiStore = create<UiStore>()((set) => ({
  isSearchOpen: false,
  isMobileMenuOpen: false,
  isAnyModalOpen: false,
  announcementBarVisible: true,
  toasts: [],
  
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setModalOpen: (open) => set({ isAnyModalOpen: open }),
  hideAnnouncementBar: () => {
    if (typeof window !== 'undefined') localStorage.setItem('zevro-bar-hidden', 'true');
    set({ announcementBarVisible: false })
  },
  initAnnouncementBar: () => {
    if (typeof window !== 'undefined') {
      const hidden = localStorage.getItem('zevro-bar-hidden') === 'true';
      set({ announcementBarVisible: !hidden });
    }
  },
  addToast: (message, type = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }))
}))

