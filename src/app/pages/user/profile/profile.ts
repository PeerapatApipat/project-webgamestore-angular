import { Component, ChangeDetectorRef } from '@angular/core';
import { Header } from '../header/header';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/user';
import { User } from '../../../model/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, Header],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'] 
})
export class Profile {
  userId: string | null = null;
  userdata: User | null = null;

  message: string = '';
  isError: boolean = false;
  isLoading: boolean = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  me = 'about me';
  bio = 'This is a sample bio for the user...';

  // ตัวแปรสำหรับแก้ไขชื่อ
  isEditingName = false;
  editedName = '';

  //เเข้ไขรูป
 isEditingAvatar = false;

  constructor(
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const user = this.authService.getUser();
    if (!user?.user_id) return;

    this.userId = user.user_id.toString();
    this.userdata = await this.authService.getdatauser(this.userId);
    this.cdr.detectChanges();
  }

  editName() {
    if (!this.userdata) return;
    this.editedName = this.userdata.username || '';
    this.isEditingName = true;
  }

  cancelEdit() {
    this.isEditingName = false;
    this.editedName = '';
  }

  async saveName() {
    if (!this.userdata || !this.userId) return;

    if (this.editedName && this.editedName !== this.userdata.username) {
      try {
        const updated = await this.authService.updateUser({ username: this.editedName, userId: this.userId });
        this.userdata.username = updated.username;
        this.isEditingName = false;
        this.cdr.detectChanges();
        alert('อัปเดตชื่อเรียบร้อย');
      } catch (err) {
        console.error('แก้ไขชื่อไม่สำเร็จ:', err);
        alert('ไม่สามารถอัปเดตชื่อได้');
      }
    } else {
      this.isEditingName = false;
    }
  } 

  onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (!file) return;

  // ตรวจสอบ type และ size ตามเดิม
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    this.message = 'กรุณาเลือกไฟล์รูปภาพเท่านั้น (jpg, jpeg, png, gif)';
    this.isError = true;
    this.cd.detectChanges();
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    this.message = 'ขนาดไฟล์ต้องไม่เกิน 5MB';
    this.isError = true;
    this.cd.detectChanges();
    return;
  }

  this.selectedFile = file;

  // ใช้ createObjectURL แทน FileReader
  this.previewUrl = URL.createObjectURL(file);
}


  //เเก้ไขรูป
  editAvatar() {
  this.isEditingAvatar = true;
  this.previewUrl = null;
  this.selectedFile = null;
}

cancelAvatar() {
  this.isEditingAvatar = false;
  this.previewUrl = null;
  this.selectedFile = null;
}

async saveAvatar() {
  if (!this.selectedFile || !this.userId) return;

  try {
    const formData = new FormData();
    formData.append("userId", this.userId);
    formData.append("profile_image", this.selectedFile);

    const updated = await this.authService.updateProfileImage(formData);

    this.userdata!.profile_image = updated.profile_image;

    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl as string);
      this.previewUrl = null;
    }

    this.isEditingAvatar = false;
    this.selectedFile = null;
    this.cdr.detectChanges();
    alert("อัปเดตรูปเรียบร้อย");
  } catch (err) {
    console.error("อัปโหลดรูปไม่สำเร็จ", err);
    alert("ไม่สามารถอัปโหลดรูปได้");
  }
}


}
