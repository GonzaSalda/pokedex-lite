import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  login(username: string, password: string): boolean {
    if ((username === 'trainer' || username === 'master') && password === 'password') {
      localStorage.setItem('user', username);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('user') !== null;
  }
}
