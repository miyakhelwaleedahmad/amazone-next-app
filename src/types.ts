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
  discountPercentage?:number;
}

export interface StateProps {
  next: {
    productData: StoreProduct[];
  };
}

export interface UserInfo {
  name?: string;
  email?: string;
  image?: string;
}
