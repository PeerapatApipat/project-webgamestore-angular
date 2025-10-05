import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../../services/user'; 
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-header',
   standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
userId: string | null = null;
  username: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef,


  ) { 
    const user = this.authService.getUser();      
    if (user) {
      this.userId = user.user_id.toString();
      this.username = user.username;
    }
  }

  

   logout() {
    this.authService.logout();         // ลบ token และ user จาก localStorage
    this.router.navigate(['/login']);  // ไปหน้า login
  }
}
