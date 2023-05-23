import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { Cart, DBCart, DBCartItem } from '../models';
import { query } from 'src/db';

export enum CartStatus {
  OPEN = 'OPEN',
  ORDERED = 'ORDERED',
}

@Injectable()
export class CartService {
  findByUserId = async (userId: string): Promise<Cart | undefined> => {
    const cartQuery = await query<DBCart>('select * from carts where user_id = $1', [userId]);

    const [cart] = cartQuery.rows;

    if (!cart) {
      return;
    }

    const cartItemsQuery = await query<DBCartItem>(`select * from cart_items where cart_id = '${cart.id}'`);

    return {
      id: cart.id,
      items: cartItemsQuery.rows.map(item => ({
        ...item,
        product: {
          id: item.product_id
        }
      }))
    }
  }

  createByUserId = async (userId: string) => {
    const createdAt = new Date().toJSON();
    const updatedAt = new Date().toJSON();

    const columns = 'user_id, created_at, updated_at, status';
    const values = `'${userId}', '${createdAt}', '${updatedAt}', '${CartStatus.OPEN}'`;

    try {
      const insertQuery = await query<Cart>(`INSERT INTO carts(${columns}) VALUES(${values}) RETURNING *`);

      return insertQuery.rows[0];

    } catch (err) {
      console.log(err);
      return err;
    }
  }

  findOrCreateByUserId = async (userId: string): Promise<Cart> => {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  updateByUserId = async (userId: string, { items }: Cart): Promise<Cart> =>  {
    const { id, ...rest } = await this.findOrCreateByUserId(userId);

    const updatedCart = {
      id,
      ...rest,
      items: [...items],
    }

    try {
      await Promise.all(
        items.map(item => {
          const values = `'${id}', '${item.count}', '${item.product.id}'`;
          return query(`insert into cart_items (cart_id, count, product_id) values(${values})`);
        }),
      );

      return { ...updatedCart };
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  removeByUserId = async (userId: string) => {
    try {
      const { id } = await this.findOrCreateByUserId(userId);
      await query(`DELETE FROM cart_items WHERE cart_id = '${id}'`);
    } catch (err) {
      console.log(err);
      return err;
    }
  }

}
