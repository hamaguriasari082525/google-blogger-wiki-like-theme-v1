// reference-preview-reference.js

(function(){
"use strict";

function buildReferencePreview(target,content){
  if(!target||!target.element){
    return;
  }

  const clone=target.element.cloneNode(true);

  clone.removeAttribute("id");

  clone.querySelectorAll("[id]").forEach(
    function(element){
      element.removeAttribute("id");
    }
  );

  clone.classList.remove("article-target");
  clone.removeAttribute("data-type");
  clone.removeAttribute("data-label");
  clone.removeAttribute("data-backlink");

  const wrapper=document.createElement("div");
  wrapper.className="article-reference-preview-reference";

  wrapper.appendChild(clone);
  content.appendChild(wrapper);

  if(
    !wrapper.textContent.trim()&&
    !wrapper.querySelector("img, table, iframe, video")
  ){
    content.textContent=target.label||"";
  }
}

function register(){
  if(!window.articleReferencePreview){
    console.warn(
      "[ReferencePreviewReference] Reference Preview not found."
    );
    return;
  }

  window.articleReferencePreview.register(
    "reference",
    buildReferencePreview
  );
}

window.articleReferenceReferencePreview={
  register:register
};

register();

})();
