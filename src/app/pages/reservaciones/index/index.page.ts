import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-index-reservaciones',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {
  token = '';
  detalles: any[] = [];
  details: any;
  citas: any[] = [];
  highlightedDates = [{}];
  servicios: any[] = [];
  selectedServiceId: string | null = null;
  selectedDate: string | null = null;
  selectedReservation: any = null;
  isModalOpen = false;
  isEditModalOpen = false;

  constructor(
    private toast: ToastController,
    private storage: Storage,
    private api: ApiService
  ) {}

  async ngOnInit() {
    await this.storage.create();
    this.token = await this.storage.get('token');

    if (this.token) {
      this.getReservations();
    } else {
      this.presentToast('top', 'Token no encontrado', 'warning');
    }

    this.getServicios();
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    this.selectedServiceId = null;
    this.details = null;
    this.selectedDate = null;
  }

  setEditOpen(isOpen: boolean) {
    this.isEditModalOpen = isOpen;
  }

  getServicios() {
    this.api.getServicios(this.token).subscribe({
      next: (res: any) => {
        console.log(res);
        this.servicios = res.data;
      },
      error: (errors: any) => {
        console.log(errors);
      },
    });
  }

  getReservations() {
    this.api.getReservations(this.token).subscribe({
      next: (res: any) => {
        console.log(res);
        res.data.forEach((cita: any) => {
          cita.attributes.appointment = cita.attributes.appointment.split('T');
          this.citas.push(cita);
          this.highlightedDates.push({
            date: `${cita.attributes.appointment[0]}`,
            textColor: '#200678',
            backgroundColor: '#aac87b',
          });
        });
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

  isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();

    return utcDay !== 0 && utcDay !== 6;
  };

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

  async saveReservation() {
    const userId = await this.storage.get('userId'); // Obtener el ID del usuario del almacenamiento

    if (
      !userId ||
      !this.selectedServiceId ||
      !this.selectedDate ||
      !this.details
    ) {
      console.log(
        userId,
        this.selectedServiceId,
        this.selectedDate,
        this.details
      );
      this.presentToast('top', 'Por favor completa todos los campos', 'danger');
      return;
    }

    const reservationData = {
      data: {
        users_permissions_user: userId, // Usar el ID del usuario autenticado
        servicie: this.selectedServiceId,
        appointment: this.selectedDate,
        details: this.details,
      },
    };

    console.log(reservationData);

    this.api.saveReservation(this.token, reservationData).subscribe({
      next: (res: any) => {
        this.presentToast(
          'top',
          'Reservación guardada exitosamente',
          'success'
        );
        this.setOpen(false); // Cierra el modal
        this.getReservations(); // Actualiza la lista de reservaciones
      },
      error: (error: any) => {
        console.log('Error al guardar la reservación:', error);
        if (error.status === 400) {
          this.presentToast(
            'top',
            'Solicitud inválida: ' + error.error.message,
            'danger'
          );
        } else {
          this.presentToast(
            'top',
            'Ocurrió un error al guardar la reservación',
            'danger'
          );
        }
      },
    });
  }

  editReservation(item: any) {
    this.selectedReservation = item;
    console.log(item);
    // Establece los valores en el modal de edición con la información existente
    this.selectedServiceId = item.attributes.servicie.data.id;
    this.selectedDate = item.attributes.appointment.join('T');
    this.details = item.attributes.details;

    // Abre el modal de edición
    this.setEditOpen(true);
  }

  async updateReservation() {
    const userId = await this.storage.get('userId');

    if (
      !userId ||
      !this.selectedServiceId ||
      !this.selectedDate ||
      !this.details
    ) {
      this.presentToast('top', 'Por favor completa todos los campos', 'danger');
      return;
    }

    const reservationData = {
      data: {
        users_permissions_user: userId,
        servicie: this.selectedServiceId,
        appointment: this.selectedDate,
        details: this.details,
      },
    };

    if (this.selectedReservation) {
      // Editar reservación existente
      this.api
        .updateReservation(
          this.token,
          this.selectedReservation.id,
          reservationData
        )
        .subscribe({
          next: (res: any) => {
            this.presentToast(
              'top',
              'Reservación actualizada exitosamente',
              'success'
            );

            const index = this.citas.indexOf(this.selectedReservation);
            if (index > -1) {
              this.citas.splice(index, 1);
            }

            const index2 = this.detalles.indexOf(this.selectedReservation);
            if (index2 > -1) {
              this.detalles.splice(index2, 1);
            }

            this.setEditOpen(false); // Cierra el modal de edición
            this.getReservations();
            this.selectedReservation = null; // Resetea la selección
          },
          error: (error: any) => {},
        });
    }
  }

  // Nueva función para eliminar una reservación
  deleteReservation(item: any) {
    this.api.deleteReservation(this.token, item.id).subscribe({
      next: () => {
        this.presentToast(
          'top',
          'Reservación eliminada exitosamente',
          'success'
        );

        const index = this.citas.indexOf(item);
        if (index > -1) {
          this.citas.splice(index, 1);
        }

        const index2 = this.detalles.indexOf(item);
        if (index2 > -1) {
          this.detalles.splice(index2, 1);
        }

        this.detalles = this.detalles.filter((item) => item.id !== item.id);
      },
      error: (error: any) => {
        console.log('Error al eliminar la reservación:', error);
        this.presentToast(
          'top',
          'Ocurrió un error al eliminar la reservación',
          'danger'
        );
      },
    });
  }

  dateChange($event: any) {
    // console.log($event.detail.value);
    this.detalles = [];
    var select = $event.detail.value.split('T');
    // console.log(select);
    this.citas.forEach((cita: any) => {
      console.log(cita);
      if (cita.attributes.appointment[0] == select[0]) {
        this.detalles.push(cita);
      }
    });
  }
}
