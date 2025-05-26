import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonItem, IonLabel, IonButton, IonSelect, IonSelectOption, IonToast, IonGrid, IonRow, IonCol, IonIcon, IonText, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

addIcons({ eyeOutline, eyeOffOutline });

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonButtons, IonText, IonCol, IonRow, IonGrid,
    IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonItem, IonLabel, IonButton,
    IonSelect, IonSelectOption, IonToast, IonIcon, CommonModule, FormsModule
  ]
})
export class RegisterPage {
  form = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'seller'
  };
  isLoading = false;
  toastMessage = '';
  showToast = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private http: HttpClient) { }

  passwordsMatch(): boolean {
    return this.form.password === this.form.confirmPassword;
  }

  async onSubmit(form: NgForm) {
    if (form.invalid || !this.passwordsMatch()) return;
    this.isLoading = true;
    this.toastMessage = '';
    this.showToast = false;
    try {
      await firstValueFrom(this.http.post(`${environment.apiUrl}/auth/register`, {
        name: this.form.name,
        email: this.form.email,
        password: this.form.password,
        role: this.form.role
      }));
      this.toastMessage = 'Usuario creado correctamente';
      this.showToast = true;
      form.resetForm({ role: 'seller' });
    } catch (err: any) {
      this.toastMessage = err?.error?.error || 'Error al registrar usuario';
      this.showToast = true;
    }
    this.isLoading = false;
  }
}