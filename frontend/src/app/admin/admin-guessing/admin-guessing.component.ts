import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { ContentService } from '../../content.service';
import { AdminGuess } from '../../model/adminObjects';
@Component({
  selector: 'app-admin-guessing', standalone: true,
  imports: [FormsModule, MatListModule, MatFormFieldModule, MatInputModule, MatCardModule],
  template: `<h2>Ratespiel - Admin</h2>
  <mat-card style="margin-bottom:16px; max-width:300px">
    <mat-card-content>
      <mat-form-field appearance="outline" style="width:100%"><mat-label>Tatsächliche Zahl</mat-label>
        <input matInput type="number" [ngModel]="actual()" (ngModelChange)="actual.set($event)"/></mat-form-field>
    </mat-card-content>
  </mat-card>
  <mat-list>
    @for (g of sorted(); track g.team.id) {
      <mat-list-item>
        <span matListItemTitle>{{ g.team.name }}</span>
        <span matListItemLine>Schätzung: {{ g.guess }} @if (actual() !== undefined) { — Abstand: {{ absDiff(g.guess) }} }</span>
      </mat-list-item>
    }
  </mat-list>`
})
export class AdminGuessingComponent implements OnInit {
  private content = inject(ContentService);
  guesses = signal<AdminGuess[]>([]); actual = signal<number | undefined>(undefined);
  sorted = computed(() => { const a = this.actual(); if (a === undefined) return this.guesses(); return [...this.guesses()].sort((x, y) => Math.abs(x.guess - a) - Math.abs(y.guess - a)); });
  absDiff(guess: number): number { const a = this.actual(); return a !== undefined ? Math.abs(guess - a) : 0; }
  ngOnInit(): void { this.content.getAdminGuesses().subscribe(g => this.guesses.set(g)); }
}
