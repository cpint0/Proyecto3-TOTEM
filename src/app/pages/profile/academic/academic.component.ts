import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Academic } from './academic.model';

@Component({
  selector: 'app-academic',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent, HttpClientModule],
  templateUrl: './academic.component.html',
  styleUrls: ['./academic.component.css'],
})
export class AcademicComponent implements OnInit {
  searchText: string = '';
  academics: Academic[] = [];
  selectedAcademic?: Academic;
  loading = true;
  error?: string;
  modalOpen = false;
  modalImage?: string;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? parseInt(idParam, 10) : null;
    if (id === null || Number.isNaN(id)) {
      // no id -> mostrar lista
      this.loadAcademics();
    } else {
      this.loadSingleAcademic(id);
    }
  }

  loadAcademics() {
    this.loading = true;
    this.http.get<Academic[]>('assets/data/academics.json').subscribe(
      (data) => {
        this.academics = data.filter((a) => a.rol === 'academico');
        this.loading = false;
      },
      (err) => {
        console.error('Error cargando académicos:', err);
        this.error = 'Error cargando académicos';
        this.loading = false;
      }
    );
  }

  loadSingleAcademic(id: number) {
    this.loading = true;
    this.http.get<Academic[]>('assets/data/academics.json').subscribe(
      (data) => {
        this.selectedAcademic = data.find((a) => a.id === id && a.rol === 'academico');
        if (!this.selectedAcademic) {
          this.error = 'Académico no encontrado';
        }
        this.loading = false;
      },
      (err) => {
        console.error('Error cargando académico:', err);
        this.error = 'Error cargando datos';
        this.loading = false;
      }
    );
  }

  filteredAcademics(): Academic[] {
    return this.academics.filter(
      (a) => this.searchText === '' || a.nombre.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  clearFilters() {
    this.searchText = '';
  }

  openImageModal(src?: string) {
    if (!src) return;
    this.modalImage = src;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.modalImage = undefined;
  }

  // Cierra el modal con la tecla Escape
  @HostListener('document:keydown.escape', [])
  onEscapeKey() {
    if (this.modalOpen) this.closeModal();
  }
}
