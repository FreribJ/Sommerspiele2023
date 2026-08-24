import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContentService } from '../../content.service';
import { RestService } from '../../rest.service';
import { AdminActivity } from '../../model/adminObjects';

@Component({
  selector: 'app-admin-activity-detail',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatSelectModule, MatButtonModule],
  templateUrl: './admin-activity-detail.component.html',
  styleUrl: './admin-activity-detail.component.css'
})
export class AdminActivityDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private content = inject(ContentService);
  private rest = inject(RestService);
  private snack = inject(MatSnackBar);

  activity = signal<AdminActivity | null>(null);
  teams = this.content.teams;
  games = this.content.games;
  deleteCountdown = signal(5);
  selectedGame = signal<number | undefined>(undefined);
  selectedTeam1 = signal<number | undefined>(undefined);
  selectedTeam2 = signal<number | undefined>(undefined);
  selectedWinner = signal<number | null | undefined>(undefined);

  private deleteInterval: any;

  ngOnInit(): void {
    const activityId = +this.route.snapshot.params['id'];
    this.content.getTeams().subscribe();
    this.content.getGames().subscribe();
    this.content.getAdminActivities().subscribe(all => {
      const a = all.find(x => x.id === activityId);
      if (!a) return;
      this.activity.set(a);
      this.selectedGame.set(a.game?.id);
      this.selectedTeam1.set(a.team1?.id);
      this.selectedTeam2.set(a.team2?.id);
      this.selectedWinner.set(a.winner?.id ?? null);
    });
  }

  save(): void {
    const a = this.activity();
    if (!a) return;
    this.rest.putAdminActivity(a.id, this.selectedGame()!, this.selectedTeam1()!, this.selectedTeam2()!, this.selectedWinner() ?? null)
      .subscribe({
        next: () => {
          this.snack.open('Gespeichert', '', { duration: 2000 });
          this.router.navigate(['/admin/activities']);
        },
        error: (e: any) => this.snack.open(e.error?.message || 'Fehler', '', { duration: 3000 })
      });
  }

  startDelete(): void {
    if (this.deleteInterval) return;
    this.deleteInterval = setInterval(() => {
      this.deleteCountdown.update(n => n - 1);
      if (this.deleteCountdown() <= 0) {
        clearInterval(this.deleteInterval);
        this.deleteInterval = null;
        this.doDelete();
      }
    }, 1000);
  }

  private doDelete(): void {
    const a = this.activity();
    if (!a) return;
    this.rest.deleteAdminActivity(a.id).subscribe({
      next: () => this.router.navigate(['/admin/activities']),
      error: (e: any) => this.snack.open(e.error?.message || 'Fehler', '', { duration: 3000 })
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.deleteInterval);
  }
}
