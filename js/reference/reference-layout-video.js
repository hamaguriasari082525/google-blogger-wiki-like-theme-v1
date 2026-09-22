// reference-layout-video.js

(function(){
"use strict";

function buildVideoLayout(){
  const core=window.articleReferenceCore;
  const display=window.articleReferenceDisplay;

  if(!core){
    console.warn("[ReferenceLayoutVideo] Reference Core not found.");
    return;
  }

  if(!display){
    console.warn("[ReferenceLayoutVideo] Reference Display not found.");
    return;
  }

  const state=core.getState();

  state.targets.forEach(function(target){
    if(
      !target||
      target.type!=="video"||
      !target.element
    ){
      return;
    }

    if(target.element.dataset.referenceLayoutApplied==="true"){
      return;
    }

    const title=target.element.querySelector(".article-video-title");

    if(!title){
      return;
    }

    const displayElement=
      target.element.querySelector(
        ":scope > .article-reference-display"
      );

    if(!displayElement){
      return;
    }

    title.insertBefore(displayElement,title.firstChild);
    target.element.dataset.referenceLayoutApplied="true";
  });
}

window.articleReferenceLayoutVideo={
  process:buildVideoLayout
};

})();
