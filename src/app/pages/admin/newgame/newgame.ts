import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Header } from '../header/header';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { games } from '../../../model/game';
import { AuthService } from '../../../services/admin';


@Component({
  selector: 'app-newgame',
 imports: [CommonModule, FormsModule, HttpClientModule, RouterLink,Header],
  templateUrl: './newgame.html',
  styleUrl: './newgame.scss'
})
export class Newgame {
    @ViewChild('registerForm') newgameForm!: NgForm;

    categories: string[] = [
  'Action',
  'Adventure',
  'RPG',
  'Simulation',
  'Strategy',
  'Sports',
  'Horror',
  'Puzzle',
  'Racing',
  'Shooter',
  'Fighting',
  'Platformer',
  'Survival',
  'MMORPG',
  'Indie'
];

game: Partial<games> = {};
   message: string = '';
  isError: boolean = false;
  isLoading: boolean = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;


  errors = {
    title: '',
    price: '',
  };

constructor(
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    
    private router: Router
  ) {}

   ngOnInit(): void {
    console.log('newgame Component Initialized');
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
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

      
  this.previewUrl = URL.createObjectURL(file);

    }
  }
  
   async newgame(): Promise<void> {
    try {
      this.message = '';
      this.isError = false;

      this.isLoading = true;
      this.cd.detectChanges();

      const formData = new FormData();
      formData.append('title', this.game.title!);
      formData.append('price', this.game.price!.toString());
       if (this.game.category) {
                formData.append('category', this.game.category);
            }
            if (this.game.release_date) {
       
                formData.append('release_date', this.game.release_date.toString());
            }
            if (this.game.description) {
                formData.append('description', this.game.description);
            }
            if (this.game.bestseller_rank !== undefined && this.game.bestseller_rank !== null) {
                 formData.append('bestseller_rank', this.game.bestseller_rank.toString());
            }


      if (this.selectedFile) {
        formData.append('profile_image', this.selectedFile);
      }

      const response = await this.authService.addnewgame(formData);
      console.log('Register success:', response);

      // แสดงข้อความสำเร็จ
      this.message = 'เพิ่มเกมสำเร็จ!';
      this.isError = false;
      this.isLoading = false;

      // รีเซ็ตข้อมูล
      this.game = {};
      this.selectedFile = null;
      this.previewUrl = null;
      this.errors = { title: '', price: '' };

      if (this.newgameForm) {
        this.newgameForm.resetForm();
      }

      this.cd.detectChanges();
      alert('เพิ่มเกมสำเร็จ!');
      setTimeout(() => {
        this.router.navigate(['/newgame']);
      }, 500);
    } catch (error: any) {
      console.error('Add newgame error:', error);

      if (error?.error?.error) {
        this.message = error.error.error;
      } else if (error?.error?.message) {
        this.message = error.error.message;
      } else if (error?.message) {
        this.message = error.message;
      } else {
        this.message = 'เกิดข้อผิดพลาดในเพิ่มเกมใหม่ กรุณาลองใหม่อีกครั้ง';
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



selectedCategories: string[] = [];
dropdownOpen: boolean = false;

toggleDropdown(): void {
  this.dropdownOpen = !this.dropdownOpen;
}

toggleCategory(cat: string): void {
  const index = this.selectedCategories.indexOf(cat);
  if (index > -1) {
    this.selectedCategories.splice(index, 1); 
  } else {
    this.selectedCategories.push(cat); 
  }
  this.game.category = this.selectedCategories.join(', ');
}

removeCategory(cat: string): void {
  this.selectedCategories = this.selectedCategories.filter(c => c !== cat);
  this.game.category = this.selectedCategories.join(', ');
}


  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.category-selector');
    if (!clickedInside) {
      this.dropdownOpen = false;
    }
  }
}
















