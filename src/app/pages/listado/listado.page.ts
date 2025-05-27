import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonRefresher, IonRefresherContent, IonItem, IonSpinner, IonButtons, IonBackButton, IonInput } from '@ionic/angular/standalone';
import { TicketsService, SoldTicket } from '../../services/tickets/tickets.service';
import { AuthService } from "../../services/auth/auth.service";
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.page.html',
  styleUrls: ['./listado.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonButtons, IonSpinner, IonItem, IonRefresherContent, IonRefresher, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput]
})
export class ListadoPage implements OnInit {
  soldTickets: SoldTicket[] = [];
  filteredTickets: any[] = [];
  isLoading = true;
  searchTerm = '';
  user: any;

  constructor(
    private ticketSvc: TicketsService,
    private auth: AuthService,
    private nav: NavController,
  ) { }

  ngOnInit() {
    this.getUser();
    this.loadSold();
  }

  async getUser() {
    this.auth.user$.subscribe(user => {
      if (!user) {
        this.nav.navigateRoot('/board');
      };
      this.user = user;
      this.nav.navigateRoot('/listado');
    });
  }

  loadSold(event?: any) {
    this.isLoading = true;
    this.ticketSvc.getSoldTickets().subscribe({
      next: list => {
        this.soldTickets = list;
        this.filterTickets();
        this.isLoading = false;
        if (event) event.target.complete(); // Finaliza el refresher si existe
      },
      error: () => {
        this.isLoading = false;
        if (event) event.target.complete();
      }
    });
  }

  filterTickets() {
    const term = this.searchTerm.toLowerCase();
    this.filteredTickets = this.soldTickets.filter(t =>
      (t.number + '').includes(term) ||
      (t.payment_method || '').toLowerCase().includes(term) ||
      (t.buyer_name || '').toLowerCase().includes(term) ||
      (t.buyer_cc || '').toLowerCase().includes(term) ||
      (t.buyer_email || '').toLowerCase().includes(term) ||
      (t.buyer_phone || '').toLowerCase().includes(term) ||
      (t.seller_name || '').toLowerCase().includes(term) ||
      (t.seller_email || '').toLowerCase().includes(term)
    );
  }

}
