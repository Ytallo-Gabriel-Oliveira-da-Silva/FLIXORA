import { authEnabled, currentUser, signIn } from '../core/auth.js';
import { toast } from '../core/state.js';
import { go } from '../core/router.js';
import { emptyState } from '../core/ui.js';

export async function LoginView(){
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
          <p>Entre com sua conta para acessar seu catálogo, listas e planos exclusivos.</p>
        </div>
        <form class="auth-form" id="loginForm">
          <div style="margin-bottom:8px;">
            <label for="emailInput" style="font-weight:600; display:block; margin-bottom:8px;">E-mail</label>
            <input id="emailInput" class="input-improved" type="email" placeholder="seu@email.com" autocomplete="email" required />
          </div>
          <div style="margin-bottom:16px;">
            <label for="passwordInput" style="font-weight:600; display:block; margin-bottom:8px;">Senha</label>
            <input id="passwordInput" class="input-improved" type="password" placeholder="••••••••" autocomplete="current-password" required minlength="6" />
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%; margin-bottom:16px;">Entrar</button>
          <div class="auth-actions" style="flex-direction:column; gap:8px;">
            <a href="#/criar-conta" style="text-align:center; font-size:.95rem;">Não tem conta? Criar conta</a>
            <a href="#/recuperar-senha" style="text-align:center; font-size:.95rem;">Esqueceu a senha?</a>
          </div>
          ${ready ? '' : `
            <div class="auth-note">
              <strong>Firebase não configurado.</strong> O login funcionará assim que as credenciais do Firebase forem adicionadas em <code>js/core/config.js</code>.
            </div>
          `}
        </form>
        <div class="auth-illustration">
          <h2>Conecte-se com segurança</h2>
          <p>O FLIXORA está pronto para autenticação por e-mail e senha com Firebase Auth. Cada usuário mantém sua lista, comentários e preferências.</p>
        </div>
      </div>
    </section>
  `;

  const form = wrap.querySelector('#loginForm');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = wrap.querySelector('#emailInput').value.trim();
    const password = wrap.querySelector('#passwordInput').value.trim();
    if(!email || !password){
      toast('Preencha e-mail e senha.');
      return;
    }
    try{
      if(!ready) throw new Error('Autenticação Firebase não configurada.');
      await signIn(email, password);
      toast('Autenticado com sucesso!');
      go('/conta');
    }catch(err){
      console.error(err);
      toast(err.message || 'Não foi possível entrar.');
    }
  });

  return wrap;
}
