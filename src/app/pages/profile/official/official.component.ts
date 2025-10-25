import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Academic } from '../academic/academic.model';

@Component({
  selector: 'app-official',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent, HttpClientModule, FormsModule],
  templateUrl: './official.component.html',
  styleUrls: ['./official.component.css']
})
export class OfficialComponent implements OnInit {
  searchText = '';
  officials: Academic[] = [];
  selectedOfficial?: Academic;
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
    this.http.get<Academic[]>('assets/data/officials.json').subscribe(
      (data) => {
        this.officials = data.filter((a) => a.rol && a.rol.toLowerCase().includes('funcionario'));
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
    this.http.get<Academic[]>('assets/data/officials.json').subscribe(
      (data) => {
        this.selectedOfficial = data.find((a) => a.id === id && a.rol && a.rol.toLowerCase().includes('funcionario'));
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

  filteredOfficials(): Academic[] {
    return this.officials.filter(
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
