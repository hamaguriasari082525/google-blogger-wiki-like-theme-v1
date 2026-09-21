// reference-sup.js

(function(){
"use strict";

function buildReferenceSup(){
  const core=window.articleReferenceCore;

  if(!core){
    console.warn("[ReferenceSup] Reference Core not found.");
    return;
  }

  const references=core.getReferences();

  references.forEach(function(reference){
    const element=reference.element;

    if(!element){
      return;
    }

    if(element.dataset.sup!=="true"){
      return;
    }

    const link=element.querySelector(".article-reference-link");

    if(!link){
      return;
    }

    link.classList.add("article-reference-sup");
    element.dataset.supApplied="true";
  });

  window.dispatchEvent(
    new CustomEvent(
      "articleReferenceSupReady",
      {
        detail:references
      }
    )
  );
}

window.articleReferenceSup={
  process:buildReferenceSup
};

})();
