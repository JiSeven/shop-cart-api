export type Product = {
  id: string,
};


export type CartItem = {
  product: Product,
  count: number,
}

export type Cart = {
  id: string,
  items: CartItem[],
}

export type DBCart = {
  id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  status: 'OPEN' | 'ORDERED';
}

export type DBCartItem = {
  cart_id: string;
  product_id: string;
  count: number;
}