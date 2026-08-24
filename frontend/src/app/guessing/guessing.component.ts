import { Component, OnInit, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContentService } from '../content.service';
import { WebSocketService } from '../core/websocket.service';

@Component({
  selector: 'app-guessing',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './guessing.component.html',
  styleUrl: './guessing.component.css'
})
export class GuessingComponent implements OnInit {
  private content = inject(ContentService);
  private snackBar = inject(MatSnackBar);
  private ws = inject(WebSocketService);

  currentGuess = signal<number | undefined>(undefined);
  newGuess = signal<number | undefined>(undefined);
  entriesOpen = signal(false);

  ngOnInit(): void {
    this.content.getGuess().subscribe(g => {
      if (g !== -1) {
        this.currentGuess.set(g);
        this.newGuess.set(g);
      }
    });
    this.ws.acceptEntries$.subscribe((v: any) => this.entriesOpen.set(v.acceptEntries));
    this.content.getAcceptEntries().subscribe(v => this.entriesOpen.set(v.acceptEntries));
  }

  save(): void {
    const g = this.newGuess();
    if (g === undefined) return;
    this.content.putGuess(g).subscribe({
      next: (saved) => {
        this.currentGuess.set(saved);
        this.snackBar.open('Gespeichert!', '', { duration: 2000 });
      },
      error: (e) => {
        this.snackBar.open(e.error?.message ?? 'Fehler', '', { duration: 3000 });
      }
    });
  }
}
