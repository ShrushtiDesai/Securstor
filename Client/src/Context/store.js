// store.js
import {create} from 'zustand';

const useStore = create(set => ({
 uploadTrigger: false,
 setUploadTrigger: (value) => set({ uploadTrigger: value }),
 userAddress: '', 
 setUserAddress: (value) => set({ userAddress: value }),
}));

export default useStore;
