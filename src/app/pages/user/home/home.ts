import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../header/header';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/admin';
import { games } from '../../../model/game';
import { BestsellerGame } from '../../../model/bestseller.model';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {
  allGames: Partial<games>[] = [];
  featuredGames: Partial<games>[] = [];
  displayGames: Partial<games>[] = [];
  bestsellerGames: BestsellerGame[] = [];

  searchTerm: string = '';
  selectedCategory: string = '';
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
    'Indie',
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    // --- 3. ดึงข้อมูลเกมทั้งหมด (เหมือนเดิม) ---
    try {
      const data = await this.authService.getdatagame();
      this.allGames = Array.isArray(data) ? data : [data];
      this.updateDisplayedGames();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Failed to fetch game data:', error);
      this.allGames = [];
      this.updateDisplayedGames();
    }

    // --- 4. ดึงข้อมูลเกมขายดี (ส่วนที่เพิ่มใหม่) ---
    try {
      const bestsellers = await this.authService.getBestsellers();
      this.bestsellerGames = bestsellers.slice(0, 5); // เอาแค่ 5 อันดับแรก
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Failed to fetch bestseller data:', error);
      this.bestsellerGames = [];
    }
  }

  // ฟังก์ชันใหม่สำหรับจัดระเบียบว่าเกมไหนจะไปแสดงที่ส่วนใด
  updateDisplayedGames(): void {
    const gamesToDisplay = this.getFilteredGames();
    this.featuredGames = gamesToDisplay.slice(0, 2);
    this.displayGames = gamesToDisplay;
  }

  getFilteredGames(): Partial<games>[] {
    let tempGames = [...this.allGames];

    if (this.selectedCategory) {
      tempGames = tempGames.filter((game) => game.category === this.selectedCategory);
    }

    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    if (lowerCaseSearchTerm) {
      tempGames = tempGames.filter((game) =>
        game.title?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    return tempGames;
  }

  onFilterChange(): void {
    this.updateDisplayedGames();
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.onFilterChange();
  }

  viewGameDetails(id: number | undefined): void {
    if (id === undefined) return;
    console.log(`Navigating to details for game with ID: ${id}`);
    this.router.navigate(['/detailgame', id]);
  }
}
