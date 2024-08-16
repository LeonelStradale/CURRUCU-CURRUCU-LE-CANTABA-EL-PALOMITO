import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-index-horarios',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {
  token = '';
  highlightedDates = [
    {
      date: '2024-07-18',
      textColor: '#800080',
      backgroundColor: '#ffc0cb',
    }
  ];

  constructor(
    private toast: ToastController,
    private storage: Storage,
    private api: ApiService
  ) {}

  async ngOnInit() {
    await this.storage.create();
    this.token = await this.storage.get('token');

    if (this.token) {
      this.getHorarios();
    } else {
      this.presentToast('top', 'Token no encontrado', 'warning');
    }
  }

  getHorarios() {
    this.api.getReservations(this.token).subscribe({
      next: (res: any) => {
        console.log(res);
        res.data.forEach((item: any) => {
          let fecha = new Date(item.attributes.appointment);
          let mes = fecha.getMonth() + 1;
          let dia = fecha.getDate();
          let anio = fecha.getUTCFullYear();
          
          let formattedMonth = mes < 10 ? `0${mes}` : mes;
          let formattedDay = dia < 10 ? `0${dia}` : dia;

          this.highlightedDates.push({
            date: `${anio}-${formattedMonth}-${formattedDay}`,
            textColor: '#200678',
            backgroundColor: '#aac87b',
          });
        });
        console.log(this.highlightedDates);
      },
      error: (error: any) => {
        if (error.status === 403) {
          this.presentToast('top', 'No tienes permisos', 'danger');
        } else if (error.status === 0) {
          this.presentToast('top', 'No tienes conexión', 'danger');
        } else {
          console.log(error);
          this.presentToast('top', 'Ocurrió un error inesperado', 'danger');
        }
      },
    });
  }

  async presentToast(
    position: 'top' | 'middle' | 'bottom',
    message: string,
    color: string
  ) {
    const toast = await this.toast.create({
      message,
      duration: 1500,
      position,
      color,
    });

    await toast.present();
  }

  isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();

    return utcDay !== 0 && utcDay !== 6;
  };
}
