import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import { addIcons } from 'ionicons';
import {
  heart, heartOutline,
  bag, bagOutline,
  calendar, calendarOutline,
  chevronForward, chevronBack,
  ribbon,
  gift,
  checkmark, checkmarkCircle,
  copyOutline,
  ticketOutline,
  locationOutline, location,
  timeOutline,
  paperPlaneOutline,
  logOutOutline,
  createOutline,
  trashOutline,
  add,
  mailOutline,
  logoWhatsapp,
  call,
  logoInstagram,
  home,
  lockClosedOutline,
  callOutline,
  informationCircleOutline,
  cashOutline
} from 'ionicons/icons';

addIcons({
  'heart': heart,
  'heart-outline': heartOutline,
  'bag': bag,
  'bag-outline': bagOutline,
  'calendar': calendar,
  'calendar-outline': calendarOutline,
  'chevron-forward': chevronForward,
  'chevron-back': chevronBack,
  'ribbon': ribbon,
  'gift': gift,
  'checkmark': checkmark,
  'checkmark-circle': checkmarkCircle,
  'copy-outline': copyOutline,
  'ticket-outline': ticketOutline,
  'location-outline': locationOutline,
  'location': location,
  'time-outline': timeOutline,
  'paper-plane-outline': paperPlaneOutline,
  'log-out-outline': logOutOutline,
  'create-outline': createOutline,
  'trash-outline': trashOutline,
  'add': add,
  'mail-outline': mailOutline,
  'logo-whatsapp': logoWhatsapp,
  'call': call,
  'logo-instagram': logoInstagram,
  'home': home,
  'lock-closed-outline': lockClosedOutline,
  'call-outline': callOutline,
  'information-circle-outline': informationCircleOutline,
  'cash-outline': cashOutline,
});

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
