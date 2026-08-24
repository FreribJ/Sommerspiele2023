import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { ContentService } from '../../content.service';
import { AdminActivity } from '../../model/adminObjects';

@Component({
  selector: 'app-admin-activity-overview',
  standalone: true,
  imports: [RouterLink, FormsModule, MatListModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, DatePipe],
  template: `<h2>Aktivitäten</h2>
  <mat-form-field appearance="outline" style="width:100%"><mat-label>Suchen</mat-label>
    <input matInput [ngModel]="search()" (ngModelChange)="search.set($event)"/><mat-icon matSuffix>search</mat-icon>
  </mat-form-field>
  <mat-list>
    @for (a of filtered(); track a.id) {
      <mat-list-item [routerLink]="['activity', a.id]">
        <span matListItemTitle>{{ a.game?.name }}: {{ a.team1?.name }} vs {{ a.team2?.name }}</span>
        <span matListItemLine>{{ a.winner ? 'Sieger: ' + a.winner.name : a.plan ? 'Plan' : 'Kein Ergebnis' }} — {{ a.timestamp | date:'dd.MM.yy HH:mm' }}</span>
        <button mat-icon-button matListItemMeta [routerLink]="['activity', a.id]"><mat-icon>edit</mat-icon></button>
      </mat-list-item>
    }
  </mat-list>`
})
export class AdminActivityOverviewComponent implements OnInit {
  private content = inject(ContentService);

  all = signal<AdminActivity[]>([]);
  search = signal('');
  filtered = computed(() => {
    const s = this.search().toLowerCase();
    if (!s) return this.all();
    return this.all().filter(a =>
      a.game?.name.toLowerCase().includes(s) ||
      a.team1?.name.toLowerCase().includes(s) ||
      a.team2?.name.toLowerCase().includes(s)
    );
  });

  ngOnInit(): void {
    this.content.getAdminActivities().subscribe(a => this.all.set(a));
  }
}
