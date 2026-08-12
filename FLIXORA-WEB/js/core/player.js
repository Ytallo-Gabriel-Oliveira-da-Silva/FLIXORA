// =============================================================
// FLIXORA — Player de vídeo customizado
// Controles próprios construídos sobre a tag <video> nativa.
// Pronto para receber URLs de conteúdo licenciado (mp4/HLS) —
// basta trocar o "src" passado em mount().
// =============================================================
export class FlixoraPlayer {
  constructor(container){
    this.container = container;
    this.rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    this.idleTimer = null;
    this._build();
  }

  _build(){
    this.container.innerHTML = `
      <div class="player-shell" id="fxShell">
        <video id="fxVideo" playsinline></video>

        <button class="fx-center-btn" id="fxCenterBtn" aria-label="Reproduzir/pausar">
          ${icon('play', 30)}
        </button>

        <div class="fx-controls" id="fxControls">
          <div class="fx-progress" id="fxProgress">
            <div class="fx-progress__buffered" id="fxBuffered"></div>
            <div class="fx-progress__fill" id="fxFill"></div>
            <div class="fx-progress__handle" id="fxHandle"></div>
          </div>
          <div class="fx-row">
            <button class="fx-btn" id="fxPlay" aria-label="Reproduzir/pausar">${icon('play',18)}</button>
            <button class="fx-btn" id="fxBack10" aria-label="Voltar 10s">${icon('back10',18)}</button>
            <button class="fx-btn" id="fxFwd10" aria-label="Avançar 10s">${icon('fwd10',18)}</button>
            <div class="fx-vol">
              <button class="fx-btn" id="fxMute" aria-label="Mudo">${icon('volume',18)}</button>
              <input type="range" id="fxVolRange" min="0" max="1" step="0.05" value="1" aria-label="Volume" />
            </div>
            <span class="fx-time" id="fxTime">0:00 / 0:00</span>
            <span class="spacer"></span>
            <div class="fx-menu" id="fxSpeedMenu">
              <button class="fx-btn" id="fxSpeedBtn" aria-label="Velocidade">${icon('speed',18)}</button>
              <div class="fx-menu__panel" id="fxSpeedPanel"></div>
            </div>
            <button class="fx-btn" id="fxPip" aria-label="Picture-in-picture">${icon('pip',18)}</button>
            <button class="fx-btn" id="fxFullscreen" aria-label="Tela cheia">${icon('expand',18)}</button>
          </div>
        </div>
      </div>
    `;
    this.el = {
      shell: this.container.querySelector('#fxShell'),
      video: this.container.querySelector('#fxVideo'),
      centerBtn: this.container.querySelector('#fxCenterBtn'),
      play: this.container.querySelector('#fxPlay'),
      back10: this.container.querySelector('#fxBack10'),
      fwd10: this.container.querySelector('#fxFwd10'),
      mute: this.container.querySelector('#fxMute'),
      vol: this.container.querySelector('#fxVolRange'),
      time: this.container.querySelector('#fxTime'),
      progress: this.container.querySelector('#fxProgress'),
      fill: this.container.querySelector('#fxFill'),
      buffered: this.container.querySelector('#fxBuffered'),
      handle: this.container.querySelector('#fxHandle'),
      speedMenu: this.container.querySelector('#fxSpeedMenu'),
      speedBtn: this.container.querySelector('#fxSpeedBtn'),
      speedPanel: this.container.querySelector('#fxSpeedPanel'),
      pip: this.container.querySelector('#fxPip'),
      fullscreen: this.container.querySelector('#fxFullscreen'),
    };
    this._buildSpeedMenu();
    this._bind();
  }

  _buildSpeedMenu(){
    this.el.speedPanel.innerHTML = this.rates.map(r =>
      `<button data-rate="${r}" class="${r===1?'active':''}">${r === 1 ? 'Normal' : r+'x'}</button>`
    ).join('');
  }

