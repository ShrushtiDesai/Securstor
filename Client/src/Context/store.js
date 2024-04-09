// store.js
import { create } from 'zustand';

const useStore = create(set => ({
  uploadTrigger: false,
  setUploadTrigger: (value) => set({ uploadTrigger: value }),
  userAddress: '',
  setUserAddress: (value) => set({ userAddress: value }),
  fileurl: '',
  setFileurl: (value) => set({ fileurl: value }),
  grantTrigger: false,
  setgrantTrigger: (value) => set({ grantTrigger: value }),

}));

export default useStore;
