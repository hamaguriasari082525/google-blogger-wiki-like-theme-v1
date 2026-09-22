// reference-backlink.js

(function(){
"use strict";

function buildBacklinks(){
  const core=window.articleReferenceCore;

  if(!core){
    console.warn("[ReferenceBacklink] Reference Core not found.");
    return;
  }

  const state=core.getState();

  state.targets.forEach(function(target){
    if(
      !target.element||
      target.element.dataset.backlink!=="true"
    ){
      return;
    }

    if(target.element.dataset.backlinkApplied==="true"){
      return;
    }

    const references=target.references||[];

    if(!references.length){
      return;
    }

    const box=document.createElement("span");
    box.className="article-reference-backlinks";

    references.forEach(function(reference,index){
      if(!reference||!reference.element){
        return;
      }

      const referenceId=getReferenceId(reference,index);
      const link=document.createElement("a");

      link.className="article-reference-backlink";
      link.textContent="["+reference.number+"]";
      link.href="#"+referenceId;
      link.dataset.referenceId=referenceId;

      box.appendChild(link);

      if(index<references.length-1){
        box.appendChild(document.createTextNode(" "));
      }
    });

    if(box.children.length){
      target.element.appendChild(box);
      target.element.dataset.backlinkApplied="true";
    }
  });

  window.dispatchEvent(
    new CustomEvent(
      "articleReferenceBacklinksReady",
      {
        detail:state
      }
    )
  );
}

function getReferenceId(reference,index){
  if(reference.element.id){
    return reference.element.id;
  }

  const id=
    "article-reference-"+
    reference.number+
    "-"+
    (index+1);

  reference.element.id=id;

  return id;
}

window.articleReferenceBacklink={
  process:buildBacklinks
};

})();
