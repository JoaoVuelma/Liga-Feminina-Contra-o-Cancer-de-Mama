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
  produtos: any[] = [];
  editandoProduto: any = null;

  estatisticas: any = null;
  patrocinadores: any[] = [];
  editandoStats = false;

  configDoacao: any = null;
  editandoConfig = false;
  enviandoImagem = false;


  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

   async ngOnInit() {
    await this.carregarEventos();
    await this.carregarProdutos();
    await this.carregarEstatisticas();
    await this.carregarConfigDoacao();
    await this.carregarPatrocinadores();
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

    // PRODUTOS
  async carregarProdutos() {
    try {
      this.produtos = await this.supabaseService.getProdutosAdmin();
      this.cdr.detectChanges();
    } catch (erro) {
      console.error('Erro ao carregar produtos:', erro);
    }
  }

  novoProduto() {
    this.editandoProduto = {
      nome: '', descricao: '', preco: null, imagem_url: '',
      tamanhos: '', estoque: 0, ativo: true
    };
  }

  editarProduto(produto: any) {
    this.editandoProduto = { ...produto, tamanhos: (produto.tamanhos || []).join(', ') };
  }

  cancelarEdicaoProduto() {
    this.editandoProduto = null;
  }

  async salvarProduto() {
    this.salvando = true;
    const dados = {
      ...this.editandoProduto,
      tamanhos: this.editandoProduto.tamanhos
        ? this.editandoProduto.tamanhos.split(',').map((t: string) => t.trim()).filter((t: string) => t)
        : []
    };
    try {
      if (dados.id) {
        await this.supabaseService.atualizarProduto(dados.id, dados);
      } else {
        await this.supabaseService.criarProduto(dados);
      }
      this.editandoProduto = null;
      await this.carregarProdutos();
    } catch (erro) {
      console.error('Erro ao salvar produto:', erro);
    } finally {
      this.salvando = false;
      this.cdr.detectChanges();
    }
  }

  async excluirProduto(id: string) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    try {
      await this.supabaseService.excluirProduto(id);
      await this.carregarProdutos();
    } catch (erro) {
      console.error('Erro ao excluir produto:', erro);
    }
  }

  // ESTATÍSTICAS
  async carregarEstatisticas() {
    try {
      this.estatisticas = await this.supabaseService.getEstatisticas();
      this.cdr.detectChanges();
    } catch (erro) {
      console.error('Erro ao carregar estatísticas:', erro);
    }
  }

  async salvarEstatisticas() {
    this.salvando = true;
    try {
      await this.supabaseService.atualizarEstatisticas(this.estatisticas.id, {
        atendidas: this.estatisticas.atendidas,
        eventos_realizados: this.estatisticas.eventos_realizados,
        voluntarias: this.estatisticas.voluntarias,
      });
      this.editandoStats = false;
    } catch (erro) {
      console.error('Erro ao salvar estatísticas:', erro);
    } finally {
      this.salvando = false;
      this.cdr.detectChanges();
    }
  }

  // CONFIG DOAÇÃO
  async carregarConfigDoacao() {
    try {
      this.configDoacao = await this.supabaseService.getConfigDoacao();
      this.cdr.detectChanges();
    } catch (erro) {
      console.error('Erro ao carregar config de doação:', erro);
    }
  }

  async salvarConfigDoacao() {
    this.salvando = true;
    try {
      await this.supabaseService.atualizarConfigDoacao(this.configDoacao.id, {
        chave_pix: this.configDoacao.chave_pix,
        cnpj: this.configDoacao.cnpj,
      });
      this.editandoConfig = false;
    } catch (erro) {
      console.error('Erro ao salvar config de doação:', erro);
    } finally {
      this.salvando = false;
      this.cdr.detectChanges();
    }
  }

    async carregarPatrocinadores() {
    try {
      this.patrocinadores = await this.supabaseService.getPatrocinadoresAdmin();
      this.cdr.detectChanges();
    } catch (erro) {
      console.error('Erro ao carregar patrocinadores:', erro);
    }
  }

  linkWhatsapp(p: any): string {
    const numero = (p.telefone || '').replace(/\D/g, '');
    const mensagem = `Olá, ${p.nome}! Vimos seu interesse em ser patrocinador do evento "${p.eventos?.nome || ''}". Vamos conversar sobre as cotas disponíveis?`;
    return `https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`;
  }

  async selecionarImagem(evento: any, alvo: 'evento' | 'produto') {
    const arquivo = evento.target.files[0];
    if (!arquivo) return;

    this.enviandoImagem = true;
    try {
      const url = await this.supabaseService.uploadImagem(arquivo);
      if (alvo === 'evento') {
        this.editando.imagem_url = url;
      } else {
        this.editandoProduto.imagem_url = url;
      }
    } catch (erro) {
      console.error('Erro ao enviar imagem:', erro);
    } finally {
      this.enviandoImagem = false;
      this.cdr.detectChanges();
    }
  }
}