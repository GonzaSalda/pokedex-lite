import { Component } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-list.component.html',
})
export class PokemonListComponent {
  pokemons: any[] = [];

  constructor(
    private pokemonService: PokemonService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }

    this.pokemonService.getPokemonList(10).subscribe({
      next: (data) => {
        this.pokemons = data.results;
        this.loadPokemonDetails();
      },
      error: (err) => console.error('Error fetching Pokémon:', err),
    });
  }

  loadPokemonDetails() {
    this.pokemons.forEach((pokemon, index) => {
      this.pokemonService.getPokemonDetails(pokemon.name).subscribe({
        next: (item) => {
          this.pokemons[index] = {
            name: item.name,
            types: item.types.map((t: any) => t.type.name),
            level: item.base_experience,
            image: item.sprites.front_default,
          };
        },
        error: (err) => console.error('Error fetching details:', err),
      });
    });
  }
}
