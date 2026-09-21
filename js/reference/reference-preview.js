// reference-preview.js

(function(){
"use strict";

const providers=new Map();

function register(type,provider){
  if(!type||typeof provider!=="function")return;
  providers.set(type,provider);
}

function buildReferencePreviews(){
  const core=window.articleReferenceCore;

  if(!core){
    console.warn("[ReferencePreview] Reference Core not found.");
    return;
  }

  const references=core.getReferences();

  references.forEach(function(reference){
    const element=reference.element;
    const target=reference.target;

    if(!element||!target||!target.element)return;
    if(element.closest("[data-reference-preview-content='true']"))return;
    if(element.dataset.preview!=="true")return;
    if(element.dataset.previewApplied==="true")return;

    element.dataset.previewApplied="true";

    element.addEventListener("mouseenter",function(){
      showPreview(element,target);
    });

    element.addEventListener("mouseleave",function(){
      hidePreview(element);
    });
  });

  window.dispatchEvent(
    new CustomEvent(
      "articleReferencePreviewsReady",
      {detail:references}
    )
  );
}

function showPreview(element,target){
  let preview=element.querySelector(".article-reference-preview");

  if(preview){
    preview.hidden=false;
    return;
  }

  preview=document.createElement("span");
  preview.className="article-reference-preview";

  const content=document.createElement("span");
  content.className="article-reference-preview-content";
  content.dataset.referencePreviewContent="true";

  const provider=providers.get(target.type);

  if(provider){
    provider(target,content);
  }else{
    buildGenericPreview(target,content);
  }

  disablePreviewInteractions(content);

  preview.appendChild(content);
  element.appendChild(preview);
}

function disablePreviewInteractions(content){
  content.querySelectorAll("a.article-reference-link").forEach(function(link){
    link.removeAttribute("href");
    link.removeAttribute("target");
    link.removeAttribute("data-linked");
    link.removeAttribute("data-reference-navigation-applied");
  });
}

function buildGenericPreview(target,content){
  const label=target.label||"";

  if(label){
    content.textContent=label;
    return;
  }

  const text=target.element.textContent.replace(/\s+/g," ").trim();
  content.textContent=text;
}

function hidePreview(element){
  const preview=element.querySelector(".article-reference-preview");

  if(!preview)return;

  preview.hidden=true;
}

window.articleReferencePreview={
  register:register,
  process:buildReferencePreviews
};

})();
