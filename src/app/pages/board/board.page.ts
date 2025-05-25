import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonContent, IonGrid, IonCol, IonRow, IonIcon, ModalController, IonText } from '@ionic/angular/standalone';
import { TicketsService } from "../../services/tickets/tickets.service";
import { Ticket } from "../../services/tickets/tickets.service";
import { SellDialogComponent } from '../../components/sell-dialog/sell-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-board',
  templateUrl: 'board.page.html',
  styleUrls: ['board.page.scss'],
  imports: [IonText, IonIcon, IonRow, IonCol, IonHeader, IonToolbar, IonContent, IonGrid, CommonModule],
  standalone: true
})
export class BoardPage {
  tickets: Record<number, Ticket> = {};
  numbers = Array.from({ length: 120 }, (_, i) => i + 1);

  constructor(private svc: TicketsService, private modalCtrl: ModalController) { }

  ngOnInit() { this.load(); }

  load() {
    this.svc.getTickets().subscribe(list => {
      this.tickets = Object.fromEntries(list.map(t => [t.number, t]));
    });
  }

  async openSell(number: number) {
    if (this.tickets[number]?.sold_at) return;
    const modal = await this.modalCtrl.create({
      component: SellDialogComponent,
      mode: 'ios',
      componentProps: { number }
    });
    modal.onDidDismiss().then(result => {
      if (result.data?.sold) this.load();
    });
    await modal.present();
  }

  hasSold(n: number): boolean {
    return !!this.tickets[n]?.sold_at;
  }
}