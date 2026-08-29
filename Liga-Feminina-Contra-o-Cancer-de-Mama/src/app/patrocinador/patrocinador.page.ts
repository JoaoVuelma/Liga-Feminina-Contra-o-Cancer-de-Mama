import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase';
import { RodapeTabsComponent } from '../components/rodape-tabs/rodape-tabs.component';
import { IonicModule } from '@ionic/angular/lazy';

@Component({
  selector: 'app-patrocinador',
  templateUrl: './patrocinador.page.html',
  styleUrls: ['./patrocinador.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RodapeTabsComponent],
})
export class PatrocinadorPage implements OnInit {
  evento: any = null;
  eventoId: string = '';
  carregando = true;
  enviando = false;
  enviado = false;

  opcoes = [
    { valor: 'financeiro', label: 'Patrocínio financeiro' },
    { valor: 'produtos', label: 'Doação de produtos' },
    { valor: 'divulgacao', label: 'Divulgação / Marketing' },
    { valor: 'servicos', label: 'Serviços / Voluntariado' },
    { valor: 'outro', label: 'Outro' },
  ];

  nome = '';
  telefone = '';
  email = '';
  tipoPatrocinio = '';
  observacoes = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.eventoId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.eventoId) return;

    try {
      this.evento = await this.supabaseService.getEventoPorId(this.eventoId);
    } catch (erro) {
      console.error('Erro ao carregar evento:', erro);
    } finally {
      this.carregando = false;
      this.cdr.detectChanges();
    }
  }
   get formularioValido(): boolean {
    return !!(this.nome && this.telefoneValido && this.emailValido && this.tipoPatrocinio);
  }

  async enviarProposta() {
    if (!this.formularioValido) return;

    this.enviando = true;
    try {
      await this.supabaseService.criarPatrocinador({
        evento_id: this.eventoId,
        nome: this.nome,
        telefone: this.telefone,
        email: this.email,
        tipo_patrocinio: this.tipoPatrocinio,
        observacoes: this.observacoes,
      });
      this.enviado = true;
    } catch (erro) {
      console.error('Erro ao enviar proposta:', erro);
    } finally {
      this.enviando = false;
      this.cdr.detectChanges();
    }
  }

  voltar() {
    this.router.navigate(['/eventos', this.eventoId]);
  }

  irParaEventos() {
    this.router.navigate(['/eventos']);
  }

    formatarTelefone(evento: any) {
    let valor = evento.target.value.replace(/\D/g, '').slice(0, 11);

    if (valor.length > 6) {
      valor = valor.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    } else if (valor.length > 2) {
      valor = valor.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    } else if (valor.length > 0) {
      valor = valor.replace(/(\d{0,2})/, '($1');
    }

    this.telefone = valor.trim().replace(/-$/, '');
  }

  get emailValido(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }

  get telefoneValido(): boolean {
    return this.telefone.replace(/\D/g, '').length === 11;
  }

 
}