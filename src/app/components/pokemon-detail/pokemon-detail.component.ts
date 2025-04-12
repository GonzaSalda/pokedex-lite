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

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }
 

    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      this.loadPokemonDetails(name);
      console.log(this.pokemon)
    }
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
}
