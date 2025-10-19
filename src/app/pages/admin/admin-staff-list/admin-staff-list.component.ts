import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService, Staff } from '../../../services/data.service';

@Component({
  selector: 'app-admin-staff-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-staff-list.component.html',
})
export class AdminStaffListComponent {
  private data = inject(DataService);

  q = signal('');
  rol = signal<'todos' | Staff['rol']>('todos');
  list = signal<Staff[]>([]);

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.data.getAllStaff().subscribe(items => this.list.set(items));
  }

  filtered = computed(() => {
    const text = this.q().trim().toLowerCase();
    const role = this.rol();
    return this.list().filter(s => {
      const okText =
        !text ||
        s.nombre?.toLowerCase().includes(text) ||
        s.correo?.toLowerCase().includes(text) ||
        s.ubicacion?.toLowerCase().includes(text);
      const okRol = role === 'todos' || s.rol === role;
      return okText && okRol;
    });
  });
}
