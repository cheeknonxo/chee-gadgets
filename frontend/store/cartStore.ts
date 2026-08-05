'use client'
import { CartItem } from "@/types";
import { create } from "zustand";

interface CartState {
  cartItems: CartItem[];
  couponCode: string | null;
  addToCart: (newItem: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTax: () => number;
  getShippingFee: () => number;
  getTotalAmount: () => number;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
}

const STORAGE_KEY = "cart-items";

const useCartStore = create<CartState>((set) => {

  const isLocalStorageAvailable = typeof window !== "undefined" && window.localStorage;

  const initialCartItems = isLocalStorageAvailable && localStorage.getItem(STORAGE_KEY);
  const parsedCartItems: CartItem[] = initialCartItems ? JSON.parse(initialCartItems) : [];

  return {
    cartItems: parsedCartItems,

    couponCode: null,

    addToCart: (newItem: CartItem): void => {
      set((state) => {
        const existingItem = state.cartItems.find((item) => item.id === newItem.id);
        return {
          cartItems: existingItem
            ? state.cartItems.map((item) =>
                item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
              )
            : [...state.cartItems, { ...newItem}],
        };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(useCartStore.getState().cartItems));
    },

    removeFromCart: (itemId: string): void => {
      set((state) => ({
        cartItems: state.cartItems.filter((item) => item.id !== itemId),
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(useCartStore.getState().cartItems));
    },

    updateQuantity: (itemId: string, newQuantity: number): void => {
      set((state) => ({
        cartItems: state.cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        ),
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(useCartStore.getState().cartItems));
    },

    clearCart: (): void => {
      set({ cartItems: [], couponCode: null });
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    },

    getTotalItems: (): number => {
      return useCartStore.getState().cartItems.reduce((acc, item) => acc + item.quantity, 0);
    },

    getTotalPrice: (): number => {
      let totalPrice = useCartStore
        .getState()
        .cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

      const couponCode = useCartStore.getState().couponCode;
      if (couponCode === "YOUR_COUPON_CODE") {
        totalPrice *= 0.9;
      }

      return totalPrice;
    },

    getTax: (): number => {
      return useCartStore.getState().getTotalPrice() * 0.1;
    },

    getShippingFee: (): number => {
      return 5;
    },

    getTotalAmount: (): number => {
      return (
        useCartStore.getState().getTotalPrice() +
        useCartStore.getState().getTax() +
        useCartStore.getState().getShippingFee()
      );
    },

    applyCoupon: (code: string): void => {
      set({ couponCode: code });
    },

    removeCoupon: (): void => {
      set({ couponCode: null });
    },
  };
});

export default useCartStore;