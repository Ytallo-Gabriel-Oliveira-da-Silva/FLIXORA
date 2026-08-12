// =============================================================
// FLIXORA — Cliente da API pública TMDB
// https://developer.themoviedb.org/reference/intro/getting-started
// =============================================================
import { CONFIG } from './config.js';
import { DEMO_MOVIES, DEMO_SERIES, DEMO_ALL, DEMO_GENRES, demoDetail } from './mock-data.js';

const cache = new Map();

async function request(path, params={}){
  if(!CONFIG.hasKey){
    throw new DemoModeError('Sem chave TMDB configurada — usando modo demo.');
  }
  const url = new URL(`${CONFIG.TMDB_BASE}${path}`);
  url.searchParams.set('api_key', CONFIG.apiKey);
  url.searchParams.set('language', CONFIG.lang);
  Object.entries(params).forEach(([k,v]) => v !== undefined && url.searchParams.set(k, v));

  const key = url.toString();
  if(cache.has(key)) return cache.get(key);

  const res = await fetch(url.toString());
  if(!res.ok){
    const body = await res.json().catch(()=>({}));
    throw new Error(body.status_message || `Erro TMDB (${res.status})`);
  }
  const data = await res.json();
  cache.set(key, data);
  return data;
}

class DemoModeError extends Error {}

function withType(list, type){
  return list.map(item => ({ ...item, media_type: item.media_type || type }));
}

export const tmdb = {
  isDemo(){ return !CONFIG.hasKey; },

  async trending(kind='all'){
    try{
      const d = await request(`/trending/${kind}/week`);
      return withType(d.results, kind === 'all' ? undefined : kind);
    }catch(e){ return kind === 'tv' ? DEMO_SERIES : DEMO_ALL; }
  },

  async popular(kind='movie'){
    try{
      const d = await request(`/${kind}/popular`);
      return withType(d.results, kind);
    }catch(e){ return kind === 'tv' ? DEMO_SERIES : DEMO_MOVIES; }
  },

  async topRated(kind='movie'){
    try{
      const d = await request(`/${kind}/top_rated`);
      return withType(d.results, kind);
    }catch(e){ return [...(kind === 'tv' ? DEMO_SERIES : DEMO_MOVIES)].reverse(); }
  },

  async nowPlaying(){
    try{
      const d = await request('/movie/now_playing');
      return withType(d.results, 'movie');
    }catch(e){ return DEMO_MOVIES.slice(0,10); }
  },

  async onTheAir(){
    try{
      const d = await request('/tv/on_the_air');
      return withType(d.results, 'tv');
    }catch(e){ return DEMO_SERIES.slice(0,10); }
  },

  async byGenre(kind='movie', genreId, page=1){
    try{
      const d = await request(`/discover/${kind}`, { with_genres: genreId, page, sort_by:'popularity.desc' });
      return withType(d.results, kind);
    }catch(e){
      const pool = kind === 'tv' ? DEMO_SERIES : DEMO_MOVIES;
      return pool.filter(i => i.genre_ids.includes(Number(genreId)));
    }
  },

  async genres(kind='movie'){
    try{
      const d = await request(`/genre/${kind}/list`);
      return d.genres;
    }catch(e){ return DEMO_GENRES; }
  },

  async search(query, page=1){
    if(!query || !query.trim()) return [];
    try{
      const d = await request('/search/multi', { query, page, include_adult:false });
      return d.results.filter(r => r.media_type === 'movie' || r.media_type === 'tv');
    }catch(e){
      const q = query.toLowerCase();
      return DEMO_ALL.filter(i => (i.title||i.name||'').toLowerCase().includes(q));
    }
  },

  async details(kind, id){
    try{
      const d = await request(`/${kind}/${id}`, { append_to_response: 'credits,videos,similar' });
      return { ...d, media_type: kind };
    }catch(e){
      return demoDetail(id) || null;
    }
  },
};
