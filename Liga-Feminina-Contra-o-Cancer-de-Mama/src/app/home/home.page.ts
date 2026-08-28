import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../services/supabase';
import { IonicModule } from '@ionic/angular/lazy';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, IonicModule],
})
export class HomePage implements OnInit, OnDestroy {
  estatisticas: any = null;
  carregando = true;
  private canalRealtime: any;

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.carregarEstatisticas();

    // Escuta mudanças em tempo real na tabela de estatísticas
    this.canalRealtime = this.supabaseService.escutarTabela('estatisticas', (payload) => {
      this.estatisticas = payload.new;
    });
  }

  async carregarEstatisticas() {
    try {
      this.estatisticas = await this.supabaseService.getEstatisticas();
    } catch (erro) {
      console.error('Erro ao carregar estatísticas:', erro);
    } finally {
      this.carregando = false;
    }
  }

  ngOnDestroy() {
    if (this.canalRealtime) {
      this.canalRealtime.unsubscribe();
    }
  }
}