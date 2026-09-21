// reference-preview-fig.js

(function(){
"use strict";

function buildFigurePreview(target,content){
  const figure=target.element.querySelector("figure");

  if(!figure){
    content.textContent=target.label||"";
    return;
  }

  const image=figure.querySelector("img");

  if(image){
    const imageElement=document.createElement("img");

    imageElement.src=image.getAttribute("src")||"";
    imageElement.alt=image.getAttribute("alt")||"";
    imageElement.className="article-reference-preview-image";

    content.appendChild(imageElement);
  }

  const caption=figure.querySelector("figcaption");

  if(caption){
    const captionElement=document.createElement("div");

    captionElement.className="article-reference-preview-caption";
    captionElement.textContent=caption.textContent.trim();

    content.appendChild(captionElement);
  }
}

function register(){
  if(!window.articleReferencePreview){
    console.warn("[FigurePreview] Reference Preview not found.");
    return;
  }

  window.articleReferencePreview.register(
    "fig",
    buildFigurePreview
  );
}

window.articleFigurePreview={
  register:register
};

register();

})();
