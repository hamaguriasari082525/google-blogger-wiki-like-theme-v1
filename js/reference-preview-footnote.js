// reference-preview-footnote.js

(function(){
"use strict";

function buildFootnotePreview(target,content){
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
  wrapper.className="article-reference-preview-footnote";

  wrapper.appendChild(clone);
  content.appendChild(wrapper);
}

function register(){
  if(!window.articleReferencePreview){
    console.warn("[FootnotePreview] Reference Preview not found.");
    return;
  }

  window.articleReferencePreview.register(
    "footnote",
    buildFootnotePreview
  );
}

window.articleFootnotePreview={
  register:register
};

register();

})();
