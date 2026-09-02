import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RodapeTabsComponent } from '../components/rodape-tabs/rodape-tabs.component';
import { IonicModule } from '@ionic/angular/lazy';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.page.html',
  styleUrls: ['./contato.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RodapeTabsComponent],
})
export class ContatoPage {
  constructor(private router: Router) {}

  voltar() {
    this.router.navigate(['/home']);
  }
}