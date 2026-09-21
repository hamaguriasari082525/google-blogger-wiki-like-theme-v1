// reference-preview-video.js

(function(){
"use strict";

function getYouTubeVideoId(src){
  if(!src){
    return "";
  }

  try{
    const url=new URL(src);
    const hostname=url.hostname.toLowerCase();

    if(
      hostname==="www.youtube.com"||
      hostname==="youtube.com"||
      hostname==="m.youtube.com"
    ){
      if(url.pathname.indexOf("/embed/")===0){
        return url.pathname.substring("/embed/".length).split("/")[0];
      }

      if(url.pathname==="/watch"){
        return url.searchParams.get("v")||"";
      }
    }

    if(hostname==="youtu.be"){
      return url.pathname.replace(/^\/+/,"").split("/")[0];
    }
  }catch(error){
    return "";
  }

  return "";
}

function createImagePreview(imageUrl,alt,className){
  if(!imageUrl){
    return null;
  }

  const wrapper=document.createElement("div");
  wrapper.className="article-reference-preview-video";

  const image=document.createElement("img");

  image.className="article-reference-preview-video-image";
  image.src=imageUrl;
  image.alt=alt||"Video";
  image.loading="lazy";

  image.addEventListener(
    "error",
    function(){
      wrapper.remove();
    }
  );

  wrapper.appendChild(image);

  const play=document.createElement("span");

  play.className="article-reference-preview-video-play";
  play.setAttribute("aria-hidden","true");
  play.textContent="▶";

  wrapper.appendChild(play);

  return wrapper;
}

function buildYouTubePreview(videoId,title){
  const thumbnailUrl=
    "https://img.youtube.com/vi/"+videoId+"/hqdefault.jpg";

  return createImagePreview(
    thumbnailUrl,
    title||"YouTube video"
  );
}

function buildVideoPreview(target,content){
  if(!target||!target.element){
    return;
  }

  const video=target.element.querySelector("iframe, video");
  const titleElement=target.element.querySelector(".article-video-title");
  const title=titleElement?titleElement.textContent.trim():"";

  if(
    video&&
    video.tagName.toLowerCase()==="iframe"
  ){
    const src=video.getAttribute("src")||"";
    const videoId=getYouTubeVideoId(src);

    if(videoId){
      const preview=buildYouTubePreview(videoId,title);

      if(preview){
        content.appendChild(preview);
      }
    }
  }else if(
    video&&
    video.tagName.toLowerCase()==="video"
  ){
    const poster=video.getAttribute("poster");

    if(poster){
      const preview=createImagePreview(
        poster,
        title||"Video"
      );

      if(preview){
        content.appendChild(preview);
      }
    }else{
      const placeholder=document.createElement("div");

      placeholder.className=
        "article-reference-preview-video-placeholder";

      placeholder.textContent="動画";

      content.appendChild(placeholder);
    }
  }

  if(title){
    const titleBox=document.createElement("div");

    titleBox.className=
      "article-reference-preview-video-title";

    titleBox.textContent=title;

    content.appendChild(titleBox);
  }

  if(!content.children.length){
    content.textContent=target.label||"";
  }
}

function register(){
  if(!window.articleReferencePreview){
    console.warn("[VideoPreview] Reference Preview not found.");
    return;
  }

  window.articleReferencePreview.register(
    "video",
    buildVideoPreview
  );
}

window.articleVideoPreview={
  register:register
};

register();

})();
