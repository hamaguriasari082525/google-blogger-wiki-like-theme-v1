// reference-backlink-navigation.js

(function(){
"use strict";

function buildBacklinkNavigation(){
  const core=window.articleReferenceCore;
  const navigation=window.articleReferenceNavigation;

  if(!core||!navigation){
    return;
  }

  const state=core.getState();

  state.targets.forEach(function(target){
    const references=target.references||[];

    references.forEach(function(reference){
      if(!reference||!reference.element){
        return;
      }

      const referenceId=reference.element.id;

      if(!referenceId){
        return;
      }

      const backlinks=
        document.querySelectorAll(
          ".article-reference-backlink[data-reference-id='"+referenceId+"']"
        );

      backlinks.forEach(function(backlink){
        if(backlink.dataset.referenceNavigationApplied==="true"){
          return;
        }

        backlink.addEventListener(
          "click",
          function(event){
            event.preventDefault();
            navigation.navigate(reference.element);
          }
        );

        backlink.dataset.referenceNavigationApplied="true";
      });
    });
  });
}

window.articleReferenceBacklinkNavigation={
  process:buildBacklinkNavigation
};

})();
