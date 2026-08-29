import { inject, NgModule } from '@angular/core';
import { CanActivateFn, PreloadAllModules, Router, RouterModule, Routes } from '@angular/router';
import { RodapeTabsComponent } from './components/rodape-tabs/rodape-tabs.component';
import { SupabaseService } from './services/supabase';

const somenteAdminGuard: CanActivateFn = async () => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);
  const usuario = await supabaseService.getUsuarioAtual();
  if (!usuario) {
    router.navigate(['/admin-login']);
    return false;
  }
  return true;
};

const routes: Routes = [
 
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

   {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: 'doacao',
    loadComponent: () => import('./doacao/doacao.page').then(m => m.DoacaoPage)
  },
  {
    path: 'loja',
    loadComponent: () => import('./loja/loja.page').then(m => m.LojaPage)
  },
    {
    path: 'eventos',
    loadComponent: () => import('./eventos/eventos.page').then(m => m.EventosPage)
  },
  {
    path: 'eventos/:id',
    loadComponent: () => import('./evento-detalhe/evento-detalhe.page').then(m => m.EventoDetalhePage)
  },
  {
    path: 'eventos/:id/patrocinador',
    loadComponent: () => import('./patrocinador/patrocinador.page').then(m => m.PatrocinadorPage)
  },
  {
    path: 'admin-login',
    loadComponent: () => import('./admin-login/admin-login.page').then(m => m.AdminLoginPage)
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.page').then(m => m.AdminPage),
    canActivate: [somenteAdminGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }