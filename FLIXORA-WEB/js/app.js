import { route, notFound, initRouter } from './core/router.js';
import { tmdb } from './core/tmdb.js';
import { posterFor, itemTitle, itemYear, itemKind, bindCardEvents, emptyState } from './core/ui.js';

import { HomeView } from './views/home.js';
import { CatalogView } from './views/catalog.js';
import { GenresView, GenreDetailView, TrendingView, FavoritesView } from './views/lists.js';
import { DetailView } from './views/detail.js';
import { PlayerView } from './views/player-view.js';
import { PremiumView } from './views/premium.js';
import { AboutView } from './views/about.js';

// ---------- Rotas ----------
route('/', HomeView);
route('/catalogo/:kind', CatalogView);
route('/catalogo/:kind/genero/:id', GenreDetailView);
route('/generos', GenresView);
route('/em-alta', TrendingView);
route('/favoritos', FavoritesView);
route('/titulo/:kind/:id', DetailView);
route('/assistir/:kind/:id', PlayerView);
route('/premium', PremiumView);
route('/sobre', AboutView);
notFound(() => emptyState('Página não encontrada', 'Verifique o endereço ou volte para o início.', '🧭'));

initRouter();

// ---------- Menu mobile ----------
const navToggle = document.getElementById('navToggle');
const mainnav = document.getElementById('mainnav');
navToggle.addEventListener('click', () => {
  const open = mainnav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

// ---------- Busca ----------
const searchToggle = document.getElementById('searchToggle');
const searchbar = document.getElementById('searchbar');
const searchInput = document.getElementById('searchInput');
const searchClose = document.getElementById('searchClose');
const searchResults = document.getElementById('searchResults');

function openSearch(){
  searchbar.hidden = false;
  searchToggle.setAttribute('aria-expanded','true');
  setTimeout(()=> searchInput.focus(), 50);
}
function closeSearch(){
  searchbar.hidden = true;
  searchToggle.setAttribute('aria-expanded','false');
  searchInput.value = '';
  searchResults.innerHTML = '';
}
searchToggle.addEventListener('click', () => searchbar.hidden ? openSearch() : closeSearch());
searchClose.addEventListener('click', closeSearch);
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') closeSearch();
  if((e.ctrlKey || e.metaKey) && e.key === 'k'){ e.preventDefault(); openSearch(); }
});

let searchTimer = null;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  const q = searchInput.value.trim();
  if(!q){ searchResults.innerHTML = ''; return; }
  searchTimer = setTimeout(async () => {
    const results = await tmdb.search(q);
    if(!results.length){
      searchResults.innerHTML = `<p style="color:var(--text-faint); grid-column:1/-1;">Nenhum resultado para "${q}".</p>`;
      return;
    }
    searchResults.innerHTML = results.slice(0, 12).map(item => `
      <article class="card" data-open="${itemKind(item)}/${item.id}" tabindex="0">
        <div class="card__poster-wrap">
          <img class="card__poster" loading="lazy" src="${posterFor(item)}" alt="${itemTitle(item)}" />
        </div>
        <div class="card__body">
          <p class="card__title">${itemTitle(item)}</p>
          <p class="card__sub">${itemYear(item)} · ${itemKind(item) === 'tv' ? 'Série' : 'Filme'}</p>
        </div>
      </article>
    `).join('');
  }, 350);
});
bindCardEvents(searchResults, {
  onOpen: (kind, id) => { closeSearch(); location.hash = `/titulo/${kind}/${id}`; }
});

// Fecha o menu mobile ao navegar
document.addEventListener('flixora:navigated', () => {
  mainnav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
});
