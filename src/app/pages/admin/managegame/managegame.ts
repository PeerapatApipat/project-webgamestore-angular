import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../header/header';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/admin';
import { games } from '../../../model/game'; // Assuming this is your game model/interface

@Component({
  selector: 'app-managegame',
  standalone: true, // Make component standalone
  imports: [CommonModule, FormsModule, Header, RouterLink], // Add necessary imports
  templateUrl: './managegame.html',
  styleUrl: './managegame.scss'
})
export class Managegame implements OnInit {
  // Master list of all games from API
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
    this.cdr.detectChanges();
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
      this.filterGames(); 
      alert('ลบเกมสำเร็จ');
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Failed to delete game:', error);
      alert('ลบเกมไม่สำเร็จ โปรดลองอีกครั้ง');
    }
  }
}

