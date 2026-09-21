// contents-core.js

(function(){
"use strict";

function buildContentsCore(){
  const article=document.querySelector(".article-body");

  if(!article){
    return;
  }

  const headings=Array.from(
    article.querySelectorAll("h2, h3")
  );

  let h2Count=0;
  let h3Count=0;

  headings.forEach(function(heading){
    if(!heading.id){
      heading.id=
        "section-"+
        Math.random().toString(36).substring(2,10);
    }

    const title=
      heading.dataset.contentsTitle||
      heading.textContent.trim();

    heading.dataset.contentsTitle=title;

    const level=heading.tagName.toLowerCase();

    if(level==="h2"){
      h2Count++;
      h3Count=0;
      heading.dataset.contentsNumber=h2Count+".";
    }else if(level==="h3"){
      h3Count++;
      heading.dataset.contentsNumber=
        h2Count+"."+h3Count;
    }
  });

  document.dispatchEvent(
    new CustomEvent(
      "articleContentsReady",
      {
        detail:headings
      }
    )
  );
}

window.articleContentsCore={
  process:buildContentsCore,

  getHeadings:function(){
    const article=document.querySelector(".article-body");

    if(!article){
      return [];
    }

    return Array.from(
      article.querySelectorAll("h2, h3")
    );
  },

  getNumber:function(heading){
    if(!heading){
      return "";
    }

    return heading.dataset.contentsNumber||"";
  },

  getTitle:function(heading){
    if(!heading){
      return "";
    }

    return (
      heading.dataset.contentsTitle||
      heading.textContent.trim()
    );
  }
};

})();
