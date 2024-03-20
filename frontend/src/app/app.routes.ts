import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { HomeComponent } from './home/home.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { ModeratorPanelComponent } from './moderator-panel/moderator-panel.component';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { adminGuard } from './guards/admin.guard';
import { moderatorGuard } from './guards/moderator.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path:"",
        pathMatch: "full",
        redirectTo: "home"
    },
    {
        path: "home",
        component: HomeComponent
    },
    {
        path: "chat",
        component: ChatComponent,
        canActivate: [authGuard]
    },
    {
        path: "admin_panel",
        component: AdminPanelComponent,
        canActivate: [authGuard, adminGuard]
    },
    {
        path: "moderator_panel",
        component: ModeratorPanelComponent,
        canActivate: [authGuard, moderatorGuard]
    },
    {
        path: "user_panel",
        component: UserPanelComponent,
        canActivate: [authGuard]
    },
    {
        path: "login",
        component: LoginComponent,
        canActivate: []
    },
    {
        path: "register",
        component: RegisterComponent,
        canActivate: []
    },
    {
        path: "forbidden",
        component: ForbiddenComponent
    },
    {
        path: "**",
        component: NotFoundComponent
    },
];
