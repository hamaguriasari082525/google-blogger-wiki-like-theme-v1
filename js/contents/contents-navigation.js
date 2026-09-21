// contents-navigation.js

(function(){
"use strict";

function navigateToTarget(target){
  if(!target){
    return;
  }

  const offset=80;

  const targetPosition=
    target.getBoundingClientRect().top+
    window.pageYOffset-
    offset;

  window.scrollTo({
    top:Math.max(0,targetPosition),
    behavior:"smooth"
  });
}

function navigateToTop(){
  window.scrollTo({
    top:0,
    behavior:"smooth"
  });
}

function buildContentsNavigation(){
  const contents=document.querySelector(".contents nav");

  if(!contents){
    return;
  }

  if(contents.dataset.navigationApplied==="true"){
    return;
  }

  const topLink=document.createElement("a");

  topLink.href="#";
  topLink.className="contents-top-link";
  topLink.textContent="先頭へ戻る";

  contents.prepend(topLink);

  contents.addEventListener(
    "click",
    function(event){
      const link=event.target.closest("a");

      if(!link){
        return;
      }

      if(link.classList.contains("contents-top-link")){
        event.preventDefault();
        navigateToTop();
        return;
      }

      if(!link.matches("a[href^='#']")){
        return;
      }

      const hash=link.getAttribute("href");

      if(!hash||hash==="#"){
        return;
      }

      const target=document.querySelector(hash);

      if(!target){
        return;
      }

      event.preventDefault();

      navigateToTarget(target);

      history.replaceState(
        null,
        "",
        hash
      );
    }
  );

  contents.dataset.navigationApplied="true";
}

window.articleContentsNavigation={
  process:buildContentsNavigation,
  navigate:navigateToTarget,
  navigateToTop:navigateToTop
};

})();
