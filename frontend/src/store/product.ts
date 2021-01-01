import axios from 'axios';
import produce from 'immer';
import create from 'zustand';
import { combine, persist, devtools } from 'zustand/middleware';
import { Product } from '../@types/product';

let store = combine(
  {
    productsList: Array<Product>(),
    loading: false,
    error: '',
    product: null,
  } as StoreType,
  (set) => ({
    async fetchProductList() {
      try {
        set((s) => ({ ...s, loading: true, error: '' }));
        const { data: productsList } = await axios.get<Product[]>(
          '/api/products',
        );

        set((s) => ({ ...s, loading: false, productsList }));
      } catch (err) {
        console.error(err);

        set((s) => ({
          ...s,
          loading: false,
          error: err.response?.data?.message || err.message,
        }));
      }
    },
    async fetchProduct(id: string) {
      try {
        set((s) =>
          produce(s, (d) => {
            d.loading = true;
            d.error = '';
          }),
        );
        const { data } = await axios.get<Product>('/api/products/' + id);
        set((s) =>
          produce(s, (d) => {
            d.loading = false;
            d.product = data;
          }),
        );
      } catch (err) {
        set((s) =>
          produce(s, (d) => {
            d.loading = false;
            d.error = err.response?.data?.message || err.message;
          }),
        );
      }
    },
  }),
);

//@types
type StoreType = {
  productsList: Product[];
  loading: boolean;
  error: string;
  product: null | Product;
};

// Add DevTools
store = devtools(store, 'ProductsStore');

//Persist
if (typeof window != 'undefined') {
  store = persist(store, {
    name: 'products',
  });
}

export const useProductsStore = create(store);
