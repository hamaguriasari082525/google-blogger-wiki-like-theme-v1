// reference-error.js

(function(){
"use strict";

function showErrors(){
  const core=window.articleReferenceCore;

  if(!core){
    console.warn("[ReferenceError] Reference Core not found.");
    return;
  }

  const errors=core.getErrors();

  if(!errors.length){
    return;
  }

  errors.forEach(function(error){
    if(!error||!error.element){
      return;
    }

    if(error.element.dataset.referenceError==="true"){
      return;
    }

    error.element.dataset.referenceError="true";

    const box=document.createElement("span");

    box.className="article-reference-error";
    box.textContent=error.message||"Reference Error";

    error.element.insertAdjacentElement("afterend",box);
  });

  window.dispatchEvent(
    new CustomEvent(
      "articleReferenceErrorsReady",
      {
        detail:errors
      }
    )
  );
}

window.articleReferenceError={
  process:showErrors
};
})();
