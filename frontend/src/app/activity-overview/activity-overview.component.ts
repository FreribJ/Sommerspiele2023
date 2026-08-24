import { Component, OnInit, computed, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { ActivityComponent } from '../framework/activity/activity.component';
import { ContentService } from '../content.service';
@Component({
  selector: 'app-activity-overview', standalone: true,
  imports: [MatListModule, ActivityComponent],
  template: `<h2>Gespielte Spiele</h2>
  @for (a of completed(); track a.id) { <app-activity [activity]="a"/> }
  @if (!completed().length) { <p>Noch keine Ergebnisse.</p> }`
})
export class ActivityOverviewComponent implements OnInit {
  private content = inject(ContentService);
  completed = computed(() => this.content.activities().filter(a => a.state !== 'open'));
  ngOnInit(): void { this.content.loadActivities().subscribe(); }
}
