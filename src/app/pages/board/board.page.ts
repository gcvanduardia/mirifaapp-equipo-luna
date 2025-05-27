import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonContent, IonGrid, IonCol, IonRow, IonIcon, ModalController, IonText, IonButtons, IonButton, IonPopover, IonList, IonItem } from '@ionic/angular/standalone';
import { TicketsService } from "../../services/tickets/tickets.service";
import { Ticket } from "../../services/tickets/tickets.service";
import { SellDialogComponent } from '../../components/sell-dialog/sell-dialog.component';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { closeOutline, logInOutline, personCircleOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board',
  templateUrl: 'board.page.html',
  styleUrls: ['board.page.scss'],
  imports: [IonItem, IonList, IonPopover, IonButton, IonButtons, IonText, IonIcon, IonRow, IonCol, IonHeader, IonToolbar, IonContent, IonGrid, CommonModule, RouterModule],
  standalone: true
})
export class BoardPage {
  tickets: Record<number, Ticket> = {};
  numbers = Array.from({ length: 120 }, (_, i) => i + 1);
  user: any;
  userMenuOpen = false;
  userMenuEvent: any;

  constructor(
    private svc: TicketsService,
    private modalCtrl: ModalController,
    public auth: AuthService,
    private router: Router
  ) {
    addIcons({ logInOutline, personCircleOutline, closeOutline });
  }

  ngOnInit() {
    this.load();
    this.getUser();
  }

  load() {
    this.svc.getTickets().subscribe(list => {
      this.tickets = Object.fromEntries(list.map(t => [t.number, t]));
    });
  }

  getUser() {
    this.auth.user$.subscribe(user => {
      if (!user) return;
      this.user = user;
    });
  }

  openUserMenu(ev: Event) {
    this.userMenuEvent = ev;
    this.userMenuOpen = true;
  }

  logout() {
    this.auth.logout();
    this.userMenuOpen = false;
  }

  verListado() {
    this.userMenuOpen = false;
    setTimeout(() => {
      this.router.navigate(['/listado']);
    }, 200);
  }

  register() {
    this.userMenuOpen = false;
    setTimeout(() => {
      this.router.navigate(['/register']);
    }, 200);
  }

  async openSell(number: number) {
    if (this.tickets[number]?.sold_at) return;
    if (!this.user?.id) return;
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