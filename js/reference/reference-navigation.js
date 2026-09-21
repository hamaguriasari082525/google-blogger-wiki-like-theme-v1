// reference-navigation.js

(function(){
"use strict";

function navigateToElement(element){
  if(!element){
    return;
  }

  const rect=element.getBoundingClientRect();

  const targetPosition=
    window.pageYOffset+
    rect.top-
    window.innerHeight*0.25;

  window.scrollTo({
    top:Math.max(0,targetPosition),
    behavior:"smooth"
  });
}

window.articleReferenceNavigation={
  navigate:navigateToElement
};

})();
