// reference-preview-table.js

(function(){
"use strict";

function buildTablePreview(target,content){
  const table=target.element.querySelector("table");

  if(!table){
    content.textContent=target.label||"";
    return;
  }

  const wrapper=document.createElement("div");
  wrapper.className="article-reference-preview-table";

  const clone=table.cloneNode(true);

  clone.removeAttribute("id");

  clone.querySelectorAll("[id]").forEach(
    function(element){
      element.removeAttribute("id");
    }
  );

  wrapper.appendChild(clone);
  content.appendChild(wrapper);
}

function register(){
  if(!window.articleReferencePreview){
    console.warn("[TablePreview] Reference Preview not found.");
    return;
  }

  window.articleReferencePreview.register(
    "table",
    buildTablePreview
  );
}

window.articleTablePreview={
  register:register
};

register();

})();
