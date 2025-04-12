import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pokemon-detail.component.html',
})
export class PokemonDetailComponent {
  pokemon: any;

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private authService: AuthService,
    private router: Router
  ) {}

  typeColors: { [key: string]: string } = {
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    grass: 'bg-green-500',
    electric: 'bg-yellow-500',
    psychic: 'bg-purple-500',
    ice: 'bg-cyan-500',
    fighting: 'bg-orange-600',
    ground: 'bg-yellow-700',
    flying: 'bg-indigo-400',
    poison: 'bg-purple-700',
    bug: 'bg-lime-600',
    rock: 'bg-gray-700',
    ghost: 'bg-indigo-700',
    dragon: 'bg-violet-600',
    dark: 'bg-gray-800',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-400',
    normal: 'bg-gray-400',
  };

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }

    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      this.loadPokemonDetails(name);
      console.log(this.pokemon);
    }
  }

  goToHome(){
    this.router.navigate(['/']);
  }

  loadPokemonDetails(name: string) {
    const storedPokemons = JSON.parse(localStorage.getItem('pokemons') || '[]');
    const foundPokemon = storedPokemons.find((p: any) => p.name === name);

    if (foundPokemon) {
      this.pokemon = foundPokemon;
    } else {
      this.pokemonService.getPokemonDetails(name).subscribe({
        next: (data) => {
          this.pokemon = {
            name: data.name,
            types: data.types.map((t: any) => t.type.name),
            typesString: data.types.map((t: any) => t.type.name).join(', '),
            level: data.base_experience,
            image: data.sprites.other['official-artwork'].front_default,
            abilities: data.abilities.map((a: any) => a.ability.name),
            evolutions: [],
          };
        },
        error: (err) => console.error('Error fetching details:', err),
      });
    }
  }

  editPokemon() {
    this.router.navigate(['/pokemon/edit', this.pokemon.name]);
  }

  getTypeColor(type: string): string {
    return this.typeColors[type] || 'bg-gray-500';
  }
}
