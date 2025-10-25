import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf, CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  searchQuery: string = ''; // texto escrito
  showSuggestions: boolean = false; // controla si se muestra la lista
  suggestions: Array<{ name: string; type: string; id?: number }> = []; // sugerencias actuales

  constructor(private router: Router) {}

  /**
   * Muestra sugerencias en tiempo real según lo que el usuario escriba
   */
  async onQueryChange() {
    const q = this.searchQuery.trim().toLowerCase();

    if (!q) {
      this.showSuggestions = false;
      this.suggestions = [];
      return;
    }

    try {
      const [academicsRes, officialsRes, roomsRes] = await Promise.all([
        fetch('/assets/data/academics.json').then((r) => r.json()),
        fetch('/assets/data/officials.json').then((r) => r.json()),
        fetch('/assets/data/rooms.json')
          .then((r) => r.json())
          .catch(() => []),
      ]);

      // Filtramos sugerencias según texto
      const acadMatches = academicsRes
        .filter((a: any) => a.nombre.toLowerCase().includes(q))
        .map((a: any) => ({ name: a.nombre, type: 'Académico', id: a.id }));

      const offMatches = officialsRes
        .filter((o: any) => o.nombre.toLowerCase().includes(q))
        .map((o: any) => ({ name: o.nombre, type: 'Funcionario', id: o.id }));

      const roomMatches = roomsRes
        .filter((s: any) => s.nombre.toLowerCase().includes(q))
        .map((s: any) => ({ name: s.nombre, type: 'Sala', id: s.id }));

      this.suggestions = [...acadMatches, ...offMatches, ...roomMatches];
      this.showSuggestions = true;
    } catch (err) {
      console.error('Error cargando sugerencias', err);
      this.suggestions = [];
      this.showSuggestions = false;
    }
  }

  /**
   * Ejecuta la búsqueda al presionar ENTER
   */
  async searchAndNavigate() {
    const q = this.searchQuery.trim();
    if (!q) return;

    try {
      const [academicsRes, officialsRes, roomsRes] = await Promise.all([
        fetch('/assets/data/academics.json').then((r) => r.json()),
        fetch('/assets/data/officials.json').then((r) => r.json()),
        fetch('/assets/data/rooms.json')
          .then((r) => r.json())
          .catch(() => []),
      ]);

      const query = q.toLowerCase();

      // Buscar académico
      const acad = academicsRes.find((a: any) =>
        a.nombre.toLowerCase().includes(query)
      );
      if (acad) {
        this.router.navigate(['/academico', acad.id]);
        this.clearSearch();
        return;
      }

      // Buscar funcionario
      const off = officialsRes.find((o: any) =>
        o.nombre.toLowerCase().includes(query)
      );
      if (off) {
        this.router.navigate(['/funcionario', off.id]);
        this.clearSearch();
        return;
      }

      // Buscar sala
      const room = roomsRes.find((s: any) =>
        s.nombre.toLowerCase().includes(query)
      );
      if (room) {
        this.router.navigate(['/salas'], { queryParams: { q: room.nombre } });
        this.clearSearch();
        return;
      }

      // Si no hay resultados, fallback
      this.router.navigate(['/salas'], { queryParams: { q } });
      this.clearSearch();
    } catch (err) {
      console.error('Search error', err);
      this.router.navigate(['/salas'], { queryParams: { q } });
      this.clearSearch();
    }
  }

  /**
   * Selección directa desde la lista de sugerencias
   */
  selectSuggestion(s: { name: string; type: string; id?: number }) {
    this.searchQuery = s.name;
    this.showSuggestions = false;

    switch (s.type) {
      case 'Académico':
        this.router.navigate(['/academico', s.id]);
        break;
      case 'Funcionario':
        this.router.navigate(['/funcionario', s.id]);
        break;
      case 'Sala':
        this.router.navigate(['/salas'], { queryParams: { q: s.name } });
        break;
      default:
        this.router.navigate(['/']);
    }

    this.clearSearch();
  }

  /** Limpia el campo y oculta sugerencias */
  clearSearch() {
    this.searchQuery = '';
    this.showSuggestions = false;
    this.suggestions = [];
  }
}
