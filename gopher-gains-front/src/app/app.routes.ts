import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './core/layout/default-layout.component';
import { DashboardPage } from './features/dashboard/dashboard.page';
import { ExerciseListPage } from './features/exercises/exercise-list.page';
import { ExerciseFormPage } from './features/exercises/exercise-form.page';
import { RoutineListPage } from './features/routines/routine-list.page';
import { RoutineFormPage } from './features/routines/routine-form.page';
import { RoutineDetailPage } from './features/routines/routine-detail.page';
import { RoutineEditPage } from './features/routines/routine-edit.page';
import { UserListPage } from './features/users/user-list.page';
import { UserFormPage } from './features/users/user-form.page';
import { SessionListPage } from './features/sessions/session-list.page';
import { SessionFormPage } from './features/sessions/session-form.page';
import { SessionDetailPage } from './features/sessions/session-detail.page';
import { AssignmentPage } from './features/assignments/assignment.page';

export const routes: Routes = [
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      { path: 'admin', component: DashboardPage, title: 'Dashboard' },
      { path: 'my', component: DashboardPage, title: 'My Dashboard' },
      { path: 'exercises', component: ExerciseListPage, title: 'Exercises' },
      { path: 'exercises/new', component: ExerciseFormPage, title: 'New Exercise' },
      { path: 'exercises/:id', component: ExerciseFormPage, title: 'Edit Exercise' },
      { path: 'routines', component: RoutineListPage, title: 'Routines' },
      { path: 'routines/new', component: RoutineFormPage, title: 'New Routine' },
      { path: 'routines/:id', component: RoutineDetailPage, title: 'Routine Detail' },
      { path: 'routines/:id/edit', component: RoutineEditPage, title: 'Edit Routine' },
      { path: 'users', component: UserListPage, title: 'Users' },
      { path: 'users/new', component: UserFormPage, title: 'New User' },
      { path: 'users/:id', component: UserFormPage, title: 'Edit User' },
      { path: 'sessions', component: SessionListPage, title: 'Sessions' },
      { path: 'sessions/new', component: SessionFormPage, title: 'New Session' },
      { path: 'sessions/:id', component: SessionDetailPage, title: 'Session Detail' },
      { path: 'assignments', component: AssignmentPage, title: 'Assignments' },
    ],
  },
];
