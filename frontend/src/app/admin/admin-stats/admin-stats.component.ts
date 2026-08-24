import { Component, OnInit, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ContentService } from '../../content.service';
import { AdminActivity } from '../../model/adminObjects';
import { signal } from '@angular/core';
@Component({
  selector: 'app-admin-stats', standalone: true,
  imports: [MatCardModule, MatProgressBarModule],
  template: `<h2>Statistiken</h2>
  <div class="stats-grid">
    <mat-card><mat-card-content><div class="big">{{ openGames() }}</div><div>Offene Spiele</div></mat-card-content></mat-card>
    <mat-card><mat-card-content><div class="big">{{ played() }}</div><div>Gespielte Spiele</div></mat-card-content></mat-card>
    <mat-card><mat-card-content><div class="big">{{ total() }}</div><div>Gesamt</div></mat-card-content></mat-card>
  </div>
  @if (total() > 0) { <mat-progress-bar mode="determinate" [value]="played()/total()*100" style="margin-top:16px; height:12px; border-radius:6px"></mat-progress-bar>
    <p>{{ played() }}/{{ total() }} gespielt</p> }`,
  styles: [`.stats-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; } .big { font-size:2.5rem; font-weight:bold; }`]
})
export class AdminStatsComponent implements OnInit {
  private content = inject(ContentService);
  activities = signal<AdminActivity[]>([]);
  openGames = computed(() => this.activities().filter(a => !a.winner).length);
  played = computed(() => this.activities().filter(a => !!a.winner).length);
  total = computed(() => this.activities().length);
  ngOnInit(): void { this.content.getAdminActivities().subscribe(a => this.activities.set(a)); }
}
