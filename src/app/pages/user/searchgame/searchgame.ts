import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../header/header';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/admin';
import { games } from '../../../model/game';

@Component({
  selector: 'app-searchgame',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, RouterLink],
  templateUrl: './searchgame.html',
  styleUrl: './searchgame.scss'
})
export class Searchgame {
 games: Partial<games>[] = [];
  // List of games to display after filtering
  filteredGames: Partial<games>[] = [];

  
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
      this.games = Array.isArray(data) ? data : [data];
      this.filteredGames = this.games; 
      this.cdr.detectChanges();
    } catch (error) {
      console.error("Failed to fetch game data:", error);
      this.games = [];
      this.filteredGames = [];
    }
  }

 
  filterGames(): void {
    let tempGames = this.games;

   
    if (this.selectedCategory) {
      tempGames = tempGames.filter(game => game.category === this.selectedCategory);
    }

    
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    if (lowerCaseSearchTerm) {
      tempGames = tempGames.filter(game =>
        game.title?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    this.filteredGames = tempGames;
  }

  editGame(id: number | undefined): void {
    if (id === undefined) return;
    console.log(`Navigating to edit game with ID: ${id}`);
    this.router.navigate(['/editgame', id]);
  }

  async deleteGame(id: number | undefined): Promise<void> {
    if (id === undefined) return;
    if (!confirm(`Are you sure you want to delete game with ID: ${id}? This action cannot be undone.`)) {
      return;
    }
    try {
      await this.authService.deleteGameById({ id });
      this.games = this.games.filter(g => g.id !== id);
      this.filterGames(); // Re-run filters to update the UI
      alert('ลบเกมสำเร็จ');
    } catch (error) {
      console.error('Failed to delete game:', error);
      alert('ลบเกมไม่สำเร็จ โปรดลองอีกครั้ง');
    }
  }
  viewGameDetails(id: number | undefined): void {
    if (id === undefined) return;
    console.log(`Navigating to details for game with ID: ${id}`);
    this.router.navigate(['/detailgame', id]); 
  }
}
