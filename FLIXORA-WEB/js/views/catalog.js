import { tmdb } from '../core/tmdb.js';
import { gridHTML, bindCardEvents } from '../core/ui.js';

export async function CatalogView({ kind = 'movie' }){
  const genres = await tmdb.genres(kind);
  const [popular, topRated] = await Promise.all([tmdb.popular(kind), tmdb.topRated(kind)]);

  const wrap = document.createElement('div');
  const label = kind === 'tv' ? 'Séries' : 'Filmes';

  wrap.innerHTML = `
    <section class="section" style="padding-top:34px;">
      <div class="section__head">
        <h1 class="section__title" style="font-size:1.8rem;">${kind === 'tv' ? '📺' : '🎬'} ${label}</h1>
      </div>
      <div class="filterbar" id="genreFilter">
        <button class="chip active" data-genre="">Todos</button>
        ${genres.map(g => `<button class="chip" data-genre="${g.id}">${g.name}</button>`).join('')}
        <select class="chip" id="sortSelect" aria-label="Ordenar">
          <option value="popular">Mais populares</option>
          <option value="top">Mais bem avaliados</option>
        </select>
      </div>
      <div id="catalogGrid">${gridHTML(popular)}</div>
    </section>
    <div style="height:40px;"></div>
  `;

  bindCardEvents(wrap);

  const gridEl = wrap.querySelector('#catalogGrid');
  const sortEl = wrap.querySelector('#sortSelect');
  let activeGenre = '';

  async function refresh(){
    gridEl.innerHTML = '<div class="page-loader"><div class="spinner"></div></div>';
    let items;
    if(activeGenre){
      items = await tmdb.byGenre(kind, activeGenre);
    } else {
      items = sortEl.value === 'top' ? topRated : popular;
    }
    gridEl.innerHTML = gridHTML(items);
  }

  wrap.querySelector('#genreFilter').addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-genre]');
    if(!btn) return;
    wrap.querySelectorAll('.chip[data-genre]').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    activeGenre = btn.dataset.genre;
    refresh();
  });
  sortEl.addEventListener('change', refresh);

  return wrap;
}
