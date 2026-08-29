import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase';
import { RodapeTabsComponent } from '../components/rodape-tabs/rodape-tabs.component';
import { IonicModule } from '@ionic/angular/lazy';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.page.html',
  styleUrls: ['./evento-detalhe.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RodapeTabsComponent],
})
export class EventoDetalhePage implements OnInit {
  evento: any = null;
  carregando = true;
  itensInclusos: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    try {
      this.evento = await this.supabaseService.getEventoPorId(id);
      if (this.evento?.o_que_inclui) {
        this.itensInclusos = this.evento.o_que_inclui
          .split('\n')
          .map((item: string) => item.trim())
          .filter((item: string) => item.length > 0);
      }
    } catch (erro) {
      console.error('Erro ao carregar evento:', erro);
    } finally {
      this.carregando = false;
      this.cdr.detectChanges();
    }
  }

  comprarIngresso() {
    const mensagem = `Olá! Tenho interesse em comprar ingresso para o evento "${this.evento.nome}" (${new Date(this.evento.data).toLocaleDateString('pt-BR')}).`;
    const url = `https://wa.me/5554999976616?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  }

  voltar() {
    this.router.navigate(['/eventos']);
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