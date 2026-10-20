import { create } from 'zustand';

const useUIStore = create((set) => ({
  isLoading: true,
  /* Door-intro phase: 'closed' | 'anticipation' | 'opening' | 'revealing' | 'fadeOut'
     (written by LoadingScreen, read by the hero so the lamp can follow the doors) */
  introPhase: 'closed',
  isMobileMenuOpen: false,
  notification: null,

  setLoading: (isLoading) => set({ isLoading }),
  setIntroPhase: (introPhase) => set({ introPhase }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  showNotification: (message, type = 'success') => {
    set({ notification: { message, type } });
    setTimeout(() => {
      set({ notification: null });
    }, 3000);
  },
}));

export default useUIStore;
