// reference-layout-table.js

(function(){
"use strict";

function buildTableLayout(){
  const core=window.articleReferenceCore;
  const display=window.articleReferenceDisplay;

  if(!core){
    console.warn("[ReferenceLayoutTable] Reference Core not found.");
    return;
  }

  if(!display){
    console.warn("[ReferenceLayoutTable] Reference Display not found.");
    return;
  }

  const state=core.getState();

  state.targets.forEach(function(target){
    if(
      !target||
      target.type!=="table"||
      !target.element
    ){
      return;
    }

    if(target.element.dataset.referenceLayoutApplied==="true"){
      return;
    }

    const title=target.element.querySelector(".article-table-title");

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

window.articleReferenceLayoutTable={
  process:buildTableLayout
};

document.addEventListener(
  "articleReferencesReady",
  buildTableLayout
);

})();
