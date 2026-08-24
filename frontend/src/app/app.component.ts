import { Component, OnInit, computed, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from './core/auth.service';
import { ContentService } from './content.service';
import { WebSocketService } from './core/websocket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatSidenavModule, MatListModule, MatIconModule, MatButtonModule, MatBadgeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  readonly year = new Date().getFullYear();
  readonly title = `Sommerspiele ${this.year}`;
  readonly auth = inject(AuthService);
  private content = inject(ContentService);
  private ws = inject(WebSocketService);
  private router = inject(Router);

  readonly menuItems = computed(() => {
    if (!this.auth.isLoggedIn()) return [];
    const items: { name: string; link: string; icon: string }[] = [
      { name: 'Übersicht', link: '/', icon: 'home' },
      { name: 'Spielplan', link: '/plans', icon: 'calendar_month' },
      { name: 'Gespielte Spiele', link: '/activities', icon: 'checklist' },
      { name: 'Ratespiel', link: '/guessing', icon: 'help_outline' },
      { name: 'Einstellungen', link: '/settings', icon: 'settings' },
    ];
    if (this.auth.easterEggCount() > 0) items.push({ name: 'Easter Eggs', link: '/eastereggs', icon: 'egg' });
    if (this.auth.isAdmin()) items.push({ name: 'Admin', link: '/admin', icon: 'admin_panel_settings' });
    return items;
  });

  ngOnInit(): void {
    this.auth.checkLogin().subscribe({
      next: () => {
        this.ws.connect();
        this.ws.activities$.subscribe(raw => this.content.mergeActivity(raw));
      },
      error: (err) => {
        if (err.status === 401) this.router.navigate(['/login']);
      }
    });
  }

  logout(): void {
    this.ws.disconnect();
    this.auth.logout();
    this.content.reset();
    this.router.navigate(['/login']);
  }
}
