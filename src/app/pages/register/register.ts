import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { User, LoginResponse } from '../../model/user';
import { AuthService } from '../../services/user';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register implements OnInit {
  @ViewChild('registerForm') registerForm!: NgForm;

  user: Partial<User> = {};
  message: string = '';
  isError: boolean = false;
  isLoading: boolean = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  // Validation errors
  errors = {
    username: '',
    email: '',
    password: '',
  };

  constructor(
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Register Component Initialized');
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.message = 'กรุณาเลือกไฟล์รูปภาพเท่านั้น (jpg, jpeg, png, gif)';
        this.isError = true;
        this.cd.detectChanges();
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.message = 'ขนาดไฟล์ต้องไม่เกิน 5MB';
        this.isError = true;
        this.cd.detectChanges();
        return;
      }

      this.selectedFile = file;

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async register(): Promise<void> {
    try {
      this.message = '';
      this.isError = false;

      this.isLoading = true;
      this.cd.detectChanges();

      const formData = new FormData();
      formData.append('username', this.user.username!);
      formData.append('email', this.user.email!);
      formData.append('password', this.user.password!);

      if (this.selectedFile) {
        formData.append('profile_image', this.selectedFile);
      }

      const response = await this.authService.register(formData);
      console.log('Register success:', response);

      // แสดงข้อความสำเร็จ
      this.message = 'สมัครสมาชิกสำเร็จ!';
      this.isError = false;
      this.isLoading = false;

      // รีเซ็ตข้อมูล
      this.user = {};
      this.selectedFile = null;
      this.previewUrl = null;
      this.errors = { username: '', email: '', password: '' };

      // รีเซ็ต form state - สำคัญมาก!
      if (this.registerForm) {
        this.registerForm.resetForm();
      }

      this.cd.detectChanges();

      // Alert แจ้งเตือน
      alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');

      // Redirect ไปหน้า login
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 500);
    } catch (error: any) {
      console.error('Register error:', error);

      if (error?.error?.error) {
        this.message = error.error.error;
      } else if (error?.error?.message) {
        this.message = error.error.message;
      } else if (error?.message) {
        this.message = error.message;
      } else {
        this.message = 'เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง';
      }

      this.isError = true;
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }
}
