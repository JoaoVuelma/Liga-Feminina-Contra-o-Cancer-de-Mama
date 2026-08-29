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

  async getEventoPorId(id: string) {
    const { data, error } = await this.supabase
      .from('eventos')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

    // ---------- AUTENTICAÇÃO (ADMIN) ----------
  async login(email: string, senha: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password: senha });
    if (error) throw error;
    return data;
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async getUsuarioAtual() {
    const { data } = await this.supabase.auth.getUser();
    return data.user;
  }

    async criarEvento(evento: any) {
    const { data, error } = await this.supabase.from('eventos').insert(evento).select().single();
    if (error) throw error;
    return data;
  }

  async atualizarEvento(id: string, evento: any) {
    const { data, error } = await this.supabase.from('eventos').update(evento).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async excluirEvento(id: string) {
    const { error } = await this.supabase.from('eventos').delete().eq('id', id);
    if (error) throw error;
  }

  // Igual ao getEventos, mas traz todos (inclusive inativos) para o admin
  async getTodosEventosAdmin() {
    const { data, error } = await this.supabase.from('eventos').select('*').order('data', { ascending: true });
    if (error) throw error;
    return data;
  }
}