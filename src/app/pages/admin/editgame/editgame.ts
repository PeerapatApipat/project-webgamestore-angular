import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../header/header';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/admin';
import { games } from '../../../model/game';

@Component({
  selector: 'app-editgame',
  imports: [CommonModule, FormsModule, Header, RouterLink],
  templateUrl: './editgame.html',
  styleUrls: ['./editgame.scss']
})
export class Editgame implements OnInit {

  categories: string[] = [
    'Action','Adventure','RPG','Simulation','Strategy','Sports','Horror',
    'Puzzle','Racing','Shooter','Fighting','Platformer','Survival','MMORPG','Indie'
  ];

  game: Partial<games> = {};
  message: string = '';
  isError: boolean = false;
  isLoading: boolean = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  gameId!: number;

  // หมวดหมู่ที่เลือกไว้
  selectedCategories: string[] = [];
  dropdownOpen: boolean = false;

  constructor(
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      const idParam = params.get('id');
      if (idParam) {
        this.gameId = +idParam;
        console.log('Editing game with ID:', this.gameId);

        try {
          const data = await this.authService.getGameById({ id: this.gameId });

          this.game = {
            title: data.title,
            price: data.price,
            description: data.description,
            category: data.category,
            image_url: data.image_url,
            release_date: data.release_date
          };

          // หมวดหมู่
          if (data.category) {
            this.selectedCategories = data.category.split(',').map(c => c.trim());
          }

          // รูปภาพ
          if (data.image_url) {
            this.previewUrl = data.image_url;
          }

          // แปลงวันที่ให้ input date แสดง
          if (data.release_date) {
          const date = new Date(data.release_date);
         const yyyy = date.getFullYear();
          const mm = String(date.getMonth() + 1).padStart(2, '0');
          const dd = String(date.getDate()).padStart(2, '0');
          this.game.release_date = `${yyyy}-${mm}-${dd}` as unknown as Date;
}

          this.cd.detectChanges();
        } catch (error) {
          console.error('Failed to load game:', error);
          this.message = 'โหลดข้อมูลเกมไม่สำเร็จ';
          this.isError = true;
        }
      }
    });
  }

  // เลือกไฟล์รูป
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

  removeImage(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }

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



  
  async savegame() {
  if (!this.game.title || !this.game.price || !this.game.release_date) {
    this.message = 'กรุณากรอกข้อมูลให้ครบ';
    this.isError = true;
    return;
  }

  this.isLoading = true;
  this.message = '';
  this.isError = false;

  try {
    const formData = new FormData();

    formData.append('id', this.gameId.toString());
    formData.append('title', this.game.title!);
    formData.append('price', this.game.price!.toString());
    formData.append('description', this.game.description || '');
    formData.append('category', this.selectedCategories.join(', '));

   
    if (this.selectedFile) {
      formData.append('game_images', this.selectedFile);
     

    }

  
    if (this.game.release_date) {
      const date = new Date(this.game.release_date);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      formData.append('release_date', `${yyyy}-${mm}-${dd}`);
    }

    if (this.game.bestseller_rank !== undefined) {
      formData.append('bestseller_rank', this.game.bestseller_rank.toString());
    }

   const response = await this.authService.updateGame(formData);
  console.log(response);
  this.message = response.message || 'บันทึกข้อมูลเรียบร้อย';

    this.isError = false;
    this.isLoading = false;
    this.cd.detectChanges();

  } catch (error) {
    console.error('Failed to save game:', error);
    this.message = 'บันทึกข้อมูลไม่สำเร็จ';
    this.isError = true;
    this.isLoading = false;
  }
}

}
