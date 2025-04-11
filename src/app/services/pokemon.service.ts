import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}

  getPokemonList(limit: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?limit=${limit}`);
  }

  getPokemonDetails(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${name}`);
  }

  getPokemonSpecies(name: string): Observable<any> {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
  }
  
  getEvolutionChain(url: string): Observable<any> {
    return this.http.get(url);
  }
}
