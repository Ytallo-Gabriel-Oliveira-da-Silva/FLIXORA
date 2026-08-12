import { tmdb } from '../core/tmdb.js';
import { gridHTML, bindCardEvents, emptyState } from '../core/ui.js';
import { favorites } from '../core/state.js';

export async function GenresView(){
  const [movieGenres, tvGenres] = await Promise.all([tmdb.genres('movie'), tmdb.genres('tv')]);
  const seen = new Set();
  const merged = [...movieGenres, ...tvGenres].filter(g => seen.has(g.id) ? false : (seen.add(g.id), true));
  const emojis = ['🎬','🚀','⚔️','😂','🕵️','🎓','💔','🐉','👻','💘','🛸','🔪','🎭','👨‍👩‍👧','🎪'];

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <section class="section" style="padding-top:34px;">
      <h1 class="section__title" style="font-size:1.8rem; margin-bottom:20px;">🎭 Gêneros</h1>
      <div class="genre-grid">
        ${merged.map((g,i) => `
          <a class="genre-tile" href="#/catalogo/movie/genero/${g.id}">${emojis[i % emojis.length]}&nbsp; ${g.name}</a>
        `).join('')}
      </div>
    </section>
    <div style="height:40px;"></div>
  `;
  return wrap;
}

export async function GenreDetailView({ kind, id }){
  const [genres, items] = await Promise.all([tmdb.genres(kind), tmdb.byGenre(kind, id)]);
  const genre = genres.find(g => String(g.id) === String(id));
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <section class="section" style="padding-top:34px;">
      <h1 class="section__title" style="font-size:1.8rem; margin-bottom:20px;">${genre ? genre.name : 'Gênero'}</h1>
      ${gridHTML(items)}
    </section>
    <div style="height:40px;"></div>
  `;
  bindCardEvents(wrap);
  return wrap;
}

export async function TrendingView(){
  const [day, week] = await Promise.all([tmdb.trending('all'), tmdb.trending('all')]);
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <section class="section" style="padding-top:34px;">
      <h1 class="section__title" style="font-size:1.8rem; margin-bottom:20px;">🔥 Em alta</h1>
      ${gridHTML(week)}
    </section>
    <div style="height:40px;"></div>
  `;
  bindCardEvents(wrap);
  return wrap;
}

export async function FavoritesView(){
  const items = favorites.all().map(f => ({ ...f, media_type:f.media_type }));
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <section class="section" style="padding-top:34px;">
      <h1 class="section__title" style="font-size:1.8rem; margin-bottom:20px;">⭐ Meus favoritos</h1>
      ${items.length ? gridHTML(items) : emptyState('Sua lista está vazia', 'Toque no ♡ em qualquer título para adicioná-lo aos seus favoritos.', '⭐')}
    </section>
    <div style="height:40px;"></div>
  `;
  bindCardEvents(wrap);
  return wrap;
}
