// src/app/components/card/card.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  // ✅ No implements OnInit needed

  // Propiedades de entrada
  @Input() title: string = 'Título Predeterminado';
  @Input() description: string = 'Descripción del servicio o solución.';
  @Input() linkUrl: string = '#';
  @Input() cardIndex: number = 0;
  @Input() imageUrl: string = '';
}
