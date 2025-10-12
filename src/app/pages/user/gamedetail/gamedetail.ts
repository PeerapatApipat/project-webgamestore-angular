import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/admin';
import { games } from '../../../model/game';

// Interface สำหรับข้อมูลเพิ่มเติม (เผื่อ API ส่ง gallery หรือ ranking มาในอนาคต)
interface GameDetail extends Partial<games> {
  gallery?: string[];
  ranking?: number;
}

@Component({
  selector: 'app-gamedetail',
  standalone: true,
  imports: [CommonModule, Header, RouterLink], // ลบ FormsModule ที่ไม่ได้ใช้ออก
  templateUrl: './gamedetail.html',
  styleUrls: ['./gamedetail.scss']
})
export class Gamedetail implements OnInit {
  
  game: GameDetail = {};
  otherGames: Partial<games>[] = []; // ข้อมูล "เกมอื่น" ควรจะมาจาก API ในอนาคต
  selectedImage: string | undefined = '';
  gameId!: number;
  message: string = '';
  isError: boolean = false;

  constructor(
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router // Inject Router สำหรับการนำทาง
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.gameId = +idParam;
        this.loadGameData();
      }
    });
  }

  async loadGameData(): Promise<void> {
    try {
      const data = await this.authService.getGameById({ id: this.gameId });
      
   
      this.game = {
        ...data,
       
        gallery: data.image_url ? [data.image_url] : []
      };
      
      this.selectedImage = this.game.image_url;

      this.otherGames = [];

      this.cd.detectChanges();
    } catch (error) {
      console.error('Failed to load game:', error);
      this.message = 'โหลดข้อมูลเกมไม่สำเร็จ';
      this.isError = true;
    }
  }

  // ฟังก์ชันสำหรับเปลี่ยนรูปภาพหลักเมื่อคลิกที่ Thumbnail
  changeSelectedImage(imageUrl: string | undefined): void {
    this.selectedImage = imageUrl;
  }


  buyGame(gameId: number | undefined): void {
    if (!gameId) {
      console.error("Game ID is missing, cannot proceed with purchase.");
      return;
    }
    console.log(`User wants to buy game with ID: ${gameId}`);
    
    alert(`เพิ่มเกม "${this.game.title}" ลงในตะกร้าเรียบร้อย!`);
  }
}

