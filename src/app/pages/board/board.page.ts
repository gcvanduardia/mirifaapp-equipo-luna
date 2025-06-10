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
  numbers = Array.from({ length: 160 }, (_, i) => i + 1);
  user: any;
  userMenuOpen = false;
  userMenuEvent: any;
  countdown: string = '';
  eventDate: String = "12/06/2025 8:00pm";

  currentNumber = 0;
  winner: number | null = null;
  isRunning = false;
  private intervalId: any;
  ganadorName: string | null = null;
  progress = 0;
  contestEnd = false;
  sorteoHabilitado = false;

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
    this.startCountdown();
    this.checkSorteoHabilitado();
    this.getWinnerTicket();
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

  checkSorteoHabilitado() {
    const eventDate = new Date('2025-06-12T20:00:00-05:00');
    const now = new Date();
    this.sorteoHabilitado = now >= eventDate;
  }

  getWinnerTicket() {
    this.svc.getWinnerTicket().subscribe({
      next: (data: any) => {
        if (data && data.number) {
          this.winner = data.number;
          if (this.winner !== null) {
            this.currentNumber = this.winner;
            this.getWinnerName(this.winner);
            this.contestEnd = true;
          }
        } else {
          this.winner = null;
          this.ganadorName = 'Desconocido';
        }
      },
      error: () => {
        this.winner = null;
        this.ganadorName = 'Desconocido';
      }
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

  startCountdown() {
    const target = new Date('2025-06-12T20:00:00-05:00').getTime();
    setInterval(() => {
      const now = new Date().getTime();
      let distance = target - now;
      if (distance < 0) {
        this.countdown = '¡El sorteo ha comenzado!';
        this.checkSorteoHabilitado();
        return;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      this.countdown = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
  }

  start() {
    this.isRunning = true;
    this.winner = null;
    this.progress = 0;
    this.contestEnd = false;
    const duration = 60000;
    const startTime = Date.now();
    this.intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      this.currentNumber = Math.floor(Math.random() * 160) + 1;
      this.progress = Math.min(100, Math.round((elapsed / duration) * 100));
      if (elapsed >= duration) {
        clearInterval(this.intervalId);
        this.winner = this.currentNumber;
        this.isRunning = false;
        this.progress = 100;
        this.contestEnd = true;
        this.ganadorName = this.getWinnerName(this.winner);
        this.uploadWinner(this.winner);
      }
    }, 300);
  }

  getWinnerName(winnerNumber: number): string | null {
    this.svc.getTicketByNumber(winnerNumber).subscribe({
      next: (data: any) => {
        if (data && data.buyer_name) {
          this.ganadorName = data.buyer_name;
        } else {
          this.ganadorName = 'Desconocido';
        }
      },
      error: () => {
        this.ganadorName = 'Desconocido';
      }
    });
    return null;
  }

  uploadWinner(numeroGanador: number) {
    this.svc.markWinnerTicket(numeroGanador).subscribe({
      next: res => console.log(res.message),
      error: err => console.error(err)
    });
  }

}