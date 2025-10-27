// src/app/services/cart.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Constants } from '../config/constants';
import { CartItem, ValidateCodeResponse, CheckoutResponse } from '../model/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private http: HttpClient, private constants: Constants) {}

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * 🛒 GET /cart
   * ดึงรายการเกมทั้งหมดในตะกร้า (status = 'pending')
   */
  public async getCartItems(): Promise<CartItem[]> {
    const token = this.getToken();
    if (!token) throw new Error('Token ไม่พบ');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.constants.API_ENDPOINT}/cart`;
    return await lastValueFrom(this.http.get<CartItem[]>(url, { headers }));
  }

  /**
   * 🗑️ DELETE /cart/item/:itemId
   * ลบเกม 1 รายการออกจากตะกร้า
   */
  public async removeCartItem(itemId: number): Promise<any> {
    const token = this.getToken();
    if (!token) throw new Error('Token ไม่พบ');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.constants.API_ENDPOINT}/cart/item/${itemId}`;
    return await lastValueFrom(this.http.delete(url, { headers }));
  }

  /**
   * ✅ POST /cart/validate-code
   * ตรวจสอบโค้ดส่วนลด
   */
  public async validateDiscountCode(code: string): Promise<ValidateCodeResponse> {
    const token = this.getToken();
    if (!token) throw new Error('Token ไม่พบ');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const url = `${this.constants.API_ENDPOINT}/cart/validate-code`;
    const body = { code };
    return await lastValueFrom(this.http.post<ValidateCodeResponse>(url, body, { headers }));
  }

  /**
   * 💳 POST /cart/checkout
   * ยืนยันการสั่งซื้อและชำระเงิน
   */
  public async checkout(discountCode: string | null): Promise<CheckoutResponse> {
    const token = this.getToken();
    if (!token) throw new Error('Token ไม่พบ');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    
    const url = `${this.constants.API_ENDPOINT}/cart/checkout`;
    const body = { discount_code: discountCode }; // ส่ง code ที่ validate แล้ว
    return await lastValueFrom(this.http.post<CheckoutResponse>(url, body, { headers }));
  }
}