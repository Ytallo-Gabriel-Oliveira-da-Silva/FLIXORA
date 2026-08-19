import { tmdb } from '../core/tmdb.js';
import { gridHTML, bindCardEvents, emptyState } from '../core/ui.js';

export async function DisneyView() {
  try {
    // Busca filmes e séries populares (conteúdos mais conhecidos da Disney)
    const [movies, series] = await Promise.all([
      tmdb.popular('movie'),
      tmdb.popular('tv')
    ]);

    const items = [...movies, ...series]
      .map(item => ({
        ...item,
        media_type: item.media_type || (item.release_date ? 'movie' : 'tv')
      }))
      .slice(0, 20);

    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <section class="section" style="padding-top:34px;">
        <h1 class="section__title" style="font-size:1.8rem; margin-bottom:20px;">✨ Disney+</h1>
        ${items.length ? gridHTML(items) : emptyState('Nenhum título encontrado', 'Tente novamente mais tarde.', '🏰')}
      </section>
      <div style="height:40px;"></div>
    `;
    bindCardEvents(wrap);
    return wrap;
  } catch (error) {
    console.error('DisneyView error:', error);
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <section class="section" style="padding-top:34px;">
        <h1 class="section__title" style="font-size:1.8rem; margin-bottom:20px;">✨ Disney+</h1>
        ${emptyState('Erro ao carregar', 'Verifique sua conexão ou tente novamente.', '⚠️')}
      </section>
      <div style="height:40px;"></div>
    `;
    return wrap;
  }
}