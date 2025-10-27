//  src/app/services/discount.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Constants } from '../config/constants';
import { DiscountCode } from '../model/discount.model';

@Injectable({
  providedIn: 'root',
})
export class DiscountService {
  constructor(private http: HttpClient, private constants: Constants) {}

  public async getAllDiscounts(): Promise<DiscountCode[]> {
    const url = `${this.constants.API_ENDPOINT}/admin/discounts`;
    const token = this.getToken();
    if (!token) throw new Error('Token ไม่พบ');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const response = await lastValueFrom(this.http.get<DiscountCode[]>(url, { headers }));
    return response;
  }

  public async addDiscount(codeData: Omit<DiscountCode, 'id' | 'used_count'>): Promise<any> {
    const url = `${this.constants.API_ENDPOINT}/admin/discounts`;
    const token = this.getToken();
    if (!token) throw new Error('Token ไม่พบ');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return await lastValueFrom(this.http.post(url, codeData, { headers }));
  }

  public async updateDiscount(
    id: number,
    codeData: Omit<DiscountCode, 'id' | 'used_count'>
  ): Promise<any> {
    const url = `${this.constants.API_ENDPOINT}/admin/discounts/${id}`;
    const token = this.getToken();
    if (!token) throw new Error('Token ไม่พบ');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return await lastValueFrom(this.http.put(url, codeData, { headers }));
  }

  /* ลบโค้ดส่วนลด*/

  public async deleteDiscount(id: number): Promise<any> {
    const url = `${this.constants.API_ENDPOINT}/admin/discounts/${id}`;
    const token = this.getToken();
    if (!token) throw new Error('Token ไม่พบ');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return await lastValueFrom(this.http.delete(url, { headers }));
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }
}
