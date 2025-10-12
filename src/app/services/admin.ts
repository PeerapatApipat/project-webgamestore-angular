  import { Injectable } from '@angular/core';
  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { lastValueFrom } from 'rxjs';
  import { Constants } from '../config/constants';
  import { games } from '../model/game';

  @Injectable({
    providedIn: 'root',
  })
  export class AuthService {
    constructor(private http: HttpClient, private constants: Constants) {}


    public async addnewgame(formData: FormData): Promise<any> {
    const token = this.getToken(); 
    console.log(token);
    
    if (!token) throw new Error('Token ไม่พบ');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      // 'Content-Type': 'application/json'
    });

      const url = `${this.constants.API_ENDPOINT}/admin/newgame`;
      const response = await lastValueFrom(this.http.post<games>(url, formData,{ headers }));
      return response;
    }

    // ลบเกมโดยใช้ ID
  public async deleteGameById( data: { id?: number; }): Promise<games> {
    const token = this.getToken();
    if (!token) throw new Error('Token ไม่พบ');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `${this.constants.API_ENDPOINT}/admin/deletegame`;
    const response = await lastValueFrom(this.http.put<games>(url,data, { headers }));
    return response;
  }


    // ดึงข้อมูล game จาก backend
    public async getdatagame(): Promise<games> {
      const url = `${this.constants.API_ENDPOINT}/admin/getgame`;
      const token = this.getToken(); // ดึง token จาก localStorage
      if (!token) throw new Error('Token ไม่พบ');
    
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      const response = await lastValueFrom(this.http.get<games>(url, { headers }));
      console.log(response);
    
      return response;
    }

  // ดึงข้อมูล game จาก backend
  public async getGameById(data: { id?: number; }): Promise<games> {

    const url = `${this.constants.API_ENDPOINT}/admin/getGameById`;
    const token = this.getToken(); // ดึง token จาก localStorage
    if (!token) throw new Error('Token ไม่พบ');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const response = await lastValueFrom(this.http.post<games>(url ,data, { headers }));
    console.log(response);

    return response;
  }

  // อัปเดตข้อมูลเกม
  public async updateGame(formData: FormData): Promise<any> {
    const token = this.getToken();
    if (!token) throw new Error('Token ไม่พบ');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `${this.constants.API_ENDPOINT}/admin/updategame`;
    return await lastValueFrom(this.http.put(url, formData, { headers }));
  }
    // logout
    public logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    public isLoggedIn(): boolean {
      return localStorage.getItem('token') !== null;
    }

    public getToken(): string | null {
      return localStorage.getItem('token');
    }

    public getUser(): games | null {
      const games = localStorage.getItem('games');
      return games ? JSON.parse(games) : null;
    }
  }
