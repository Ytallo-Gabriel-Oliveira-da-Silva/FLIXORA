// =============================================================
// FLIXORA — Estado local (favoritos / continuar assistindo)
// =============================================================
const FAV_KEY = 'flixora_favorites';
const PROGRESS_KEY = 'flixora_progress';

function read(key){
  try{ return JSON.parse(localStorage.getItem(key)) || {}; }
  catch(e){ return {}; }
}
function write(key, obj){ localStorage.setItem(key, JSON.stringify(obj)); }

export const favorites = {
  all(){ return Object.values(read(FAV_KEY)); },
  has(kind, id){ return !!read(FAV_KEY)[`${kind}_${id}`]; },
  toggle(item){
    const all = read(FAV_KEY);
    const k = `${item.media_type}_${item.id}`;
    if(all[k]) delete all[k];
    else all[k] = { id:item.id, media_type:item.media_type, title:item.title || item.name, poster_path:item.poster_path, vote_average:item.vote_average, addedAt: Date.now() };
    write(FAV_KEY, all);
    return !!all[k];
  }
};

export const progress = {
  all(){ return read(PROGRESS_KEY); },
  get(kind, id){ return read(PROGRESS_KEY)[`${kind}_${id}`]; },
  set(kind, id, seconds, duration, meta={}){
    const all = read(PROGRESS_KEY);
    all[`${kind}_${id}`] = { seconds, duration, updatedAt: Date.now(), ...meta };
    write(PROGRESS_KEY, all);
  }
};

export function toast(msg, ms=2600){
  const el = document.getElementById('toast');
  if(!el) return;
  el.textContent = msg;
  el.hidden = false;
  requestAnimationFrame(()=> el.classList.add('show'));
  clearTimeout(toast._t);
  toast._t = setTimeout(()=>{
    el.classList.remove('show');
    setTimeout(()=> el.hidden = true, 300);
  }, ms);
}
