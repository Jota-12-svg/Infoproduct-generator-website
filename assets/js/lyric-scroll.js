/* Vision section karaoke-style word animation triggered by IntersectionObserver */
(function(){
  const initLyric=()=>{
    const container=document.getElementById('lyric-container');
    if(!container||container.dataset.lyricInit==='true')return;
    container.dataset.lyricInit='true';
    const words=Array.from(container.querySelectorAll('.lyric-word'));
    let timers=[];
    const resetWords=()=>{timers.forEach(clearTimeout);timers=[];words.forEach(w=>w.classList.remove('is-active','is-past'))};
    const playKaraoke=()=>{
      resetWords();
      words.forEach((word,index)=>{
        const timer=setTimeout(()=>{
          if(words[index-1]){words[index-1].classList.remove('is-active');words[index-1].classList.add('is-past')}
          word.classList.add('is-active');
          if(index===words.length-1){setTimeout(()=>{word.classList.remove('is-active');word.classList.add('is-past')},520)}
        },index*145);
        timers.push(timer);
      });
    };
    const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){playKaraoke()}else{resetWords()}})},{threshold:0.45});
    observer.observe(container);
    if(window.lucide)window.lucide.createIcons();
  };
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initLyric)}else{setTimeout(initLyric,100)}
})();
