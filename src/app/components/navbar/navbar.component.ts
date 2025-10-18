import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, CommonModule } from '@angular/common'; // Aseguramos CommonModule para pipes/directives

@Component({
  selector: 'app-navbar',
  standalone: true,
  // Es crucial incluir CommonModule para que funciones como date pipes o NgIf/NgFor funcionen
  imports: [RouterLink, NgIf, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
// Implementamos OnInit y OnDestroy
export class NavbarComponent implements OnInit, OnDestroy {
  // 1. Declaración de la propiedad usada en el HTML
  currentDateTime: string = '';
  private timer: any; // Para guardar la referencia del setInterval

  // Definición del formato de la fecha y hora
  dateTimeFormat: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };

  ngOnInit() {
    this.updateDateTime();
    // 2. Iniciamos el temporizador para actualizar la hora cada segundo
    this.timer = setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }

  ngOnDestroy() {
    // 3. Limpiamos el temporizador cuando el componente se destruye
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  updateDateTime() {
    const now = new Date();
    // Actualizamos la variable que se muestra en el HTML
    this.currentDateTime = now
      .toLocaleString('es-CL', this.dateTimeFormat)
      .replace(',', ' -');
  }
}
