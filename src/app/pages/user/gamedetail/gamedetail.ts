import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/admin';
import { games } from '../../../model/game';
import Swal from 'sweetalert2';

interface GameDetail extends Partial<games> {
  gallery?: string[];
  ranking?: number;
}

@Component({
  selector: 'app-gamedetail',
  standalone: true,
  imports: [CommonModule, Header, RouterLink], 
  templateUrl: './gamedetail.html',
  styleUrls: ['./gamedetail.scss']
})
export class Gamedetail implements OnInit {
  
  game: GameDetail = {};
  otherGames: Partial<games>[] = []; 
  selectedImage: string | undefined = '';
  gameId!: number;
  message: string = '';
  isError: boolean = false;
  isBuying: boolean = false;
  addtocart: boolean = false;

  constructor(
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router 
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

 
  changeSelectedImage(imageUrl: string | undefined): void {
    this.selectedImage = imageUrl;
  }


  async buyGame(gameId: number | undefined): Promise<void> {
    if (!gameId) return;

    this.isBuying = true;
    this.cd.detectChanges();

    try {
      const result = await this.authService.purchaseGame([{ game_id: gameId, quantity: 1 }]);

      await Swal.fire({
        icon: 'success',
        title: 'ชำระเงินสำเร็จ!',
        html:
          `<b>${this.game.title}</b><br>` +
          `ยอดที่ชำระ: <b>${result.final_price} บาท</b><br>` +
          `ยอดคงเหลือใน Wallet: <b>${result.remaining_balance} บาท</b>`,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#3085d6',
      });
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'ผิดพลาด!',
        text: error.error?.message || 'ไม่สามารถซื้อเกมได้',
      });
    } finally {
      this.isBuying = false;
      this.cd.detectChanges();
    }
  }


  async addgametocart(gameId: number | undefined): Promise<void> {
    if (!gameId) return;

    this.addtocart = true;
    this.cd.detectChanges();

    try {
      const result = await this.authService.addgametocart([{ game_id: gameId, quantity: 1 }]);

      await Swal.fire({
        icon: 'success',
        title: 'เพิ่มเข้าตะกล้าสำเร็จ!',
        // html:
        //   `<b>${this.game.title}</b><br>` +
        //   `ยอดที่ชำระ: <b>${result.final_price} บาท</b><br>` +
        //   `ยอดคงเหลือใน Wallet: <b>${result.remaining_balance} บาท</b>`,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#3085d6',
      });
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'ผิดพลาด!',
        text: error.error?.message || 'ไม่สามารถเพิ่มเข้าตะกล้าได้',
      });
    } finally {
      this.isBuying = false;
      this.cd.detectChanges();
    }
  }


  async confirmPurchase(gameId: number | undefined): Promise<void> {
    if (!gameId) return;

    const result = await Swal.fire({
      title: 'ยืนยันการซื้อ?',
      text: `คุณต้องการซื้อ "${this.game.title}" ในราคา ฿${this.game.price?.toFixed(
        2
      )} ใช่หรือไม่?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยันการชำระเงิน',
      cancelButtonText: 'ยกเลิก',
    });

    if (result.isConfirmed) {
     
      this.buyGame(gameId);
    }
  }


  async confirmcart(gameId: number | undefined): Promise<void> {
    if (!gameId) return;

    const result = await Swal.fire({
      title: 'ยืนยันการเพิ่มเข้าตะกล้า?',
      text: `ยืนยันการเพิ่มเข้าตะกล้า "${this.game.title}" ในราคา ฿${this.game.price?.toFixed(
        2
      )} ใช่หรือไม่?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยันการเพิ่มเข้าตะกล้า',
      cancelButtonText: 'ยกเลิก',
    });

    if (result.isConfirmed) {
     
      this.addgametocart(gameId);
    }
  }


}

