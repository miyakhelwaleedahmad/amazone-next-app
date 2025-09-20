// src/store/nextSlice.ts
import type { StoreProduct, UserInfo } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

export interface NextState {
  productData: StoreProduct[];    // cart items
  favouriteData: StoreProduct[]; // wishlist/favourites
  allProducts: StoreProduct[];    // store catalog cache
  userInfo: UserInfo | null;
}

const initialState: NextState = {
  productData: [],
  favouriteData: [],
  allProducts: [],
  userInfo: null,
};

const nextSlice = createSlice({
  name: "next",
  initialState,
  reducers: {
    // payload: full StoreProduct
    addToCart: (state, action: PayloadAction<StoreProduct>) => {
      const payload = action.payload;
      const existing = state.productData.find((p) => p._id === payload._id);
      const qtyToAdd = payload.quantity ?? 1;
      if (existing) {
        existing.quantity = (existing.quantity ?? 0) + qtyToAdd;
      } else {
        state.productData.push({ ...payload, quantity: qtyToAdd });
      }
    },

    // Add to favourites (no duplicates)
    addToFavourite: (state, action: PayloadAction<StoreProduct>) => {
      const payload = action.payload;
      const exists = state.favouriteData.find((p) => p._id === payload._id);
      if (!exists) {
        state.favouriteData.push({ ...payload, quantity: payload.quantity ?? 1 });
      }
    },

    // Increase cart item quantity by id
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const item = state.productData.find((p) => p._id === id);
      if (item) item.quantity = (item.quantity ?? 0) + 1;
    },

    // Decrease cart item quantity by id. If quantity becomes 0 remove from cart.
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const item = state.productData.find((p) => p._id === id);
      if (!item) return;
      if ((item.quantity ?? 0) <= 1) {
        // remove item when reaching 0/1 based on your policy — here we remove
        state.productData = state.productData.filter((p) => p._id !== id);
      } else {
        item.quantity!--;
      }
    },

    // Remove item from cart by id
    deleteProduct: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.productData = state.productData.filter((p) => p._id !== id);
    },

    // Clear cart
    resetCart: (state) => {
      state.productData = [];
    },

    // Set/replace cart (useful when hydrating from localStorage)
    setCart: (state, action: PayloadAction<StoreProduct[]>) => {
      state.productData = action.payload;
    },

    // User login info (store minimal fields from UserInfo)
    addUser: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },

    // Remove user
    removeUser: (state) => {
      state.userInfo = null;
    },

    // Replace cached product list (useful after fetching from API)
    setAllProducts: (state, action: PayloadAction<StoreProduct[]>) => {
      state.allProducts = action.payload;
    },

    // Optional: remove from favourites
    removeFromFavourite: (state, action: PayloadAction<string>) => {
      state.favouriteData = state.favouriteData.filter((p) => p._id !== action.payload);
    },
  },
});

// Actions
export const {
  addToCart,
  addToFavourite,
  increaseQuantity,
  decreaseQuantity,
  deleteProduct,
  resetCart,
  setCart,
  addUser,
  removeUser,
  setAllProducts,
  removeFromFavourite,
} = nextSlice.actions;

export default nextSlice.reducer;

/*
  Selectors (typed). Use these in components:
    import { useAppSelector } from "@/store/hooks";
    const total = useAppSelector(selectCartTotal);
*/
export const selectCartItems = (state: RootState) => state.next.productData;
export const selectFavourites = (state: RootState) => state.next.favouriteData;
export const selectAllProducts = (state: RootState) => state.next.allProducts;
export const selectUserInfo = (state: RootState) => state.next.userInfo;

export const selectCartCount = (state: RootState) =>
  state.next.productData.reduce((sum, p) => sum + (p.quantity ?? 0), 0);

export const selectCartTotal = (state: RootState) =>
  state.next.productData.reduce((sum, p) => sum + (p.price * (p.quantity ?? 1)), 0);
