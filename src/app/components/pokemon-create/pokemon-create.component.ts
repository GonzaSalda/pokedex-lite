import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pokemon-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pokemon-create.component.html',
})
export class PokemonCreateComponent {
  pokemon: any = {
    name: '',
    image: '',
    level: 1,
    types: [],
    abilities: [],
    evolutions: []
  };

  newType: string = '';
  newAbility: string = '';
  newEvolutionName: string = '';
  newEvolutionLevel: number | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  addType() {
    if (this.newType.trim()) {
      this.pokemon.types.push(this.newType.trim().toLowerCase());
      this.newType = '';
    }
  }

  removeType(index: number) {
    this.pokemon.types.splice(index, 1);
  }

  addAbility() {
    if (this.newAbility.trim()) {
      this.pokemon.abilities.push(this.newAbility.trim());
      this.newAbility = '';
    }
  }

  removeAbility(index: number) {
    this.pokemon.abilities.splice(index, 1);
  }

  addEvolution() {
    if (this.newEvolutionName.trim()) {
      this.pokemon.evolutions.push({
        name: this.newEvolutionName.trim(),
        min_level: this.newEvolutionLevel || 1
      });
      this.newEvolutionName = '';
      this.newEvolutionLevel = null;
    }
  }

  removeEvolution(index: number) {
    this.pokemon.evolutions.splice(index, 1);
  }

  savePokemon() {
    const storedPokemons = JSON.parse(localStorage.getItem('pokemons') || '[]');
    storedPokemons.push(this.pokemon);
    localStorage.setItem('pokemons', JSON.stringify(storedPokemons));
    this.router.navigate(['/pokemon', this.pokemon.name]);
  }
}
