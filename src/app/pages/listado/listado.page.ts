import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonRefresher, IonRefresherContent, IonItem, IonSpinner, IonButtons, IonBackButton, IonInput, IonButton, IonFooter, IonIcon } from '@ionic/angular/standalone';
import { TicketsService, SoldTicket } from '../../services/tickets/tickets.service';
import { AuthService } from "../../services/auth/auth.service";
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cloudDownloadOutline } from 'ionicons/icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.page.html',
  styleUrls: ['./listado.page.scss'],
  standalone: true,
  imports: [IonFooter, IonBackButton, IonButtons, IonSpinner, IonItem, IonRefresherContent, IonRefresher, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput, IonButton, IonIcon]
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
  ) { 
    addIcons({ cloudDownloadOutline });
  }

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

  get total(): number {
    return this.filteredTickets.reduce((sum, t) => sum + (Number(t.ticket_price) || 0), 0);
  }

  exportToExcel() {
    const data = this.filteredTickets.map(t => ({
      Número: t.number,
      Método: t.payment_method,
      Comprador: t.buyer_name,
      CC: t.buyer_cc,
      Email: t.buyer_email,
      Teléfono: t.buyer_phone,
      Vendedor: t.seller_name,
      'Email Vendedor': t.seller_email,
      Fecha: t.sold_at,
      Valor: t.ticket_price
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Listado');

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'listado_boletas_vendidas_equipo_luna.xlsx');
  }

}
