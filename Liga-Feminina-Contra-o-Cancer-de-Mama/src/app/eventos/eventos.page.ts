import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase';
import { RodapeTabsComponent } from '../components/rodape-tabs/rodape-tabs.component';
import { IonicModule } from '@ionic/angular/lazy';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RodapeTabsComponent],
})
export class EventosPage implements OnInit {
  eventos: any[] = [];
  carregando = true;

  constructor(
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      this.eventos = await this.supabaseService.getEventos();
    } catch (erro) {
      console.error('Erro ao carregar eventos:', erro);
    } finally {
      this.carregando = false;
      this.cdr.detectChanges();
    }
  }

  irParaParticipar(id: string) {
    this.router.navigate(['/eventos', id]);
  }

  irParaPatrocinador(id: string) {
    this.router.navigate(['/eventos', id, 'patrocinador']);
  }

  diaDoMes(data: string): string {
    return new Date(data).getDate().toString().padStart(2, '0');
  }

  mesAbreviado(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
  }

  ano(data: string): string {
    return new Date(data).getFullYear().toString();
  }
}