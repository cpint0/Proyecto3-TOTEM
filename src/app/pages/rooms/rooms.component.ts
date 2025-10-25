import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';

interface Room {
  id_Sala: number;
  nombre: string;
  ubicacion: string;
  capacidadMax: number;
  url_mapa: string;
  codigo: string;
  QR: string;
  category: string; 
  image: string;
  description: string;
}

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './rooms.component.html',
})
export class RoomsComponent {
  searchText: string = '';
  selectedCategory: string = '';
  selectedRoom: Room | null = null;

  categories: string[] = ['Laboratorio', 'Simulación', 'Virtual', 'Experimental'];

  rooms: Room[] = [
    {
      id_Sala: 101,
      nombre: 'Laboratorio Alpha',
      category: 'Laboratorio',
      ubicacion: 'Edificio A, Piso 2, Ala Norte',
      capacidadMax: 30,
      url_mapa: 'https://www.google.com/maps/search/?api=1&query=Sala+101', // URL ejemplo
      codigo: 'LA-101',
      QR: 'https://example.com/qr/101', // URL ejemplo
      image: 'https://source.unsplash.com/600x600/?laboratory,science',
      description: 'Sala dedicada a experimentos científicos y pruebas controladas. Ideal para proyectos de microbiología y física avanzada.',
    },
    {
      id_Sala: 205,
      nombre: 'Simulador Beta',
      category: 'Simulación',
      ubicacion: 'Edificio C, Piso 3, Sector Central',
      capacidadMax: 15,
      url_mapa: 'https://www.google.com/maps/search/?api=1&query=Sala+205',
      codigo: 'SB-205',
      QR: 'https://example.com/qr/205',
      image: 'https://source.unsplash.com/600x600/?simulation,cockpit',
      description: 'Sala de simulaciones de entornos urbanos y naturales, utilizada para entrenamiento de pilotos y operadores de maquinaria pesada.',
    },
    {
      id_Sala: 301,
      nombre: 'Virtual Gamma',
      category: 'Virtual',
      ubicacion: 'Edificio B, Subsuelo 1',
      capacidadMax: 10,
      url_mapa: 'https://www.google.com/maps/search/?api=1&query=Sala+301',
      codigo: 'RV-301',
      QR: 'https://example.com/qr/301',
      image: 'https://source.unsplash.com/600x600/?virtual,reality',
      description: 'Sala equipada con VR para entrenamiento inmersivo y educativo en diseño arquitectónico y medicina.',
    },
    {
      id_Sala: 412,
      nombre: 'Experimental Delta',
      category: 'Experimental',
      ubicacion: 'Edificio D, Tercer Nivel, Laboratorio Sur',
      capacidadMax: 20,
      url_mapa: 'https://www.google.com/maps/search/?api=1&query=Sala+412',
      codigo: 'ED-412',
      QR: 'https://example.com/qr/412',
      image: 'https://source.unsplash.com/600x600/?technology,lab',
      description: 'Sala para experimentos tecnológicos avanzados y pruebas de IA con acceso a hardware especializado.',
    },
    {
      id_Sala: 503,
      nombre: 'Simulación Sigma',
      category: 'Virtual',
      ubicacion: 'Edificio E, Planta Baja',
      capacidadMax: 8,
      url_mapa: 'https://www.google.com/maps/search/?api=1&query=Sala+503',
      codigo: 'SS-503',
      QR: 'https://example.com/qr/503',
      image: 'https://source.unsplash.com/600x600/?digital,space',
      description: 'Sala de simulación digital para prototipado rápido y visualización de datos tridimensionales.',
    },
  ];

  filteredRooms(): Room[] {
    return this.rooms.filter(room => {
      const matchesText = room.nombre.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesCategory = this.selectedCategory ? room.category === this.selectedCategory : true;
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