import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Staff } from '../../services/data.service';
import { map, switchMap } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-staff-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css']
})
export class StaffListComponent {
  private route = inject(ActivatedRoute);
  private data = inject(DataService);

  q = '';

  list$ = this.route.paramMap.pipe(
    map(p => p.get('tipo') as Staff['rol']),
    switchMap(rol => this.data.getByRol(rol))
  );
}
