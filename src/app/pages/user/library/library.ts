// src/app/pages/library/library.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header'; // (เช็ค Path)
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthService } from '../../../services/user'; // (เช็ค Path)
import { LibraryGame } from '../../../model/library.model'; // (เช็ค Path)

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, Header, FormsModule, RouterLink],
  templateUrl: './library.html',
  styleUrls: ['./library.scss']
})
export class LibraryComponent implements OnInit {

  ownedGames: LibraryGame[] = [];
  filteredGames: LibraryGame[] = [];
  isLoading: boolean = true;
  
  // ตัวแปรสำหรับ Filters
  selectedCategory: string = 'all';
  selectedSort: string = 'title';
  searchQuery: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadOwnedGames();
  }

  async loadOwnedGames(): Promise<void> {
    this.isLoading = true;
    try {
      this.ownedGames = await this.authService.getOwnedGames();
      this.applyFilters(); 
    } catch (error: any) {
      console.error('Failed to load owned games:', error);
      Swal.fire('ผิดพลาด', error.error?.message || 'ไม่สามารถโหลดคลังเกมของคุณได้', 'error');
      // อาจจะต้อง logout ถ้า token หมดอายุ
      if (error.status === 401) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  applyFilters(): void {
    // 1. กรองตาม Category
    if (this.selectedCategory === 'all') {
      this.filteredGames = [...this.ownedGames];
    } else {
      this.filteredGames = this.ownedGames.filter(game => 
        game.category?.toLowerCase().includes(this.selectedCategory.toLowerCase())
      );
    }

    // 2. กรองตาม Search (ถ้ามี)
    if (this.searchQuery) {
      this.filteredGames = this.filteredGames.filter(game => 
        game.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    // 3. จัดเรียง
    if (this.selectedSort === 'title') {
      this.filteredGames.sort((a, b) => a.title.localeCompare(b.title));
    }
    // เพิ่มการจัดเรียงอื่นๆ ได้ตามต้องการ (เช่น 'size', 'release_date' ถ้ามี)
    // if (this.selectedSort === 'installed_size') {
    //   this.filteredGames.sort((a, b) => (b.size_gb || 0) - (a.size_gb || 0));
    // }

    this.cd.detectChanges();
  }

  // เรียกใช้เมื่อมีการเปลี่ยนแปลงค่าใน dropdown หรือ search
  onFilterChange(): void {
    this.applyFilters();
  }

  viewGameDetails(id: number): void {
    // หน้านี้อาจจะเป็นหน้า "Play" หรือ "Manage" แทนที่จะเป็น "Detail"
    // แต่ตอนนี้เราจะส่งไปหน้า detail ก่อน
    this.router.navigate(['/detailgame', id]);
  }
}