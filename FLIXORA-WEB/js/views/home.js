import { tmdb } from '../core/tmdb.js';
import { itemTitle, itemYear, itemKind, backdropFor, railHTML, bindCardEvents } from '../core/ui.js';
import { favorites } from '../core/state.js';

let heroTimer = null;

export async function HomeView(){
  const [trending, popularMovies, popularSeries, topRated, nowPlaying] = await Promise.all([
    tmdb.trending('all'),
    tmdb.popular('movie'),
    tmdb.popular('tv'),
    tmdb.topRated('movie'),
    tmdb.nowPlaying(),
  ]);

  const heroItems = trending.slice(0, 5);
  const continueList = favorites.all().slice(0,10);
  const demoNote = tmdb.isDemo() ? `
    <div class="container" style="padding-top:18px;">
      <div class="player-notice" style="max-width:var(--maxw); margin:18px auto 0;">
        <span>⚡</span>
        <div>
          <strong>Modo demonstração ativo.</strong> Você está vendo um catálogo de exemplo gerado localmente.
          Para carregar filmes, séries e capas reais (fonte pública TMDB), acesse
          <a href="#/sobre" style="color:#fff; text-decoration:underline;">Sobre a plataforma</a> e configure sua chave gratuita.
        </div>
      </div>
    </div>` : '';

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <section class="hero" id="heroSection">
      ${heroItems.map((item, i) => `
        <div class="hero__bg" data-hero="${i}" style="opacity:${i===0?1:0}; background-image:url('${backdropFor(item,'original')}');"></div>
      `).join('')}
      <div class="hero__content">
        <span class="hero__eyebrow">🔥 Em alta esta semana</span>
        <h1 class="hero__title" id="heroTitle">${itemTitle(heroItems[0]||{})}</h1>
        <div class="hero__meta" id="heroMeta">
          <span>${itemYear(heroItems[0]||{})}</span><span class="dot"></span>
          <span>${itemKind(heroItems[0]||{}) === 'tv' ? 'Série' : 'Filme'}</span><span class="dot"></span>
          <span>★ ${(heroItems[0]?.vote_average||0).toFixed ? heroItems[0].vote_average.toFixed(1) : heroItems[0]?.vote_average || '—'}</span>
        </div>
        <p class="hero__overview" id="heroOverview">${heroItems[0]?.overview || ''}</p>
        <div class="hero__actions">
          <a class="btn btn-primary" id="heroPlayBtn" href="#/assistir/${itemKind(heroItems[0]||{})}/${heroItems[0]?.id}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Assistir
          </a>
          <a class="btn btn-ghost" id="heroInfoBtn" href="#/titulo/${itemKind(heroItems[0]||{})}/${heroItems[0]?.id}">ℹ Mais informações</a>
        </div>
      </div>
      <div class="hero__dots">
        ${heroItems.map((_,i)=>`<button data-dot="${i}" class="${i===0?'active':''}" aria-label="Destaque ${i+1}"></button>`).join('')}
      </div>
    </section>

    ${demoNote}

    ${continueList.length ? railHTML('Continuar assistindo', continueList, { icon:'▶' }) : ''}
    ${railHTML('Em alta', trending, { link:'/em-alta', icon:'🔥' })}
    ${railHTML('Filmes populares', popularMovies, { link:'/catalogo/movie', icon:'🎬' })}
    ${railHTML('Séries populares', popularSeries, { link:'/catalogo/tv', icon:'📺' })}
    ${railHTML('Em cartaz', nowPlaying, { link:'/catalogo/movie', wide:true, icon:'🆕' })}
    ${railHTML('Mais bem avaliados', topRated, { link:'/catalogo/movie', icon:'⭐' })}
    <div style="height:40px;"></div>
  `;

  bindCardEvents(wrap);

  // Hero autoplay + dots
  clearInterval(heroTimer);
  let idx = 0;
  const setHero = (i) => {
    idx = i;
    const item = heroItems[i];
    if(!item) return;
    wrap.querySelectorAll('[data-hero]').forEach(el => el.style.opacity = Number(el.dataset.hero) === i ? 1 : 0);
    wrap.querySelectorAll('[data-dot]').forEach(el => el.classList.toggle('active', Number(el.dataset.dot) === i));
    wrap.querySelector('#heroTitle').textContent = itemTitle(item);
    wrap.querySelector('#heroOverview').textContent = item.overview || '';
    wrap.querySelector('#heroMeta').innerHTML = `<span>${itemYear(item)}</span><span class="dot"></span><span>${itemKind(item)==='tv'?'Série':'Filme'}</span><span class="dot"></span><span>★ ${item.vote_average ? Number(item.vote_average).toFixed(1) : '—'}</span>`;
    wrap.querySelector('#heroPlayBtn').setAttribute('href', `#/assistir/${itemKind(item)}/${item.id}`);
    wrap.querySelector('#heroInfoBtn').setAttribute('href', `#/titulo/${itemKind(item)}/${item.id}`);
  };
  wrap.querySelectorAll('[data-dot]').forEach(btn => btn.addEventListener('click', ()=> setHero(Number(btn.dataset.dot))));
  if(heroItems.length > 1){
    heroTimer = setInterval(()=> setHero((idx+1) % heroItems.length), 7000);
  }

  return wrap;
}
