/* Testimonials section: IntersectionObserver reveal and drag-to-scroll slider */
(function(){
  const section=document.getElementById('testimonials');
  const slider=document.getElementById('scroll-container');
  if(section){
    const observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){section.classList.add('is-visible')}})},{threshold:0.25});
    observer.observe(section);
  }
  if(slider){
    let isDown=false,startX=0,scrollLeft=0;
    const stopDragging=function(){if(!isDown)return;isDown=false;slider.style.cursor='grab';slider.classList.add('snap-x','snap-mandatory')};
    slider.addEventListener('mousedown',function(e){isDown=true;slider.style.cursor='grabbing';slider.classList.remove('snap-x','snap-mandatory');startX=e.pageX-slider.offsetLeft;scrollLeft=slider.scrollLeft});
    slider.addEventListener('mouseleave',stopDragging);
    slider.addEventListener('mouseup',stopDragging);
    slider.addEventListener('mousemove',function(e){if(!isDown)return;e.preventDefault();const x=e.pageX-slider.offsetLeft;const walk=(x-startX)*2;slider.scrollLeft=scrollLeft-walk});
    slider.addEventListener('wheel',function(e){if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){e.preventDefault();slider.scrollLeft+=e.deltaY}},{passive:false});
  }
})();
