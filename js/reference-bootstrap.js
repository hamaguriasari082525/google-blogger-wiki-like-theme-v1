// reference-bootstrap.js

(function(){
"use strict";

function runModule(name,module){
  if(!module||typeof module.process!=="function"){
    console.warn(
      "[ReferenceBootstrap] Module not found: "+name
    );
    return false;
  }

  try{
    module.process();
    return true;
  }catch(error){
    console.error(
      "[ReferenceBootstrap] Module failed: "+name,
      error
    );
    return false;
  }
}

function bootstrap(){
  if(
    window.articleReferenceBootstrap&&
    window.articleReferenceBootstrap.started
  ){
    return;
  }

  window.articleReferenceBootstrap={
    started:true,
    ready:false
  };

  console.log("[ReferenceBootstrap] START");

  runModule("Reference Core",window.articleReferenceCore);
  runModule("Reference Display",window.articleReferenceDisplay);
  runModule("Reference Layout Fig",window.articleReferenceLayoutFig);
  runModule("Reference Layout Table",window.articleReferenceLayoutTable);
  runModule("Reference Layout Equation",window.articleReferenceLayoutEquation);
  runModule("Reference Layout Code",window.articleReferenceLayoutCode);
  runModule("Reference Layout Video",window.articleReferenceLayoutVideo);
  runModule("Reference Link",window.articleReferenceLink);
  runModule("Reference Sup",window.articleReferenceSup);
  runModule("Reference Backlink",window.articleReferenceBacklink);
  runModule("Reference Error",window.articleReferenceError);
  runModule("Reference Preview",window.articleReferencePreview);
  runModule(
    "Reference Navigation Binding",
    window.articleReferenceNavigationBinding
  );
  runModule(
    "Reference Backlink Navigation",
    window.articleReferenceBacklinkNavigation
  );

  window.articleReferenceBootstrap.ready=true;

  console.log("[ReferenceBootstrap] READY");

  document.dispatchEvent(
    new CustomEvent(
      "articleReferenceBootstrapReady",
      {
        detail:window.articleReferenceBootstrap
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
