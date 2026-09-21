// gallery-bootstrap.js

(function(){
"use strict";

function runModule(name,module){
  if(!module||typeof module.process!=="function"){
    console.warn(
      "[GalleryBootstrap] Module not found: "+name
    );
    return false;
  }

  try{
    module.process();
    return true;
  }catch(error){
    console.error(
      "[GalleryBootstrap] Module failed: "+name,
      error
    );
    return false;
  }
}

function bootstrap(){
  if(
    window.articleGalleryBootstrap&&
    window.articleGalleryBootstrap.started
  ){
    return;
  }

  window.articleGalleryBootstrap={
    started:true,
    ready:false
  };

  console.log("[GalleryBootstrap] START");

  runModule("Gallery",window.articleGallery);

  window.articleGalleryBootstrap.ready=true;

  console.log("[GalleryBootstrap] READY");

  document.dispatchEvent(
    new CustomEvent(
      "articleGalleryBootstrapReady",
      {
        detail:window.articleGalleryBootstrap
      }
    )
  );
}

if(document.readyState==="loading"){
  document.addEventListener(
    "DOMContentLoaded",
    bootstrap
  );
}else{
  bootstrap();
}

})();
