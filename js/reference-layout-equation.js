// reference-layout-equation.js

(function(){
"use strict";

function buildEquationLayout(){
  const core=window.articleReferenceCore;
  const display=window.articleReferenceDisplay;

  if(!core){
    console.warn("[ReferenceLayoutEquation] Reference Core not found.");
    return;
  }

  if(!display){
    console.warn("[ReferenceLayoutEquation] Reference Display not found.");
    return;
  }

  const state=core.getState();

  state.targets.forEach(function(target){
    if(
      !target||
      target.type!=="equation"||
      !target.element
    ){
      return;
    }

    if(target.element.dataset.referenceLayoutApplied==="true"){
      return;
    }

    const equation=target.element.querySelector(".article-equation");

    if(!equation){
      return;
    }

    const displayElement=
      target.element.querySelector(
        ":scope > .article-reference-display"
      );

    if(!displayElement){
      return;
    }

    equation.appendChild(displayElement);
    equation.classList.add("article-equation-layout");

    target.element.dataset.referenceLayoutApplied="true";
  });
}

window.articleReferenceLayoutEquation={
  process:buildEquationLayout
};

document.addEventListener(
  "articleReferencesReady",
  buildEquationLayout
);

})();
