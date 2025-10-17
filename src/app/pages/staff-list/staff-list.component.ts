import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { DataService, Staff } from '../../services/data.service';
import { map, switchMap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { Observable, combineLatest, of } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-staff-list',
  imports: [RouterLink, AsyncPipe, NgFor, NgIf, FormsModule],
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css']
})
export class StaffListComponent {
  private route = inject(ActivatedRoute);
  private data = inject(DataService);

  q = '';
  tipo$ = this.route.paramMap.pipe(map(p => p.get('tipo') as Staff['rol']));
  base$: Observable<Staff[]> = this.tipo$.pipe(switchMap(t => this.data.getByRol(t)));
  vm$ = combineLatest([of(null), this.base$]).pipe(map(([_, list]) =>
    list.filter(s => (this.q ? (s.nombre + ' ' + (s.ubicacion||'')).toLowerCase().includes(this.q.toLowerCase()) : true))
  ));
  
}
