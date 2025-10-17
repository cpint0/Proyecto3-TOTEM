import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Staff {
  id: string;
  nombre: string;
  rol: 'academicos'|'admin'|'laboratorio'|'aseo'|'centro';
  correo?: string; anexo?: string; ubicacion?: string;
  fotoUrl?: string;
  horario?: { dia: string; tramo: string; ramo?: string; sala?: string }[];
  mapaUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);

  // IMPORTANTÍSIMO: ruta correcta (fuera de app/)
  private staff$ = this.http
    .get<Staff[]>('assets/data/staff.json')
    .pipe(shareReplay(1));

  getByRol(rol: Staff['rol']): Observable<Staff[]> {
    return this.staff$.pipe(map(list => list.filter(s => s.rol === rol)));
  }

  getById(id: string): Observable<Staff> {
    return this.staff$.pipe(map(list => list.find(s => s.id === id)!));
  }
}
