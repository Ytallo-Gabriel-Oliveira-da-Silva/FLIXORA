import { itemTitle } from './ui.js';

const STORAGE_KEY = 'flixora_comments';

const canned = [
  { author: 'Ana M.', role: 'Assinante Premium', rating: 5, message: 'Uma experiência fluida e elegante. Estou adorando as recomendações e o visual da plataforma.' },
  { author: 'Thiago P.', role: 'Crítico de entretenimento', rating: 4.8, message: 'O catálogo demo já entrega um conceito muito sólido. Gostaria de ver mais trilhas em breve.' },
  { author: 'Beatriz L.', role: 'Usuário há 2 meses', rating: 4.5, message: 'Comentários úteis, interface moderna e layout bem adaptado para telas grandes.' },
  { author: 'Diego S.', role: 'Beta tester', rating: 4.7, message: 'A navegação ficou muito superior. Ótimo trabalho com a seção de detalhes e a experiência de assinatura.' },
];

function read(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch{ return {}; }
}

function write(data){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getComments(kind, id){
  const storage = read();
  const key = `${kind}_${id}`;
  const saved = storage[key] || [];
  const seeded = canned.map((item, index) => ({
    id: `seed-${kind}-${id}-${index}`,
    author: item.author,
    role: item.role,
    rating: item.rating,
    message: item.message,
    createdAt: Date.now() - ((index + 1) * 3600000),
  }));
  return [...saved, ...seeded];
}

export function addComment(kind, id, comment){
  const storage = read();
  const key = `${kind}_${id}`;
  const list = storage[key] || [];
  const entry = { id: `local-${Date.now()}`, ...comment, createdAt: Date.now() };
  storage[key] = [entry, ...list];
  write(storage);
  return entry;
}

export function commentHTML(comment){
  const time = new Date(comment.createdAt).toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric'});
  return `
    <article class="comment-card">
      <div class="comment-avatar">${comment.author.charAt(0)}</div>
      <div class="comment-body">
        <div class="comment-meta">
          <strong>${comment.author}</strong>
          <span>${comment.role}</span>
          <span class="comment-rating">★ ${comment.rating.toFixed(1)}</span>
        </div>
        <p>${comment.message}</p>
        <span class="comment-date">${time}</span>
      </div>
    </article>
  `;
}
