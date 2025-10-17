import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { DataService } from '../../services/data.service';
import { map, switchMap } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-staff-detail',
  imports: [AsyncPipe, NgFor, NgIf],
  templateUrl: './staff-detail.component.html',
  styleUrls: ['./staff-detail.component.css']
})
export class StaffDetailComponent {
  private route = inject(ActivatedRoute);
  private data = inject(DataService);
  vm$ = this.route.paramMap.pipe(
    map(p => p.get('id')!),
    switchMap(id => this.data.getById(id))
  );
}
