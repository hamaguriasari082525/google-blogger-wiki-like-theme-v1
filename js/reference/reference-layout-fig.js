// reference-layout-fig.js

(function(){
"use strict";

function buildFigLayout(){
  const core=window.articleReferenceCore;
  const display=window.articleReferenceDisplay;

  if(!core){
    console.warn("[ReferenceLayoutFig] Reference Core not found.");
    return;
  }

  if(!display){
    console.warn("[ReferenceLayoutFig] Reference Display not found.");
    return;
  }

  const state=core.getState();

  state.targets.forEach(function(target){
    if(
      !target||
      target.type!=="fig"||
      !target.element
    ){
      return;
    }

    if(target.element.dataset.referenceLayoutApplied==="true"){
      return;
    }

    const caption=target.element.querySelector("figcaption");

    if(!caption){
      return;
    }

    const displayElement=
      target.element.querySelector(
        ":scope > .article-reference-display"
      );

    if(!displayElement){
      return;
    }

    caption.insertBefore(displayElement,caption.firstChild);
    target.element.dataset.referenceLayoutApplied="true";
  });
}

window.articleReferenceLayoutFig={
  process:buildFigLayout
};

document.addEventListener(
  "articleReferencesReady",
  buildFigLayout
);

})();
