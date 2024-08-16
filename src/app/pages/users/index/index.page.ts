import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-index-users',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {
  constructor(private toast: ToastController, private storage: Storage, private api: ApiService) {}
  token = '';

  async ngOnInit() {
    await this.storage.create();
    this.token = await this.storage.get('token');
    this.getUsers();
  }

  getUsers() {
    this.api.getUsers(this.token).subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (error: any) => {
        if (error.status == 403) {
          this.presentToast('top', 'No tienes permisos', 'danger')
        }

        if (error.status == 0) {
          this.presentToast('top', 'No tienes conexión', 'danger')
        }
        console.log(error);
      },
    });
  }

  async presentToast(
    position: 'top' | 'middle' | 'bottom',
    msj: string,
    color: string
  ) {
    const toast = await this.toast.create({
      message: msj,
      duration: 1500,
      position: position,
      color: color,
    });

    await toast.present();
  }
}
