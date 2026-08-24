import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {OverviewComponent} from './overview/overview.component';
import {AdminComponent} from './admin/admin.component';
import {GuessingComponent} from './guessing/guessing.component';
import {TeamOverviewComponent} from './admin/team-overview/team-overview.component';
import {ActivityOverviewComponent} from './activity-overview/activity-overview.component';
import {PlanOverviewComponent} from './plan-overview/plan-overview.component';
import {NewActivityComponent} from './new-activity/new-activity.component';
import {RouterModule, RouterOutlet, Routes} from "@angular/router";
import {AdminActivityOverviewComponent} from './admin/admin-activity-overview/admin-activity-overview.component';
import {ActivityComponent} from './framework/activity/activity.component';
import {FormsModule} from "@angular/forms";
import {AdminGuessingComponent} from './admin/admin-guessing/admin-guessing.component';
import {provideHttpClient} from "@angular/common/http";
import {AdminActivityResultComponent} from './admin/admin-activity-result/admin-activity-result.component';
import {AdminActivityDetailComponent} from './admin/admin-activity-detail/admin-activity-detail.component';
import {EastereggsComponent} from './eastereggs/eastereggs.component';
import {EastereggComponent} from './eastereggs/easteregg/easteregg.component';
import {AdminStatsComponent} from './admin/admin-stats/admin-stats.component';
import {SettingsComponent} from './settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OverviewComponent,
    AdminComponent,
    GuessingComponent,
    TeamOverviewComponent,
    ActivityOverviewComponent,
    PlanOverviewComponent,
    NewActivityComponent,
    AdminActivityOverviewComponent,
    ActivityComponent,
    AdminGuessingComponent,
    AdminActivityResultComponent,
    AdminActivityDetailComponent,
    EastereggsComponent,
    EastereggComponent,
    AdminStatsComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    RouterModule.forRoot([
      {path: 'login', component: LoginComponent, title: 'Login'},
      {path: '', component: OverviewComponent, title: 'Übersicht'},
      {path: 'plans', component: PlanOverviewComponent, title: 'Spielpläne'},
      {path: 'activities', component: ActivityOverviewComponent, title: 'Spiele'},
      {path: 'new', component: NewActivityComponent, title: 'Neues Spiel'},
      {path: 'guessing', component: GuessingComponent, title: 'Schätzfrage'},
      {path: 'settings', component: SettingsComponent, title: 'Einstellungen'},
      {
        path: 'eastereggs', children: [
          {path: '', component: EastereggsComponent, title: 'Easter Eggs'},
          {path: ':id', component: EastereggComponent, title: 'Easter Egg'}
        ]
      },
      {
        path: 'admin', children: [
          {path: '', component: AdminComponent, title: 'Admin-Bereich'},
          {path: 'teams', component: TeamOverviewComponent},
          {path: 'guessing', component: AdminGuessingComponent},
          {path: 'result', component: AdminActivityResultComponent},
          {path: 'stats', component: AdminStatsComponent},
          {
            path: 'activities', children: [
              {path: '', component: AdminActivityOverviewComponent},
              {path: 'activity/:id', component: AdminActivityDetailComponent},
            ]
          },
        ]
      },
      {path: '**', redirectTo: '/', pathMatch: 'full'}
    ]),
    FormsModule,
  ],
  exports: [
    RouterModule,
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule {
  routes: Routes = []
}
