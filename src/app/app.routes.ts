import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { PokemonDetailComponent } from './components/pokemon-detail/pokemon-detail.component';
import { PokemonEditComponent } from './components/pokemon-edit/pokemon-edit.component';
export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'pokemons', component: PokemonListComponent },
  { path: 'pokemon/:name', component: PokemonDetailComponent },
  { path: 'pokemon/edit/:name', component: PokemonEditComponent },
];
