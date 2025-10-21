import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

/** ===================== MODELOS ===================== **/

export interface Staff {
  id: string;
  nombre: string;
  rol: 'academicos'|'admin'|'laboratorio'|'aseo'|'centro'|'funcionarios';
  correo?: string; anexo?: string; ubicacion?: string;
  fotoUrl?: string;
  horario?: { dia: string; tramo: string; ramo?: string; sala?: string }[];
  mapaUrl?: string;
  /** ⬇️ ahora incluye deptId para ser multi-departamento */
  mapa?: { deptId?: string; floor: number; roomId: string };
}

export interface Room {
  id: string;
  name: string;
  x: number; y: number; w: number; h: number;
}

export interface FloorSchema {
  floor: number; // 1..N
  width: number;
  height: number;
  rooms: Room[];
}

export interface Department {
  id: string;     // slug único: ej "mecanica-a"
  name: string;   // nombre visible: "Ing. Mecánica A"
  floors: FloorSchema[];
}

export interface MapsSchema {
  departments: Department[];
}

/** ===================== SERVICIO ===================== **/

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);

  /** ----- STAFF base + overlay (igual que antes) ----- */
  private LS_KEY_STAFF = 'staff.overlay';

  private base$ = this.http.get<Staff[]>('/assets/data/staff.json').pipe(shareReplay(1));

  private readOverlay(): Staff[] {
    try { return JSON.parse(localStorage.getItem(this.LS_KEY_STAFF) || '[]'); }
    catch { return []; }
  }
  private writeOverlay(list: Staff[]) {
    localStorage.setItem(this.LS_KEY_STAFF, JSON.stringify(list));
  }
  private mergeStaff(base: Staff[], overlay: Staff[]): Staff[] {
    const byId = new Map(base.map(s => [s.id, s]));
    for (const o of overlay) byId.set(o.id, o);
    return Array.from(byId.values());
  }

  getAllStaff(): Observable<Staff[]> {
    const overlay = this.readOverlay();
    return this.base$.pipe(map(base => this.mergeStaff(base, overlay)));
  }
  getByRol(rol: Staff['rol']): Observable<Staff[]> {
    return this.getAllStaff().pipe(map(list => list.filter(s => s.rol === rol)));
  }
  getById(id: string): Observable<Staff> {
    return this.getAllStaff().pipe(map(list => list.find(s => s.id === id)!));
  }
  upsertStaff(s: Staff): Observable<void> {
    const overlay = this.readOverlay();
    const idx = overlay.findIndex(x => x.id === s.id);
    if (idx >= 0) overlay[idx] = s; else overlay.push(s);
    this.writeOverlay(overlay);
    return of(void 0);
  }
  deleteStaff(id: string): Observable<void> {
    const overlay = this.readOverlay().filter(x => x.id !== id);
    this.writeOverlay(overlay);
    return of(void 0);
  }

  /** ----- MAPAS multi-departamento en localStorage ----- */
  private LS_KEY_MAPS = 'maps.schema';

  private readMaps(): MapsSchema {
    const raw = localStorage.getItem(this.LS_KEY_MAPS);
    if (raw) {
      try { return JSON.parse(raw) as MapsSchema; } catch {}
    }
    // Semilla inicial con un departamento por defecto:
    const seed: MapsSchema = {
      departments: [{
        id: 'mecanica', name: 'Ingeniería Mecánica', floors: [
          { floor: 1, width: 1000, height: 600, rooms: [] },
          { floor: 2, width: 1000, height: 600, rooms: [] },
          { floor: 3, width: 1000, height: 600, rooms: [] },
          { floor: 4, width: 1000, height: 600, rooms: [] }
        ]
      }]
    };
    localStorage.setItem(this.LS_KEY_MAPS, JSON.stringify(seed));
    return seed;
  }

  private writeMaps(m: MapsSchema) {
    localStorage.setItem(this.LS_KEY_MAPS, JSON.stringify(m));
  }

  /** ===== Departamentos ===== */
  getDepartments$(): Observable<Department[]> {
    return of(this.readMaps().departments);
  }

  addDepartment(name: string): Observable<Department> {
    const slug = this.slugify(name);
    const maps = this.readMaps();
    if (maps.departments.some(d => d.id === slug)) {
      // si existe, agrega sufijo simple
      const variant = slug + '-' + (Date.now()%1000);
      maps.departments.push({ id: variant, name, floors: [] });
      this.writeMaps(maps);
      return of({ id: variant, name, floors: [] });
    }
    maps.departments.push({ id: slug, name, floors: [] });
    this.writeMaps(maps);
    return of({ id: slug, name, floors: [] });
  }

  renameDepartment(id: string, newName: string): Observable<void> {
    const maps = this.readMaps();
    const d = maps.departments.find(x => x.id === id);
    if (d) { d.name = newName; this.writeMaps(maps); }
    return of(void 0);
  }

  deleteDepartment(id: string): Observable<void> {
    const maps = this.readMaps();
    // 1) elimina el departamento y sus pisos/salas
    maps.departments = maps.departments.filter(d => d.id !== id);
    this.writeMaps(maps);

    // 2) limpia asignaciones de staff que apuntaban a ese depto
    const overlay = this.readOverlay();
    let touched = false;
    for (const s of overlay) {
      if (s.mapa?.deptId === id) {
        delete s.mapa; // o: s.mapa = undefined;
        touched = true;
      }
    }
    if (touched) this.writeOverlay(overlay);

    return of(void 0);
  }


  private ensureDept(id: string): Department {
    const maps = this.readMaps();
    let d = maps.departments.find(x => x.id === id);
    if (!d) {
      d = { id, name: id, floors: [] };
      maps.departments.push(d);
      this.writeMaps(maps);
    }
    return d;
  }

  /** ===== Pisos / Salas por departamento ===== */
  getFloor$(deptId: string, floor: number): Observable<FloorSchema> {
    const maps = this.readMaps();
    const d = maps.departments.find(x => x.id === deptId) || this.ensureDept(deptId);
    let f = d.floors.find(x => x.floor === floor);
    if (!f) { f = { floor, width: 1000, height: 600, rooms: [] }; d.floors.push(f); this.writeMaps(maps); }
    return of(f);
  }

  setCanvasSize(deptId: string, floor: number, width: number, height: number): Observable<void> {
    const maps = this.readMaps();
    const d = maps.departments.find(x => x.id === deptId) || this.ensureDept(deptId);
    let f = d.floors.find(x => x.floor === floor);
    if (!f) { f = { floor, width, height, rooms: [] }; d.floors.push(f); }
    else { f.width = width; f.height = height; }
    this.writeMaps(maps);
    return of(void 0);
  }

  upsertRoom(deptId: string, floor: number, room: Room): Observable<void> {
    const maps = this.readMaps();
    const d = maps.departments.find(x => x.id === deptId) || this.ensureDept(deptId);
    let f = d.floors.find(x => x.floor === floor);
    if (!f) { f = { floor, width: 1000, height: 600, rooms: [] }; d.floors.push(f); }
    const ri = f.rooms.findIndex(r => r.id === room.id);
    if (ri >= 0) f.rooms[ri] = room; else f.rooms.push(room);
    this.writeMaps(maps);
    return of(void 0);
  }

  deleteRoom(deptId: string, floor: number, roomId: string): Observable<void> {
    const maps = this.readMaps();
    const d = maps.departments.find(x => x.id === deptId);
    if (d) {
      const f = d.floors.find(x => x.floor === floor);
      if (f) f.rooms = f.rooms.filter(r => r.id !== roomId);
      this.writeMaps(maps);
    }
    return of(void 0);
  }

  getRoomName(deptId: string, floor: number, roomId: string): string {
    const maps = this.readMaps();
    const d = maps.departments.find(x => x.id === deptId);
    const f = d?.floors.find(x => x.floor === floor);
    const r = f?.rooms.find(rr => rr.id === roomId);
    return r?.name || roomId;
  }

  /** ===== Asignación de sala a Staff (multi-departamento) ===== */
  assignStaffToRoom(staffId: string, deptId: string, floor: number, roomId: string): Observable<void> {
    return this.getById(staffId).pipe(map((s: Staff) => {
      const updated: Staff = { ...s, mapa: { deptId, floor, roomId } };
      const overlay: Staff[] = this.readOverlay();
      const idx = overlay.findIndex((x: Staff) => x.id === s.id);
      if (idx >= 0) overlay[idx] = updated; else overlay.push(updated);
      this.writeOverlay(overlay);
      return;
    }));
  }

  /** Utils */
  private slugify(name: string): string {
    return (name || '')
      .toLowerCase()
      .normalize('NFD').replace(/\p{Diacritic}/gu,'')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
