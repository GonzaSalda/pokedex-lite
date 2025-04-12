import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PokemonStyleService {
  private typeColors: { [key: string]: string } = {
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

  getTypeColor(type: string): string {
    return this.typeColors[type] || 'bg-gray-500';
  }
}
