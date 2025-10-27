// src/app/pages/cart/cart.component.ts

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header'; // (เช็ค Path ของ Header component)
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Router, RouterLink } from '@angular/router';import Swal from 'sweetalert2';

import { CartService } from '../../../services/cart.service'; // (เช็ค Path)
import { WalletService } from '../../../services/wallet'; // (เช็ค Path)
import { AuthService } from '../../../services/admin'; // (เช็ค Path)

import { User } from '../../../model/user'; // (เช็ค Path)
import { CartItem, ValidateCodeResponse } from '../../../model/cart.model'; // (เช็ค Path)

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, Header, FormsModule,RouterLink], // ต้องเพิ่ม FormsModule
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss'],
})
export class CartComponent implements OnInit {
  
  cartItems: CartItem[] = [];
  currentUser: User | null = null;
  walletBalance: number = 0;
  
  isLoading: boolean = true;
  isProcessing: boolean = false;

  // Discount
  discountCodeInput: string = '';
  appliedDiscount: ValidateCodeResponse | null = null;
  discountError: string = '';

  constructor(
    private cartService: CartService,
    private walletService: WalletService,
    private authService: AuthService, // ใช้ authService แค่เช็ค login
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }
  viewGameDetails(id: number | undefined): void {
    if (id === undefined) return;
    console.log(`Navigating to details for game with ID: ${id}`);
    this.router.navigate(['/detailgame', id]);
  }

  async loadInitialData(): Promise<void> {
    this.isLoading = true;
    try {
      // 1. ดึงข้อมูล User
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('ไม่พบข้อมูลผู้ใช้');
      }
      this.currentUser = JSON.parse(userStr) as User;

      // 2. โหลดตะกร้าและ Wallet พร้อมกัน
      await Promise.all([
        this.loadCartItems(),
        this.loadWalletBalance()
      ]);

    } catch (error: any) {
      console.error(error);
      Swal.fire('ผิดพลาด', 'ไม่สามารถโหลดข้อมูลตะกร้าได้', 'error');
      this.authService.logout();
      this.router.navigate(['/login']);
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  async loadCartItems(): Promise<void> {
    try {
      this.cartItems = await this.cartService.getCartItems();
      this.resetDiscount(); // รีเซ็ตส่วนลดทุกครั้งที่โหลดตะกร้าใหม่
    } catch (error) {
      console.error('Failed to load cart items:', error);
      this.cartItems = []; // ถ้า error ให้เป็นตะกร้าว่าง
    }
  }

  async loadWalletBalance(): Promise<void> {
    if (!this.currentUser) return;
    try {
      // ดึง wallet ล่าสุดเสมอ
      this.walletBalance = await this.walletService.getWallet(this.currentUser.user_id);
    } catch (error) {
      console.error('Failed to load wallet:', error);
      this.walletBalance = this.currentUser.wallet_balance; // ใช้ค่าเก่าถ้า fetch ไม่ได้
    }
  }

  // --- Calculations ---

  get totalPrice(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  get discountAmount(): number {
    if (!this.appliedDiscount) return 0;
    return this.totalPrice * (this.appliedDiscount.discount_percent / 100);
  }

  get subtotal(): number {
    return this.totalPrice - this.discountAmount;
  }

  // --- Actions ---

  async handleRemoveItem(item: CartItem): Promise<void> {
    const result = await Swal.fire({
      title: 'ลบสินค้า?',
      text: `คุณต้องการลบ "${item.title}" ออกจากตะกร้าใช่หรือไม่?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก',
    });

    if (result.isConfirmed) {
      try {
        await this.cartService.removeCartItem(item.item_id);
        Swal.fire('ลบแล้ว!', `"${item.title}" ถูกลบออกจากตะกร้าแล้ว`, 'success');
        await this.loadCartItems(); // โหลดตะกร้าใหม่
        this.cd.detectChanges();
      } catch (error: any) {
        Swal.fire('ผิดพลาด!', error.error?.message || 'ไม่สามารถลบสินค้าได้', 'error');
      }
    }
  }

  async handleValidateCode(): Promise<void> {
    if (!this.discountCodeInput) return;
    
    this.isProcessing = true;
    this.discountError = '';
    this.appliedDiscount = null;

    try {
      const response = await this.cartService.validateDiscountCode(this.discountCodeInput);
      this.appliedDiscount = response;
      Swal.fire('ใช้โค้ดสำเร็จ!', `คุณได้รับส่วนลด ${response.discount_percent}%`, 'success');
    } catch (error: any) {
      this.discountError = error.error?.message || 'โค้ดส่วนลดไม่ถูกต้อง';
    } finally {
      this.isProcessing = false;
      this.cd.detectChanges();
    }
  }

  resetDiscount(): void {
    this.discountCodeInput = '';
    this.appliedDiscount = null;
    this.discountError = '';
  }

  async handleCheckout(): Promise<void> {
    if (this.walletBalance < this.subtotal) {
      Swal.fire('ยอดเงินไม่พอ!', 'กรุณาเติมเงินเข้า Wallet ก่อนทำรายการ', 'error');
      return;
    }

    const result = await Swal.fire({
      title: 'ยืนยันการชำระเงิน',
      html: `
        <p>ราคารวม: ฿${this.totalPrice.toFixed(2)}</p>
        <p>ส่วนลด: -฿${this.discountAmount.toFixed(2)}</p>
        <hr>
        <p><b>ยอดสุทธิ: ฿${this.subtotal.toFixed(2)}</b></p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#8A2BE2',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
    });

    if (result.isConfirmed) {
      this.isProcessing = true;
      try {
        const codeToUse = this.appliedDiscount ? this.appliedDiscount.code : null;
        const response = await this.cartService.checkout(codeToUse);

        await Swal.fire({
          icon: 'success',
          title: 'ชำระเงินสำเร็จ!',
          html: `
            <p>ขอบคุณสำหรับการสั่งซื้อ!</p>
            <p>ยอดที่ชำระ: <b>฿${response.final_price.toFixed(2)}</b></p>
            <p>ยอดคงเหลือใน Wallet: <b>฿${response.remaining_balance.toFixed(2)}</b></p>
          `,
        });
        
        // อัปเดตข้อมูลหน้า
        await this.loadCartItems();
        await this.loadWalletBalance();

        // ไปยังหน้า library (หรือประวัติการซื้อ)
        this.router.navigate(['/library']); 

      } catch (error: any) {
        Swal.fire('ชำระเงินผิดพลาด!', error.error?.message || 'เกิดข้อผิดพลาด', 'error');
      } finally {
        this.isProcessing = false;
        this.cd.detectChanges();
      }
    }
  }
}