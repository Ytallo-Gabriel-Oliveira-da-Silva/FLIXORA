import { authEnabled, currentUser, signUp } from '../core/auth.js';
import { toast } from '../core/state.js';
import { go } from '../core/router.js';
import { emptyState } from '../core/ui.js';

export async function RegisterView(){
  if(currentUser()){
    go('/');
    return emptyState('Redirecionando...', 'Você já está conectado.');
  }

  const ready = authEnabled();
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <section class="section auth-page">
      <div class="auth-panel">
        <div class="auth-brand">
          <span>FLIXORA</span>
          <p>Crie sua conta para salvar favoritos, comentários e acessar planos futuros.</p>
        </div>
        <form class="auth-form" id="registerForm">
          <div style="margin-bottom:8px;">
            <label for="emailInput" style="font-weight:600; display:block; margin-bottom:8px;">E-mail</label>
            <input id="emailInput" class="input-improved" type="email" placeholder="seu@email.com" autocomplete="email" required />
          </div>
          <div style="margin-bottom:16px;">
            <label for="passwordInput" style="font-weight:600; display:block; margin-bottom:8px;">Senha</label>
            <input id="passwordInput" class="input-improved" type="password" placeholder="••••••••" autocomplete="new-password" required minlength="6" />
            <p style="margin:6px 0 0; font-size:.85rem; color:var(--text-faint);">Mínimo 6 caracteres</p>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%; margin-bottom:16px;">Criar conta</button>
          <div class="auth-actions" style="flex-direction:column; gap:8px;">
            <a href="#/entrar" style="text-align:center; font-size:.95rem;">Já tem conta? Entre aqui</a>
          </div>
          ${ready ? '' : `
            <div class="auth-note">
              <strong>Firebase não configurado.</strong> Assim que as credenciais do Firebase forem adicionadas, o cadastro estará disponível.
            </div>
          `}
        </form>
      </div>
    </section>
  `;

  const form = wrap.querySelector('#registerForm');
  form.addEventListener('submit', async (event)=>{
    event.preventDefault();
    const email = wrap.querySelector('#emailInput').value.trim();
    const password = wrap.querySelector('#passwordInput').value.trim();
    if(!email || !password){
      toast('Preencha e-mail e senha.');
      return;
    }
    try{
      if(!ready) throw new Error('Autenticação Firebase não configurada.');
      await signUp(email, password);
      toast('Conta criada! Verifique seu e-mail se necessário.');
      go('/conta');
    }catch(err){
      console.error(err);
      toast(err.message || 'Não foi possível criar a conta.');
    }
  });

  return wrap;
}
