import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase';
import { IonicModule } from '@ionic/angular/lazy';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.page.html',
  styleUrls: ['./admin-login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class AdminLoginPage {
  email = '';
  senha = '';
  erro = '';
  entrando = false;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async entrar() {
    this.erro = '';
    this.entrando = true;
    try {
      await this.supabaseService.login(this.email, this.senha);
      this.router.navigate(['/admin']);
    } catch (erro: any) {
      this.erro = 'E-mail ou senha inválidos.';
    } finally {
      this.entrando = false;
      this.cdr.detectChanges();
    }
  }

  voltar() {
    this.router.navigate(['/home']);
  }
}