import { Component, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TicketsService } from '../../services/tickets/tickets.service';
import { ModalController, IonButton, IonInput, IonItem, IonLabel, IonContent, IonSelect, IonSelectOption, IonHeader, IonToolbar, IonTitle, IonButtons, ToastController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-sell-modal',
  templateUrl: './sell-dialog.component.html',
  styleUrls: ['./sell-dialog.component.scss'],
  standalone: true,
  imports: [IonButtons, IonTitle, IonToolbar, IonHeader, IonContent, CommonModule, ReactiveFormsModule, IonButton, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption],
})
export class SellDialogComponent {
  @Input() number!: number;
  form = this.fb.group({
    buyer_name: ['', Validators.required],
    buyer_email: ['', [Validators.required, Validators.email]],
    buyer_cc: [''],
    buyer_phone: ['', Validators.required],
    payment_method: ['efectivo', Validators.required]
  });
  user: any;

  constructor(
    private fb: FormBuilder,
    private svc: TicketsService,
    private modalCtrl: ModalController,
    private auth: AuthService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.getUser();
  }

  async sell() {
    if (this.form.invalid) return;
    if (!this.user?.id) return;
    this.svc.sellTicket(this.number, {
      ...this.form.value,
      seller_id: this.user.id,
    }).subscribe(async () => {
      const toast = await this.toastCtrl.create({
        message: '¡Boleta vendida correctamente!',
        duration: 2000,
        color: 'success',
        position: 'top'
      });
      await toast.present();
      this.modalCtrl.dismiss({ sold: true });
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }

  getUser() {
    this.auth.user$.subscribe(user => {
      if (!user) return;
      this.user = user;
      console.log('User in sell-dialog:', user);
    });
  }
}