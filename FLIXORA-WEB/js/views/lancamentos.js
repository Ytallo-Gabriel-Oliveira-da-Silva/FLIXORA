import { tmdb } from '../core/tmdb.js';
import { gridHTML, bindCardEvents, emptyState } from '../core/ui.js';

export async function LancamentosView() {
  try {
    // Busca filmes em cartaz e séries no ar (lançamentos recentes)
    const [movies, series] = await Promise.all([
      tmdb.nowPlaying(),
      tmdb.onTheAir()
    ]);

    // Ordena por data de lançamento (mais recente primeiro)
    const items = [...movies, ...series]
      .map(item => ({
        ...item,
        media_type: item.media_type || (item.release_date ? 'movie' : 'tv')
      }))
      .sort((a, b) => {
        const dateA = new Date(a.release_date || a.first_air_date);
        const dateB = new Date(b.release_date || b.first_air_date);
        return dateB - dateA;
      })
      .slice(0, 20);

    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <section class="section" style="padding-top:34px;">
        <h1 class="section__title" style="font-size:1.8rem; margin-bottom:20px;">📅 Lançamentos</h1>
        ${items.length ? gridHTML(items) : emptyState('Nenhum lançamento encontrado', 'Tente novamente mais tarde.', '🎬')}
      </section>
      <div style="height:40px;"></div>
    `;
    bindCardEvents(wrap);
    return wrap;
  } catch (error) {
    console.error('LancamentosView error:', error);
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <section class="section" style="padding-top:34px;">
        <h1 class="section__title" style="font-size:1.8rem; margin-bottom:20px;">📅 Lançamentos</h1>
        ${emptyState('Erro ao carregar', 'Verifique sua conexão ou tente novamente.', '⚠️')}
      </section>
      <div style="height:40px;"></div>
    `;
    return wrap;
  }
}