import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Constants } from '../config/constants';
import { User, LoginResponse } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private constants: Constants) {}

 // ดึงข้อมูล user จาก backend
 public async getdatauser(userId: string): Promise<User> {
  const url = `${this.constants.API_ENDPOINT}/getprofiledata?user_id=${userId}`;
  const token = this.getToken(); // ดึง token จาก localStorage
  if (!token) throw new Error('Token ไม่พบ');

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  const response = await lastValueFrom(this.http.get<User>(url, { headers }));
  console.log(response);

  return response;
}

  // อัปเดตข้อมูล user name
   public async updateUser(data: { username?: string; userId?: string}): Promise<User> {
  const url = `${this.constants.API_ENDPOINT}/customers/editprofile`;
    
  const token = this.getToken();
  if (!token) throw new Error('Token ไม่พบ');

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const response = await lastValueFrom(this.http.put<User>(url, data, { headers }));
  
  return response;
}
 





  // login
  public async login(email: string, password: string): Promise<LoginResponse> {
    const url = `${this.constants.API_ENDPOINT}/customers/login`;
    const response = await lastValueFrom(this.http.post<LoginResponse>(url, { email, password }));

    if (response && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('user_id', response.user.user_id.toString());
    }
    return response;
  }

  // register
  public async register(formData: FormData): Promise<any> {
    const url = `${this.constants.API_ENDPOINT}/customers/register`;
    const response = await lastValueFrom(this.http.post(url, formData));
    return response;
  }


  
  public async updateProfileImage(formData: FormData): Promise<User> {
  const token = this.getToken();
  if (!token) throw new Error("Token ไม่พบ");

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  const url = `${this.constants.API_ENDPOINT}/customers/update-profile`;
  return await lastValueFrom(this.http.put<User>(url, formData, { headers }));
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

  public getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
