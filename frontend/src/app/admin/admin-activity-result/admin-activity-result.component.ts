import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { PercentPipe } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContentService } from '../../content.service';
import { WebSocketService } from '../../core/websocket.service';
import { AdminActivity, AdminEasterEgg } from '../../model/adminObjects';
import { Team } from '../../model/objects';

interface TeamResult {
  team: Team;
  won: number;
  lost: number;
  winRate: number;
  eggCount: number;
}

@Component({
  selector: 'app-admin-activity-result',
  standalone: true,
  imports: [PercentPipe, MatTabsModule, MatListModule, MatButtonModule, MatSlideToggleModule, MatCardModule],
  templateUrl: './admin-activity-result.component.html',
  styleUrl: './admin-activity-result.component.css'
})
export class AdminActivityResultComponent implements OnInit {
  private content = inject(ContentService);
  private ws = inject(WebSocketService);
  private snack = inject(MatSnackBar);

  activities = signal<AdminActivity[]>([]);
  eggs = signal<AdminEasterEgg[]>([]);
  teams = this.content.teams;
  loadCount = signal(0);
  acceptEntries = signal(false);

  teamResults = computed(() => this.calcTeamResults());
  cliqueResults = computed(() => this.calcCliqueResults());
  eggResults = computed(() => this.calcEggResults());

  ngOnInit(): void {
    this.loadCount.set(4);
    const done = () => this.loadCount.update(n => n - 1);

    this.content.getTeams().subscribe(done);
    this.content.getAdminActivities().subscribe(a => { this.activities.set(a); done(); });
    this.content.getAcceptEntries().subscribe(v => { this.acceptEntries.set(v.acceptEntries); done(); });
    this.content.getAdminFoundEastereggs().subscribe(e => { this.eggs.set(e); done(); });

    this.ws.acceptEntries$.subscribe(v => this.acceptEntries.set((v as any).acceptEntries));
  }

  toggleAcceptEntries(): void {
    this.content.setAcceptEntries(!this.acceptEntries()).subscribe({
      next: v => this.acceptEntries.set(v.acceptEntries),
      error: () => this.snack.open('Fehler', '', { duration: 2000 })
    });
  }

  private calcTeamResults(): TeamResult[] {
    return this.content.teams().map(team => {
      const mine = this.activities().filter(a =>
        !a.plan && (a.team1?.id === team.id || a.team2?.id === team.id) && a.winner
      );
      const won = mine.filter(a => a.winner?.id === team.id).length;
      const lost = mine.length - won;
      const eggCount = this.eggs().filter(e => e.id_team === team.id).length;
      return { team, won, lost, winRate: mine.length ? won / mine.length : 0, eggCount };
    }).sort((a, b) => b.won - a.won);
  }

  private calcCliqueResults() {
    const cliques = ['jannes', 'mattes'];
    return cliques.map(clique => {
      const clTeams = this.content.teams().filter(t => t.clique === clique).map(t => t.id);
      const wins = this.activities().filter(a => a.plan && a.winner && clTeams.includes(a.winner.id)).length;
      return { clique, wins };
    }).sort((a, b) => b.wins - a.wins);
  }

  private calcEggResults(): TeamResult[] {
    return this.calcTeamResults().slice().sort((a, b) => b.eggCount - a.eggCount);
  }
}
