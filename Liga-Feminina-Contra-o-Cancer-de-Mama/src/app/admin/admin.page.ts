import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase';
import { IonicModule } from '@ionic/angular/lazy';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class AdminPage implements OnInit {
  abaSelecionada = 'eventos';
  eventos: any[] = [];
  carregando = true;
  editando: any = null; // null = lista, {} = novo, {id...} = editando
  salvando = false;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.carregarEventos();
  }

  async carregarEventos() {
    this.carregando = true;
    try {
      this.eventos = await this.supabaseService.getTodosEventosAdmin();
    } catch (erro) {
      console.error('Erro ao carregar eventos:', erro);
    } finally {
      this.carregando = false;
      this.cdr.detectChanges();
    }
  }

  novoEvento() {
    this.editando = {
      nome: '', descricao: '', data: '', local: '',
      preco_ingresso: null, imagem_url: '', link_ingresso: '',
      o_que_inclui: '', ativo: true
    };
  }

  editarEvento(evento: any) {
    this.editando = { ...evento };
  }

  cancelarEdicao() {
    this.editando = null;
  }

  async salvarEvento() {
    this.salvando = true;
    try {
      if (this.editando.id) {
        await this.supabaseService.atualizarEvento(this.editando.id, this.editando);
      } else {
        await this.supabaseService.criarEvento(this.editando);
      }
      this.editando = null;
      await this.carregarEventos();
    } catch (erro) {
      console.error('Erro ao salvar evento:', erro);
    } finally {
      this.salvando = false;
      this.cdr.detectChanges();
    }
  }

  async excluirEvento(id: string) {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;
    try {
      await this.supabaseService.excluirEvento(id);
      await this.carregarEventos();
    } catch (erro) {
      console.error('Erro ao excluir evento:', erro);
    }
  }

  async sair() {
    await this.supabaseService.logout();
    this.router.navigate(['/home']);
  }
}