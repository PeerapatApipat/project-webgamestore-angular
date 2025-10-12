import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WalletService } from '../../../services/wallet';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../header/header';
@Component({
  selector: 'app-wallet',
  imports: [CommonModule, FormsModule, Header],
  templateUrl: './wallet.html',
  styleUrls: ['./wallet.scss'],
  standalone: true,
})
export class Wallet implements OnInit {
  balance: number = 0;
  topupAmount: number = 0.0;
  userId: number | null = null;

  constructor(
    private walletService: WalletService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.userId = user.user_id;
      this.loadWallet();
    } else {
      console.error('User ID not found. Redirect to login.');
      this.router.navigate(['/login']);
    }
  }

  async loadWallet() {
    if (!this.userId) return;

    try {
      this.balance = await this.walletService.getWallet(this.userId);
      this.cd.detectChanges(); // อัปเดต view หลังดึงข้อมูล
    } catch (error) {
      console.error('Failed to load wallet:', error);
    }
  }

  async topUpWallet() {
    if (!this.userId) return;

    if (this.topupAmount <= 0) {
      console.warn('Top-up amount must be greater than zero.');
      alert('กรุณากรอกจำนวนเงิน');
      return;
    }

    try {
      await this.walletService.topUp(this.userId, this.topupAmount);
      await this.loadWallet(); // โหลดยอดเงินใหม่หลังเติมเงิน
      console.log(`Top-up ${this.topupAmount} THB successful!`);
      alert(`เติมเงิน ${this.topupAmount} THB สำเร็จ!`);
    } catch (error) {
      console.error('Failed to top up wallet:', error);
      alert('ไม่สามารถเติมเงินได้ โปรดลองใหม่');
    }
  }

  setTopupAmount(amount: number) {
    this.topupAmount = amount;
  }
}
