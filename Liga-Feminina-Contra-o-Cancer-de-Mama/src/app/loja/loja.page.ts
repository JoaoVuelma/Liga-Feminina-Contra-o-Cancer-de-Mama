import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../services/supabase';
import { RodapeTabsComponent } from '../components/rodape-tabs/rodape-tabs.component';
import { IonicModule } from '@ionic/angular/lazy';

@Component({
  selector: 'app-loja',
  templateUrl: './loja.page.html',
  styleUrls: ['./loja.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RodapeTabsComponent],
})
export class LojaPage implements OnInit {
  produtos: any[] = [];
  carregando = true;
  tamanhoSelecionado: { [produtoId: string]: string } = {};

  constructor(
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    try {
      this.produtos = await this.supabaseService.getProdutos();
    } catch (erro) {
      console.error('Erro ao carregar produtos:', erro);
    } finally {
      this.carregando = false;
      this.cdr.detectChanges();
    }
  }

  selecionarTamanho(produtoId: string, tamanho: string) {
    this.tamanhoSelecionado[produtoId] = tamanho;
  }

    comprarProduto(produto: any) {
    const tamanho = this.tamanhoSelecionado[produto.id];
    let mensagem = `Olá! Tenho interesse em comprar: ${produto.nome} (R$ ${produto.preco}).`;
    if (tamanho) mensagem += ` Tamanho: ${tamanho}.`;
    const url = `https://wa.me/5511987654321?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  }
}