// src/app/pages/transaction/transactions.ts
import { ChangeDetectorRef, Component } from '@angular/core';
import { TransactionService } from '../../../services/transaction';
import { Transaction } from '../../../model/transaction.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Header } from '../header/header';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule, Header],
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.scss'],
  standalone: true,
})
export class Transactions {
  transactions: Transaction[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTransactionHistory();
  }

  async loadTransactionHistory(): Promise<void> {
    try {
      this.isLoading = true;
      this.errorMessage = null;
      this.cd.detectChanges();

      const userId = localStorage.getItem('user_id');
      if (!userId) {
        throw new Error('ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่');
      }

      this.transactions = await this.transactionService.getTransactionHistory(userId);
      this.transactions.sort((a, b) => b.order_id - a.order_id);

      console.log('Transaction loaded:', this.transactions);
      console.log('Transaction count:', this.transactions.length);
    } catch (error: any) {
      this.errorMessage = error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล';
      console.error('Error loading transactions:', error);
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      paid: 'สำเร็จ',
      pending: 'รอดำเนินการ',
      cancelled: 'ยกเลิก',
    };
    return statusMap[status] || status;
  }
}
