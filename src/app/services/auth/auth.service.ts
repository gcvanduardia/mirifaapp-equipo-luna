import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, tap } from 'rxjs';

interface LoginResp { token: string; }
interface User { id: number; name: string; role: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _user = new BehaviorSubject<User | null>(null);
    user$ = this._user.asObservable();
    private readonly TOKEN_KEY = 'auth-token';
    private readonly API_URL = 'http://localhost:3000/api/auth';

    constructor(private http: HttpClient, private storage: Storage) {
        this.storage.create().then(() => this.loadUser());
    }

    login(email: string, password: string) {
        return this.http.post<LoginResp>(`${this.API_URL}/login`, { email, password })
            .pipe(
                tap(async res => {
                    await this.storage.set(this.TOKEN_KEY, res.token);
                    this.loadUser();
                })
            );
    }

    async loadUser() {
        const token = await this.storage.get(this.TOKEN_KEY);
        if (!token) return;
        this.http.get<User>(`${this.API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        }).subscribe({
            next: user => this._user.next(user),
            error: () => this._user.next(null)
        });
    }

    logout() {
        this.storage.remove(this.TOKEN_KEY);
        this._user.next(null);
        window.location.reload();
    }

    getToken() {
        return this.storage.get(this.TOKEN_KEY);
    }
}