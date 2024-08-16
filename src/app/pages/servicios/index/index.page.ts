import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Storage } from '@ionic/storage-angular';  

@Component({
  selector: 'app-index-servicios',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {
  token = '';

  constructor(
    private toast: ToastController, 
    private storage: Storage, 
    private api: ApiService
  ) {}

  async ngOnInit() {
    await this.storage.create();
    this.token = await this.storage.get('token');

    if (this.token) {
      this.getServicios();
    } else {
      this.presentToast('top', 'Token no encontrado', 'warning');
    }
  }

  getServicios() {
    this.api.getServicios(this.token).subscribe({
      next: (res: any) => {
        console.log(res);
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
}
