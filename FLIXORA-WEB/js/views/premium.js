import { toast } from '../core/state.js';

export async function PremiumView(){
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <section class="section" style="padding-top:50px; text-align:center;">
      <span class="hero__eyebrow">👑 FLIXORA Premium</span>
      <h1 style="font-size:clamp(1.8rem,4vw,2.6rem); margin:14px 0 10px;">Mais universos, uma assinatura.</h1>
      <p style="color:var(--text-dim); max-width:560px; margin:0 auto;">Os planos abaixo estarão disponíveis para contratação assim que o catálogo licenciado for lançado. Cadastre seu interesse e avisamos em primeira mão.</p>

      <div class="plans">
        <div class="plan-card">
          <h3>Básico</h3>
          <div class="price">R$ 19<span>,90/mês</span></div>
          <ul>
            <li>1 tela simultânea</li>
            <li>Qualidade HD</li>
            <li>Catálogo completo</li>
            <li>Com anúncios</li>
          </ul>
          <button class="btn btn-outline" style="width:100%;" data-plan="Básico">Quero ser avisado</button>
        </div>
        <div class="plan-card featured">
          <span class="plan-card__tag">Mais popular</span>
          <h3>Padrão</h3>
          <div class="price">R$ 34<span>,90/mês</span></div>
          <ul>
            <li>2 telas simultâneas</li>
            <li>Qualidade Full HD</li>
            <li>Catálogo completo</li>
            <li>Sem anúncios</li>
            <li>Download offline</li>
          </ul>
          <button class="btn btn-primary" style="width:100%;" data-plan="Padrão">Quero ser avisado</button>
        </div>
        <div class="plan-card">
          <h3>Premium</h3>
          <div class="price">R$ 49<span>,90/mês</span></div>
          <ul>
            <li>4 telas simultâneas</li>
            <li>Qualidade 4K + HDR</li>
            <li>Catálogo completo</li>
            <li>Sem anúncios</li>
            <li>Download offline</li>
            <li>Áudio espacial</li>
          </ul>
          <button class="btn btn-outline" style="width:100%;" data-plan="Premium">Quero ser avisado</button>
        </div>
      </div>
    </section>
    <div style="height:60px;"></div>
  `;

  wrap.querySelectorAll('[data-plan]').forEach(btn => {
    btn.addEventListener('click', () => toast(`Anotado! Avisaremos quando o plano ${btn.dataset.plan} estiver disponível.`));
  });

  return wrap;
}
