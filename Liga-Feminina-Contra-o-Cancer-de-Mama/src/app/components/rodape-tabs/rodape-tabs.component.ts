import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular/lazy';

@Component({
  selector: 'app-rodape-tabs',
  templateUrl: './rodape-tabs.component.html',
  styleUrls: ['./rodape-tabs.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, RouterLinkActive],
})
export class RodapeTabsComponent {}