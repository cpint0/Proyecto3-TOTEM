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
  mapa?: {
    floor: number;   // piso (1..N)
    roomId: string;  // id de la sala (coincide con la que defines en el diseñador)
  };

}

export interface FloorSchema {
  floor: number;                // 1..N
  width: number;                // ancho del lienzo (ej. 1000)
  height: number;               // alto del lienzo (ej. 600)
  rooms: Array<{
    id: string;                 // identificador estable (ej. "of_214")
    name: string;               // etiqueta legible (ej. "Oficina 214")
    x: number; y: number;       // posición (svg units)
    w: number; h: number;       // tamaño
  }>;
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

    private LS_KEY_FLOORS = 'floors.schema';

  /** Lee el esquema (si no existe, crea uno base de ejemplo) */
  private readFloors(): FloorSchema[] {
    const raw = localStorage.getItem(this.LS_KEY_FLOORS);
    if (raw) {
      try { return JSON.parse(raw) as FloorSchema[]; } catch {}
    }
    // Esquema inicial (puedes editarlo libremente)
    const seed: FloorSchema[] = [
      { floor: 1, width: 1000, height: 600, rooms: [
        { id:'of_101', name:'Oficina 101', x:60, y:60, w:180, h:120 },
        { id:'of_102', name:'Oficina 102', x:280, y:60, w:200, h:120 },
      ]},
      { floor: 2, width: 1000, height: 600, rooms: [] },
      { floor: 3, width: 1000, height: 600, rooms: [] },
      { floor: 4, width: 1000, height: 600, rooms: [] },
    ];
    localStorage.setItem(this.LS_KEY_FLOORS, JSON.stringify(seed));
    return seed;
  }

  private writeFloors(floors: FloorSchema[]) {
    localStorage.setItem(this.LS_KEY_FLOORS, JSON.stringify(floors));
  }

  getFloors$(): Observable<FloorSchema[]> {
    return of(this.readFloors());
  }

  getFloor$(floor: number): Observable<FloorSchema> {
    const all = this.readFloors();
    let f = all.find(x => x.floor === floor);
    if (!f) { f = { floor, width: 1000, height: 600, rooms: [] }; all.push(f); this.writeFloors(all); }
    return of(f);
  }

  upsertRoom(floor: number, room: FloorSchema['rooms'][number]): Observable<void> {
    const all = this.readFloors();
    const fi = all.findIndex(x => x.floor === floor);
    if (fi < 0) all.push({ floor, width: 1000, height: 600, rooms: [room] });
    else {
      const rooms = all[fi].rooms;
      const ri = rooms.findIndex(r => r.id === room.id);
      if (ri >= 0) rooms[ri] = room; else rooms.push(room);
    }
    this.writeFloors(all);
    return of(void 0);
  }

  deleteRoom(floor: number, roomId: string): Observable<void> {
    const all = this.readFloors();
    const f = all.find(x => x.floor === floor);
    if (f) { f.rooms = f.rooms.filter(r => r.id !== roomId); this.writeFloors(all); }
    return of(void 0);
  }

  setCanvasSize(floor: number, width: number, height: number): Observable<void> {
    const all = this.readFloors();
    const f = all.find(x => x.floor === floor);
    if (f) { f.width = width; f.height = height; this.writeFloors(all); }
    return of(void 0);
  }

 
  assignStaffToRoom(staffId: string, floor: number, roomId: string) {
    return this.getById(staffId).pipe(
      map((s: Staff) => {
        const updated: Staff = { ...s, mapa: { floor, roomId } };
        const overlay: Staff[] = this.readOverlay(); 
        const idx = overlay.findIndex((x: Staff) => x.id === s.id);
        if (idx >= 0) overlay[idx] = updated; else overlay.push(updated);
        this.writeOverlay(overlay);
        return;
      })
    );
  }


}


