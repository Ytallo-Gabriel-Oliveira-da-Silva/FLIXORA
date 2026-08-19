import { authEnabled, sendPasswordReset } from '../core/auth.js';
import { toast } from '../core/state.js';
import { go } from '../core/router.js';

export async function ResetPasswordView(){
  const ready = authEnabled();
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <section class="section auth-page">
      <div class="auth-panel">
        <div class="auth-brand">
          <span>FLIXORA</span>
          <p>Informe seu e-mail para receber as instruções de redefinição de senha.</p>
        </div>
        <form class="auth-form" id="resetForm">
          <div style="margin-bottom:16px;">
            <label for="emailInput" style="font-weight:600; display:block; margin-bottom:8px;">E-mail</label>
            <input id="emailInput" class="input-improved" type="email" placeholder="seu@email.com" autocomplete="email" required />
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%; margin-bottom:16px;">Enviar instruções</button>
          <div class="auth-actions" style="flex-direction:column; gap:8px;">
            <a href="#/entrar" style="text-align:center; font-size:.95rem;">Voltar ao login</a>
          </div>
          ${ready ? '' : `
            <div class="auth-note">
              <strong>Firebase não configurado.</strong> A redefinição de senha será habilitada após inserir as credenciais do Firebase em <code>js/core/config.js</code>.
            </div>
          `}
        </form>
      </div>
    </section>
  `;

  wrap.querySelector('#resetForm').addEventListener('submit', async (event)=>{
    event.preventDefault();
    const email = wrap.querySelector('#emailInput').value.trim();
    if(!email){
      toast('Digite um e-mail válido.');
      return;
    }
    try{
      if(!ready) throw new Error('Autenticação Firebase não configurada.');
      await sendPasswordReset(email);
      toast('E-mail de redefinição enviado.');
      go('/entrar');
    }catch(err){
      console.error(err);
      toast(err.message || 'Não foi possível enviar o e-mail.');
    }
  });

  return wrap;
}
