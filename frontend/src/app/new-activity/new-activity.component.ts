import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { ContentService } from '../content.service';

@Component({
  selector: 'app-new-activity',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
  ],
  templateUrl: './new-activity.component.html',
  styleUrl: './new-activity.component.css',
})
export class NewActivityComponent implements OnInit {
  private content = inject(ContentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  readonly teams = this.content.teams;
  readonly games = this.content.games;
  readonly myTeam = this.content.myTeam;

  readonly opponents = computed(() =>
    this.teams().filter(t => t.id !== this.myTeam()?.id)
  );

  planId = signal(-1);
  selectedGameId = signal<number | null>(null);
  selectedOpponentId = signal<number | null>(null);
  selectedState = signal<'won' | 'lost' | null>(null);
  isLoading = signal(false);
  alreadyFilledOut = signal(false);

  readonly selectedGame = computed(() =>
    this.games().find(g => g.id === this.selectedGameId())
  );

  ngOnInit(): void {
    this.content.getTeams().subscribe();
    this.content.getGames().subscribe();
    this.content.getMyTeam().subscribe();

    const id = this.route.snapshot.queryParams['id'];
    if (id) {
      this.planId.set(+id);
      this.isLoading.set(true);
      this.content.loadActivities().subscribe(() => {
        this.isLoading.set(false);
        const plan = this.content.activities().find(a => a.id === +id);
        if (plan) {
          if (plan.state !== 'open') {
            this.alreadyFilledOut.set(true);
            this.selectedState.set(plan.state as 'won' | 'lost');
          }
          this.selectedGameId.set(plan.game.id);
          this.selectedOpponentId.set(plan.opponent.id);
        }
      });
    }
  }

  submit(): void {
    const gameId = this.selectedGameId();
    const opponentId = this.selectedOpponentId();
    const state = this.selectedState();

    if (!gameId || !opponentId || !state) return;

    this.isLoading.set(true);

    const obs =
      this.planId() > 0
        ? this.content.editActivity(
            this.planId(),
            state === 'won' ? this.myTeam()!.id : opponentId
          )
        : this.content.newActivity(gameId, opponentId, state);

    obs.subscribe({
      next: () => {
        this.router.navigate(['/activities']);
      },
      error: (e: any) => {
        this.isLoading.set(false);
        this.snack.open(
          e.error?.message ?? 'Ein Fehler ist aufgetreten.',
          undefined,
          { duration: 3000 }
        );
      },
    });
  }
}
