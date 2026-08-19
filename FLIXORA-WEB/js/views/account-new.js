import { currentUser, logout, authEnabled, updateUserProfile, updateUserPassword } from '../core/auth.js';
import { tmdb } from '../core/tmdb.js';
import { imgUrl } from '../core/config.js';
import { AVATAR_CATEGORIES, fetchCastForTitle } from '../core/avatar-library.js';
import { favorites } from '../core/state.js';
import { toast } from '../core/state.js';
import { go } from '../core/router.js';

export async function AccountView(){
  const user = currentUser();
  if(!user){
    go('/entrar');
    return `<div class="empty-state"><h3>Área restrita</h3><p>Faça login para acessar sua conta FLIXORA.</p></div>`;
  }

  const list = favorites.all();
  const displayName = user.displayName || user.email?.split('@')[0] || 'Usuário';
  const photoURL = user.photoURL || '';

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <section class="section account-page">
      <div class="account-grid">
        <div class="account-card account-overview">
          <div class="account-profile">
            <button class="profile-avatar" id="profileAvatar" type="button" aria-label="Editar perfil" ${photoURL ? `style="background-image:url('${photoURL}')"` : ''}>
              ${photoURL ? '' : displayName.charAt(0).toUpperCase()}
            </button>
            <div class="profile-info">
              <span class="hero__eyebrow">Perfil</span>
              <h2>${displayName}</h2>
              <p>Clique em editar para personalizar seu perfil</p>
            </div>
          </div>

          <div class="account-summary">
            <div><strong>${list.length}</strong><span>Itens na minha lista</span></div>
            <div><strong>3</strong><span>Planos disponíveis</span></div>
            <div><strong>${authEnabled() ? 'Ativo' : 'Aguardando'}</strong><span>Auth Firebase</span></div>
          </div>

          <div class="account-actions">
            <button class="btn btn-primary" id="mirrorBtn">Espelhar tela</button>
            <button class="btn btn-outline" id="editProfileBtn">Editar Perfil</button>
            <button class="btn btn-outline" id="logoutBtn">Sair</button>
          </div>
        </div>

        <div class="account-card account-plans">
          <span class="hero__eyebrow">Planos empresariais</span>
          <h2>Escolha o plano ideal</h2>
          <div class="plans plans-compact">
            <div class="plan-card">
              <h3>Básico</h3>
              <p>1 tela · HD · Com anúncios</p>
            </div>
            <div class="plan-card featured">
              <h3>Padrão</h3>
              <p>2 telas · Full HD · Sem anúncios</p>
            </div>
            <div class="plan-card">
              <h3>Premium</h3>
              <p>4 telas · 4K · Áudio espacial</p>
            </div>
          </div>
          <p class="auth-note">Os planos ainda não processam pagamento real. Esta área está pronta para integração com gateway de cobrança e licenciamento.</p>
        </div>
      </div>
    </section>
  `;

  wrap.querySelector('#logoutBtn')?.addEventListener('click', async () => {
    try{
      await logout();
      toast('Sessão encerrada.');
      go('/entrar');
    }catch(err){
      console.error(err);
      toast('Não foi possível sair agora.');
    }
  });

  wrap.querySelector('#mirrorBtn')?.addEventListener('click', async () => {
    try{
      if (navigator.mediaDevices?.getDisplayMedia) {
        await navigator.mediaDevices.getDisplayMedia({ video: true });
        toast('Tentativa de espelhamento iniciada. Use a interface do dispositivo para escolher a tela.');
      } else {
        toast('Espelhamento nativo não disponível. Será liberado com servidor de casting em breve.');
      }
    }catch(err){
      toast('Espelhamento não pôde ser iniciado.');
    }
  });

  const profileAvatar = wrap.querySelector('#profileAvatar');
  const editProfileBtn = wrap.querySelector('#editProfileBtn');

  profileAvatar?.addEventListener('click', () => openProfileModal());
  editProfileBtn?.addEventListener('click', () => openProfileModal());

  function createModal(){
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-content profile-modal">
        <button class="modal-close" aria-label="Fechar">×</button>
        <div style="margin-bottom:20px;">
          <h3 style="margin:0 0 6px; font-size:1.8rem;">Editar Perfil</h3>
          <p style="margin:0; color:var(--text-faint); font-size:.95rem;">Personalize sua conta com um novo nome e escolha seu avatar entre 30+ personagens populares</p>
        </div>
        <form id="modalProfileForm" class="comment-form">
          <div style="display:grid; gap:16px; margin-bottom:24px; border-bottom:1px solid rgba(255,255,255,.06); padding-bottom:24px;">
            <div>
              <label for="mDisplayName" style="display:block; margin-bottom:8px; font-weight:600;">Nome público</label>
              <input id="mDisplayName" class="input-improved" type="text" value="${displayName}" placeholder="Seu nome na plataforma" />
            </div>
            <div>
              <label for="mPassword" style="display:block; margin-bottom:8px; font-weight:600;">Nova senha (opcional)</label>
              <input id="mPassword" class="input-improved" type="password" placeholder="Deixe em branco para manter a senha atual" minlength="6" />
              <p style="margin:6px 0 0; font-size:.85rem; color:var(--text-faint);">Mínimo 6 caracteres</p>
            </div>
          </div>

          <div style="margin-bottom:24px;">
            <h4 style="margin:0 0 4px; font-size:1.1rem; font-weight:700;">Escolher ícone do perfil</h4>
            <p style="margin:0 0 16px; color:var(--text-faint); font-size:.9rem;">Navegue pelos personagens de suas séries e filmes favoritos</p>
            
            <div class="avatar-chooser">
              <div class="avatar-cats" id="avatarCats"></div>
              <div class="avatar-grid" id="modalAvatarGrid" aria-live="polite">Carregando...</div>
            </div>
          </div>

          <div style="display:flex; gap:10px; margin-top:24px;">
            <button type="submit" class="btn btn-primary" style="flex:1;">Salvar alterações</button>
            <button type="button" class="btn btn-outline" id="modalCancelBtn" style="flex:1;">Cancelar</button>
          </div>
          <input id="mSelectedAvatar" type="hidden" />
        </form>
      </div>
    `;
    return modal;
  }

  function openProfileModal(){
    const modal = createModal();
    document.body.appendChild(modal);

    const backdrop = modal.querySelector('.modal-backdrop');
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('#modalCancelBtn');
    const mForm = modal.querySelector('#modalProfileForm');
    const avatarGrid = modal.querySelector('#modalAvatarGrid');
    const selectedInput = modal.querySelector('#mSelectedAvatar');
    const avatarCatsContainer = modal.querySelector('#avatarCats');

    function close(){ modal.remove(); }
    backdrop.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    cancelBtn.addEventListener('click', close);

    // Create category buttons from avatar library
    AVATAR_CATEGORIES.forEach((cat, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-sm avatar-cat';
      btn.dataset.cat = cat.key;
      btn.textContent = cat.name;
      if(idx === 0) btn.classList.add('active');
      btn.addEventListener('click', (e) => {
        modal.querySelectorAll('.avatar-cat').forEach(x=>x.classList.remove('active'));
        btn.classList.add('active');
        loadAvatars(cat.key);
      });
      avatarCatsContainer.appendChild(btn);
    });

    async function loadAvatars(catKey){
      avatarGrid.innerHTML = 'Carregando imagens...';
      try{
        const cat = AVATAR_CATEGORIES.find(c => c.key === catKey);
        if(!cat) return;

        let allThumbs = [];
        for(const titleData of cat.titles){
          try{
            const cast = await fetchCastForTitle(tmdb, titleData.query, titleData.type);
            allThumbs.push(...cast.map(c => ({ 
              url: imgUrl(c.profile_path, 'w185'),
              title: titleData.title,
              name: c.name
            })));
          }catch(e){ console.error(e); }
        }

        allThumbs = allThumbs.filter(t => t.url).slice(0,30);
        if(allThumbs.length === 0){
          avatarGrid.innerHTML = '<div class="comment-note" style="grid-column:1/-1;">Nenhuma imagem encontrada para esta categoria.</div>';
        } else {
          avatarGrid.innerHTML = '';
          allThumbs.forEach(t => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'avatar-option';
            btn.title = `${t.name} de ${t.title}`;
            btn.innerHTML = `<img src="${t.url}" alt="${t.name}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23333%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E'"/>`;
            btn.addEventListener('click', ()=>{
              modal.querySelectorAll('.avatar-option.selected').forEach(x=>x.classList.remove('selected'));
              btn.classList.add('selected');
              selectedInput.value = t.url;
            });
            avatarGrid.appendChild(btn);
          });
        }
      }catch(err){
        console.error(err);
        avatarGrid.innerHTML = '<div class="comment-note" style="grid-column:1/-1;">Erro ao carregar imagens. Tente novamente.</div>';
      }
    }

    // Load initial category
    setTimeout(()=>{
      loadAvatars(AVATAR_CATEGORIES[0].key);
    }, 100);

    mForm?.addEventListener('submit', async (ev)=>{
      ev.preventDefault();
      const name = modal.querySelector('#mDisplayName').value.trim();
      const selected = modal.querySelector('#mSelectedAvatar').value.trim();
      const password = modal.querySelector('#mPassword').value.trim();
      try{
        if(name || selected){
          await updateUserProfile({ 
            displayName: name || displayName, 
            photoURL: selected || photoURL 
          });
        }
        if(password){ 
          await updateUserPassword(password); 
        }
        window.dispatchEvent(new CustomEvent('profileUpdated', { detail: { displayName: name, photoURL: selected } }));
        toast('Perfil atualizado com sucesso!');
        close();
      }catch(err){
        console.error(err);
        toast(err.message || 'Erro ao atualizar perfil.');
      }
    });
  }

  return wrap;
}
