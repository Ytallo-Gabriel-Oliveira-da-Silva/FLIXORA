import { tmdb } from '../core/tmdb.js';
import { itemTitle, backdropFor, posterFor, railHTML, bindCardEvents, emptyState } from '../core/ui.js';
import { favorites, toast } from '../core/state.js';
import { imgUrl } from '../core/config.js';
import { posterPlaceholder } from '../core/poster.js';

export async function DetailView({ kind, id }){
  const item = await tmdb.details(kind, id);
  if(!item) return emptyState('Título não encontrado', 'Ele pode ter sido removido ou o link está incorreto.');

  const title = itemTitle(item);
  const year = (item.release_date || item.first_air_date || '').slice(0,4);
  const runtime = item.runtime ? `${Math.floor(item.runtime/60)}h ${item.runtime%60}min` : (item.number_of_seasons ? `${item.number_of_seasons} temporada${item.number_of_seasons>1?'s':''}` : '');
  const isFav = favorites.has(kind, item.id);
  const cast = item.credits?.cast?.slice(0, 10) || [];
  const similar = item.similar?.results?.slice(0, 12) || [];

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <section class="detail-hero">
      <div class="detail-hero__bg" style="background-image:url('${backdropFor(item,'original')}');"></div>
    </section>
    <div class="detail-wrap">
      <img class="detail-poster" src="${posterFor(item,'w500')}" alt="${title}" />
      <div>
        ${item._demo ? '<span class="badge-soon" style="margin-bottom:12px; display:inline-block;">Conteúdo demo</span>' : ''}
        <h1 class="detail-title">${title}</h1>
        <div class="detail-meta">
          <span>${year || '—'}</span><span class="dot"></span>
          <span>${kind === 'tv' ? 'Série' : 'Filme'}</span>
          ${runtime ? `<span class="dot"></span><span>${runtime}</span>` : ''}
          <span class="dot"></span><span>★ ${item.vote_average ? Number(item.vote_average).toFixed(1) : '—'}</span>
        </div>
        <div class="detail-genres">
          ${(item.genres||[]).map(g => `<span class="genre-pill">${g.name}</span>`).join('')}
        </div>
        <p class="detail-overview">${item.overview || 'Sinopse não disponível.'}</p>
        <div class="detail-actions">
          <a class="btn btn-primary" href="#/assistir/${kind}/${item.id}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Assistir agora
          </a>
          <button class="btn btn-ghost" id="favBtn">${isFav ? '♥ Nos favoritos' : '♡ Adicionar aos favoritos'}</button>
          <button class="btn btn-outline" id="shareBtn">🔗 Compartilhar</button>
        </div>
        <div class="detail-extra">
          <div><h5>Status</h5><p>${statusLabel(item.status)}</p></div>
          <div><h5>Idioma original</h5><p>${(item.original_language || 'pt').toUpperCase()}</p></div>
          <div><h5>Popularidade</h5><p>${item.popularity ? Math.round(item.popularity) : '—'}</p></div>
          <div><h5>Avaliações</h5><p>${item.vote_count ?? '—'} votos</p></div>
        </div>
      </div>
    </div>

    ${cast.length ? `
    <section class="section">
      <div class="section__head"><h2 class="section__title">Elenco</h2></div>
      <div class="cast-rail">
        ${cast.map(c => `
          <div class="cast-card">
            <img src="${imgUrl(c.profile_path,'w200') || posterPlaceholder(c.name)}" alt="${c.name}" />
            <p>${c.name}</p><span>${c.character || ''}</span>
          </div>
        `).join('')}
      </div>
    </section>` : ''}

    ${railHTML('Você também pode gostar', similar, { icon:'✨' })}
    <div style="height:50px;"></div>
  `;

  bindCardEvents(wrap);

  wrap.querySelector('#favBtn').addEventListener('click', (e)=>{
    const nowFav = favorites.toggle({ ...item, media_type:kind });
    e.target.innerHTML = nowFav ? '♥ Nos favoritos' : '♡ Adicionar aos favoritos';
    toast(nowFav ? 'Adicionado aos favoritos' : 'Removido dos favoritos');
  });
  wrap.querySelector('#shareBtn').addEventListener('click', async ()=>{
    const url = location.href;
    try{ await navigator.clipboard.writeText(url); toast('Link copiado!'); }
    catch(e){ toast(url); }
  });

  return wrap;
}

function statusLabel(status){
  const map = { 'Released':'Lançado', 'Ended':'Finalizada', 'Returning Series':'Em exibição', 'In Production':'Em produção', 'Post Production':'Pós-produção', 'Planned':'Planejado' };
  return map[status] || status || 'Pré-lançamento';
}
