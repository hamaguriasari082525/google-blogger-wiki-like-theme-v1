// reference-display.js

(function(){
"use strict";

const displayDefaults={
  fig:{
    targetPrefix:"図",
    targetSuffix:". ",
    referencePrefix:"図",
    referenceSuffix:""
  },
  table:{
    targetPrefix:"表",
    targetSuffix:". ",
    referencePrefix:"表",
    referenceSuffix:""
  },
  equation:{
    targetPrefix:"(",
    targetSuffix:")",
    referencePrefix:"式(",
    referenceSuffix:")"
  },
  code:{
    targetPrefix:"コード",
    targetSuffix:". ",
    referencePrefix:"コード",
    referenceSuffix:""
  },
  video:{
    targetPrefix:"動画",
    targetSuffix:". ",
    referencePrefix:"動画",
    referenceSuffix:""
  },
  article:{
    targetPrefix:"記事",
    targetSuffix:". ",
    referencePrefix:"記事",
    referenceSuffix:""
  },
  reference:{
    targetPrefix:"[",
    targetSuffix:"]",
    referencePrefix:"[",
    referenceSuffix:"]"
  },
  footnote:{
    targetPrefix:"",
    targetSuffix:"",
    referencePrefix:"",
    referenceSuffix:""
  },
  section:{
    targetPrefix:"",
    targetSuffix:"",
    referencePrefix:"",
    referenceSuffix:""
  }
};

function getConfig(type){
  return displayDefaults[type]||{
    targetPrefix:"",
    targetSuffix:"",
    referencePrefix:"",
    referenceSuffix:""
  };
}

function getValue(element,key,fallback){
  if(element&&element.dataset[key]!==undefined){
    return element.dataset[key];
  }
  return fallback;
}

function buildTargetLabel(target){
  const config=getConfig(target.type);
  const prefix=getValue(target.element,"prefix",config.targetPrefix);
  const suffix=getValue(target.element,"suffix",config.targetSuffix);

  return prefix+target.number+suffix;
}

function buildReferenceLabel(reference){
  const config=getConfig(reference.target.type);
  const prefix=getValue(reference.element,"prefix",config.referencePrefix);
  const suffix=getValue(reference.element,"suffix",config.referenceSuffix);

  return prefix+reference.number+suffix;
}

function renderTargetLabel(target){
  const element=target.element;

  if(!element){
    return;
  }

  if(element.dataset.referenceDisplayApplied==="true"){
    return;
  }

  const label=buildTargetLabel(target);
  const display=document.createElement("span");

  display.className="article-reference-display";
  display.textContent=label;

  element.appendChild(display);
  element.dataset.referenceDisplayApplied="true";
}

function renderTargetDisplays(){
  const core=window.articleReferenceCore;

  if(!core){
    console.warn("[ReferenceDisplay] Reference Core not found.");
    return;
  }

  const state=core.getState();

  state.targets.forEach(renderTargetLabel);
}

window.articleReferenceDisplay={
  process:renderTargetDisplays,
  getTargetLabel:function(target){
    return buildTargetLabel(target);
  },
  getReferenceLabel:function(reference){
    return buildReferenceLabel(reference);
  },
  getConfig:getConfig
};

document.addEventListener(
  "articleReferencesReady",
  renderTargetDisplays
);

})();