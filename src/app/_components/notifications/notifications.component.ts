import { BootboxDialogOptionsImpl } from './../../_models/bootbox/bootbox-dialogue-options';
import { NotificationResultDTO } from './../../_models/dto/notification-result-dto';
import { NotificationListResultDTO } from './../../_models/dto/notification-list-result-dto';
import { NotificationService } from './../../_services/notification.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notificationListResult: NotificationListResultDTO = new NotificationListResultDTO();

  constructor(private notificationService: NotificationService) {

      notificationService.getUserNotifications().subscribe(notificationListResult =>
        {
          this.notificationListResult = notificationListResult;
        });


   }

  ngOnInit() {

  }

  ngAfterViewInit() {
    // Windows navigated to by sibling resourse do
    // not automtically scroll to top. Thiw sill scroll to top
      window.scrollTo(0, 0);
   }

    readNotification(notificationResultDTO: NotificationResultDTO): any {

        let bootboxDialogOptionsImpl: BootboxDialogOptions = new BootboxDialogOptionsImpl();
        bootboxDialogOptionsImpl.title = notificationResultDTO.title;
        bootboxDialogOptionsImpl.size = 'large';
        bootboxDialogOptionsImpl.message = notificationResultDTO.content;
        bootboxDialogOptionsImpl.buttons = {['ok']: {'label': 'OK'}};


        if(!notificationResultDTO.read) {
          this.notificationService.getMarkNotificationRead(notificationResultDTO.id).subscribe( result =>
            {
              notificationResultDTO.read = true;
            });
        }

        bootbox.dialog(bootboxDialogOptionsImpl);

  };

}