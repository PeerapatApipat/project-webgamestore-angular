import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminTransactionService } from '../../../services/adminTransactionService';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AllUserTransactionsResponse, UserTransaction } from '../../../model/adminTransaction';
import { Header } from '../header/header';

@Component({
  selector: 'app-admin-transaction',
  imports: [CommonModule, Header],
  standalone: true,
  templateUrl: './admin-transaction.html',
  styleUrls: ['./admin-transaction.scss'],
})
export class AdminTransactions implements OnInit {
  data?: AllUserTransactionsResponse;
  transactions: any[] = [];
  loading = true;
  error?: string;
  selectedUser: UserTransaction | null = null;

  constructor(
    private adminTxService: AdminTransactionService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  async ngOnInit() {
    this.loading = true;
    this.error = undefined;

    try {
      const data = await this.adminTxService.getAllUsersTransactions();
      this.data = data;

      // ตั้งค่า user คนแรกเป็น default
      if (this.data.users.length > 0) {
        this.selectedUser = this.data.users[0];
      }

      // Flatten transactions: รวมทุก transaction ของทุก user เป็น array เดียว
      this.transactions = [];
      this.data.users.forEach((user) => {
        user.transactions.forEach((tx) => {
          this.transactions.push({
            username: user.username,
            ...tx,
          });
        });
      });

      this.cd.detectChanges(); // อัปเดต UI ทันที
      console.log('Flatten transactions:', this.transactions);
    } catch (err: any) {
      this.error = err.message || 'ไม่สามารถดึงข้อมูลได้';
      console.error('โหลดข้อมูลล้มเหลว:', err);
    } finally {
      this.loading = false;
      this.cd.detectChanges();
    }
  }
}
