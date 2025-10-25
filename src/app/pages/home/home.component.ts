import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CardComponent } from '../../components/card/card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Sections = {
  title: string;
  description: string;
  link: any[];
  imageUrl: string;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NavbarComponent,
    FooterComponent,
    CardComponent,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  section: Sections[] = [
    {
      title: 'Académicos',
      description: 'Listado de académicos por categoría.',
      link: ['/academicos'], 
      imageUrl: 'assets/img/academicos.png',
    },
    {
      title: 'Funcionarios',
      description: 'Personal administrativo y de apoyo.',
      link: ['/funcionarios'], 
      imageUrl: 'assets/img/administrativo.png',
    },
    {
      title: 'Salas',
      description: 'Consulta de salas y horarios.',
      link: ['/salas'], 
      imageUrl: 'assets/img/salas.png',
    },
  ];
}
