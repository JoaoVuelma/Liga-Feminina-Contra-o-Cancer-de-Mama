import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../services/supabase';
import { IonicModule } from '@ionic/angular/lazy';
import { RodapeTabsComponent } from '../components/rodape-tabs/rodape-tabs.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, IonicModule, RodapeTabsComponent],
})
export class HomePage implements OnInit, OnDestroy {
  estatisticas: any = null;
  carregando = true;
  private canalRealtime: any;

  constructor(
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.carregarEstatisticas();

    this.canalRealtime = this.supabaseService.escutarTabela('estatisticas', (payload) => {
      this.estatisticas = payload.new;
      this.cdr.detectChanges();
    });
  }

  async carregarEstatisticas() {
    try {
      this.estatisticas = await this.supabaseService.getEstatisticas();
    } catch (erro) {
      console.error('Erro ao carregar estatísticas:', erro);
    } finally {
      this.carregando = false;
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    if (this.canalRealtime) {
      this.canalRealtime.unsubscribe();
    }
  }
}