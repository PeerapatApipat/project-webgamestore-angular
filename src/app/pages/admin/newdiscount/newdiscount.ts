import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DiscountCode } from '../../../model/discount.model';
import { FormsModule, NgForm } from '@angular/forms';
import { DiscountService } from '../../../services/discount.service';
import { Header } from '../header/header';
import { CommonModule, DatePipe } from '@angular/common';
@Component({
  selector: 'app-newdiscount',
  standalone: true, 
  imports: [Header, CommonModule, DatePipe, FormsModule],
  templateUrl: './newdiscount.html',
  styleUrl: './newdiscount.scss', 
})
export class Newdiscount implements OnInit {
  // แก้ไข: เพิ่ม implements OnInit
  discounts: DiscountCode[] = [];
  codeForm: Partial<DiscountCode> = {};

  isEditMode: boolean = false;
  message: string = '';
  isError: boolean = false;
  isLoading: boolean = false;
  isLoadingList: boolean = false;

  constructor(private discountService: DiscountService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadAllDiscounts();
  }

  async loadAllDiscounts(): Promise<void> {
    this.isLoadingList = true;
    try {
      this.discounts = await this.discountService.getAllDiscounts();
    } catch (error: any) {
      this.message = 'เกิดข้อผิดพลาดในการโหลดข้อมูล: ' + error.message;
      this.isError = true;
    } finally {
      this.isLoadingList = false;
      this.cd.detectChanges();
    }
  }

  async handleFormSubmit(form: NgForm): Promise<void> {
    if (form.invalid) {
      this.message = 'กรุณากรอกข้อมูลให้ครบถ้วน';
      this.isError = true;
      return;
    }

    this.isLoading = true;
    this.message = '';
    this.isError = false;

    try {
      const formData = {
        code: this.codeForm.code!,
        discount_percent: this.codeForm.discount_percent!,
        max_uses: this.codeForm.max_uses!,
        expire_date: this.codeForm.expire_date!,
      };

      if (this.isEditMode && this.codeForm.id) {
        await this.discountService.updateDiscount(this.codeForm.id, formData);
        this.message = 'อัปเดตโค้ดส่วนลดสำเร็จ!';
        this.cd.detectChanges();
      } else {
        await this.discountService.addDiscount(formData);
        this.message = 'เพิ่มโค้ดส่วนลดใหม่สำเร็จ!';
        this.cd.detectChanges();
      }

      this.resetForm(form);
      await this.loadAllDiscounts();
    } catch (error: any) {
      this.message = error?.error?.message || 'เกิดข้อผิดพลาด';
      this.isError = true;
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  selectForEdit(code: DiscountCode): void {
    this.isEditMode = true;
    this.codeForm = {
      ...code,
      expire_date: this.formatDateForInput(code.expire_date),
    };
    this.message = '';
    this.isError = false;
    window.scrollTo(0, 0);
  }

  async deleteCode(id: number, code: string): Promise<void> {
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบโค้ด: ${code} ?`)) {
      return;
    }

    try {
      await this.discountService.deleteDiscount(id);
      this.message = `ลบโค้ด ${code} สำเร็จ`;
      this.isError = false;
      await this.loadAllDiscounts(); // โหลด List ใหม่
    } catch (error: any) {
      this.message = error?.error?.message || 'เกิดข้อผิดพลาดในการลบ';
      this.isError = true;
    }
  }

  resetForm(form: NgForm): void {
    form.resetForm();
    this.codeForm = {};
    this.isEditMode = false;
    this.isError = false;
  }

  public isCodeInactive(code: DiscountCode): boolean {
    const isUsedUp = code.used_count >= code.max_uses;

    const expiryDate = new Date(code.expire_date);
    expiryDate.setHours(23, 59, 59, 999);

    const today = new Date();

    const isExpired = expiryDate < today;

    return isUsedUp || isExpired;
  }

  private formatDateForInput(dateStr: string | Date): string {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  }
}
