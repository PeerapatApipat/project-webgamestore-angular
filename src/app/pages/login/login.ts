// src/app/pages/login/login.ts
import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoginResponse, User } from '../../model/user';
import { AuthService } from '../../services/user';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  email: string = '';
  password: string = '';
  message: string = '';
  user: User | null = null;

  constructor(
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {}

  async login() {
    try {
      if (!this.email || !this.password) {
        this.message = 'กรุณากรอก Email และ Password'; // ต้องเซ็ตตรงนี้
        this.cd.detectChanges();
        return;
      }
      const response: LoginResponse = await this.authService.login(this.email, this.password);
      this.user = response.user;

      if (this.user.role === 'admin') {
        this.router.navigate(['/admin']);
        console.log('admin');
      } else {
        // this.router.navigate(['/profile', this.user.user_id]);
                this.router.navigate(['/profile']);

        console.log('user');
      }

      console.log('Login user:', this.user);
      const token = localStorage.getItem('token');
      console.log('Token:', token);

      console.log('login');
      this.message = `ยินดีต้อนรับ, ${this.user.username}!`;
    } catch (error: any) {
      console.log('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      this.message = error?.error?.error || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
      console.log('Message to show:', this.message);
      this.cd.detectChanges();
    }
  }
}
