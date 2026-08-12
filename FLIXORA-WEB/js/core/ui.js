// =============================================================
// FLIXORA — Componentes de UI reutilizáveis
// =============================================================
import { imgUrl } from './config.js';
import { posterPlaceholder } from './poster.js';
import { favorites } from './state.js';

export function itemTitle(item){ return item.title || item.name || 'Sem título'; }
export function itemYear(item){
  const d = item.release_date || item.first_air_date;
  return d ? d.slice(0,4) : '—';
}
export function itemKind(item){ return item.media_type || (item.first_air_date ? 'tv' : 'movie'); }

export function posterFor(item, size='w342'){
  return imgUrl(item.poster_path, size) || posterPlaceholder(itemTitle(item), 'poster');
}
export function backdropFor(item, size='w1280'){
  return imgUrl(item.backdrop_path, size) || imgUrl(item.poster_path, size) || posterPlaceholder(itemTitle(item), 'wide');
}

export function cardHTML(item, { wide=false } = {}){
  const kind = itemKind(item);
  const isFav = favorites.has(kind, item.id);
  const rating = item.vote_average ? item.vote_average.toFixed ? item.vote_average.toFixed(1) : item.vote_average : null;
  return `
  <article class="card ${wide ? 'card--wide' : ''}" data-open="${kind}/${item.id}" tabindex="0" role="button" aria-label="${itemTitle(item)}">
    <div class="card__poster-wrap">
      <img class="card__poster" loading="lazy" src="${wide ? backdropFor(item) : posterFor(item)}" alt="${itemTitle(item)}" />
      ${item._demo ? '<span class="card__badge">DEMO</span>' : ''}
      <button class="card__fav ${isFav ? 'active' : ''}" data-fav="${kind}/${item.id}" aria-label="Favoritar">${isFav ? '♥' : '♡'}</button>
      <div class="card__play">
        <svg width="46" height="46" viewBox="0 0 24 24" fill="rgba(245,245,245,.95)"><circle cx="12" cy="12" r="11" fill="rgba(124,58,237,.85)"/><path d="M10 8l6 4-6 4z" fill="#fff"/></svg>
      </div>
    </div>
    <div class="card__body">
      <p class="card__title">${itemTitle(item)}</p>
      <p class="card__sub">${itemYear(item)} ${rating ? `<span class="dot"></span><span class="card__rating">★ ${rating}</span>` : ''}</p>
    </div>
  </article>`;
}

export function railHTML(title, items, { link=null, wide=false, icon='' } = {}){
  if(!items || !items.length) return '';
  return `
  <section class="section">
    <div class="section__head">
      <h2 class="section__title">${icon} ${title}</h2>
      ${link ? `<a class="section__link" href="#${link}">Ver tudo →</a>` : ''}
    </div>
    <div class="rail">
      ${items.map(i => cardHTML(i, { wide })).join('')}
    </div>
  </section>`;
}

export function gridHTML(items){
  if(!items || !items.length){
    return emptyState('Nenhum título encontrado', 'Tente outro filtro, gênero ou termo de busca.');
  }
  return `<div class="grid">${items.map(i => cardHTML(i)).join('')}</div>`;
}

export function emptyState(title, text, icon='🎬'){
  return `
  <div class="empty-state">
    <div style="font-size:3rem;">${icon}</div>
    <h3>${title}</h3>
    <p>${text}</p>
  </div>`;
}

// Delega cliques de card/favorito para qualquer container renderizado
export function bindCardEvents(container, { onOpen } = {}){
  container.addEventListener('click', (e)=>{
    const favBtn = e.target.closest('[data-fav]');
    if(favBtn){
      e.stopPropagation();
      const [kind, id] = favBtn.dataset.fav.split('/');
      const item = { id, media_type:kind, title:favBtn.closest('.card')?.querySelector('.card__title')?.textContent, poster_path:null, vote_average:null };
      const nowFav = favorites.toggle(item);
      favBtn.classList.toggle('active', nowFav);
      favBtn.textContent = nowFav ? '♥' : '♡';
      return;
    }
    const card = e.target.closest('[data-open]');
    if(card){
      const [kind, id] = card.dataset.open.split('/');
      onOpen ? onOpen(kind, id) : (location.hash = `/titulo/${kind}/${id}`);
    }
  });
  container.addEventListener('keydown', (e)=>{
    if(e.key !== 'Enter') return;
    const card = e.target.closest('[data-open]');
    if(card){ const [kind,id] = card.dataset.open.split('/'); location.hash = `/titulo/${kind}/${id}`; }
  });
}
