// src/app/services/transaction.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Constants } from '../config/constants';
import { Transaction, TransactionResponse } from '../model/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private http: HttpClient, private constants: Constants) {}

  /**
   * ดึงประวัติ transaction ของผู้ใช้
   * @param userId ไอดีผู้ใช้
   * @returns Promise<Transaction[]> รายการ transaction
   */
  public async getTransactionHistory(userId: string): Promise<Transaction[]> {
    const url = `${this.constants.API_ENDPOINT}/history`;

    const token = this.getToken();
    if (!token) throw new Error('Token ไม่พบ');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const params = new HttpParams().set('user_id', userId);

    // เรียก API
    const response: TransactionResponse = await lastValueFrom(
      this.http.get<TransactionResponse>(url, { headers, params })
    );

    // ส่งกลับ transactions
    return response.transactions;
  }

  /**
   * ตรวจสอบว่ามี token อยู่หรือไม่
   */
  private getToken(): string | null {
    return localStorage.getItem('token');
  }
}
