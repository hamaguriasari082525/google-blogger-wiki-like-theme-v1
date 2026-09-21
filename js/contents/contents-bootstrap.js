// contents-bootstrap.js

(function(){
"use strict";

function runModule(name,module){
  if(!module||typeof module.process!=="function"){
    console.warn(
      "[ContentsBootstrap] Module not found: "+name
    );
    return false;
  }

  try{
    module.process();
    return true;
  }catch(error){
    console.error(
      "[ContentsBootstrap] Module failed: "+name,
      error
    );
    return false;
  }
}

function bootstrap(){
  if(
    window.articleContentsBootstrap&&
    window.articleContentsBootstrap.started
  ){
    return;
  }

  window.articleContentsBootstrap={
    started:true,
    ready:false
  };

  console.log("[ContentsBootstrap] START");

  runModule("Contents Core",window.articleContentsCore);
  runModule("Contents Display",window.articleContentsDisplay);
  runModule("Contents List",window.articleContentsList);
  runModule("Contents Navigation",window.articleContentsNavigation);

  window.articleContentsBootstrap.ready=true;

  console.log("[ContentsBootstrap] READY");

  document.dispatchEvent(
    new CustomEvent(
      "articleContentsBootstrapReady",
      {
        detail:window.articleContentsBootstrap
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
