import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  user = localStorage.getItem('user')
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  goToHome() {
    this.router.navigate(['/pokemons']); 
  }

  createPokemon() {
    this.router.navigate(['/pokemon/create']);
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }
}
