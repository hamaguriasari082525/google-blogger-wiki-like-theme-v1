// reference-link.js

(function(){
"use strict";

function buildReferenceLinks(){
  const core=window.articleReferenceCore;

  if(!core){
    console.warn("[ReferenceLink] Reference Core not found.");
    return;
  }

  const display=window.articleReferenceDisplay;

  if(!display){
    console.warn("[ReferenceLink] Reference Display not found.");
    return;
  }

  const references=core.getReferences();

  references.forEach(function(reference){
    const element=reference.element;
    const target=reference.target;

    if(!element||!target){
      return;
    }

    if(element.dataset.referenceLinkApplied==="true"){
      return;
    }

    const label=display.getReferenceLabel(reference);
    const link=document.createElement("a");

    link.className="article-reference-link";
    link.textContent=label;
    link.href="#"+(target.element.id||"");
    link.dataset.linked="true";

    element.textContent="";
    element.appendChild(link);
    element.dataset.referenceLinkApplied="true";
  });

  window.dispatchEvent(
    new CustomEvent(
      "articleReferenceLinksReady",
      {
        detail:references
      }
    )
  );
}

window.articleReferenceLink={
  process:buildReferenceLinks
};

document.addEventListener(
  "articleReferencesReady",
  buildReferenceLinks
);

})();