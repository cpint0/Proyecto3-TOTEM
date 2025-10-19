import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export interface Staff {
  id: string;
  nombre: string;
  rol: 'academicos'|'admin'|'laboratorio'|'aseo'|'centro'|'funcionarios';
  correo?: string; anexo?: string; ubicacion?: string;
  fotoUrl?: string;
  horario?: { dia: string; tramo: string; ramo?: string; sala?: string }[];
  mapaUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);

  /** Base desde /public/assets/data (solo lectura) */
  private base$ = this.http.get<Staff[]>('/assets/data/staff.json').pipe(shareReplay(1));

  /** Clave de overlay (mock “persistente” en localStorage) */
  private LS_KEY = 'staff.overlay';

  /** Lee overlay desde localStorage */
  private readOverlay(): Staff[] {
    try { return JSON.parse(localStorage.getItem(this.LS_KEY) || '[]'); }
    catch { return []; }
  }

  /** Guarda overlay en localStorage */
  private writeOverlay(list: Staff[]) {
    localStorage.setItem(this.LS_KEY, JSON.stringify(list));
  }

  /** Combina base + overlay (overlay pisa por id) */
  private merge(base: Staff[], overlay: Staff[]): Staff[] {
    const byId = new Map(base.map(s => [s.id, s]));
    for (const o of overlay) byId.set(o.id, o);
    return Array.from(byId.values());
  }

  /** ===== API pública (fácil de reemplazar por backend) ===== */

  /** Lista completa */
  getAllStaff(): Observable<Staff[]> {
    const overlay = this.readOverlay();
    return this.base$.pipe(map(base => this.merge(base, overlay)));
  }

  /** Por rol */
  getByRol(rol: Staff['rol']): Observable<Staff[]> {
    return this.getAllStaff().pipe(map(list => list.filter(s => s.rol === rol)));
  }

  /** Por id */
  getById(id: string): Observable<Staff> {
    return this.getAllStaff().pipe(map(list => list.find(s => s.id === id)!));
  }

  /** Crear/Actualizar (upsert) */
  upsertStaff(s: Staff): Observable<void> {
    const overlay = this.readOverlay();
    const idx = overlay.findIndex(x => x.id === s.id);
    if (idx >= 0) overlay[idx] = s; else overlay.push(s);
    this.writeOverlay(overlay);
    return of(void 0);
  }

  /** Eliminar */
  deleteStaff(id: string): Observable<void> {
    const overlay = this.readOverlay().filter(x => x.id !== id);
    this.writeOverlay(overlay);
    return of(void 0);
  }
}
