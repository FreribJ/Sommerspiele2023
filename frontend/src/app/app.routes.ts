import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { adminGuard } from './core/admin.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },

  { path: '', canActivate: [authGuard], loadComponent: () => import('./overview/overview.component').then(m => m.OverviewComponent) },

  { path: 'plans', canActivate: [authGuard], loadComponent: () => import('./plan-overview/plan-overview.component').then(m => m.PlanOverviewComponent) },

  { path: 'activities', canActivate: [authGuard], loadComponent: () => import('./activity-overview/activity-overview.component').then(m => m.ActivityOverviewComponent) },

  { path: 'new', canActivate: [authGuard], loadComponent: () => import('./new-activity/new-activity.component').then(m => m.NewActivityComponent) },

  { path: 'guessing', canActivate: [authGuard], loadComponent: () => import('./guessing/guessing.component').then(m => m.GuessingComponent) },

  { path: 'settings', canActivate: [authGuard], loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent) },

  { path: 'eastereggs', canActivate: [authGuard], loadComponent: () => import('./eastereggs/eastereggs.component').then(m => m.EastereggsComponent) },

  { path: 'eastereggs/:id', canActivate: [authGuard], loadComponent: () => import('./eastereggs/easteregg/easteregg.component').then(m => m.EastereggComponent) },

  { path: 'admin', canActivate: [authGuard, adminGuard], children: [
    { path: '', loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent) },
    { path: 'teams', loadComponent: () => import('./admin/team-overview/team-overview.component').then(m => m.TeamOverviewComponent) },
    { path: 'activities', loadComponent: () => import('./admin/admin-activity-overview/admin-activity-overview.component').then(m => m.AdminActivityOverviewComponent) },
    { path: 'activities/activity/:id', loadComponent: () => import('./admin/admin-activity-detail/admin-activity-detail.component').then(m => m.AdminActivityDetailComponent) },
    { path: 'guessing', loadComponent: () => import('./admin/admin-guessing/admin-guessing.component').then(m => m.AdminGuessingComponent) },
    { path: 'result', loadComponent: () => import('./admin/admin-activity-result/admin-activity-result.component').then(m => m.AdminActivityResultComponent) },
    { path: 'stats', loadComponent: () => import('./admin/admin-stats/admin-stats.component').then(m => m.AdminStatsComponent) },
  ]},

  { path: '**', redirectTo: '' }
];
