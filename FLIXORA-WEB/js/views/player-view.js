import { tmdb } from '../core/tmdb.js';
import { itemTitle, backdropFor } from '../core/ui.js';
import { FlixoraPlayer } from '../core/player.js';
import { progress } from '../core/state.js';
import { CONFIG } from '../core/config.js';

export async function PlayerView({ kind, id }){
  const item = await tmdb.details(kind, id);
  const title = item ? itemTitle(item) : 'Título';
  const saved = progress.get(kind, id);

  const wrap = document.createElement('div');
  wrap.className = 'player-page';
  wrap.innerHTML = `
    <div class="player-shell-outer" style="position:relative;">
      <div id="playerMount"></div>
      <a class="player-back" href="#/titulo/${kind}/${id}" aria-label="Voltar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>
      <div class="player-info">
        <h2>${title}</h2>
        <span>Player de demonstração</span>
      </div>
      <span class="badge-soon player-badge-demo">Em breve · conteúdo licenciado</span>
    </div>

    <div class="player-below">
      <div class="player-notice">
        <span>🔒</span>
        <div>
          <strong>Os servidores de reprodução estão em desenvolvimento.</strong>
          O FLIXORA já conta com player e interface de streaming, mas o catálogo licenciado ainda será conectado.
          Você pode navegar, montar sua lista e acompanhar os comentários enquanto a plataforma fica pronta.
        </div>
      </div>
      <h1>${title}</h1>
      <p>${item?.overview || ''}</p>
    </div>
  `;

  const player = new FlixoraPlayer(wrap.querySelector('#playerMount'));
  player.mount(CONFIG.DEMO_VIDEO_URL, {
    startAt: saved?.seconds || 0,
    onProgress: (seconds, duration) => {
      if(Math.floor(seconds) % 3 === 0){
        progress.set(kind, id, seconds, duration, { title, poster_path: item?.poster_path });
      }
    }
  });

  return wrap;
}
