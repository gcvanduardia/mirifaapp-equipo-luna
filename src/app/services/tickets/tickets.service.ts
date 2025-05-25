import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ticket { number: number; sold_at: string | null; }

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private apiUrl = 'http://localhost:3000/api/tickets';
  constructor(private http: HttpClient) {}
  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);
  }
  sellTicket(number: number, data: any) {
    return this.http.put(`${this.apiUrl}/${number}/sell`, data);
  }
}
