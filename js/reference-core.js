// reference-core.js

(function(){
"use strict";

const TARGET_SELECTOR=".article-target[data-label][data-type]";
const REFERENCE_SELECTOR=".article-ref[data-ref][data-type]";

const state={
  targets:new Map(),
  references:[],
  errors:[]
};

const targetTypes={
  reference:{numbering:"reference"},
  footnote:{numbering:"footnote"},
  fig:{numbering:"figure"},
  table:{numbering:"table"},
  equation:{numbering:"equation"},
  code:{numbering:"code"},
  video:{numbering:"video"},
  article:{numbering:"article"},
  section:{numbering:"section"}
};

function createTargetKey(type,label){
  return type+":"+label;
}

function getNumberingType(type){
  const config=targetTypes[type];
  return config?config.numbering:type||"default";
}

function registerTargets(){
  state.targets.clear();
  const counters=new Map();

  document.querySelectorAll(TARGET_SELECTOR).forEach(function(element){
    const type=element.dataset.type;
    const label=element.dataset.label;

    if(!type||!label)return;

    const key=createTargetKey(type,label);

    if(state.targets.has(key)){
      console.warn("[ReferenceCore] Duplicate target:",key);
      state.errors.push({
        type:"duplicate-target",
        message:"[ReferenceCore] Duplicate target: "+key,
        element:element
      });
      return;
    }

    const numberingType=getNumberingType(type);
    const number=(counters.get(numberingType)||0)+1;

    counters.set(numberingType,number);

    state.targets.set(key,{
      key:key,
      id:element.id,
      type:type,
      label:label,
      numberingType:numberingType,
      number:number,
      element:element,
      url:element.dataset.url||null,
      references:[]
    });
  });
}

function findTarget(ref){
  const type=ref.dataset.type;
  const label=ref.dataset.ref;

  if(!type||!label)return null;

  return state.targets.get(createTargetKey(type,label))||null;
}

function registerReferences(){
  state.references=[];

  state.targets.forEach(function(target){
    target.references=[];
  });

  document.querySelectorAll(REFERENCE_SELECTOR).forEach(function(element,index){
    const type=element.dataset.type;
    const label=element.dataset.ref;

    if(!type)return;

    const target=findTarget(element);

    if(!target){
      const message="[ReferenceCore] Target not found: "+type+":"+label;

      console.warn(message);

      state.errors.push({
        type:"target-not-found",
        message:message,
        element:element,
        targetType:type,
        targetLabel:label
      });
      return;
    }

    const reference={
      id:"article-reference-"+(index+1),
      element:element,
      target:target,
      number:target.number
    };

    state.references.push(reference);
    target.references.push(reference);

    element.dataset.referenceNumber=target.number;
    element.dataset.referenceTarget=target.id||target.key;
  });
}

function process(){
  state.errors=[];
  registerTargets();
  registerReferences();

  window.dispatchEvent(
    new CustomEvent("articleReferencesReady",{
      detail:state
    })
  );
}

function getTarget(key){
  return state.targets.get(key)||null;
}

function getReferences(){
  return state.references.slice();
}

function getErrors(){
  return state.errors.slice();
}

function getState(){
  return state;
}

window.articleReferenceCore={
  process:process,
  getTarget:getTarget,
  getReferences:getReferences,
  getErrors:getErrors,
  getState:getState
};

})();