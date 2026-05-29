/* Pricing 3D card stage: highlights closest card on mousemove, clears on mouseleave */
(function(){
  const stage=document.querySelector('#pricing .pricing-stage');
  if(!stage)return;
  const cards=[stage.querySelector('.pricing-card-1'),stage.querySelector('.pricing-card-2'),stage.querySelector('.pricing-card-3')];
  const setActiveCard=function(event){
    let closestIndex=0,closestDistance=Infinity;
    cards.forEach(function(card,index){
      if(!card)return;
      const rect=card.getBoundingClientRect();
      const cardCenterX=rect.left+rect.width/2;
      const distance=Math.abs(event.clientX-cardCenterX);
      if(distance<closestDistance){closestDistance=distance;closestIndex=index}
    });
    stage.setAttribute('data-active',String(closestIndex+1));
  };
  stage.addEventListener('mousemove',setActiveCard);
  stage.addEventListener('mouseleave',function(){stage.removeAttribute('data-active')});
  cards.forEach(function(card,index){
    if(!card)return;
    card.addEventListener('mouseenter',function(){stage.setAttribute('data-active',String(index+1))});
    card.addEventListener('focusin',function(){stage.setAttribute('data-active',String(index+1))});
  });
})();
