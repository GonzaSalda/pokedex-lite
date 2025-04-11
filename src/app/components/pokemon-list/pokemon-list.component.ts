import { Component } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pokemon-list.component.html',
})
export class PokemonListComponent {
  pokemons: any[] = [];

  typeColors: { [key: string]: string } = {
    fire: "bg-red-500",
    water: "bg-blue-500",
    grass: "bg-green-500",
    electric: "bg-yellow-500",
    psychic: "bg-purple-500",
    ice: "bg-cyan-500",
    fighting: "bg-orange-600",
    ground: "bg-yellow-700",
    flying: "bg-indigo-400",
    poison: "bg-purple-700",
    bug: "bg-lime-600",
    rock: "bg-gray-700",
    ghost: "bg-indigo-700",
    dragon: "bg-violet-600",
    dark: "bg-gray-800",
    steel: "bg-gray-500",
    fairy: "bg-pink-400",
    normal: "bg-gray-400",
  };

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
            image: item.sprites.other['official-artwork'].front_default,
          };
        },
        error: (err) => console.error('Error fetching details:', err),
      });
    });
  }

  getTypeColor(type: string): string {
    return this.typeColors[type] || "bg-gray-500";
  }
}