  _bind(){
    const { video, shell } = this.el;

    this.el.centerBtn.addEventListener('click', ()=> this.toggle());
    this.el.play.addEventListener('click', ()=> this.toggle());
    video.addEventListener('click', ()=> this.toggle());
    video.addEventListener('play', ()=> this._setPlayingUI(true));
    video.addEventListener('pause', ()=> this._setPlayingUI(false));
    video.addEventListener('timeupdate', ()=> this._updateProgress());
    video.addEventListener('progress', ()=> this._updateBuffered());
    video.addEventListener('loadedmetadata', ()=> this._updateProgress());
    video.addEventListener('ended', ()=> shell.classList.add('paused'));

    this.el.back10.addEventListener('click', ()=> video.currentTime = Math.max(0, video.currentTime - 10));
    this.el.fwd10.addEventListener('click', ()=> video.currentTime = Math.min(video.duration||0, video.currentTime + 10));

    this.el.mute.addEventListener('click', ()=>{
      video.muted = !video.muted;
      this.el.mute.innerHTML = icon(video.muted ? 'muted' : 'volume', 18);
      this.el.vol.value = video.muted ? 0 : video.volume;
    });
    this.el.vol.addEventListener('input', (e)=>{
      video.volume = Number(e.target.value);
      video.muted = video.volume === 0;
      this.el.mute.innerHTML = icon(video.muted ? 'muted' : 'volume', 18);
    });

    let dragging = false;
    const seekAt = (clientX) => {
      const r = this.el.progress.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      if(video.duration) video.currentTime = ratio * video.duration;
    };
    this.el.progress.addEventListener('pointerdown', (e)=>{ dragging = true; seekAt(e.clientX); });
    window.addEventListener('pointermove', (e)=> dragging && seekAt(e.clientX));
    window.addEventListener('pointerup', ()=> dragging = false);

    this.el.speedBtn.addEventListener('click', (e)=>{
      e.stopPropagation();
      this.el.speedMenu.classList.toggle('open');
    });
    this.el.speedPanel.addEventListener('click', (e)=>{
      const btn = e.target.closest('button[data-rate]');
      if(!btn) return;
      video.playbackRate = Number(btn.dataset.rate);
      [...this.el.speedPanel.children].forEach(b=> b.classList.toggle('active', b===btn));
      this.el.speedMenu.classList.remove('open');
    });
    document.addEventListener('click', ()=> this.el.speedMenu.classList.remove('open'));

    this.el.pip.addEventListener('click', async ()=>{
      try{
        if(document.pictureInPictureElement) await document.exitPictureInPicture();
        else await video.requestPictureInPicture();
      }catch(err){ /* PiP indisponível no navegador */ }
    });

    this.el.fullscreen.addEventListener('click', ()=>{
      if(document.fullscreenElement) document.exitFullscreen();
      else shell.requestFullscreen?.();
    });

    document.addEventListener('keydown', (e)=>{
      if(!document.body.contains(shell)) return;
      if(['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;
      if(e.code === 'Space'){ e.preventDefault(); this.toggle(); }
      if(e.code === 'ArrowRight') video.currentTime += 10;
      if(e.code === 'ArrowLeft') video.currentTime -= 10;
      if(e.code === 'KeyF') this.el.fullscreen.click();
      if(e.code === 'KeyM') this.el.mute.click();
    });

    ['mousemove','pointerdown'].forEach(ev => shell.addEventListener(ev, ()=> this._wakeControls()));
  }

  _wakeControls(){
    this.el.shell.classList.remove('idle');
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(()=>{
      if(!this.el.video.paused) this.el.shell.classList.add('idle');
    }, 2600);
  }

  _setPlayingUI(playing){
    this.el.shell.classList.toggle('paused', !playing);
    this.el.play.innerHTML = icon(playing ? 'pause' : 'play', 18);
    this.el.centerBtn.innerHTML = icon(playing ? 'pause' : 'play', 30);
    if(playing) this._wakeControls();
  }

  _updateProgress(){
    const { video } = this.el;
    if(!video.duration) return;
    const ratio = video.currentTime / video.duration;
    this.el.fill.style.width = `${ratio*100}%`;
    this.el.handle.style.left = `${ratio*100}%`;
    this.el.time.textContent = `${fmt(video.currentTime)} / ${fmt(video.duration)}`;
    this.onProgress?.(video.currentTime, video.duration);
  }

  _updateBuffered(){
    const { video } = this.el;
    if(!video.duration || !video.buffered.length) return;
    const end = video.buffered.end(video.buffered.length - 1);
    this.el.buffered.style.width = `${(end/video.duration)*100}%`;
  }

  toggle(){ this.el.video.paused ? this.el.video.play() : this.el.video.pause(); }

  mount(src, { startAt=0, poster=null, onProgress=null } = {}){
    this.onProgress = onProgress;
    const v = this.el.video;
    v.src = src;
    if(poster) v.poster = poster;
    v.currentTime = startAt || 0;
    v.volume = 1;
  }

  destroy(){
    this.el.video.pause();
    this.el.video.src = '';
    clearTimeout(this.idleTimer);
  }
}

function fmt(s){
  if(!isFinite(s)) return '0:00';
  const m = Math.floor(s/60), sec = Math.floor(s%60);
  const h = Math.floor(m/60);
  if(h > 0) return `${h}:${String(m%60).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  return `${m}:${String(sec).padStart(2,'0')}`;
}

function icon(name, size=18){
  const s = size;
  const icons = {
    play: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`,
    pause: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>`,
    back10: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12a8 8 0 1 1 2.6 5.9" stroke-linecap="round"/><path d="M4 6v5h5" stroke-linecap="round" stroke-linejoin="round"/><text x="12" y="16" font-size="7" fill="currentColor" stroke="none" text-anchor="middle">10</text></svg>`,
    fwd10: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 12a8 8 0 1 0-2.6 5.9" stroke-linecap="round"/><path d="M20 6v5h-5" stroke-linecap="round" stroke-linejoin="round"/><text x="12" y="16" font-size="7" fill="currentColor" stroke="none" text-anchor="middle">10</text></svg>`,
    volume: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor"><path d="M4 9v6h4l5 5V4L8 9H4z"/><path d="M17 8.5a5 5 0 010 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    muted: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor"><path d="M4 9v6h4l5 5V4L8 9H4z"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    speed: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" stroke-linecap="round"/></svg>`,
    pip: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="14" rx="2"/><rect x="12" y="11" width="7" height="5" rx="1" fill="currentColor" stroke="none"/></svg>`,
    expand: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9V5h4M20 9V5h-4M4 15v4h4M20 15v4h-4"/></svg>`,
  };
  return icons[name] || '';
}
