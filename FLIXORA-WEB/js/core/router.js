// =============================================================
// FLIXORA — Router SPA (hash-based, sem dependências)
// =============================================================
const routes = [];
let notFoundHandler = () => '<div class="empty-state"><h3>Página não encontrada</h3></div>';

export function route(pattern, handler){
  const keys = [];
  const regex = new RegExp('^' + pattern.replace(/:[a-zA-Z]+/g, (m)=>{
    keys.push(m.slice(1)); return '([^/]+)';
  }) + '$');
  routes.push({ regex, keys, handler, pattern });
}

export function notFound(handler){ notFoundHandler = handler; }

async function resolve(){
  const app = document.getElementById('app');
  const hash = location.hash.replace(/^#/, '') || '/';
  const [pathOnly] = hash.split('?');
  const path = pathOnly || '/';

  let matched = null, params = {};
  for(const r of routes){
    const m = path.match(r.regex);
    if(m){
      matched = r;
      r.keys.forEach((k,i)=> params[k] = decodeURIComponent(m[i+1]));
      break;
    }
  }

  window.scrollTo({ top:0, behavior:'instant' in window ? 'instant' : 'auto' });
  highlightNav(path);
  closeMobileNav();

  app.innerHTML = '<div class="page-loader"><div class="spinner"></div></div>';
  try{
    const out = matched ? await matched.handler(params) : await notFoundHandler();
    app.innerHTML = '';
    if(typeof out === 'string') app.innerHTML = out;
    else if(out instanceof Node) app.appendChild(out);
  }catch(err){
    console.error(err);
    app.innerHTML = `<div class="empty-state"><h3>Algo deu errado</h3><p>${err.message || ''}</p></div>`;
  }
  document.dispatchEvent(new CustomEvent('flixora:navigated', { detail:{ path, params } }));
}

function highlightNav(path){
  document.querySelectorAll('.mainnav a[data-route]').forEach(a=>{
    const r = a.getAttribute('data-route');
    const active = r === '/' ? path === '/' : path.startsWith(r);
    a.classList.toggle('active', active);
  });
}

function closeMobileNav(){
  document.getElementById('mainnav')?.classList.remove('open');
  document.getElementById('navToggle')?.setAttribute('aria-expanded','false');
}

export function initRouter(){
  window.addEventListener('hashchange', resolve);
  window.addEventListener('DOMContentLoaded', resolve);
  if(document.readyState !== 'loading') resolve();
}

export function go(path){ location.hash = path; }
