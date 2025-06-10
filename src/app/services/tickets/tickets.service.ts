import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Ticket { number: number; sold_at: string | null; }
export interface SoldTicket extends Ticket {
  buyer_name: string;
  buyer_email: string;
  buyer_cc: string;
  buyer_phone: string;
  payment_method: 'efectivo' | 'transferencia';
  sold_at: string;
  seller_name: string;
  seller_email: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private apiUrl = `${environment.apiUrl}/tickets`;
  constructor(private http: HttpClient) { }
  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);
  }
  sellTicket(number: number, data: any) {
    return this.http.put(`${this.apiUrl}/${number}/sell`, data);
  }
  getSoldTickets(): Observable<SoldTicket[]> {
    return this.http.get<SoldTicket[]>(`${this.apiUrl}/sold`);
  }
  getTicketByNumber(number: number): Observable<Ticket | SoldTicket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${number}`);
  }
  markWinnerTicket(number: number) {
    return this.http.post<{ message: string }>(`${this.apiUrl}/${number}/winner`, {});
  }
  getWinnerTicket() {
    return this.http.get<Ticket | SoldTicket>(`${this.apiUrl}/winner`);
  }
}
