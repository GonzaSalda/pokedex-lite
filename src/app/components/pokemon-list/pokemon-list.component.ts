import { Component } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PokemonStyleService } from '../../services/pokemon-style.service';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pokemon-list.component.html',
})
export class PokemonListComponent {
  pokemons: any[] = [];

  constructor(
    private pokemonService: PokemonService,
    private authService: AuthService,
    private router: Router,
    private pokemonStyleService: PokemonStyleService,
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }

    const storedPokemons = JSON.parse(localStorage.getItem('pokemons') || '[]');

    if (storedPokemons.length > 0) {
      this.pokemons = storedPokemons;
    } else {
      this.pokemonService.getPokemonList(10).subscribe({
        next: (data) => {
          this.pokemons = data.results;
          this.loadPokemonDetails();
        },
        error: (err) => console.error('Error fetching Pokémon:', err),
      });
    }
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
            abilities: item.abilities.map((a: any) => a.ability.name),
            evolutions: [],
          };

          this.pokemonService.getPokemonSpecies(item.name).subscribe({
            next: (species) => {
              this.pokemonService
                .getEvolutionChain(species.evolution_chain.url)
                .subscribe({
                  next: (data) => {
                    this.extractEvolutions(data.chain, index); 
                  },
                  error: (err) =>
                    console.error('Error fetching evolution chain:', err),
                });
            },
            error: (err) =>
              console.error('Error fetching species details:', err),
          });

          localStorage.setItem('pokemons', JSON.stringify(this.pokemons));
        },
        error: (err) => console.error('Error fetching details:', err),
      });
    });
  }

  extractEvolutions(chain: any, index: number) {
    const evolutions: { name: string; min_level: number | string }[] = []; 
    let current = chain;
    
    while (current) {
      evolutions.push({
        name: current.species.name,
        min_level: current.evolution_details.length > 0
          ? current.evolution_details[0].min_level
          : (evolutions.length === 0 ? 1 : 'Unknown'), 
      });
  
      current = current.evolves_to.length ? current.evolves_to[0] : null;
    }
  
    this.pokemons[index].evolutions = evolutions; 
    localStorage.setItem('pokemons', JSON.stringify(this.pokemons)); 
  }

  getTypeColor(type: string): string {
    return this.pokemonStyleService.getTypeColor(type);
  }
}
