import { CONFIG } from '../core/config.js';
import { toast } from '../core/state.js';

export async function AboutView(){
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <section class="section" style="padding-top:44px; max-width:760px;">
      <h1 class="section__title" style="font-size:1.8rem; margin-bottom:16px;">Sobre a plataforma</h1>
      <p style="color:var(--text-dim); line-height:1.7; margin-bottom:26px;">
        A FLIXORA está em fase de pré-lançamento. O visual, a navegação, as páginas de detalhe e o
        player de vídeo já estão prontos e funcionais. O conteúdo licenciado (filmes e séries reais)
        será ativado assim que os acordos com distribuidoras forem fechados.
      </p>
      <p style="color:var(--text-dim); line-height:1.7; margin-bottom:26px;">
        Enquanto isso, o catálogo de capas, sinopses e informações pode ser carregado a partir de uma
        fonte pública e de uso permitido — o <strong>TMDB (The Movie Database)</strong>. Cadastre-se
        gratuitamente em
        <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener" style="color:var(--purple-light);">themoviedb.org/settings/api</a>
        para gerar sua própria chave e cole-a abaixo — ela fica salva apenas neste navegador.
      </p>

      <div style="background:var(--card); border:1px solid var(--line); border-radius:var(--radius-md); padding:24px;">
        <label for="apiKeyInput" style="display:block; font-weight:700; margin-bottom:10px;">Chave da API TMDB</label>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <input id="apiKeyInput" type="text" placeholder="Cole sua chave aqui"
            value="${CONFIG.apiKey}"
            style="flex:1; min-width:220px; background:var(--bg-elevated); border:1px solid var(--line); color:var(--text); padding:12px 14px; border-radius:var(--radius-sm);" />
          <button class="btn btn-primary" id="saveKeyBtn">Salvar</button>
          ${CONFIG.hasKey ? '<button class="btn btn-outline" id="clearKeyBtn">Remover</button>' : ''}
        </div>
        <p style="color:var(--text-faint); font-size:.8rem; margin-top:12px;">
          Status atual: <strong style="color:${CONFIG.hasKey ? 'var(--purple-light)' : 'var(--gold)'}">${CONFIG.hasKey ? 'Chave configurada — catálogo real ativo' : 'Modo demonstração'}</strong>
        </p>
      </div>

      <h2 style="margin-top:40px; font-size:1.2rem;">Multi-plataforma</h2>
      <p style="color:var(--text-dim); line-height:1.7;">
        Esta versão web foi construída em HTML, CSS e JavaScript puros — sem dependência de build —
        para que possa ser publicada em qualquer hospedagem estática hoje mesmo. A mesma base visual e
        de API pode alimentar os apps de Android, iOS e TV (ex.: envolvendo esta interface com Capacitor,
        ou reconstruindo as telas nativamente e reutilizando o mesmo backend de catálogo/licenciamento).
      </p>
    </section>
    <div style="height:50px;"></div>
  `;

  wrap.querySelector('#saveKeyBtn').addEventListener('click', ()=>{
    const val = wrap.querySelector('#apiKeyInput').value.trim();
    CONFIG.apiKey = val;
    toast(val ? 'Chave salva! Recarregando catálogo...' : 'Chave removida.');
    setTimeout(()=> location.reload(), 900);
  });
  wrap.querySelector('#clearKeyBtn')?.addEventListener('click', ()=>{
    CONFIG.apiKey = '';
    toast('Chave removida. Voltando ao modo demonstração...');
    setTimeout(()=> location.reload(), 900);
  });

  return wrap;
}
