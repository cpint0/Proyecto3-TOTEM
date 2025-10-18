import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, NgFor, NgIf, KeyValuePipe, NgClass } from '@angular/common';
import { DataService } from '../../services/data.service';
import { map, switchMap } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';

type HorarioItem = { dia: string; tramo: string; ramo?: string; sala?: string; };
type Vm = {
  id: string; nombre: string; correo?: string; anexo?: string; ubicacion?: string;
  fotoUrl?: string; mapaUrl?: string; horario?: HorarioItem[];
  days: { idx: number; label: string; key: string }[];
  grouped: Record<number, Array<HorarioItem & {startMin:number; endMin:number}>>;
  timeRows: string[];
};

@Component({
  standalone: true,
  selector: 'app-staff-detail',
  imports: [AsyncPipe, NgFor, NgIf, KeyValuePipe, NgClass, RouterLink],
  templateUrl: './staff-detail.component.html',
  styleUrls: ['./staff-detail.component.css']
})
export class StaffDetailComponent {
  private route = inject(ActivatedRoute);
  private data = inject(DataService);
  private location = inject(Location);
  goBack() {
    this.location.back();
  }


  viewMode = signal<'day' | 'week'>('day');
  selectedDay = signal<number>(this.today());

  vm$ = this.route.paramMap.pipe(
    map(p => p.get('id')!),
    switchMap(id => this.data.getById(id)),
    map((p: any) => this.withScheduleProcessed(p))
  );

  private today(): number { return new Date().getDay() as 0|1|2|3|4|5|6; }

  private DAYS = [
    { idx: 1, label: 'Lunes',      key: 'LUNES' },
    { idx: 2, label: 'Martes',     key: 'MARTES' },
    { idx: 3, label: 'Miércoles',  key: 'MIERCOLES' },
    { idx: 4, label: 'Jueves',     key: 'JUEVES' },
    { idx: 5, label: 'Viernes',    key: 'VIERNES' },
    { idx: 6, label: 'Sábado',     key: 'SABADO' },
    { idx: 0, label: 'Domingo',    key: 'DOMINGO' }
  ];

  private mapDiaToIdx(dia: string): number {
    const key = (dia || '').normalize('NFD').replace(/\p{Diacritic}/gu,'').toUpperCase();
    const found = this.DAYS.find(d => d.key === key);
    return found ? found.idx : 1;
  }

  private toMinutes(hhmm: string): number {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  }

  private parseTramo(tramo: string): { startMin:number; endMin:number } {
    const m = tramo.match(/(\d{2}:\d{2})\s*[-–]\s*(\d{2}:\d{2})/);
    if (!m) return { startMin: 0, endMin: 0 };
    return { startMin: this.toMinutes(m[1]), endMin: this.toMinutes(m[2]) };
  }

  private withScheduleProcessed(p: any): Vm {
    const grouped: Vm['grouped'] = {0:[],1:[],2:[],3:[],4:[],5:[],6:[]};
    const timeSet = new Set<string>();

    (p.horario ?? []).forEach((h: HorarioItem) => {
      const idx = this.mapDiaToIdx(h.dia);
      const { startMin, endMin } = this.parseTramo(h.tramo);
      grouped[idx].push({ ...h, startMin, endMin });
      timeSet.add(h.tramo);
    });

    for (const k of Object.keys(grouped)) {
      grouped[+k].sort((a,b) => a.startMin - b.startMin || a.endMin - b.endMin);
    }

    const timeRows = Array.from(timeSet)
      .sort((a,b) => this.parseTramo(a).startMin - this.parseTramo(b).startMin);

    const today = this.today();
    if (!grouped[today].length) {
      const firstWith = this.DAYS.find(d => grouped[d.idx].length);
      if (firstWith) this.selectedDay.set(firstWith.idx);
    }

    return {
      id: p.id, nombre: p.nombre, correo: p.correo, anexo: p.anexo, ubicacion: p.ubicacion,
      fotoUrl: p.fotoUrl, mapaUrl: p.mapaUrl, horario: p.horario,
      days: this.DAYS, grouped, timeRows
    };
  }

  isNow(tramo: string, dayIdx: number): boolean {
    const now = new Date();
    if (dayIdx !== now.getDay()) return false;
    const { startMin, endMin } = this.parseTramo(tramo);
    const cur = now.getHours()*60 + now.getMinutes();
    return cur >= startMin && cur < endMin;
  }

  dayLabel(vm: Vm, idx: number): string {
  const d = vm.days.find(x => x.idx === idx);
  return d ? d.label : '';
  }

  onDayChange(ev: Event) {
  const value = Number((ev.target as HTMLSelectElement).value);
  this.selectedDay.set(value);
  }


}
