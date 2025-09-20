export interface ProductProps {
  _id: string;
  title: string;
  brand: string;
  category: string;
  description: string;
  image: string;
  isNew: boolean;
  oldPrice: number;
  price: number;
}
export interface StoreProduct {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  brand: string;
  category: string;
  description: string;
  isNew: boolean;
  oldPrice: number;
}

export interface StoreProps{
  productData:[];
  favouriteData:[];
  userInfo:null|string;
  next:any;
}
