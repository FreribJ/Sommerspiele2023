import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ActivityComponent } from '../framework/activity/activity.component';
import { ContentService } from '../content.service';
@Component({
  selector: 'app-plan-overview', standalone: true,
  imports: [RouterLink, MatProgressBarModule, MatCardModule, MatButtonModule, ActivityComponent],
  template: `<h2>Spielplan</h2>
  <mat-card class="progress-card">
    <mat-card-content>
      <p>{{ done() }} / {{ plans().length }} gespielt</p>
      <mat-progress-bar mode="determinate" [value]="plans().length ? done()/plans().length*100 : 0"></mat-progress-bar>
    </mat-card-content>
  </mat-card>
  @for (a of sorted(); track a.id) {
    <a [routerLink]="a.state === 'open' ? ['/new'] : null" [queryParams]="a.state === 'open' ? {id: a.id} : null">
      <app-activity [activity]="a"/>
    </a>
  }
  @if (!plans().length) { <p>Kein Spielplan vorhanden.</p> }`,
  styles: [`.progress-card { margin-bottom: 16px; } a { text-decoration: none; }`]
})
export class PlanOverviewComponent implements OnInit {
  private content = inject(ContentService);
  plans = computed(() => this.content.activities().filter(a => a.plan));
  done = computed(() => this.plans().filter(a => a.state !== 'open').length);
  sorted = computed(() => [...this.plans()].sort((a, b) => (a.state === 'open' ? -1 : 1) - (b.state === 'open' ? -1 : 1)));
  ngOnInit(): void { this.content.loadActivities().subscribe(); }
}
