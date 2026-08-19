// =============================================================
// FLIXORA — Configuração global
// =============================================================
// O catálogo de metadados/capas usa a API pública do TMDB
// (The Movie Database). É gratuita para uso não comercial /
// pré-lançamento, mediante uma chave própria e gratuita:
// https://www.themoviedb.org/settings/api
//
// A chave NUNCA é embutida no código — cada instalação usa a sua,
// guardada apenas no navegador do usuário (localStorage).
// Sem chave configurada, o app funciona em MODO DEMO com dados
// de exemplo gerados localmente, para que toda a interface e o
// player continuem 100% navegáveis e testáveis.
// =============================================================

const STORAGE_KEY = 'flixora_tmdb_key';
const LANG_KEY = 'flixora_lang';
const DEFAULT_TMDB_KEY = '49484566da8b7edefd7d6d403413cfd1';
const DEFAULT_TMDB_READ_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTQ4NDU2NmRhOGI3ZWRlZmQ3ZDZkNDAzNDEzY2ZkMSIsIm5iZiI6MTc1MTY2MjEzMC40ODE5OTk5LCJzdWIiOiI2ODY4M2UzMjI5MTMwNzY1NjM3MDIwN2EiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.EUz_gu3GAOQBYAJjpkGCp22mBgZ6ts_1WlpKTqsGkEI';

export const CONFIG = {
  APP_NAME: 'FLIXORA',
  TMDB_BASE: 'https://api.themoviedb.org/3',
  TMDB_IMG: 'https://image.tmdb.org/t/p',
  // placeholder de vídeo público/licença Creative Commons usado
  // apenas como DEMONSTRAÇÃO do player enquanto não há conteúdo
  // licenciado. Trocar por URLs licenciadas reais no futuro.
  DEMO_VIDEO_URL: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  DEMO_VIDEO_POSTER: null,

  get apiKey(){ return localStorage.getItem(STORAGE_KEY) || DEFAULT_TMDB_KEY; },
  set apiKey(v){
    if(v) localStorage.setItem(STORAGE_KEY, v.trim());
    else localStorage.removeItem(STORAGE_KEY);
  },
  get hasKey(){ return !!(this.apiKey || this.TMDB_READ_ACCESS_TOKEN); },

  get lang(){ return localStorage.getItem(LANG_KEY) || 'pt-BR'; },
  set lang(v){ localStorage.setItem(LANG_KEY, v); }
};

export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDznTPRHUW3qYItsHVj_5wVYuVrdoUicS4',
  authDomain: 'flixora-213f3.firebaseapp.com',
  projectId: 'flixora-213f3',
  storageBucket: 'flixora-213f3.firebasestorage.app',
  messagingSenderId: '892697191969',
  appId: '1:892697191969:web:51377bcbbb6566a324e560',
  measurementId: 'G-FZKS66QFR0',
  TMDB_READ_ACCESS_TOKEN: DEFAULT_TMDB_READ_TOKEN,
};

export function imgUrl(path, size='w500'){
  if(!path) return null;
  return `${CONFIG.TMDB_IMG}/${size}${path}`;
}
