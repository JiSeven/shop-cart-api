import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { Order } from '../models';
import { query } from 'src/db';

@Injectable()
export class OrderService {
  private orders: Record<string, Order> = {}

  async findById(orderId: string): Promise<Order> {
    try {
      const ordersQuery = await query<Order>(`select * from orders where order_id = ${orderId};`);

      return ordersQuery.rows[0];
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async create(data: any) {
    const id = v4(v4());
    const order = {
      ...data,
      id,
      status: 'inProgress',
    };

    try {
      const queryText = `insert into orders (user_id, cart_id, payment, delivery, comments, status, total) values (${order});`;
      return await query(queryText);
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  update(orderId, data) {
    const order = this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    this.orders[ orderId ] = {
      ...data,
      id: orderId,
    }
  }
}
