import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonRefresher, IonRefresherContent, IonList, IonItem, IonLabel, IonSpinner, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { TicketsService, SoldTicket } from '../../services/tickets/tickets.service';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.page.html',
  styleUrls: ['./listado.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonButtons, IonSpinner, IonLabel, IonItem, IonList, IonRefresherContent, IonRefresher, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ListadoPage implements OnInit {
  soldTickets: SoldTicket[] = [];
  isLoading = true;

  constructor(private ticketSvc: TicketsService) { }

  ngOnInit() {
    this.loadSold();
  }

  loadSold() {
    this.isLoading = true;
    this.ticketSvc.getSoldTickets().subscribe({
      next: list => {
        this.soldTickets = list;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

}
