import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RoomsComponent } from './pages/rooms/rooms.component';
import { AcademicComponent } from './pages/profile/academic/academic.component';
import { OfficialComponent } from './pages/profile/official/official.component';
import { AcercadeComponent } from './pages/acercade/acercade.component';

export const routes: Routes = [
  // Público
  { path: '', component: HomeComponent },
  { path: 'salas', component: RoomsComponent },
  { path: 'academicos', component: AcademicComponent },
  { path: 'academico/:id', component: AcademicComponent },
  { path: 'funcionario/:id', component: OfficialComponent },
  { path: 'funcionarios', component: OfficialComponent },
  { path: 'acercade', component: AcercadeComponent },
  // Ruta por defecto
  { path: '**', redirectTo: '' },
];
