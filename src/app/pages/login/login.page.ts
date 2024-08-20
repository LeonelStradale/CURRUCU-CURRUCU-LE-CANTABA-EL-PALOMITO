import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Storage } from '@ionic/storage-angular';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    private navCtrl: NavController,
    private toast: ToastController,
    private storage: Storage,
    private api: ApiService
  ) {}
  
  user = 'edgarleonel@gmail.com';
  pass = 'Juni1200';

  async ngOnInit() {
    await this.storage.create();
  }

  login() {
    this.api.login(this.user, this.pass).subscribe({
      next: async (res: any) => {
        await this.storage.set('token', res.jwt);
        await this.storage.set('userId', res.user.id); // Guardar el ID del usuario
        await this.storage.set('name', res.user.name);
        this.presentToast('bottom', '¡Bienvenido! ' + res.user.name, 'success');
        console.log(res.jwt);

        // Redirigir a la vista de reservas
        this.navCtrl.navigateForward('/reservaciones');
      },
      error: (error: any) => {
        console.log(error);
        this.presentToast('bottom', 'Error al iniciar sesión. Inténtalo de nuevo.', 'danger');
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
