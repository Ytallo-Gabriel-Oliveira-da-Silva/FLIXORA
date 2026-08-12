// =============================================================
// FLIXORA — Catálogo de demonstração (MODO DEMO)
// =============================================================
// Usado apenas quando nenhuma chave TMDB está configurada, para
// que a navegação, os cards, a página de detalhes e o player
// continuem 100% funcionais durante testes e apresentações.
// Nenhuma imagem externa é referenciada aqui — as capas são
// geradas localmente em SVG (ver poster.js) para não citar
// nenhuma fonte de dado como se fosse real.
// =============================================================

const GENRES = [
  { id: 28, name: 'Ação' }, { id: 12, name: 'Aventura' }, { id: 16, name: 'Animação' },
  { id: 35, name: 'Comédia' }, { id: 80, name: 'Crime' }, { id: 99, name: 'Documentário' },
  { id: 18, name: 'Drama' }, { id: 14, name: 'Fantasia' }, { id: 27, name: 'Terror' },
  { id: 10749, name: 'Romance' }, { id: 878, name: 'Ficção científica' }, { id: 53, name: 'Suspense' }
];

function title(i, kind){
  const words = ['Éter','Vórtice','Nébula','Fronteira','Sombra','Aurora','Cinzas','Zênite','Deriva','Miragem','Colapso','Horizonte','Espectro','Vertigem','Labirinto','Eclipse'];
  return `${words[i % words.length]}${kind === 'tv' ? ' — Temporada' : ''}`;
}

function makeItem(i, kind){
  const g = [GENRES[i % GENRES.length].id, GENRES[(i+3) % GENRES.length].id];
  const year = 2019 + (i % 7);
  return {
    id: (kind === 'tv' ? 5000 : 1000) + i,
    media_type: kind,
    title: kind === 'tv' ? undefined : title(i, kind),
    name: kind === 'tv' ? title(i, kind) : undefined,
    overview: 'Sinopse de demonstração. Este título é um espaço reservado do catálogo FLIXORA — os metadados reais (sinopse, elenco, capas) serão carregados automaticamente do TMDB assim que uma chave de API for configurada, e o conteúdo licenciado será liberado após acordos com distribuidoras.',
    poster_path: null,
    backdrop_path: null,
    vote_average: (6 + (i % 4) + Math.random()).toFixed(1) * 1,
    release_date: `${year}-0${(i % 9)+1}-1${i%2}`,
    first_air_date: `${year}-0${(i % 9)+1}-1${i%2}`,
    genre_ids: g,
    runtime: 90 + (i % 6) * 12,
    number_of_seasons: (i % 5) + 1,
    _demo: true
  };
}

export const DEMO_GENRES = GENRES;
export const DEMO_MOVIES = Array.from({length:20}, (_,i)=>makeItem(i,'movie'));
export const DEMO_SERIES = Array.from({length:20}, (_,i)=>makeItem(i,'tv'));
export const DEMO_ALL = [...DEMO_MOVIES, ...DEMO_SERIES];

export function demoDetail(id){
  const item = DEMO_ALL.find(x => String(x.id) === String(id));
  if(!item) return null;
  return {
    ...item,
    genres: item.genre_ids.map(gid => GENRES.find(g=>g.id===gid)).filter(Boolean),
    credits: {
      cast: Array.from({length:8},(_,i)=>({ id:i, name:`Interpretação ${i+1}`, character:`Personagem ${i+1}`, profile_path:null }))
    },
    videos: { results: [] }
  };
}
