import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Official } from '../../../models/official.model';

@Component({
  selector: 'app-official',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NavbarComponent,
    FooterComponent,
    HttpClientModule,
    FormsModule,
  ],
  templateUrl: './official.component.html',
  styleUrls: ['./official.component.css'],
})
export class OfficialComponent implements OnInit {
  searchText = '';
  searchCargo = '';
  officials: Official[] = [];
  cargos: string[] = [];
  selectedOfficial?: Official;
  loading = true;
  error?: string;
  modalOpen = false;
  modalImage?: string;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? parseInt(idParam, 10) : null;
    if (id === null || Number.isNaN(id)) {
      this.loadOfficials();
    } else {
      this.loadSingleOfficial(id);
    }
  }

  loadOfficials() {
    this.loading = true;
    this.http.get<Official[]>('assets/data/officials.json').subscribe(
      (data) => {
        this.officials = data.filter(
          (a) => a.rol && a.rol.toLowerCase().includes('funcionario')
        );
        // Extraer cargos únicos y ordenarlos
        const allCargos = this.officials.map((o) => o.cargo).filter(Boolean);
        this.cargos = [...new Set(allCargos)].sort();

        this.loading = false;
      },
      (err) => {
        console.error('Error cargando funcionarios:', err);
        this.error = 'Error cargando funcionarios';
        this.loading = false;
      }
    );
  }

  loadSingleOfficial(id: number) {
    this.loading = true;
    this.http.get<Official[]>('assets/data/officials.json').subscribe(
      (data) => {
        this.selectedOfficial = data.find(
          (a) =>
            a.id === id && a.rol && a.rol.toLowerCase().includes('funcionario')
        );
        if (!this.selectedOfficial) this.error = 'Funcionario no encontrado';
        this.loading = false;
      },
      (err) => {
        console.error('Error cargando funcionario:', err);
        this.error = 'Error cargando datos';
        this.loading = false;
      }
    );
  }

  selectOfficial(o: Official) {
    this.selectedOfficial = o;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  filteredOfficials(): Official[] {
    return this.officials.filter(
      (official) =>
        (this.searchText === '' ||
          official.nombre
            .toLowerCase()
            .includes(this.searchText.toLowerCase())) &&
        (this.searchCargo === '' || official.cargo === this.searchCargo)
    );
  }

  clearFilters() {
    this.searchText = '';
    this.searchCargo = '';
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
