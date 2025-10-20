import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs'; // ⬅️ NUEVO
import { DataService, FloorSchema, Staff } from '../../../services/data.service';

type DragState = {
  mode: 'move'|'resize-nw'|'resize-ne'|'resize-sw'|'resize-se'|null;
  startX: number; startY: number;
  orig: { x:number; y:number; w:number; h:number };
};

@Component({
  selector: 'app-admin-rooms-designer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-rooms-designer.component.html',
})
export class AdminRoomsDesignerComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private data = inject(DataService);

  floor = signal<number>(1);
  schema = signal<FloorSchema | null>(null);
  selectedId = signal<string>('');
  drag = signal<DragState | null>(null);

  staffList = signal<Staff[]>([]);
  staffTarget = signal<string>('');

  viewBox = computed(() => {
    const s = this.schema();
    return `0 0 ${s?.width ?? 1000} ${s?.height ?? 600}`;
  });

  ngOnInit() {
    const f = Number(this.route.snapshot.paramMap.get('floor') || '1');
    this.floor.set([1,2,3,4].includes(f) ? f : 1);
    this.load();
    this.data.getAllStaff().subscribe(list => this.staffList.set(list));
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
  }
  ngOnDestroy() {
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
  }

  load() {
    this.data.getFloor$(this.floor()).subscribe(s => this.schema.set(structuredClone(s)));
  }

  changeFloor(f: number) {
    this.floor.set(f);
    this.router.navigate(['/admin/rooms/designer', f]);
    this.load();
  }

  // ⬅️ NUEVO: actualizar width/height desde el template
  onCanvasSize(key: 'width'|'height', val: number) {
    const s = this.schema();
    if (!s) return;
    const next = { ...s, [key]: Number(val) };
    this.schema.set(next);
  }

  addRoom() {
    const s = this.schema(); if (!s) return;
    const id = 'room_' + Date.now();
    s.rooms.push({ id, name: 'Sala nueva', x: 100, y: 100, w: 160, h: 100 });
    this.selectedId.set(id);
    this.schema.set({ ...s });
  }

  removeRoom() {
    const s = this.schema(); if (!s) return;
    const id = this.selectedId(); if (!id) return;
    s.rooms = s.rooms.filter(r => r.id !== id);
    this.selectedId.set('');
    this.schema.set({ ...s });
  }

  saveAll() {
    const s = this.schema(); if (!s) return;
    const ops = [
      this.data.setCanvasSize(this.floor(), s.width, s.height),
      ...s.rooms.map(r => this.data.upsertRoom(this.floor(), r))
    ];
    forkJoin(ops).subscribe(() => alert('Mapa guardado.'));
  }

  assignToStaff() {
    const id = this.selectedId(); const staffId = this.staffTarget();
    if (!id || !staffId) { alert('Selecciona una sala y un staff.'); return; }
    this.data.assignStaffToRoom(staffId, this.floor(), id).subscribe(() => {
      alert('Sala asignada.');
    });
  }

  // ====== Interacción (drag/resize) ======
  private get selected() {
    const s = this.schema(); if (!s) return null;
    const id = this.selectedId(); if (!id) return null;
    return s.rooms.find(r => r.id === id) || null;
  }

  select(id: string) { this.selectedId.set(id); }

  onHandleDown(evt: MouseEvent, mode: DragState['mode']) {
    evt.stopPropagation();
    const r = this.selected; if (!r) return;
    this.drag.set({
      mode,
      startX: evt.clientX, startY: evt.clientY,
      orig: { x: r.x, y: r.y, w: r.w, h: r.h }
    });
  }

  onRectDown(evt: MouseEvent, id: string) {
    this.select(id);
    const r = this.selected; if (!r) return;
    this.drag.set({
      mode: 'move',
      startX: evt.clientX, startY: evt.clientY,
      orig: { x: r.x, y: r.y, w: r.w, h: r.h }
    });
  }

  onMouseMove = (evt: MouseEvent) => {
    const d = this.drag(); if (!d) return;
    const s = this.schema(); const r = this.selected; if (!s || !r) return;

    const dx = (evt.clientX - d.startX);
    const dy = (evt.clientY - d.startY);

    if (d.mode === 'move') {
      r.x = d.orig.x + dx;
      r.y = d.orig.y + dy;
    } else if (d.mode === 'resize-nw') {
      r.x = d.orig.x + dx; r.y = d.orig.y + dy;
      r.w = d.orig.w - dx; r.h = d.orig.h - dy;
    } else if (d.mode === 'resize-ne') {
      r.y = d.orig.y + dy;
      r.w = d.orig.w + dx; r.h = d.orig.h - dy;
    } else if (d.mode === 'resize-sw') {
      r.x = d.orig.x + dx;
      r.w = d.orig.w - dx; r.h = d.orig.h + dy;
    } else if (d.mode === 'resize-se') {
      r.w = d.orig.w + dx; r.h = d.orig.h + dy;
    }
    if (r.w < 20) r.w = 20;
    if (r.h < 20) r.h = 20;
    if (r.x < 0) r.x = 0;
    if (r.y < 0) r.y = 0;

    this.schema.set({ ...s });
  };

  onMouseUp = () => { this.drag.set(null); };
}
