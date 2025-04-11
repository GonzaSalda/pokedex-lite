import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pokemon-detail.component.html',
})
export class PokemonDetailComponent {
  pokemon: any;
  evolutions: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private router: Router
  ) {}

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      this.loadPokemonDetails(name);
      this.loadEvolutions(name);
    }
  }

  loadPokemonDetails(name: string) {
    const storedPokemons = JSON.parse(localStorage.getItem('pokemons') || '[]');
    const foundPokemon = storedPokemons.find((p: any) => p.name === name);

    if (foundPokemon) {
      this.pokemon = foundPokemon;
      this.pokemon.typesString = this.pokemon.types.join(', '); 
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
          };
        },
        error: (err) => console.error('Error fetching details:', err),
      });
    }
  }

  loadEvolutions(name: string) {
    this.pokemonService.getPokemonSpecies(name).subscribe({
      next: (species) => {
        this.pokemonService
          .getEvolutionChain(species.evolution_chain.url)
          .subscribe({
            next: (data) => {
              this.extractEvolutions(data.chain);
            },
            error: (err) => console.error('Error fetching details:', err),
          });
      },
      error: (err) => console.error('Error fetching details:', err),
    });
  }

  extractEvolutions(chain: any) {
    this.evolutions = [];
    let current = chain;
    while (current) {
      this.evolutions.push(current.species.name);
      current = current.evolves_to.length ? current.evolves_to[0] : null;
    }
  }

  editPokemon() {
    this.router.navigate(['/pokemon/edit', this.pokemon.name]);
  }
}
