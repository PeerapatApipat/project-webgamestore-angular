import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Constants } from '../config/constants';
import {
  AllUserTransactionsResponse,
  SingleUserTransactionResponse,
} from '../model/adminTransaction';

@Injectable({
  providedIn: 'root',
})
export class AdminTransactionService {
  constructor(private http: HttpClient, private constants: Constants) {}

  /**
   * ✅ ดึงธุรกรรมของผู้ใช้ทั้งหมด (role = 'user')
   */
  public async getAllUsersTransactions(): Promise<AllUserTransactionsResponse> {
    const url = `${this.constants.API_ENDPOINT}/admin/history`;

    const token = this.getToken();
    if (!token) throw new Error('Token ไม่พบ');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const response = await lastValueFrom(
      this.http.get<AllUserTransactionsResponse>(url, { headers })
    );

    return response;
  }

  /**
   * ✅ ดึงธุรกรรมของผู้ใช้คนเดียว
   * @param userId ไอดีของผู้ใช้
   */
  public async getSingleUserTransactions(userId: string): Promise<SingleUserTransactionResponse> {
    const url = `${this.constants.API_ENDPOINT}/admin/history`;
    const token = this.getToken();
    if (!token) throw new Error('Token ไม่พบ');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const params = new HttpParams().set('user_id', userId);

    const response = await lastValueFrom(
      this.http.get<SingleUserTransactionResponse>(url, { headers, params })
    );

    return response;
  }

  /**
   * ✅ แนบ Token จาก localStorage
   */
  private getToken(): string | null {
    return localStorage.getItem('token');
  }
}
