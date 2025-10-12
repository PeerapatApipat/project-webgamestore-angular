import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Constants } from '../config/constants';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  constructor(private http: HttpClient, private constants: Constants) {}

  // ดึง wallet balance ของผู้ใช้
  public async getWallet(userId: number): Promise<number> {
    const url = `${this.constants.API_ENDPOINT}/wallet/${userId}`;
    const token = this.getToken();
    if (!token) throw new Error('Token ไม่พบ');

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const response: any = await lastValueFrom(this.http.get(url, { headers }));
    return response.wallet_balance; // backend ส่ง field wallet_balance
  }

  // เติมเงินเข้ากระเป๋า
  public async topUp(userId: number, amount: number): Promise<any> {
    const url = `${this.constants.API_ENDPOINT}/topup`;
    const token = this.getToken();
    if (!token) throw new Error('Token ไม่พบ');

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const body = { user_id: userId, wallet: amount };

    return await lastValueFrom(this.http.post(url, body, { headers }));
  }

  private getToken(): string | null {
    return localStorage.getItem('token'); // สมมติเก็บ token ไว้ใน localStorage
  }
}
