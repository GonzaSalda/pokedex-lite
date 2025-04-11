import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemon-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pokemon-edit.component.html',
  styleUrl: './pokemon-edit.component.css',
})
export class PokemonEditComponent {
  pokemon: any = { name: '', level: 0, types: [], abilities: [] };
  originalName: string = '';
  newType: string = '';
  newAbility: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      const storedPokemons = JSON.parse(
        localStorage.getItem('pokemons') || '[]'
      );
      const foundPokemon = storedPokemons.find((p: any) => p.name === name);
      if (foundPokemon) {
        this.pokemon = {
          ...foundPokemon,
          types: Array.isArray(foundPokemon.types) ? foundPokemon.types : [],
          abilities: Array.isArray(foundPokemon.abilities) ? foundPokemon.abilities : [],

        };
        this.originalName = foundPokemon.name;
      }
    }
  }

  addType() {
    if (this.newType.trim()) {
      this.pokemon.types.push(this.newType.trim().toLowerCase());
    }
  }

  removeType(index: number) {
    this.pokemon.types.splice(index, 1);
  }

  addAbility() {
    if (this.newAbility.trim()) {
      if (!Array.isArray(this.pokemon.abilities)) {
        this.pokemon.abilities = []; // Asegurar que sea un array
      }
      this.pokemon.abilities.push(this.newAbility.trim());
      this.newAbility = ''; 
    }
  }

  removeAbility(index: number) {
    this.pokemon.abilities.splice(index, 1);
  }

  saveChanges() {
    let storedPokemons = JSON.parse(localStorage.getItem('pokemons') || '[]');
    const index = storedPokemons.findIndex(
      (p: any) => p.name === this.originalName
    );

    if (index !== -1) {
      storedPokemons[index] = {
        ...this.pokemon,
         types: [...this.pokemon.types],  // Asegurar que siga siendo array
      abilities: [...this.pokemon.abilities],  // Guardar correctamente habilidades
      };

      // Si el nombre cambió, actualizar la clave en localStorage
      if (this.originalName !== this.pokemon.name) {
        storedPokemons.splice(index, 1);
        storedPokemons.push(this.pokemon);
      }

      localStorage.setItem('pokemons', JSON.stringify(storedPokemons));
    }

    this.router.navigate(['/pokemon', this.pokemon.name]);
  }
}
