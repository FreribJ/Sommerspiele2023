import { Component, OnInit, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContentService } from '../content.service';
import { AuthService } from '../core/auth.service';
import { WebSocketService } from '../core/websocket.service';
@Component({
  selector: 'app-settings', standalone: true,
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `<h2>Einstellungen</h2>
  <mat-card>
    <mat-card-content>
      <mat-form-field appearance="outline" class="full-width"><mat-label>Teamname</mat-label>
        <input matInput [ngModel]="teamName()" (ngModelChange)="teamName.set($event)"/></mat-form-field>
      <mat-form-field appearance="outline" class="full-width"><mat-label>Mitglied 1</mat-label>
        <input matInput [ngModel]="mate1()" (ngModelChange)="mate1.set($event)"/></mat-form-field>
      <mat-form-field appearance="outline" class="full-width"><mat-label>Mitglied 2</mat-label>
        <input matInput [ngModel]="mate2()" (ngModelChange)="mate2.set($event)"/></mat-form-field>
    </mat-card-content>
    <mat-card-actions>
      <button mat-raised-button color="primary" (click)="save()">Speichern</button>
      <button mat-stroked-button color="warn" (click)="logout()">Abmelden</button>
    </mat-card-actions>
  </mat-card>`,
  styles: [`.full-width { width: 100%; margin-top: 12px; } mat-card { max-width: 500px; }`]
})
export class SettingsComponent implements OnInit {
  private content = inject(ContentService); private auth = inject(AuthService);
  private ws = inject(WebSocketService); private router = inject(Router); private snack = inject(MatSnackBar);
  teamName = signal(''); mate1 = signal(''); mate2 = signal('');
  ngOnInit(): void { this.content.getMyTeam().subscribe(t => { this.teamName.set(t.name); this.mate1.set(t.partner1); this.mate2.set(t.partner2); }); }
  save(): void { this.content.updateTeam(this.teamName(), this.mate1(), this.mate2()).subscribe(() => this.snack.open('Gespeichert!', '', { duration: 2000 })); }
  logout(): void { this.ws.disconnect(); this.auth.logout(); this.content.reset(); this.router.navigate(['/login']); }
}
