import { Component, Input, OnChanges, SimpleChanges, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, FloorSchema } from '../../services/data.service';

@Component({
  selector: 'app-floor-view',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="bg-white rounded-xl shadow p-3 overflow-auto">
    <ng-container *ngIf="schema(); else noMap">
      <svg [attr.viewBox]="viewBox()" class="w-full h-[420px] border rounded">
        <!-- fondo -->
        <rect x="0" y="0"
              [attr.width]="schema()!.width"
              [attr.height]="schema()!.height"
              fill="#f8fafc"></rect>

        <!-- salas -->
        <ng-container *ngFor="let r of schema()!.rooms">
          <rect
            [attr.x]="r.x" [attr.y]="r.y"
            [attr.width]="r.w" [attr.height]="r.h"
            [attr.fill]="r.id === activeRoomId ? '#DBEAFE' : '#E5E7EB'"
            stroke="#0F3F7A" stroke-width="1.5"
            rx="6" ry="6"
          />
          <text
            [attr.x]="r.x + 8"
            [attr.y]="r.y + 18"
            font-size="12"
            fill="#0F172A"
          >{{ r.name }}</text>
        </ng-container>
      </svg>
    </ng-container>
    <ng-template #noMap>
      <div class="text-gray-500">No hay mapa para este piso.</div>
    </ng-template>
  </div>
  `
})
export class FloorViewComponent implements OnChanges {
  private data = inject(DataService);

  /** Piso a mostrar (1..N) */
  @Input() floor!: number;

  /** Sala a resaltar */
  @Input() activeRoomId?: string;

  schema = signal<FloorSchema | null>(null);
  viewBox = computed(() => {
    const s = this.schema();
    return `0 0 ${s?.width ?? 1000} ${s?.height ?? 600}`;
  });

  ngOnChanges(changes: SimpleChanges): void {
    if ('floor' in changes && this.floor) {
      this.data.getFloor$(this.floor).subscribe(s => this.schema.set(s));
    }
  }
}
