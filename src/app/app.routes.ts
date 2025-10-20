import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { StaffListComponent } from './pages/staff-list/staff-list.component';
import { StaffDetailComponent } from './pages/staff-detail/staff-detail.component';
import { RoomsComponent } from './pages/rooms/rooms.component';

// Admin
import { adminGuard } from './guards/admin.guard';
import { AdminLayoutComponent } from './pages/admin/admin-layout/admin-layout.component';
import { AdminLoginComponent } from './pages/admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminStaffListComponent } from './pages/admin/admin-staff-list/admin-staff-list.component';
import { AdminStaffEditComponent } from './pages/admin/admin-staff-edit/admin-staff-edit.component';
import { AdminRoomsDesignerComponent } from './pages/admin/admin-rooms-designer/admin-rooms-designer.component';
//import { AdminRoomsListComponent } from './pages/admin/rooms/admin-rooms-list.component';
//import { AdminRoomsEditComponent } from './pages/admin/rooms/admin-rooms-edit.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'categoria/:tipo', component: StaffListComponent },
  { path: 'perfil/:id', component: StaffDetailComponent },
  { path: 'salas', component: RoomsComponent },

  // Admin público: login
  { path: 'admin/login', component: AdminLoginComponent },

  // Admin protegido
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'staff', component: AdminStaffListComponent },
      { path: 'staff/:id', component: AdminStaffEditComponent },
      { path: 'rooms/designer', component: AdminRoomsDesignerComponent },
      { path: 'rooms/designer/:floor', component: AdminRoomsDesignerComponent }, 
    ],
  },

  { path: '**', redirectTo: '' },
];


//      { path: 'rooms', component: AdminRoomsListComponent },
//      { path: 'rooms/:id', component: AdminRoomsEditComponent }, // editar/crear