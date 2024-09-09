import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'






// This depicts how to make your state data persist
export const useAuthStore = create(
  persist(
  (set) => ({
  isAuthenticated: false,
  authenticate: () => {
    set((state) => ({ isAuthenticated: true }));
  },
  disauthenticate: () => {
    set((state) => ({ isAuthenticated: false }));
  },
  reset: () => {
    set((state) => ({ isAuthenticated: false }));
  },
}),
{
  name: 'auth-storage', // name of the item in the storage (must be unique)
  storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
},
),
);
