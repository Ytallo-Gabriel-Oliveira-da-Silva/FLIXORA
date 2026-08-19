import { tmdb } from '../core/tmdb.js';
import { gridHTML, bindCardEvents, emptyState } from '../core/ui.js';
import { favorites } from '../core/state.js';
import { imgUrl } from '../core/config.js';

export async function GenresView(){
  const [movieGenres, tvGenres] = await Promise.all([tmdb.genres('movie'), tmdb.genres('tv')]);
  const seen = new Set();
  const merged = [...movieGenres, ...tvGenres].filter(g => seen.has(g.id) ? false : (seen.add(g.id), true));

  // Try to fetch a representative poster for each genre (first movie in that genre)
  const genreTiles = await Promise.all(merged.map(async (g) => {
    try{
      const items = await tmdb.byGenre('movie', g.id, 1);
      const poster = items && items[0] ? imgUrl(items[0].poster_path, 'w300') : null;
      return { id: g.id, name: g.name, poster };
    }catch(e){
      return { id: g.id, name: g.name, poster: null };
    }
  }));

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <section class="section" style="padding-top:34px;">
      <h1 class="section__title" style="font-size:1.8rem; margin-bottom:20px;">🎭 Gêneros</h1>
      <div class="genre-grid">
        ${genreTiles.map(g => `
          <a class="genre-tile" href="#/catalogo/movie/genero/${g.id}" style="background-image:${g.poster?`url(${g.poster})`:'none'};">
            <span class="genre-tile__label">${g.name}</span>
          </a>
        `).join('')}
      </div>
    </section>
    <div style="height:40px;"></div>
  `;
  bindCardEvents(wrap); // keep interactions consistent
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
