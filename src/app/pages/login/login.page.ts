import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from "../../services/auth/auth.service";
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonInput, IonRow, IonGrid, IonCol } from '@ionic/angular/standalone';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [ IonCol, IonGrid, IonRow, IonButton, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonInput],
})
export class LoginPage implements OnInit {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  user: any;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private nav: NavController,
    private toast: ToastController
  ) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.auth.user$.subscribe(user => {
      if (!user) return;
      this.user = user;
      console.log('User in login:', user);
      this.nav.navigateRoot('/board');
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.auth.login(this.form.value.email!, this.form.value.password!)
      .subscribe({
        next: () => this.nav.navigateRoot('/board'),
        error: async () => {
          const t = await this.toast.create({ message: 'Login fallido', duration: 2000, color: 'danger' });
          t.present();
        }
      });
  }

}
