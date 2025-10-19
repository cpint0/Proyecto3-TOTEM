import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export type AdminUser = {
  username: string;
  password: string;
  name: string;
  role: 'admin';
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private _isLoggedIn = signal<boolean>(this.hasToken());
  isLoggedIn = this._isLoggedIn.asReadonly();

  private _currentUser = signal<Pick<AdminUser, 'username'|'name'|'role'> | null>(this.readUser());
  currentUser = this._currentUser.asReadonly();

  /** Login contra JSON de assets. Cambiar por POST /auth/login cuando tengamos backend. */
  login$(username: string, password: string): Observable<boolean> {
    if (!username || !password) return of(false);

    return this.http.get<AdminUser[]>('/assets/data/admins.json').pipe(
      map(users => users.find(u => u.username === username && u.password === password) || null),
      tap(user => {
        if (user) {
          localStorage.setItem('token', 'demo-token'); // al migrar, guarda el JWT real
          localStorage.setItem('adminUser', JSON.stringify({ username: user.username, name: user.name, role: user.role }));
          this._isLoggedIn.set(true);
          this._currentUser.set({ username: user.username, name: user.name, role: user.role });
        }
      }),
      map(Boolean)
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    this._isLoggedIn.set(false);
    this._currentUser.set(null);
  }

  // ===== Helpers =====
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private readUser(): Pick<AdminUser,'username'|'name'|'role'> | null {
    try {
      const raw = localStorage.getItem('adminUser');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
}
