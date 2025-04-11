import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-detail.component.html',
})
export class PokemonDetailComponent {
  pokemon: any;
  evolutions: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService
  ) {}

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name');
    console.log(name);

    if (name) {
      this.loadPokemonDetails(name);
      this.loadEvolutions(name);
    }
  }

  loadPokemonDetails(name: string) {
    this.pokemonService.getPokemonDetails(name).subscribe({
      next: (data) => {
        this.pokemon = {
          name: data.name,
          types: data.types.map((t: any) => t.type.name),
          level: data.base_experience,
          image: data.sprites.other['official-artwork'].front_default,
          abilities: data.abilities.map((a: any) => a.ability.name),
        };
      },
      error: (err) => console.error('Error fetching details:', err),
    });
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
            error: (err) => console.error('Error al obtener evoluciones:', err),
          });
      },
      error: (err) => console.error('Error al obtener especie:', err),
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
}
