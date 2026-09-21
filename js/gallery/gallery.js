// gallery.js

(function(){
"use strict";

function getArticle(){
  return document.querySelector(".article-body");
}

function getSourceImages(article){
  return Array.from(
    article.querySelectorAll(".article-image img")
  );
}

function createGallery(){
  const gallery=document.createElement("section");
  gallery.className="article-gallery";

  const title=document.createElement("h2");
  title.className="article-gallery-title";
  title.id="article-gallery";
  title.textContent="Gallery";

  gallery.appendChild(title);

  const viewport=document.createElement("div");
  viewport.className="article-gallery-viewport";

  const track=document.createElement("div");
  track.className="article-gallery-track";

  viewport.appendChild(track);
  viewport.appendChild(createPreviousButton());
  viewport.appendChild(createNextButton());

  gallery.appendChild(viewport);

  return {
    gallery:gallery,
    track:track,
    viewport:viewport
  };
}

function createPreviousButton(){
  const button=document.createElement("button");

  button.className="article-gallery-prev";
  button.type="button";
  button.textContent="‹";
  button.setAttribute("aria-label","前の画像");

  return button;
}

function createNextButton(){
  const button=document.createElement("button");

  button.className="article-gallery-next";
  button.type="button";
  button.textContent="›";
  button.setAttribute("aria-label","次の画像");

  return button;
}

function createGalleryItem(sourceImage){
  const item=document.createElement("figure");
  item.className="article-gallery-item";

  const image=document.createElement("img");
  image.src=sourceImage.src;
  image.alt=sourceImage.alt||"";

  item.appendChild(image);

  const sourceWrapper=sourceImage.closest(".article-image");

  const sourceCaption=sourceWrapper
    ? sourceWrapper.querySelector(".article-image-caption")
    : null;

  if(sourceCaption){
    const caption=document.createElement("figcaption");
    caption.textContent=sourceCaption.textContent;
    item.appendChild(caption);
  }

  item.addEventListener("click",function(){
    sourceImage.click();
  });

  return item;
}

function getScrollAmount(track){
  const item=track.querySelector(".article-gallery-item");

  if(!item){
    return 0;
  }

  const style=window.getComputedStyle(track);
  const gap=parseFloat(style.gap)||0;

  return (item.offsetWidth+gap)*4;
}

function updateButtons(track){
  const previous=track.parentElement.querySelector(
    ".article-gallery-prev"
  );

  const next=track.parentElement.querySelector(
    ".article-gallery-next"
  );

  if(!previous||!next){
    return;
  }

  const maxScroll=track.scrollWidth-track.clientWidth;

  previous.disabled=track.scrollLeft<=1;
  next.disabled=track.scrollLeft>=maxScroll-1;
}

function setupButtons(track,previous,next){
  previous.addEventListener("click",function(){
    track.scrollBy({
      left:-getScrollAmount(track),
      behavior:"smooth"
    });
  });

  next.addEventListener("click",function(){
    track.scrollBy({
      left:getScrollAmount(track),
      behavior:"smooth"
    });
  });

  track.addEventListener("scroll",function(){
    updateButtons(track);
  });
}

function setupDrag(track){
  let isDragging=false;
  let startX=0;
  let startScrollLeft=0;

  track.addEventListener("mousedown",function(event){
    isDragging=true;

    track.classList.add("is-dragging");

    startX=event.pageX-track.offsetLeft;
    startScrollLeft=track.scrollLeft;
  });

  track.addEventListener("mouseleave",function(){
    isDragging=false;
    track.classList.remove("is-dragging");
  });

  track.addEventListener("mouseup",function(){
    isDragging=false;
    track.classList.remove("is-dragging");
  });

  track.addEventListener("mousemove",function(event){
    if(!isDragging){
      return;
    }

    event.preventDefault();

    const x=event.pageX-track.offsetLeft;
    const walk=(x-startX)*1.2;

    track.scrollLeft=startScrollLeft-walk;
  });
}

function buildGallery(){
  const article=getArticle();

  if(!article){
    return;
  }

  if(article.querySelector(":scope > .article-gallery")){
    return;
  }

  const sourceImages=getSourceImages(article);

  if(!sourceImages.length){
    return;
  }

  const parts=createGallery();

  sourceImages.forEach(function(sourceImage){
    parts.track.appendChild(
      createGalleryItem(sourceImage)
    );
  });

  article.appendChild(parts.gallery);

  const previous=parts.viewport.querySelector(
    ".article-gallery-prev"
  );

  const next=parts.viewport.querySelector(
    ".article-gallery-next"
  );

  setupButtons(parts.track,previous,next);
  setupDrag(parts.track);
  updateButtons(parts.track);

  document.dispatchEvent(
    new CustomEvent(
      "articleGalleryReady",
      {
        detail:{
          gallery:parts.gallery,
          article:article,
          sourceImages:sourceImages
        }
      }
    )
  );
}

window.articleGallery={
  process:buildGallery
};

})();
