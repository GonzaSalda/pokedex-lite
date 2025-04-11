import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/pokemons']); 
    }
  }

  login() {
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/pokemons']).then(() => {
        location.reload(); 
      });
    } else {
      this.errorMessage = 'Username or password is incorrect';
    }
  }
}
