import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // ---------- PRODUTOS (Loja) ----------
  async getProdutos() {
    const { data, error } = await this.supabase
      .from('produtos')
      .select('*')
      .eq('ativo', true);
    if (error) throw error;
    return data;
  }

  // ---------- EVENTOS ----------
  async getEventos() {
    const { data, error } = await this.supabase
      .from('eventos')
      .select('*')
      .eq('ativo', true)
      .order('data', { ascending: true });
    if (error) throw error;
    return data;
  }

  // ---------- PATROCINADORES ----------
  async criarPatrocinador(patrocinador: {
    evento_id: string;
    nome: string;
    telefone: string;
    email: string;
    tipo_patrocinio: string;
    observacoes?: string;
  }) {
    const { data, error } = await this.supabase
      .from('patrocinadores')
      .insert(patrocinador);
    if (error) throw error;
    return data;
  }

  // ---------- ESTATÍSTICAS ----------
  async getEstatisticas() {
    const { data, error } = await this.supabase
      .from('estatisticas')
      .select('*')
      .limit(1)
      .single();
    if (error) throw error;
    return data;
  }

  // ---------- CONFIG DOAÇÃO ----------
  async getConfigDoacao() {
    const { data, error } = await this.supabase
      .from('config_doacao')
      .select('*')
      .limit(1)
      .single();
    if (error) throw error;
    return data;
  }

  // ---------- REALTIME: escuta mudanças em uma tabela ----------
  escutarTabela(tabela: string, callback: (payload: any) => void) {
    return this.supabase
      .channel(`realtime:${tabela}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: tabela }, callback)
      .subscribe();
  }
}