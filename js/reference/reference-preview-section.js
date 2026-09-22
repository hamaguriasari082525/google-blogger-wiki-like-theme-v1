// reference-preview-section.js

(function(){
"use strict";

function getSectionContent(target){
  const element=target?.element;
  if(!element)return [];

  const level=Number(element.tagName.substring(1));
  if(!level)return [element];

  const elements=[element];
  let current=element.nextElementSibling;

  while(current){
    if(/^H[1-6]$/.test(current.tagName)){
      const currentLevel=Number(current.tagName.substring(1));
      if(currentLevel<=level)break;
    }

    elements.push(current);
    current=current.nextElementSibling;
  }

  return elements;
}

function cleanClone(clone){
  clone.removeAttribute("id");
  clone.removeAttribute("data-type");
  clone.removeAttribute("data-label");
  clone.removeAttribute("data-backlink");

  clone.classList.remove("article-target");

  clone.querySelectorAll("[id]").forEach(function(element){
    element.removeAttribute("id");
  });

  clone.querySelectorAll("[data-type]").forEach(function(element){
    element.removeAttribute("data-type");
  });

  clone.querySelectorAll("[data-label]").forEach(function(element){
    element.removeAttribute("data-label");
  });

  clone.querySelectorAll("[data-backlink]").forEach(function(element){
    element.removeAttribute("data-backlink");
  });
}

function buildSectionPreview(target,content){
  if(!target?.element)return;

  const elements=getSectionContent(target);
  const wrapper=document.createElement("div");

  wrapper.className="article-reference-preview-section";

  elements.forEach(function(element){
    const clone=element.cloneNode(true);
    cleanClone(clone);
    wrapper.appendChild(clone);
  });

  content.appendChild(wrapper);
}

function register(){
  if(!window.articleReferencePreview){
    console.warn("[SectionPreview] Reference Preview not found.");
    return;
  }

  window.articleReferencePreview.register(
    "section",
    buildSectionPreview
  );
}

window.articleSectionPreview={
  register:register
};

register();

})();

