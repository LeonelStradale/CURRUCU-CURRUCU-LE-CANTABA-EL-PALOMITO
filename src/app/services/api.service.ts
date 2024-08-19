import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private storage: Storage, private http: HttpClient) {}
  url = environment.backend;

  login(user: string, pass: string) {
    return this.http.post(this.url + '/auth/local', {
      identifier: user,
      password: pass,
    });
  }

  getUsers(token: string) {
    return this.http.get(this.url + '/users', {
      headers: { Authorization: 'bearer ' + token },
    });
  }

  getReservations(token: string) {
    return this.http.get(this.url + '/reservations?populate=*', {
      headers: { Authorization: 'bearer ' + token },
    });
  }

  getSchedules(token: string) {
    return this.http.get(this.url + '/schedules', {
      headers: { Authorization: 'bearer ' + token },
    });
  }

  getServicios(token: string) {
    return this.http.get(this.url + '/servicies', {
      headers: { Authorization: 'bearer ' + token },
    });
  }

  saveReservation(token: string, reservationData: any) {
    return this.http.post(this.url + '/reservations', reservationData, {
      headers: { Authorization: 'bearer ' + token },
    });  
  }

  deleteReservation(token: string, id: number) {
    return this.http.delete(`${this.url}/reservations/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  updateReservation(token: string, reservationId: string, reservationData: any) {
    return this.http.put(`${this.url}/reservations/${reservationId}`, reservationData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  
  
}
