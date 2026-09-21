// reference-layout-code.js

(function(){
"use strict";

function buildCodeLayout(){
  const core=window.articleReferenceCore;
  const display=window.articleReferenceDisplay;

  if(!core){
    console.warn("[ReferenceLayoutCode] Reference Core not found.");
    return;
  }

  if(!display){
    console.warn("[ReferenceLayoutCode] Reference Display not found.");
    return;
  }

  const state=core.getState();

  state.targets.forEach(function(target){
    if(
      !target||
      target.type!=="code"||
      !target.element
    ){
      return;
    }

    if(target.element.dataset.referenceLayoutApplied==="true"){
      return;
    }

    const title=target.element.querySelector(".article-code-title");

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

window.articleReferenceLayoutCode={
  process:buildCodeLayout
};

document.addEventListener(
  "articleReferencesReady",
  buildCodeLayout
);

})();
