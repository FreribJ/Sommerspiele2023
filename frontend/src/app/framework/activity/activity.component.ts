import { Component, Input, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Activity } from '../../model/objects';
@Component({
  selector: 'app-activity', standalone: true,
  imports: [DatePipe, MatCardModule, MatIconModule, MatChipsModule],
  template: `
  <mat-card class="activity-card" [style.border-left-color]="color()">
    <mat-card-content>
      <div class="activity-row">
        <mat-icon [style.color]="color()">{{ icon() }}</mat-icon>
        <span class="game-name">{{ activity.game?.name }}</span>
        <span class="spacer"></span>
        <mat-chip [style.background]="color()" [style.color]="'white'">{{ stateLabel() }}</mat-chip>
      </div>
      <div class="activity-details">
        <span>vs. {{ activity.opponent?.name }}</span>
        @if (activity.timestamp) { <span class="ts">{{ activity.timestamp | date:'dd.MM HH:mm' }}</span> }
        @if (activity.plan) { <mat-chip color="accent">Spielplan</mat-chip> }
      </div>
    </mat-card-content>
  </mat-card>`,
  styles: [`.activity-card { margin-bottom: 8px; border-left: 4px solid; }
    .activity-row { display: flex; align-items: center; gap: 8px; }
    .game-name { font-weight: 500; }
    .spacer { flex: 1; }
    .activity-details { display: flex; align-items: center; gap: 12px; margin-top: 4px; color: #666; font-size: 0.85rem; }
    .ts { margin-left: auto; }`]
})
export class ActivityComponent {
  @Input() activity!: Activity;
  color = computed(() => this.activity?.state === 'won' ? '#4caf50' : this.activity?.state === 'lost' ? '#f44336' : '#9e9e9e');
  icon = computed(() => this.activity?.state === 'won' ? 'emoji_events' : this.activity?.state === 'lost' ? 'close' : 'hourglass_empty');
  stateLabel = computed(() => ({ won: 'Sieg', lost: 'Niederlage', open: 'Offen' }[this.activity?.state] ?? ''));
}
