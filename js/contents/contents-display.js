// contents-display.js

(function(){
"use strict";

function buildContentsDisplay(){
  const core=window.articleContentsCore;

  if(!core){
    console.warn("[ContentsDisplay] Contents Core not found.");
    return;
  }

  const headings=core.getHeadings();

  headings.forEach(function(heading){
    const number=core.getNumber(heading);

    if(!number){
      return;
    }

    let display=
      heading.querySelector(
        ":scope > .article-section-number"
      );

    if(!display){
      display=document.createElement("span");
      display.className="article-section-number";

      heading.insertBefore(
        display,
        heading.firstChild
      );
    }

    display.textContent=number;
  });
}

window.articleContentsDisplay={
  process:buildContentsDisplay
};

})();
