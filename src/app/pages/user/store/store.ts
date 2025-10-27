import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../header/header';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/admin';
import { games } from '../../../model/game';

@Component({
  selector: 'app-store',
  standalone: true, // ตรวจสอบให้แน่ใจว่าเป็น standalone
  imports: [CommonModule, FormsModule, Header, RouterLink],
  templateUrl: './store.html',
  styleUrls: ['./store.scss']
})
export class Store implements OnInit {
  
  allGames: Partial<games>[] = [];
  
  featuredGames: Partial<games>[] = [];
  displayGames: Partial<games>[] = []; 

  
  searchTerm: string = '';
  selectedCategory: string = '';
  categories: string[] = [
    'Action', 'Adventure', 'RPG', 'Simulation', 'Strategy', 'Sports', 'Horror',
    'Puzzle', 'Racing', 'Shooter', 'Fighting', 'Platformer', 'Survival', 'MMORPG', 'Indie'
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      const data = await this.authService.getdatagame();
      this.allGames = Array.isArray(data) ? data : [data];
      this.updateDisplayedGames();
      this.cdr.detectChanges();
    } catch (error) {
      console.error("Failed to fetch game data:", error);
      this.allGames = [];
      this.updateDisplayedGames();
    }
  }

  updateDisplayedGames(): void {
    const gamesToDisplay = this.getFilteredGames();
    // this.heroGame = gamesToDisplay.length > 0 ? gamesToDisplay[0] : null;
    this.featuredGames = gamesToDisplay.slice(0, 2);
    this.displayGames = gamesToDisplay;
  }


  getFilteredGames(): Partial<games>[] {
    let tempGames = [...this.allGames];


    if (this.selectedCategory) {
      tempGames = tempGames.filter(game => game.category === this.selectedCategory);
    }

  
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    if (lowerCaseSearchTerm) {
      tempGames = tempGames.filter(game =>
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

