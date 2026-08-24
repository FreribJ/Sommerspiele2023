import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ContentService } from '../../content.service';
import { AdminTeam } from '../../model/adminObjects';
@Component({
  selector: 'app-team-overview', standalone: true,
  imports: [FormsModule, MatTableModule, MatFormFieldModule, MatInputModule, MatIconModule],
  template: `<h2>Teams</h2>
  <mat-form-field appearance="outline"><mat-label>Suchen</mat-label>
    <input matInput [ngModel]="search()" (ngModelChange)="search.set($event)"/><mat-icon matSuffix>search</mat-icon>
  </mat-form-field>
  <table mat-table [dataSource]="filtered()" class="mat-elevation-z2" style="width:100%">
    <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Team</th><td mat-cell *matCellDef="let t">{{ t.name }}</td></ng-container>
    <ng-container matColumnDef="partner1"><th mat-header-cell *matHeaderCellDef>Mitglied 1</th><td mat-cell *matCellDef="let t">{{ t.partner1 }}</td></ng-container>
    <ng-container matColumnDef="partner2"><th mat-header-cell *matHeaderCellDef>Mitglied 2</th><td mat-cell *matCellDef="let t">{{ t.partner2 }}</td></ng-container>
    <ng-container matColumnDef="clique"><th mat-header-cell *matHeaderCellDef>Clique</th><td mat-cell *matCellDef="let t">{{ t.clique }}</td></ng-container>
    <ng-container matColumnDef="password"><th mat-header-cell *matHeaderCellDef>Passwort</th><td mat-cell *matCellDef="let t">{{ t.password }}</td></ng-container>
    <tr mat-header-row *matHeaderRowDef="cols"></tr><tr mat-row *matRowDef="let row; columns: cols;"></tr>
  </table>`,
  styles: [`mat-form-field { width: 100%; margin-bottom: 16px; }`]
})
export class TeamOverviewComponent implements OnInit {
  private content = inject(ContentService);
  allTeams = signal<AdminTeam[]>([]); search = signal('');
  cols = ['name','partner1','partner2','clique','password'];
  filtered = computed(() => { const s = this.search().toLowerCase(); return this.allTeams().filter(t => !s || t.name.toLowerCase().includes(s) || t.partner1.toLowerCase().includes(s) || t.partner2.toLowerCase().includes(s)); });
  ngOnInit(): void { this.content.getAdminTeams().subscribe(t => this.allTeams.set(t)); }
}
