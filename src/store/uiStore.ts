import { create } from 'zustand'

interface UiStore {
  isSearchOpen: boolean
  isMobileMenuOpen: boolean
  isAnyModalOpen: boolean
  announcementBarVisible: boolean
  
  setSearchOpen: (open: boolean) => void
  setMobileMenuOpen: (open: boolean) => void
  setModalOpen: (open: boolean) => void
  hideAnnouncementBar: () => void
  initAnnouncementBar: () => void
}

export const useUiStore = create<UiStore>()((set) => ({
  isSearchOpen: false,
  isMobileMenuOpen: false,
  isAnyModalOpen: false,
  announcementBarVisible: true,
  
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
  }
}))
