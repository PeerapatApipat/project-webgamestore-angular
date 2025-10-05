import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { Router, RouterLink } from '@angular/router';
import { Header } from '../header/header';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Header,
    RouterLink,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
