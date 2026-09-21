// reference-preview-equation.js

(function(){
"use strict";

function buildEquationPreview(target,content){
  if(!target||!target.element){
    return;
  }

  const equation=target.element.querySelector(".article-equation");
  const source=equation||target.element;
  const clone=source.cloneNode(true);

  clone.removeAttribute("id");

  clone.querySelectorAll("[id]").forEach(
    function(element){
      element.removeAttribute("id");
    }
  );

  const wrapper=document.createElement("div");
  wrapper.className="article-reference-preview-equation";

  wrapper.appendChild(clone);
  content.appendChild(wrapper);
}

function register(){
  if(!window.articleReferencePreview){
    console.warn("[EquationPreview] Reference Preview not found.");
    return;
  }

  window.articleReferencePreview.register(
    "equation",
    buildEquationPreview
  );
}

window.articleEquationPreview={
  register:register
};

register();

})();
