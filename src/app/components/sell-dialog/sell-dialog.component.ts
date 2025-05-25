import { Component, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TicketsService } from '../../services/tickets/tickets.service';
import { ModalController, IonButton, IonInput, IonItem, IonLabel, IonContent, IonSelect, IonSelectOption, IonHeader, IonToolbar, IonTitle, IonButtons } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

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

  constructor(
    private fb: FormBuilder,
    private svc: TicketsService,
    private modalCtrl: ModalController
  ) {}

  sell() {
    if (this.form.invalid) return;
    this.svc.sellTicket(this.number, {
      ...this.form.value,
      seller_id: 1
    }).subscribe(() =>
      this.modalCtrl.dismiss({ sold: true })
    );
  }

  close() {
    this.modalCtrl.dismiss();
  }
}