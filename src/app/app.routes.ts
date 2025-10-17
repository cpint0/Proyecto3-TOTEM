import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { StaffListComponent } from './pages/staff-list/staff-list.component';
import { StaffDetailComponent } from './pages/staff-detail/staff-detail.component';
import { RoomsComponent } from './pages/rooms/rooms.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'categoria/:tipo', component: StaffListComponent },
  { path: 'perfil/:id', component: StaffDetailComponent },
  { path: 'salas', component: RoomsComponent },
  { path: '**', redirectTo: '' },
];
