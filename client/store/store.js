"use client"
import create from 'zustand';

// Define the Zustand store
const useStore = create((set) => ({
  isLogin: false,
  setIsLogin: (isLogin) => set({ isLogin }),
  username: null,
  setUsername: (username) => set({ username }),
  admin: false,
  setAdmin: (admin) => set({ admin }),
}));

export default useStore;
