import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Room } from '../../models/rooms.model';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, HttpClientModule],
  templateUrl: './rooms.component.html',
})
export class RoomsComponent implements OnInit {
  searchText: string = '';
  selectedCategory: string = '';
  selectedRoom: Room | null = null;
  rooms: Room[] = [];
  loading = true;
  error: string | null = null;

  categories: string[] = [
    'Laboratorio',
    'Simulación',
    'Virtual',
    'Experimental',
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Room[]>('assets/data/rooms.json').subscribe({
      next: (data) => {
        this.rooms = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando las salas:', err);
        this.error =
          'No se pudieron cargar los datos de las salas. Por favor, intente más tarde.';
        this.loading = false;
      },
    });
  }

  filteredRooms(): Room[] {
    return this.rooms.filter((room) => {
      const matchesText = room.nombre
        .toLowerCase()
        .includes(this.searchText.toLowerCase());
      const matchesCategory = this.selectedCategory
        ? room.category === this.selectedCategory
        : true;
      return matchesText && matchesCategory;
    });
  }

  openModal(room: Room) {
    this.selectedRoom = room;
  }

  closeModal() {
    this.selectedRoom = null;
  }

  clearFilters() {
    this.searchText = '';
    this.selectedCategory = '';
  }

  // Host Listener para accesibilidad (cierre con Escape)
  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    if (this.selectedRoom) {
      this.closeModal();
    }
  }
}
