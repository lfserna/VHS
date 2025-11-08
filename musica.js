// musica.js - Reproductor que detecta archivos musica1.mp4, musica2.mp4, ...
(async function(){
  const MAX_TRIES = 50; // buscar hasta musica50.mp4
  const baseName = 'musica';
  const ext = '.mp3';
  const playlist = [];

  // Intentar detectar archivos usando HEAD requests (funciona cuando sirves por HTTP)
  async function detectFiles(){
    for(let i=1;i<=MAX_TRIES;i++){
      const url = `${baseName}${i}${ext}`;
      try{
        const res = await fetch(url, {method: 'HEAD'});
        if(res.ok){
          playlist.push({title: `${baseName}${i}`, src: url});
        }
      }catch(e){
        // ignore (fetch puede fallar en file:// o CORS)
      }
    }
  }

  await detectFiles();

  // Elementos UI
  const trackTitle = document.getElementById('trackTitle');
  const playBtn = document.getElementById('playBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const shuffleBtn = document.getElementById('shuffleBtn');
  const progressBar = document.getElementById('progress');
  const progressFill = progressBar.querySelector('i');
  const currentEl = document.getElementById('current');
  const durationEl = document.getElementById('duration');
  const playlistEl = document.getElementById('playlist');

  // audio element
  const audio = new Audio();
  audio.preload = 'metadata';

  let currentIndex = 0;
  let isPlaying = false;
  let shuffle = false;

  function formatTime(t){
    if(!t || isNaN(t)) return '0:00';
    const m = Math.floor(t/60);
    const s = Math.floor(t%60).toString().padStart(2,'0');
    return `${m}:${s}`;
  }

  function renderPlaylist(){
    playlistEl.innerHTML = '';
    playlist.forEach((item, idx)=>{
      const li = document.createElement('li');
      li.textContent = item.title;
      li.dataset.index = idx;
      if(idx===currentIndex) li.classList.add('active');
      li.addEventListener('click', ()=>{ loadTrack(idx); play(); });
      playlistEl.appendChild(li);
    });
  }

  function updateUI(){
    trackTitle.textContent = playlist[currentIndex] ? playlist[currentIndex].title : 'Sin pistas';
    Array.from(playlistEl.children).forEach(li=> li.classList.toggle('active', Number(li.dataset.index)===currentIndex));
  }

  function loadTrack(index){
    if(playlist.length===0) return;
    currentIndex = (index+playlist.length)%playlist.length;
    audio.src = playlist[currentIndex].src;
    audio.load();
    updateUI();
  }

  function play(){
    if(!audio.src) return;
    audio.play();
    isPlaying = true;
    playBtn.textContent = '⏸';
  }
  function pause(){
    audio.pause();
    isPlaying = false;
    playBtn.textContent = '▶️';
  }

  function next(){
    if(shuffle){
      currentIndex = Math.floor(Math.random()*playlist.length);
    } else {
      currentIndex = (currentIndex+1)%playlist.length;
    }
    loadTrack(currentIndex);
    play();
  }
  function prev(){
    if(shuffle){
      currentIndex = Math.floor(Math.random()*playlist.length);
    } else {
      currentIndex = (currentIndex-1+playlist.length)%playlist.length;
    }
    loadTrack(currentIndex);
    play();
  }

  // Listeners
  playBtn.addEventListener('click', ()=>{ if(isPlaying) pause(); else play(); });
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  shuffleBtn.addEventListener('click', ()=>{ shuffle = !shuffle; shuffleBtn.style.opacity = shuffle? '1' : '0.6'; });

  audio.addEventListener('timeupdate', ()=>{
    const pct = audio.currentTime / (audio.duration || 1) * 100;
    progressFill.style.width = pct + '%';
    currentEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  });

  progressBar.addEventListener('click', (e)=>{
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    if(audio.duration) audio.currentTime = pct * audio.duration;
  });

  audio.addEventListener('ended', ()=>{
    next();
  });

  audio.addEventListener('loadedmetadata', ()=>{
    durationEl.textContent = formatTime(audio.duration);
  });

  // Inicialización final
  if(playlist.length===0){
    trackTitle.textContent = 'No se encontraron archivos musica1.mp4..musicaN.mp4 en esta carpeta.';
  } else {
    loadTrack(0);
    renderPlaylist();
    updateUI();
  }

  // Exponer para consola si se necesita
  window._player = {audio, playlist};
})();
