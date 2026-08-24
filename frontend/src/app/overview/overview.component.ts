import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { PercentPipe } from '@angular/common';
import { ContentService } from '../content.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatProgressBarModule, MatIconModule, PercentPipe],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  private content = inject(ContentService);

  team = this.content.myTeam;

  gamesWon = computed(() => this.content.activities().filter(a => a.state === 'won').length);
  gamesLost = computed(() => this.content.activities().filter(a => a.state === 'lost').length);
  winRate = computed(() => {
    const w = this.gamesWon(), l = this.gamesLost();
    return w + l > 0 ? w / (w + l) : 0;
  });

  ngOnInit(): void {
    this.content.loadActivities().subscribe();
  }
}
