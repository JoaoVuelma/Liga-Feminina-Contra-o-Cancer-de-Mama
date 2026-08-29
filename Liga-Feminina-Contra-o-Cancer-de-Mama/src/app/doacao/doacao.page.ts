import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as QRCode from 'qrcode';
import { SupabaseService } from '../services/supabase';
import { IonicModule } from '@ionic/angular/lazy';
import { RodapeTabsComponent } from '../components/rodape-tabs/rodape-tabs.component';

@Component({
  selector: 'app-doacao',
  templateUrl: './doacao.page.html',
  styleUrls: ['./doacao.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RodapeTabsComponent],
})
export class DoacaoPage implements OnInit {
  config: any = null;
  carregando = true;
  valorSelecionado: number | null = null;
  valorOutro: string = '';
  mostrarCampoOutro = false;
  qrCodeUrl: string = '';
  copiado = false;
  cnpj: string = '00.000.000/0001-00';
  valores_sugeridos: number[] = [10, 25, 50];
  texto_impacto_por_valor: { [key: string]: string } = {
    "10": "cobre material educativo para 5 mulheres",
    "25": "cobre uma consulta de acompanhamento",
    "50": "financia uma sessão de apoio psicológico"
  };

  constructor(
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    try {
      this.config = await this.supabaseService.getConfigDoacao();
      if (this.config?.valores_sugeridos?.length) {
        this.valorSelecionado = this.config.valores_sugeridos[0];
      }
      await this.gerarQrCode();
    } catch (erro) {
      console.error('Erro ao carregar config de doação:', erro);
    } finally {
      this.carregando = false;
      this.cdr.detectChanges();
    }
  }

  async gerarQrCode() {
    if (!this.config?.chave_pix) return;
    this.qrCodeUrl = await QRCode.toDataURL(this.config.chave_pix, {
      width: 200,
      margin: 1,
      color: { dark: '#7B1E3D', light: '#FFFFFF' }
    });
    this.cdr.detectChanges();
  }

  selecionarValor(valor: number) {
    this.valorSelecionado = valor;
    this.mostrarCampoOutro = false;
  }

  selecionarOutro() {
    this.mostrarCampoOutro = true;
    this.valorSelecionado = null;
  }

  get valorFinal(): number {
    if (this.mostrarCampoOutro) {
      return parseFloat(this.valorOutro) || 0;
    }
    return this.valorSelecionado || 0;
  }

  get textoImpacto(): string {
    if (!this.config?.texto_impacto_por_valor || !this.valorSelecionado) return '';
    return this.config.texto_impacto_por_valor[String(this.valorSelecionado)] || '';
  }

  async copiarChave() {
    if (!this.config?.chave_pix) return;
    await navigator.clipboard.writeText(this.config.chave_pix);
    this.copiado = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.copiado = false;
      this.cdr.detectChanges();
    }, 2000);
  }
}