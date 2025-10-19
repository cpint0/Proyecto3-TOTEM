import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Staff } from '../../../services/data.service';

type SlotForm = {
  dia: string;
  start: string;
  end: string;
  ramo?: string;
  sala?: string;
};

@Component({
  selector: 'app-admin-staff-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-staff-edit.component.html',
})
export class AdminStaffEditComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private data = inject(DataService);

  isNew = signal(false);
  s = signal<Staff | null>(null);

  // ======= Horarios =======
  readonly DAYS = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];

  slot = signal<SlotForm>({
    dia: 'Lunes',
    start: '08:00',
    end: '09:30',
    ramo: '',
    sala: ''
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.isNew.set(true);
      const nid = 's_' + Date.now();
      this.s.set({
        id: nid,
        nombre: '',
        rol: 'academicos',
        correo: '',
        anexo: '',
        ubicacion: '',
        fotoUrl: '',
        horario: []
      } as Staff);
    } else {
      this.data.getById(id!).subscribe(x => this.s.set({ ...x, horario: x.horario ?? [] }));
    }
  }

  /** Actualiza una propiedad simple del Staff */
  update<K extends keyof Staff>(key: K, value: Staff[K]) {
    this.s.update(cur => (cur ? { ...cur, [key]: value } as Staff : cur));
  }

  /** Helpers para el formulario de horario (evita spreads en el template) */
  setSlot<K extends keyof SlotForm>(key: K, value: SlotForm[K]) {
    const cur = this.slot();
    this.slot.set({ ...cur, [key]: value });
  }

  private toMinutes(hhmm: string): number {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  }

  private validSlot(f: SlotForm): string | null {
    if (!f.dia) return 'Selecciona un día.';
    if (!/^\d{2}:\d{2}$/.test(f.start) || !/^\d{2}:\d{2}$/.test(f.end)) return 'Formato de hora inválido (usa HH:MM).';
    if (this.toMinutes(f.end) <= this.toMinutes(f.start)) return 'La hora de término debe ser mayor que la de inicio.';
    return null;
  }

  addSlot() {
    const cur = this.s();
    const f = this.slot();
    if (!cur) return;

    const err = this.validSlot(f);
    if (err) { alert(err); return; }

    const tramo = `${f.start} - ${f.end}`;
    const nuevo = { dia: f.dia, tramo, ramo: f.ramo?.trim() || undefined, sala: f.sala?.trim() || undefined };

    const horario = [...(cur.horario ?? []), nuevo];

    const dayOrder = new Map(this.DAYS.map((d, i) => [d, i]));
    horario.sort((a, b) => {
      const da = dayOrder.get(a.dia) ?? 0;
      const db = dayOrder.get(b.dia) ?? 0;
      if (da !== db) return da - db;
      const [sa] = a.tramo.split('-').map(x => x.trim());
      const [sb] = b.tramo.split('-').map(x => x.trim());
      return this.toMinutes(sa) - this.toMinutes(sb);
    });

    this.update('horario', horario);

    this.slot.set({ dia: f.dia, start: '08:00', end: '09:30', ramo: '', sala: '' });
  }

  removeSlot(idx: number) {
    const cur = this.s();
    if (!cur?.horario) return;
    this.update('horario', cur.horario.filter((_, i) => i !== idx));
  }

  onFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => this.update('fotoUrl', reader.result as string);
    reader.readAsDataURL(file);
  }

  save() {
    const cur = this.s();
    if (!cur) return;
    this.data.upsertStaff(cur).subscribe(() => this.router.navigate(['/admin/staff']));
  }

  remove() {
    const cur = this.s();
    if (!cur || this.isNew()) return;
    if (confirm('¿Eliminar registro?')) {
      this.data.deleteStaff(cur.id).subscribe(() => this.router.navigate(['/admin/staff']));
    }
  }
}
