// src/app/model/cart.model.ts

export interface CartItem {
  order_id: number;
  item_id: number; // นี่คือ ID ของ order_item (สำหรับใช้ลบ)
  game_id: number;
  quantity: number;
  title: string;
  price: number;
  image_url: string;
  description: string;
}

export interface ValidateCodeResponse {
  message: string;
  code: string;
  discount_percent: number;
}

export interface CheckoutResponse {
  message: string;
  order_id: number;
  final_price: number;
  remaining_balance: number;
}