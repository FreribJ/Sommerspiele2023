import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RestService } from '../rest.service';
import { AuthService } from '../core/auth.service';
import { WebSocketService } from '../core/websocket.service';
import { Team } from '../model/objects';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private rest = inject(RestService);
  private auth = inject(AuthService);
  private ws = inject(WebSocketService);
  private router = inject(Router);

  teams = signal<Team[]>([]);
  selectedTeamId = signal<number | undefined>(undefined);
  password = signal('');
  isLoading = signal(false);
  passwordWrong = signal(false);
  viewPassword = signal(false);
  selectedTeam = computed(() => this.teams().find(t => t.id === this.selectedTeamId()));

  ngOnInit(): void {
    this.rest.getTeams().subscribe(t => this.teams.set(t));
  }

  login(): void {
    const id = this.selectedTeamId();
    const pw = this.password();
    if (!id || !pw) return;
    this.isLoading.set(true);
    this.passwordWrong.set(false);
    this.rest.postLogin(id, pw).subscribe({
      next: () => {
        this.auth.checkLogin().subscribe(() => {
          this.ws.connect();
          this.router.navigate(['/']);
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.passwordWrong.set(true);
      }
    });
  }
}
