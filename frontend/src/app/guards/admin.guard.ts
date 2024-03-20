import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { firstValueFrom } from 'rxjs';
import { User } from '../users/IUser';

export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const auth = localStorage.getItem('authenticated');
  const isDirectUrlAccess = !state.url.startsWith('/' + router.config.find(c => c.path === route.url.join('/')).path); // Check for mismatch between URL and router configuration

  if (!auth) {
    return router.createUrlTree(['forbidden']);
  }

  return firstValueFrom(authService.getUser())
    .then((user: User) => {
      if(user.role_id !== 1)
        return router.createUrlTree(['forbidden']);
      if (isDirectUrlAccess) {
        return router.createUrlTree(['forbidden']);
      } else {
        return true;
      }
    })
    .catch(error => {
      console.error('Error fetching user:', error);
      return router.createUrlTree(['forbidden']); // Redirect on error
    });
};
