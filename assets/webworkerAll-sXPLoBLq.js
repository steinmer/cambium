import{E as f,m as P,d as he,u as C,J as T,a5 as fe,R as N,M as w,w as D,I as pe,ac as Le,ad as U,a2 as y,a3 as v,$ as M,ae as $,S as A,z as k,af as Ie,ag as q,N as H,ah as B,c as ee,B as G,t as Q,x as $e,G as He,ai as Y,aj as Ye,o as me,s as xe,a7 as ge,aa as _e,ak as be,p as Xe,q as je,a8 as Ne,a9 as qe,ab as Qe,al as Ke,am as Je,an as Ze,ao as X,ap as et,D as ye,n as Te,aq as O,e as b,ar as tt}from"./index-CsqZNGhN.js";import{c as z,a as rt,b as nt,B as ve}from"./colorToUniform-BXaCBwVl.js";class we{constructor(e){this._renderer=e}push(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"filter",canBundle:!1,action:"pushFilter",container:t,filterEffect:e})}pop(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"filter",action:"popFilter",canBundle:!1})}execute(e){e.action==="pushFilter"?this._renderer.filter.push(e):e.action==="popFilter"&&this._renderer.filter.pop()}destroy(){this._renderer=null}}we.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"filter"};function at(a,e){e.clear();const t=e.matrix;for(let r=0;r<a.length;r++){const n=a[r];n.globalDisplayStatus<7||(e.matrix=n.worldTransform,e.addBounds(n.bounds))}return e.matrix=t,e}const st=new fe({attributes:{aPosition:{buffer:new Float32Array([0,0,1,0,1,1,0,1]),format:"float32x2",stride:2*4,offset:0}},indexBuffer:new Uint32Array([0,1,2,0,2,3])});class ot{constructor(){this.skip=!1,this.inputTexture=null,this.backTexture=null,this.filters=null,this.bounds=new pe,this.container=null,this.blendRequired=!1,this.outputRenderSurface=null,this.outputOffset={x:0,y:0},this.globalFrame={x:0,y:0,width:0,height:0}}}class Ce{constructor(e){this._filterStackIndex=0,this._filterStack=[],this._filterGlobalUniforms=new P({uInputSize:{value:new Float32Array(4),type:"vec4<f32>"},uInputPixel:{value:new Float32Array(4),type:"vec4<f32>"},uInputClamp:{value:new Float32Array(4),type:"vec4<f32>"},uOutputFrame:{value:new Float32Array(4),type:"vec4<f32>"},uGlobalFrame:{value:new Float32Array(4),type:"vec4<f32>"},uOutputTexture:{value:new Float32Array(4),type:"vec4<f32>"}}),this._globalFilterBindGroup=new he({}),this.renderer=e}get activeBackTexture(){var e;return(e=this._activeFilterData)==null?void 0:e.backTexture}push(e){const t=this.renderer,r=e.filterEffect.filters,n=this._pushFilterData();n.skip=!1,n.filters=r,n.container=e.container,n.outputRenderSurface=t.renderTarget.renderSurface;const s=t.renderTarget.renderTarget.colorTexture.source,o=s.resolution,i=s.antialias;if(r.length===0){n.skip=!0;return}const l=n.bounds;if(e.renderables?at(e.renderables,l):e.filterEffect.filterArea?(l.clear(),l.addRect(e.filterEffect.filterArea),l.applyMatrix(e.container.worldTransform)):e.container.getFastGlobalBounds(!0,l),e.container){const x=(e.container.renderGroup||e.container.parentRenderGroup).cacheToLocalTransform;x&&l.applyMatrix(x)}if(this._calculateFilterBounds(n,t.renderTarget.rootViewPort,i,o,1),n.skip)return;const u=this._getPreviousFilterData();let h=o,d=0,c=0;u&&(d=u.bounds.minX,c=u.bounds.minY,h=u.inputTexture.source._resolution),n.outputOffset.x=l.minX-d,n.outputOffset.y=l.minY-c;const p=n.globalFrame;if(p.x=d*h,p.y=c*h,p.width=s.width*h,p.height=s.height*h,n.backTexture=C.EMPTY,n.blendRequired){t.renderTarget.finishRenderPass();const g=t.renderTarget.getRenderTarget(n.outputRenderSurface);n.backTexture=this.getBackTexture(g,l,u==null?void 0:u.bounds)}n.inputTexture=T.getOptimalTexture(l.width,l.height,n.resolution,n.antialias),t.renderTarget.bind(n.inputTexture,!0),t.globalUniforms.push({offset:l})}generateFilteredTexture({texture:e,filters:t}){const r=this._pushFilterData();this._activeFilterData=r,r.skip=!1,r.filters=t;const n=e.source,s=n.resolution,o=n.antialias;if(t.length===0)return r.skip=!0,e;const i=r.bounds;if(i.addRect(e.frame),this._calculateFilterBounds(r,i.rectangle,o,s,0),r.skip)return e;const l=s,u=0,h=0;r.outputOffset.x=-i.minX,r.outputOffset.y=-i.minY;const d=r.globalFrame;d.x=u*l,d.y=h*l,d.width=n.width*l,d.height=n.height*l,r.outputRenderSurface=T.getOptimalTexture(i.width,i.height,r.resolution,r.antialias),r.backTexture=C.EMPTY,r.inputTexture=e,this.renderer.renderTarget.finishRenderPass(),this._applyFiltersToTexture(r,!0);const p=r.outputRenderSurface;return p.source.alphaMode="premultiplied-alpha",p}pop(){const e=this.renderer,t=this._popFilterData();t.skip||(e.globalUniforms.pop(),e.renderTarget.finishRenderPass(),this._activeFilterData=t,this._applyFiltersToTexture(t,!1),t.blendRequired&&T.returnTexture(t.backTexture),T.returnTexture(t.inputTexture))}getBackTexture(e,t,r){const n=e.colorTexture.source._resolution,s=T.getOptimalTexture(t.width,t.height,n,!1);let o=t.minX,i=t.minY;r&&(o-=r.minX,i-=r.minY),o=Math.floor(o*n),i=Math.floor(i*n);const l=Math.ceil(t.width*n),u=Math.ceil(t.height*n);return this.renderer.renderTarget.copyToTexture(e,s,{x:o,y:i},{width:l,height:u},{x:0,y:0}),s}applyFilter(e,t,r,n){const s=this.renderer,o=this._activeFilterData,i=o.outputRenderSurface,l=this._filterGlobalUniforms,u=l.uniforms,h=u.uOutputFrame,d=u.uInputSize,c=u.uInputPixel,p=u.uInputClamp,g=u.uGlobalFrame,x=u.uOutputTexture;i===r?(h[0]=o.outputOffset.x,h[1]=o.outputOffset.y):(h[0]=0,h[1]=0),h[2]=t.frame.width,h[3]=t.frame.height,d[0]=t.source.width,d[1]=t.source.height,d[2]=1/d[0],d[3]=1/d[1],c[0]=t.source.pixelWidth,c[1]=t.source.pixelHeight,c[2]=1/c[0],c[3]=1/c[1],p[0]=.5*c[2],p[1]=.5*c[3],p[2]=t.frame.width*d[2]-.5*c[2],p[3]=t.frame.height*d[3]-.5*c[3],g[0]=o.globalFrame.x,g[1]=o.globalFrame.y,g[2]=o.globalFrame.width,g[3]=o.globalFrame.height,r instanceof C&&(r.source.resource=null);const _=this.renderer.renderTarget.getRenderTarget(r);if(s.renderTarget.bind(r,!!n),r instanceof C?(x[0]=r.frame.width,x[1]=r.frame.height):(x[0]=_.width,x[1]=_.height),x[2]=_.isRoot?-1:1,l.update(),s.renderPipes.uniformBatch){const m=s.renderPipes.uniformBatch.getUboResource(l);this._globalFilterBindGroup.setResource(m,0)}else this._globalFilterBindGroup.setResource(l,0);this._globalFilterBindGroup.setResource(t.source,1),this._globalFilterBindGroup.setResource(t.source.style,2),e.groups[0]=this._globalFilterBindGroup,s.encoder.draw({geometry:st,shader:e,state:e._state,topology:"triangle-list"}),s.type===N.WEBGL&&s.renderTarget.finishRenderPass()}calculateSpriteMatrix(e,t){const r=this._activeFilterData,n=e.set(r.inputTexture._source.width,0,0,r.inputTexture._source.height,r.bounds.minX,r.bounds.minY),s=t.worldTransform.copyTo(w.shared),o=t.renderGroup||t.parentRenderGroup;return o&&o.cacheToLocalTransform&&s.prepend(o.cacheToLocalTransform),s.invert(),n.prepend(s),n.scale(1/t.texture.frame.width,1/t.texture.frame.height),n.translate(t.anchor.x,t.anchor.y),n}destroy(){}_applyFiltersToTexture(e,t){const r=e.inputTexture,n=e.bounds,s=e.filters;if(this._globalFilterBindGroup.setResource(r.source.style,2),this._globalFilterBindGroup.setResource(e.backTexture.source,3),s.length===1)s[0].apply(this,r,e.outputRenderSurface,t);else{let o=e.inputTexture;const i=T.getOptimalTexture(n.width,n.height,o.source._resolution,!1);let l=i,u=0;for(u=0;u<s.length-1;++u){s[u].apply(this,o,l,!0);const d=o;o=l,l=d}s[u].apply(this,o,e.outputRenderSurface,t),T.returnTexture(i)}}_calculateFilterBounds(e,t,r,n,s){var x;const o=this.renderer,i=e.bounds,l=e.filters;let u=1/0,h=0,d=!0,c=!1,p=!1,g=!0;for(let _=0;_<l.length;_++){const m=l[_];if(u=Math.min(u,m.resolution==="inherit"?n:m.resolution),h+=m.padding,m.antialias==="off"?d=!1:m.antialias==="inherit"&&d&&(d=r),m.clipToViewport||(g=!1),!!!(m.compatibleRenderers&o.type)){p=!1;break}if(m.blendRequired&&!(((x=o.backBuffer)==null?void 0:x.useBackBuffer)??!0)){D("Blend filter requires backBuffer on WebGL renderer to be enabled. Set `useBackBuffer: true` in the renderer options."),p=!1;break}p=m.enabled||p,c||(c=m.blendRequired)}if(!p){e.skip=!0;return}if(g&&i.fitBounds(0,t.width/n,0,t.height/n),i.scale(u).ceil().scale(1/u).pad((h|0)*s),!i.isPositive){e.skip=!0;return}e.antialias=d,e.resolution=u,e.blendRequired=c}_popFilterData(){return this._filterStackIndex--,this._filterStack[this._filterStackIndex]}_getPreviousFilterData(){let e,t=this._filterStackIndex-1;for(;t>1&&(t--,e=this._filterStack[t],!!e.skip););return e}_pushFilterData(){let e=this._filterStack[this._filterStackIndex];return e||(e=this._filterStack[this._filterStackIndex]=new ot),this._filterStackIndex++,e}}Ce.extension={type:[f.WebGLSystem,f.WebGPUSystem],name:"filter"};class V extends Le{constructor(e){e instanceof U&&(e={context:e});const{context:t,roundPixels:r,...n}=e||{};super({label:"Graphics",...n}),this.renderPipeId="graphics",t?this._context=t:this._context=this._ownedContext=new U,this._context.on("update",this.onViewUpdate,this),this.didViewUpdate=!0,this.allowChildren=!1,this.roundPixels=r??!1}set context(e){e!==this._context&&(this._context.off("update",this.onViewUpdate,this),this._context=e,this._context.on("update",this.onViewUpdate,this),this.onViewUpdate())}get context(){return this._context}get bounds(){return this._context.bounds}updateBounds(){}containsPoint(e){return this._context.containsPoint(e)}destroy(e){this._ownedContext&&!e?this._ownedContext.destroy(e):(e===!0||(e==null?void 0:e.context)===!0)&&this._context.destroy(e),this._ownedContext=null,this._context=null,super.destroy(e)}_callContextMethod(e,t){return this.context[e](...t),this}setFillStyle(...e){return this._callContextMethod("setFillStyle",e)}setStrokeStyle(...e){return this._callContextMethod("setStrokeStyle",e)}fill(...e){return this._callContextMethod("fill",e)}stroke(...e){return this._callContextMethod("stroke",e)}texture(...e){return this._callContextMethod("texture",e)}beginPath(){return this._callContextMethod("beginPath",[])}cut(){return this._callContextMethod("cut",[])}arc(...e){return this._callContextMethod("arc",e)}arcTo(...e){return this._callContextMethod("arcTo",e)}arcToSvg(...e){return this._callContextMethod("arcToSvg",e)}bezierCurveTo(...e){return this._callContextMethod("bezierCurveTo",e)}closePath(){return this._callContextMethod("closePath",[])}ellipse(...e){return this._callContextMethod("ellipse",e)}circle(...e){return this._callContextMethod("circle",e)}path(...e){return this._callContextMethod("path",e)}lineTo(...e){return this._callContextMethod("lineTo",e)}moveTo(...e){return this._callContextMethod("moveTo",e)}quadraticCurveTo(...e){return this._callContextMethod("quadraticCurveTo",e)}rect(...e){return this._callContextMethod("rect",e)}roundRect(...e){return this._callContextMethod("roundRect",e)}poly(...e){return this._callContextMethod("poly",e)}regularPoly(...e){return this._callContextMethod("regularPoly",e)}roundPoly(...e){return this._callContextMethod("roundPoly",e)}roundShape(...e){return this._callContextMethod("roundShape",e)}filletRect(...e){return this._callContextMethod("filletRect",e)}chamferRect(...e){return this._callContextMethod("chamferRect",e)}star(...e){return this._callContextMethod("star",e)}svg(...e){return this._callContextMethod("svg",e)}restore(...e){return this._callContextMethod("restore",e)}save(){return this._callContextMethod("save",[])}getTransform(){return this.context.getTransform()}resetTransform(){return this._callContextMethod("resetTransform",[])}rotateTransform(...e){return this._callContextMethod("rotate",e)}scaleTransform(...e){return this._callContextMethod("scale",e)}setTransform(...e){return this._callContextMethod("setTransform",e)}transform(...e){return this._callContextMethod("transform",e)}translateTransform(...e){return this._callContextMethod("translate",e)}clear(){return this._callContextMethod("clear",[])}get fillStyle(){return this._context.fillStyle}set fillStyle(e){this._context.fillStyle=e}get strokeStyle(){return this._context.strokeStyle}set strokeStyle(e){this._context.strokeStyle=e}clone(e=!1){return e?new V(this._context.clone()):(this._ownedContext=null,new V(this._context))}lineStyle(e,t,r){y(v,"Graphics#lineStyle is no longer needed. Use Graphics#setStrokeStyle to set the stroke style.");const n={};return e&&(n.width=e),t&&(n.color=t),r&&(n.alpha=r),this.context.strokeStyle=n,this}beginFill(e,t){y(v,"Graphics#beginFill is no longer needed. Use Graphics#fill to fill the shape with the desired style.");const r={};return e!==void 0&&(r.color=e),t!==void 0&&(r.alpha=t),this.context.fillStyle=r,this}endFill(){y(v,"Graphics#endFill is no longer needed. Use Graphics#fill to fill the shape with the desired style."),this.context.fill();const e=this.context.strokeStyle;return(e.width!==U.defaultStrokeStyle.width||e.color!==U.defaultStrokeStyle.color||e.alpha!==U.defaultStrokeStyle.alpha)&&this.context.stroke(),this}drawCircle(...e){return y(v,"Graphics#drawCircle has been renamed to Graphics#circle"),this._callContextMethod("circle",e)}drawEllipse(...e){return y(v,"Graphics#drawEllipse has been renamed to Graphics#ellipse"),this._callContextMethod("ellipse",e)}drawPolygon(...e){return y(v,"Graphics#drawPolygon has been renamed to Graphics#poly"),this._callContextMethod("poly",e)}drawRect(...e){return y(v,"Graphics#drawRect has been renamed to Graphics#rect"),this._callContextMethod("rect",e)}drawRoundedRect(...e){return y(v,"Graphics#drawRoundedRect has been renamed to Graphics#roundRect"),this._callContextMethod("roundRect",e)}drawStar(...e){return y(v,"Graphics#drawStar has been renamed to Graphics#star"),this._callContextMethod("star",e)}}function it(a){const e=a._stroke,t=a._fill,n=[`div { ${[`color: ${M.shared.setValue(t.color).toHex()}`,`font-size: ${a.fontSize}px`,`font-family: ${a.fontFamily}`,`font-weight: ${a.fontWeight}`,`font-style: ${a.fontStyle}`,`font-variant: ${a.fontVariant}`,`letter-spacing: ${a.letterSpacing}px`,`text-align: ${a.align}`,`padding: ${a.padding}px`,`white-space: ${a.whiteSpace==="pre"&&a.wordWrap?"pre-wrap":a.whiteSpace}`,...a.lineHeight?[`line-height: ${a.lineHeight}px`]:[],...a.wordWrap?[`word-wrap: ${a.breakWords?"break-all":"break-word"}`,`max-width: ${a.wordWrapWidth}px`]:[],...e?[Pe(e)]:[],...a.dropShadow?[Se(a.dropShadow)]:[],...a.cssOverrides].join(";")} }`];return lt(a.tagStyles,n),n.join(" ")}function Se(a){const e=M.shared.setValue(a.color).setAlpha(a.alpha).toHexa(),t=Math.round(Math.cos(a.angle)*a.distance),r=Math.round(Math.sin(a.angle)*a.distance),n=`${t}px ${r}px`;return a.blur>0?`text-shadow: ${n} ${a.blur}px ${e}`:`text-shadow: ${n} ${e}`}function Pe(a){return[`-webkit-text-stroke-width: ${a.width}px`,`-webkit-text-stroke-color: ${M.shared.setValue(a.color).toHex()}`,`text-stroke-width: ${a.width}px`,`text-stroke-color: ${M.shared.setValue(a.color).toHex()}`,"paint-order: stroke"].join(";")}const te={fontSize:"font-size: {{VALUE}}px",fontFamily:"font-family: {{VALUE}}",fontWeight:"font-weight: {{VALUE}}",fontStyle:"font-style: {{VALUE}}",fontVariant:"font-variant: {{VALUE}}",letterSpacing:"letter-spacing: {{VALUE}}px",align:"text-align: {{VALUE}}",padding:"padding: {{VALUE}}px",whiteSpace:"white-space: {{VALUE}}",lineHeight:"line-height: {{VALUE}}px",wordWrapWidth:"max-width: {{VALUE}}px"},re={fill:a=>`color: ${M.shared.setValue(a).toHex()}`,breakWords:a=>`word-wrap: ${a?"break-all":"break-word"}`,stroke:Pe,dropShadow:Se};function lt(a,e){for(const t in a){const r=a[t],n=[];for(const s in r)re[s]?n.push(re[s](r[s])):te[s]&&n.push(te[s].replace("{{VALUE}}",r[s]));e.push(`${t} { ${n.join(";")} }`)}}class K extends ${constructor(e={}){super(e),this._cssOverrides=[],this.cssOverrides=e.cssOverrides??[],this.tagStyles=e.tagStyles??{}}set cssOverrides(e){this._cssOverrides=e instanceof Array?e:[e],this.update()}get cssOverrides(){return this._cssOverrides}update(){this._cssStyle=null,super.update()}clone(){return new K({align:this.align,breakWords:this.breakWords,dropShadow:this.dropShadow?{...this.dropShadow}:null,fill:this._fill,fontFamily:this.fontFamily,fontSize:this.fontSize,fontStyle:this.fontStyle,fontVariant:this.fontVariant,fontWeight:this.fontWeight,letterSpacing:this.letterSpacing,lineHeight:this.lineHeight,padding:this.padding,stroke:this._stroke,whiteSpace:this.whiteSpace,wordWrap:this.wordWrap,wordWrapWidth:this.wordWrapWidth,cssOverrides:this.cssOverrides,tagStyles:{...this.tagStyles}})}get cssStyle(){return this._cssStyle||(this._cssStyle=it(this)),this._cssStyle}addOverride(...e){const t=e.filter(r=>!this.cssOverrides.includes(r));t.length>0&&(this.cssOverrides.push(...t),this.update())}removeOverride(...e){const t=e.filter(r=>this.cssOverrides.includes(r));t.length>0&&(this.cssOverrides=this.cssOverrides.filter(r=>!t.includes(r)),this.update())}set fill(e){typeof e!="string"&&typeof e!="number"&&D("[HTMLTextStyle] only color fill is not supported by HTMLText"),super.fill=e}set stroke(e){e&&typeof e!="string"&&typeof e!="number"&&D("[HTMLTextStyle] only color stroke is not supported by HTMLText"),super.stroke=e}}const ne="http://www.w3.org/2000/svg",ae="http://www.w3.org/1999/xhtml";class Me{constructor(){this.svgRoot=document.createElementNS(ne,"svg"),this.foreignObject=document.createElementNS(ne,"foreignObject"),this.domElement=document.createElementNS(ae,"div"),this.styleElement=document.createElementNS(ae,"style"),this.image=new Image;const{foreignObject:e,svgRoot:t,styleElement:r,domElement:n}=this;e.setAttribute("width","10000"),e.setAttribute("height","10000"),e.style.overflow="hidden",t.appendChild(e),e.appendChild(r),e.appendChild(n)}}let se;function ut(a,e,t,r){r||(r=se||(se=new Me));const{domElement:n,styleElement:s,svgRoot:o}=r;n.innerHTML=`<style>${e.cssStyle};</style><div style='padding:0'>${a}</div>`,n.setAttribute("style","transform-origin: top left; display: inline-block"),t&&(s.textContent=t),document.body.appendChild(o);const i=n.getBoundingClientRect();o.remove();const l=e.padding*2;return{width:i.width-l,height:i.height-l}}class dt{constructor(){this.batches=[],this.batched=!1}destroy(){this.batches.forEach(e=>{k.return(e)}),this.batches.length=0}}class Ue{constructor(e,t){this.state=A.for2d(),this.renderer=e,this._adaptor=t,this.renderer.runners.contextChange.add(this)}contextChange(){this._adaptor.contextChange(this.renderer)}validateRenderable(e){const t=e.context,r=!!e._gpuData,n=this.renderer.graphicsContext.updateGpuContext(t);return!!(n.isBatchable||r!==n.isBatchable)}addRenderable(e,t){const r=this.renderer.graphicsContext.updateGpuContext(e.context);e.didViewUpdate&&this._rebuild(e),r.isBatchable?this._addToBatcher(e,t):(this.renderer.renderPipes.batch.break(t),t.add(e))}updateRenderable(e){const r=this._getGpuDataForRenderable(e).batches;for(let n=0;n<r.length;n++){const s=r[n];s._batcher.updateElement(s)}}execute(e){if(!e.isRenderable)return;const t=this.renderer,r=e.context;if(!t.graphicsContext.getGpuContext(r).batches.length)return;const s=r.customShader||this._adaptor.shader;this.state.blendMode=e.groupBlendMode;const o=s.resources.localUniforms.uniforms;o.uTransformMatrix=e.groupTransform,o.uRound=t._roundPixels|e._roundPixels,z(e.groupColorAlpha,o.uColor,0),this._adaptor.execute(this,e)}_rebuild(e){const t=this._getGpuDataForRenderable(e),r=this.renderer.graphicsContext.updateGpuContext(e.context);t.destroy(),r.isBatchable&&this._updateBatchesForRenderable(e,t)}_addToBatcher(e,t){const r=this.renderer.renderPipes.batch,n=this._getGpuDataForRenderable(e).batches;for(let s=0;s<n.length;s++){const o=n[s];r.addToBatch(o,t)}}_getGpuDataForRenderable(e){return e._gpuData[this.renderer.uid]||this._initGpuDataForRenderable(e)}_initGpuDataForRenderable(e){const t=new dt;return e._gpuData[this.renderer.uid]=t,t}_updateBatchesForRenderable(e,t){const r=e.context,n=this.renderer.graphicsContext.getGpuContext(r),s=this.renderer._roundPixels|e._roundPixels;t.batches=n.batches.map(o=>{const i=k.get(Ie);return o.copyTo(i),i.renderable=e,i.roundPixels=s,i})}destroy(){this.renderer=null,this._adaptor.destroy(),this._adaptor=null,this.state=null}}Ue.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"graphics"};class J{constructor(){this.batcherName="default",this.packAsQuad=!1,this.indexOffset=0,this.attributeOffset=0,this.roundPixels=0,this._batcher=null,this._batch=null,this._textureMatrixUpdateId=-1,this._uvUpdateId=-1}get blendMode(){return this.renderable.groupBlendMode}get topology(){return this._topology||this.geometry.topology}set topology(e){this._topology=e}reset(){this.renderable=null,this.texture=null,this._batcher=null,this._batch=null,this.geometry=null,this._uvUpdateId=-1,this._textureMatrixUpdateId=-1}setTexture(e){this.texture!==e&&(this.texture=e,this._textureMatrixUpdateId=-1)}get uvs(){const t=this.geometry.getBuffer("aUV"),r=t.data;let n=r;const s=this.texture.textureMatrix;return s.isSimple||(n=this._transformedUvs,(this._textureMatrixUpdateId!==s._updateID||this._uvUpdateId!==t._updateID)&&((!n||n.length<r.length)&&(n=this._transformedUvs=new Float32Array(r.length)),this._textureMatrixUpdateId=s._updateID,this._uvUpdateId=t._updateID,s.multiplyUvs(r,n))),n}get positions(){return this.geometry.positions}get indices(){return this.geometry.indices}get color(){return this.renderable.groupColorAlpha}get groupTransform(){return this.renderable.groupTransform}get attributeSize(){return this.geometry.positions.length/2}get indexSize(){return this.geometry.indices.length}}class oe{destroy(){}}class Be{constructor(e,t){this.localUniforms=new P({uTransformMatrix:{value:new w,type:"mat3x3<f32>"},uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uRound:{value:0,type:"f32"}}),this.localUniformsBindGroup=new he({0:this.localUniforms}),this.renderer=e,this._adaptor=t,this._adaptor.init()}validateRenderable(e){const t=this._getMeshData(e),r=t.batched,n=e.batched;if(t.batched=n,r!==n)return!0;if(n){const s=e._geometry;if(s.indices.length!==t.indexSize||s.positions.length!==t.vertexSize)return t.indexSize=s.indices.length,t.vertexSize=s.positions.length,!0;const o=this._getBatchableMesh(e);return o.texture.uid!==e._texture.uid&&(o._textureMatrixUpdateId=-1),!o._batcher.checkAndUpdateTexture(o,e._texture)}return!1}addRenderable(e,t){const r=this.renderer.renderPipes.batch,{batched:n}=this._getMeshData(e);if(n){const s=this._getBatchableMesh(e);s.setTexture(e._texture),s.geometry=e._geometry,r.addToBatch(s,t)}else r.break(t),t.add(e)}updateRenderable(e){if(e.batched){const t=this._getBatchableMesh(e);t.setTexture(e._texture),t.geometry=e._geometry,t._batcher.updateElement(t)}}execute(e){if(!e.isRenderable)return;e.state.blendMode=q(e.groupBlendMode,e.texture._source);const t=this.localUniforms;t.uniforms.uTransformMatrix=e.groupTransform,t.uniforms.uRound=this.renderer._roundPixels|e._roundPixels,t.update(),z(e.groupColorAlpha,t.uniforms.uColor,0),this._adaptor.execute(this,e)}_getMeshData(e){var t,r;return(t=e._gpuData)[r=this.renderer.uid]||(t[r]=new oe),e._gpuData[this.renderer.uid].meshData||this._initMeshData(e)}_initMeshData(e){var t,r;return e._gpuData[this.renderer.uid].meshData={batched:e.batched,indexSize:(t=e._geometry.indices)==null?void 0:t.length,vertexSize:(r=e._geometry.positions)==null?void 0:r.length},e._gpuData[this.renderer.uid].meshData}_getBatchableMesh(e){var t,r;return(t=e._gpuData)[r=this.renderer.uid]||(t[r]=new oe),e._gpuData[this.renderer.uid].batchableMesh||this._initBatchableMesh(e)}_initBatchableMesh(e){const t=new J;return t.renderable=e,t.setTexture(e._texture),t.transform=e.groupTransform,t.roundPixels=this.renderer._roundPixels|e._roundPixels,e._gpuData[this.renderer.uid].batchableMesh=t,t}destroy(){this.localUniforms=null,this.localUniformsBindGroup=null,this._adaptor.destroy(),this._adaptor=null,this.renderer=null}}Be.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"mesh"};class ct{execute(e,t){const r=e.state,n=e.renderer,s=t.shader||e.defaultShader;s.resources.uTexture=t.texture._source,s.resources.uniforms=e.localUniforms;const o=n.gl,i=e.getBuffers(t);n.shader.bind(s),n.state.set(r),n.geometry.bind(i.geometry,s.glProgram);const u=i.geometry.indexBuffer.data.BYTES_PER_ELEMENT===2?o.UNSIGNED_SHORT:o.UNSIGNED_INT;o.drawElements(o.TRIANGLES,t.particleChildren.length*6,u,0)}}class ht{execute(e,t){const r=e.renderer,n=t.shader||e.defaultShader;n.groups[0]=r.renderPipes.uniformBatch.getUniformBindGroup(e.localUniforms,!0),n.groups[1]=r.texture.getTextureBindGroup(t.texture);const s=e.state,o=e.getBuffers(t);r.encoder.draw({geometry:o.geometry,shader:t.shader||e.defaultShader,state:s,size:t.particleChildren.length*6})}}function ie(a,e=null){const t=a*6;if(t>65535?e||(e=new Uint32Array(t)):e||(e=new Uint16Array(t)),e.length!==t)throw new Error(`Out buffer length is incorrect, got ${e.length} and expected ${t}`);for(let r=0,n=0;r<t;r+=6,n+=4)e[r+0]=n+0,e[r+1]=n+1,e[r+2]=n+2,e[r+3]=n+0,e[r+4]=n+2,e[r+5]=n+3;return e}function ft(a){return{dynamicUpdate:le(a,!0),staticUpdate:le(a,!1)}}function le(a,e){const t=[];t.push(`

        var index = 0;

        for (let i = 0; i < ps.length; ++i)
        {
            const p = ps[i];

            `);let r=0;for(const s in a){const o=a[s];if(e!==o.dynamic)continue;t.push(`offset = index + ${r}`),t.push(o.code);const i=H(o.format);r+=i.stride/4}t.push(`
            index += stride * 4;
        }
    `),t.unshift(`
        var stride = ${r};
    `);const n=t.join(`
`);return new Function("ps","f32v","u32v",n)}class pt{constructor(e){this._size=0,this._generateParticleUpdateCache={};const t=this._size=e.size??1e3,r=e.properties;let n=0,s=0;for(const h in r){const d=r[h],c=H(d.format);d.dynamic?s+=c.stride:n+=c.stride}this._dynamicStride=s/4,this._staticStride=n/4,this.staticAttributeBuffer=new B(t*4*n),this.dynamicAttributeBuffer=new B(t*4*s),this.indexBuffer=ie(t);const o=new fe;let i=0,l=0;this._staticBuffer=new ee({data:new Float32Array(1),label:"static-particle-buffer",shrinkToFit:!1,usage:G.VERTEX|G.COPY_DST}),this._dynamicBuffer=new ee({data:new Float32Array(1),label:"dynamic-particle-buffer",shrinkToFit:!1,usage:G.VERTEX|G.COPY_DST});for(const h in r){const d=r[h],c=H(d.format);d.dynamic?(o.addAttribute(d.attributeName,{buffer:this._dynamicBuffer,stride:this._dynamicStride*4,offset:i*4,format:d.format}),i+=c.size):(o.addAttribute(d.attributeName,{buffer:this._staticBuffer,stride:this._staticStride*4,offset:l*4,format:d.format}),l+=c.size)}o.addIndex(this.indexBuffer);const u=this.getParticleUpdate(r);this._dynamicUpload=u.dynamicUpdate,this._staticUpload=u.staticUpdate,this.geometry=o}getParticleUpdate(e){const t=mt(e);return this._generateParticleUpdateCache[t]?this._generateParticleUpdateCache[t]:(this._generateParticleUpdateCache[t]=this.generateParticleUpdate(e),this._generateParticleUpdateCache[t])}generateParticleUpdate(e){return ft(e)}update(e,t){e.length>this._size&&(t=!0,this._size=Math.max(e.length,this._size*1.5|0),this.staticAttributeBuffer=new B(this._size*this._staticStride*4*4),this.dynamicAttributeBuffer=new B(this._size*this._dynamicStride*4*4),this.indexBuffer=ie(this._size),this.geometry.indexBuffer.setDataWithSize(this.indexBuffer,this.indexBuffer.byteLength,!0));const r=this.dynamicAttributeBuffer;if(this._dynamicUpload(e,r.float32View,r.uint32View),this._dynamicBuffer.setDataWithSize(this.dynamicAttributeBuffer.float32View,e.length*this._dynamicStride*4,!0),t){const n=this.staticAttributeBuffer;this._staticUpload(e,n.float32View,n.uint32View),this._staticBuffer.setDataWithSize(n.float32View,e.length*this._staticStride*4,!0)}}destroy(){this._staticBuffer.destroy(),this._dynamicBuffer.destroy(),this.geometry.destroy()}}function mt(a){const e=[];for(const t in a){const r=a[t];e.push(t,r.code,r.dynamic?"d":"s")}return e.join("_")}var xt=`varying vec2 vUV;
varying vec4 vColor;

uniform sampler2D uTexture;

void main(void){
    vec4 color = texture2D(uTexture, vUV) * vColor;
    gl_FragColor = color;
}`,gt=`attribute vec2 aVertex;
attribute vec2 aUV;
attribute vec4 aColor;

attribute vec2 aPosition;
attribute float aRotation;

uniform mat3 uTranslationMatrix;
uniform float uRound;
uniform vec2 uResolution;
uniform vec4 uColor;

varying vec2 vUV;
varying vec4 vColor;

vec2 roundPixels(vec2 position, vec2 targetSize)
{       
    return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
}

void main(void){
    float cosRotation = cos(aRotation);
    float sinRotation = sin(aRotation);
    float x = aVertex.x * cosRotation - aVertex.y * sinRotation;
    float y = aVertex.x * sinRotation + aVertex.y * cosRotation;

    vec2 v = vec2(x, y);
    v = v + aPosition;

    gl_Position = vec4((uTranslationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

    if(uRound == 1.0)
    {
        gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
    }

    vUV = aUV;
    vColor = vec4(aColor.rgb * aColor.a, aColor.a) * uColor;
}
`,ue=`
struct ParticleUniforms {
  uProjectionMatrix:mat3x3<f32>,
  uColor:vec4<f32>,
  uResolution:vec2<f32>,
  uRoundPixels:f32,
};

@group(0) @binding(0) var<uniform> uniforms: ParticleUniforms;

@group(1) @binding(0) var uTexture: texture_2d<f32>;
@group(1) @binding(1) var uSampler : sampler;

struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) color : vec4<f32>,
  };
@vertex
fn mainVertex(
  @location(0) aVertex: vec2<f32>,
  @location(1) aPosition: vec2<f32>,
  @location(2) aUV: vec2<f32>,
  @location(3) aColor: vec4<f32>,
  @location(4) aRotation: f32,
) -> VSOutput {
  
   let v = vec2(
       aVertex.x * cos(aRotation) - aVertex.y * sin(aRotation),
       aVertex.x * sin(aRotation) + aVertex.y * cos(aRotation)
   ) + aPosition;

   let position = vec4((uniforms.uProjectionMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

    let vColor = vec4(aColor.rgb * aColor.a, aColor.a) * uniforms.uColor;

  return VSOutput(
   position,
   aUV,
   vColor,
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @location(1) color: vec4<f32>,
  @builtin(position) position: vec4<f32>,
) -> @location(0) vec4<f32> {

    var sample = textureSample(uTexture, uSampler, uv) * color;
   
    return sample;
}`;class _t extends Q{constructor(){const e=$e.from({vertex:gt,fragment:xt}),t=He.from({fragment:{source:ue,entryPoint:"mainFragment"},vertex:{source:ue,entryPoint:"mainVertex"}});super({glProgram:e,gpuProgram:t,resources:{uTexture:C.WHITE.source,uSampler:new Y({}),uniforms:{uTranslationMatrix:{value:new w,type:"mat3x3<f32>"},uColor:{value:new M(16777215),type:"vec4<f32>"},uRound:{value:1,type:"f32"},uResolution:{value:[0,0],type:"vec2<f32>"}}}})}}class Ge{constructor(e,t){this.state=A.for2d(),this.localUniforms=new P({uTranslationMatrix:{value:new w,type:"mat3x3<f32>"},uColor:{value:new Float32Array(4),type:"vec4<f32>"},uRound:{value:1,type:"f32"},uResolution:{value:[0,0],type:"vec2<f32>"}}),this.renderer=e,this.adaptor=t,this.defaultShader=new _t,this.state=A.for2d()}validateRenderable(e){return!1}addRenderable(e,t){this.renderer.renderPipes.batch.break(t),t.add(e)}getBuffers(e){return e._gpuData[this.renderer.uid]||this._initBuffer(e)}_initBuffer(e){return e._gpuData[this.renderer.uid]=new pt({size:e.particleChildren.length,properties:e._properties}),e._gpuData[this.renderer.uid]}updateRenderable(e){}execute(e){const t=e.particleChildren;if(t.length===0)return;const r=this.renderer,n=this.getBuffers(e);e.texture||(e.texture=t[0].texture);const s=this.state;n.update(t,e._childrenDirty),e._childrenDirty=!1,s.blendMode=q(e.blendMode,e.texture._source);const o=this.localUniforms.uniforms,i=o.uTranslationMatrix;e.worldTransform.copyTo(i),i.prepend(r.globalUniforms.globalUniformData.projectionMatrix),o.uResolution=r.globalUniforms.globalUniformData.resolution,o.uRound=r._roundPixels|e._roundPixels,z(e.groupColorAlpha,o.uColor,0),this.adaptor.execute(this,e)}destroy(){this.defaultShader&&(this.defaultShader.destroy(),this.defaultShader=null)}}class Re extends Ge{constructor(e){super(e,new ct)}}Re.extension={type:[f.WebGLPipes],name:"particle"};class Fe extends Ge{constructor(e){super(e,new ht)}}Fe.extension={type:[f.WebGPUPipes],name:"particle"};class bt extends J{constructor(){super(),this.geometry=new Ye}destroy(){this.geometry.destroy()}}class De{constructor(e){this._renderer=e}addRenderable(e,t){const r=this._getGpuSprite(e);e.didViewUpdate&&this._updateBatchableSprite(e,r),this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuSprite(e);e.didViewUpdate&&this._updateBatchableSprite(e,t),t._batcher.updateElement(t)}validateRenderable(e){const t=this._getGpuSprite(e);return!t._batcher.checkAndUpdateTexture(t,e._texture)}_updateBatchableSprite(e,t){t.geometry.update(e),t.setTexture(e._texture)}_getGpuSprite(e){return e._gpuData[this._renderer.uid]||this._initGPUSprite(e)}_initGPUSprite(e){const t=e._gpuData[this._renderer.uid]=new bt,r=t;return r.renderable=e,r.transform=e.groupTransform,r.texture=e._texture,r.roundPixels=this._renderer._roundPixels|e._roundPixels,e.didViewUpdate||this._updateBatchableSprite(e,r),t}destroy(){this._renderer=null}}De.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"nineSliceSprite"};const yt={name:"tiling-bit",vertex:{header:`
            struct TilingUniforms {
                uMapCoord:mat3x3<f32>,
                uClampFrame:vec4<f32>,
                uClampOffset:vec2<f32>,
                uTextureTransform:mat3x3<f32>,
                uSizeAnchor:vec4<f32>
            };

            @group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
            @group(2) @binding(1) var uTexture: texture_2d<f32>;
            @group(2) @binding(2) var uSampler: sampler;
        `,main:`
            uv = (tilingUniforms.uTextureTransform * vec3(uv, 1.0)).xy;

            position = (position - tilingUniforms.uSizeAnchor.zw) * tilingUniforms.uSizeAnchor.xy;
        `},fragment:{header:`
            struct TilingUniforms {
                uMapCoord:mat3x3<f32>,
                uClampFrame:vec4<f32>,
                uClampOffset:vec2<f32>,
                uTextureTransform:mat3x3<f32>,
                uSizeAnchor:vec4<f32>
            };

            @group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
            @group(2) @binding(1) var uTexture: texture_2d<f32>;
            @group(2) @binding(2) var uSampler: sampler;
        `,main:`

            var coord = vUV + ceil(tilingUniforms.uClampOffset - vUV);
            coord = (tilingUniforms.uMapCoord * vec3(coord, 1.0)).xy;
            var unclamped = coord;
            coord = clamp(coord, tilingUniforms.uClampFrame.xy, tilingUniforms.uClampFrame.zw);

            var bias = 0.;

            if(unclamped.x == coord.x && unclamped.y == coord.y)
            {
                bias = -32.;
            }

            outColor = textureSampleBias(uTexture, uSampler, coord, bias);
        `}},Tt={name:"tiling-bit",vertex:{header:`
            uniform mat3 uTextureTransform;
            uniform vec4 uSizeAnchor;

        `,main:`
            uv = (uTextureTransform * vec3(aUV, 1.0)).xy;

            position = (position - uSizeAnchor.zw) * uSizeAnchor.xy;
        `},fragment:{header:`
            uniform sampler2D uTexture;
            uniform mat3 uMapCoord;
            uniform vec4 uClampFrame;
            uniform vec2 uClampOffset;
        `,main:`

        vec2 coord = vUV + ceil(uClampOffset - vUV);
        coord = (uMapCoord * vec3(coord, 1.0)).xy;
        vec2 unclamped = coord;
        coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);

        outColor = texture(uTexture, coord, unclamped == coord ? 0.0 : -32.0);// lod-bias very negative to force lod 0

        `}};let E,W;class vt extends Q{constructor(){E??(E=me({name:"tiling-sprite-shader",bits:[rt,yt,xe]})),W??(W=ge({name:"tiling-sprite-shader",bits:[nt,Tt,_e]}));const e=new P({uMapCoord:{value:new w,type:"mat3x3<f32>"},uClampFrame:{value:new Float32Array([0,0,1,1]),type:"vec4<f32>"},uClampOffset:{value:new Float32Array([0,0]),type:"vec2<f32>"},uTextureTransform:{value:new w,type:"mat3x3<f32>"},uSizeAnchor:{value:new Float32Array([100,100,.5,.5]),type:"vec4<f32>"}});super({glProgram:W,gpuProgram:E,resources:{localUniforms:new P({uTransformMatrix:{value:new w,type:"mat3x3<f32>"},uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uRound:{value:0,type:"f32"}}),tilingUniforms:e,uTexture:C.EMPTY.source,uSampler:C.EMPTY.source.style}})}updateUniforms(e,t,r,n,s,o){const i=this.resources.tilingUniforms,l=o.width,u=o.height,h=o.textureMatrix,d=i.uniforms.uTextureTransform;d.set(r.a*l/e,r.b*l/t,r.c*u/e,r.d*u/t,r.tx/e,r.ty/t),d.invert(),i.uniforms.uMapCoord=h.mapCoord,i.uniforms.uClampFrame=h.uClampFrame,i.uniforms.uClampOffset=h.uClampOffset,i.uniforms.uTextureTransform=d,i.uniforms.uSizeAnchor[0]=e,i.uniforms.uSizeAnchor[1]=t,i.uniforms.uSizeAnchor[2]=n,i.uniforms.uSizeAnchor[3]=s,o&&(this.resources.uTexture=o.source,this.resources.uSampler=o.source.style)}}class wt extends be{constructor(){super({positions:new Float32Array([0,0,1,0,1,1,0,1]),uvs:new Float32Array([0,0,1,0,1,1,0,1]),indices:new Uint32Array([0,1,2,0,2,3])})}}function Ct(a,e){const t=a.anchor.x,r=a.anchor.y;e[0]=-t*a.width,e[1]=-r*a.height,e[2]=(1-t)*a.width,e[3]=-r*a.height,e[4]=(1-t)*a.width,e[5]=(1-r)*a.height,e[6]=-t*a.width,e[7]=(1-r)*a.height}function St(a,e,t,r){let n=0;const s=a.length/e,o=r.a,i=r.b,l=r.c,u=r.d,h=r.tx,d=r.ty;for(t*=e;n<s;){const c=a[t],p=a[t+1];a[t]=o*c+l*p+h,a[t+1]=i*c+u*p+d,t+=e,n++}}function Pt(a,e){const t=a.texture,r=t.frame.width,n=t.frame.height;let s=0,o=0;a.applyAnchorToTexture&&(s=a.anchor.x,o=a.anchor.y),e[0]=e[6]=-s,e[2]=e[4]=1-s,e[1]=e[3]=-o,e[5]=e[7]=1-o;const i=w.shared;i.copyFrom(a._tileTransform.matrix),i.tx/=a.width,i.ty/=a.height,i.invert(),i.scale(a.width/r,a.height/n),St(e,2,0,i)}const F=new wt;class Mt{constructor(){this.canBatch=!0,this.geometry=new be({indices:F.indices.slice(),positions:F.positions.slice(),uvs:F.uvs.slice()})}destroy(){var e;this.geometry.destroy(),(e=this.shader)==null||e.destroy()}}class Ae{constructor(e){this._state=A.default2d,this._renderer=e}validateRenderable(e){const t=this._getTilingSpriteData(e),r=t.canBatch;this._updateCanBatch(e);const n=t.canBatch;if(n&&n===r){const{batchableMesh:s}=t;return!s._batcher.checkAndUpdateTexture(s,e.texture)}return r!==n}addRenderable(e,t){const r=this._renderer.renderPipes.batch;this._updateCanBatch(e);const n=this._getTilingSpriteData(e),{geometry:s,canBatch:o}=n;if(o){n.batchableMesh||(n.batchableMesh=new J);const i=n.batchableMesh;e.didViewUpdate&&(this._updateBatchableMesh(e),i.geometry=s,i.renderable=e,i.transform=e.groupTransform,i.setTexture(e._texture)),i.roundPixels=this._renderer._roundPixels|e._roundPixels,r.addToBatch(i,t)}else r.break(t),n.shader||(n.shader=new vt),this.updateRenderable(e),t.add(e)}execute(e){const{shader:t}=this._getTilingSpriteData(e);t.groups[0]=this._renderer.globalUniforms.bindGroup;const r=t.resources.localUniforms.uniforms;r.uTransformMatrix=e.groupTransform,r.uRound=this._renderer._roundPixels|e._roundPixels,z(e.groupColorAlpha,r.uColor,0),this._state.blendMode=q(e.groupBlendMode,e.texture._source),this._renderer.encoder.draw({geometry:F,shader:t,state:this._state})}updateRenderable(e){const t=this._getTilingSpriteData(e),{canBatch:r}=t;if(r){const{batchableMesh:n}=t;e.didViewUpdate&&this._updateBatchableMesh(e),n._batcher.updateElement(n)}else if(e.didViewUpdate){const{shader:n}=t;n.updateUniforms(e.width,e.height,e._tileTransform.matrix,e.anchor.x,e.anchor.y,e.texture)}}_getTilingSpriteData(e){return e._gpuData[this._renderer.uid]||this._initTilingSpriteData(e)}_initTilingSpriteData(e){const t=new Mt;return t.renderable=e,e._gpuData[this._renderer.uid]=t,t}_updateBatchableMesh(e){const t=this._getTilingSpriteData(e),{geometry:r}=t,n=e.texture.source.style;n.addressMode!=="repeat"&&(n.addressMode="repeat",n.update()),Pt(e,r.uvs),Ct(e,r.positions)}destroy(){this._renderer=null}_updateCanBatch(e){const t=this._getTilingSpriteData(e),r=e.texture;let n=!0;return this._renderer.type===N.WEBGL&&(n=this._renderer.context.supports.nonPowOf2wrapping),t.canBatch=r.textureMatrix.isSimple&&(n||r.source.isPowerOfTwo),t.canBatch}}Ae.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"tilingSprite"};const Ut={name:"local-uniform-msdf-bit",vertex:{header:`
            struct LocalUniforms {
                uColor:vec4<f32>,
                uTransformMatrix:mat3x3<f32>,
                uDistance: f32,
                uRound:f32,
            }

            @group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `,main:`
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `,end:`
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `},fragment:{header:`
            struct LocalUniforms {
                uColor:vec4<f32>,
                uTransformMatrix:mat3x3<f32>,
                uDistance: f32
            }

            @group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
         `,main:`
            outColor = vec4<f32>(calculateMSDFAlpha(outColor, localUniforms.uColor, localUniforms.uDistance));
        `}},Bt={name:"local-uniform-msdf-bit",vertex:{header:`
            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `,main:`
            vColor *= uColor;
            modelMatrix *= uTransformMatrix;
        `,end:`
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `},fragment:{header:`
            uniform float uDistance;
         `,main:`
            outColor = vec4(calculateMSDFAlpha(outColor, vColor, uDistance));
        `}},Gt={name:"msdf-bit",fragment:{header:`
            fn calculateMSDFAlpha(msdfColor:vec4<f32>, shapeColor:vec4<f32>, distance:f32) -> f32 {

                // MSDF
                var median = msdfColor.r + msdfColor.g + msdfColor.b -
                    min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
                    max(msdfColor.r, max(msdfColor.g, msdfColor.b));

                // SDF
                median = min(median, msdfColor.a);

                var screenPxDistance = distance * (median - 0.5);
                var alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);
                if (median < 0.01) {
                    alpha = 0.0;
                } else if (median > 0.99) {
                    alpha = 1.0;
                }

                // Gamma correction for coverage-like alpha
                var luma: f32 = dot(shapeColor.rgb, vec3<f32>(0.299, 0.587, 0.114));
                var gamma: f32 = mix(1.0, 1.0 / 2.2, luma);
                var coverage: f32 = pow(shapeColor.a * alpha, gamma);

                return coverage;

            }
        `}},Rt={name:"msdf-bit",fragment:{header:`
            float calculateMSDFAlpha(vec4 msdfColor, vec4 shapeColor, float distance) {

                // MSDF
                float median = msdfColor.r + msdfColor.g + msdfColor.b -
                                min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
                                max(msdfColor.r, max(msdfColor.g, msdfColor.b));

                // SDF
                median = min(median, msdfColor.a);

                float screenPxDistance = distance * (median - 0.5);
                float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);

                if (median < 0.01) {
                    alpha = 0.0;
                } else if (median > 0.99) {
                    alpha = 1.0;
                }

                // Gamma correction for coverage-like alpha
                float luma = dot(shapeColor.rgb, vec3(0.299, 0.587, 0.114));
                float gamma = mix(1.0, 1.0 / 2.2, luma);
                float coverage = pow(shapeColor.a * alpha, gamma);

                return coverage;
            }
        `}};let L,I;class Ft extends Q{constructor(e){const t=new P({uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uTransformMatrix:{value:new w,type:"mat3x3<f32>"},uDistance:{value:4,type:"f32"},uRound:{value:0,type:"f32"}});L??(L=me({name:"sdf-shader",bits:[Xe,je(e),Ut,Gt,xe]})),I??(I=ge({name:"sdf-shader",bits:[Ne,qe(e),Bt,Rt,_e]})),super({glProgram:I,gpuProgram:L,resources:{localUniforms:t,batchSamplers:Qe(e)}})}}class Dt extends V{destroy(){this.context.customShader&&this.context.customShader.destroy(),super.destroy()}}class ke{constructor(e){this._renderer=e,this._renderer.renderableGC.addManagedHash(this,"_gpuBitmapText")}validateRenderable(e){const t=this._getGpuBitmapText(e);return e._didTextUpdate&&(e._didTextUpdate=!1,this._updateContext(e,t)),this._renderer.renderPipes.graphics.validateRenderable(t)}addRenderable(e,t){const r=this._getGpuBitmapText(e);de(e,r),e._didTextUpdate&&(e._didTextUpdate=!1,this._updateContext(e,r)),this._renderer.renderPipes.graphics.addRenderable(r,t),r.context.customShader&&this._updateDistanceField(e)}updateRenderable(e){const t=this._getGpuBitmapText(e);de(e,t),this._renderer.renderPipes.graphics.updateRenderable(t),t.context.customShader&&this._updateDistanceField(e)}_updateContext(e,t){const{context:r}=t,n=Ke.getFont(e.text,e._style);r.clear(),n.distanceField.type!=="none"&&(r.customShader||(r.customShader=new Ft(this._renderer.limits.maxBatchableTextures)));const s=Je.graphemeSegmenter(e.text),o=e._style;let i=n.baseLineOffset;const l=Ze(s,o,n,!0);let u=0;const h=o.padding,d=l.scale;let c=l.width,p=l.height+l.offsetY;o._stroke&&(c+=o._stroke.width/d,p+=o._stroke.width/d),r.translate(-e._anchor._x*c-h,-e._anchor._y*p-h).scale(d,d);const g=n.applyFillAsTint?o._fill.color:16777215;for(let x=0;x<l.lines.length;x++){const _=l.lines[x];for(let m=0;m<_.charPositions.length;m++){const Z=s[u++],S=n.chars[Z];S!=null&&S.texture&&r.texture(S.texture,g||"black",Math.round(_.charPositions[m]+S.xOffset),Math.round(i+S.yOffset))}i+=n.lineHeight}}_getGpuBitmapText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new Dt;return e._gpuData[this._renderer.uid]=t,this._updateContext(e,t),t}_updateDistanceField(e){const t=this._getGpuBitmapText(e).context,r=e._style.fontFamily,n=X.get(`${r}-bitmap`),{a:s,b:o,c:i,d:l}=e.groupTransform,u=Math.sqrt(s*s+o*o),h=Math.sqrt(i*i+l*l),d=(Math.abs(u)+Math.abs(h))/2,c=n.baseRenderedFontSize/e._style.fontSize,p=d*n.distanceField.range*(1/c);t.customShader.resources.localUniforms.uniforms.uDistance=p}destroy(){this._renderer=null}}ke.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"bitmapText"};function de(a,e){e.groupTransform=a.groupTransform,e.groupColorAlpha=a.groupColorAlpha,e.groupColor=a.groupColor,e.groupBlendMode=a.groupBlendMode,e.globalDisplayStatus=a.globalDisplayStatus,e.groupTransform=a.groupTransform,e.localDisplayStatus=a.localDisplayStatus,e.groupAlpha=a.groupAlpha,e._roundPixels=a._roundPixels}class At extends ve{constructor(e){super(),this.generatingTexture=!1,this._renderer=e,e.runners.resolutionChange.add(this)}resolutionChange(){const e=this.renderable;e._autoResolution&&e.onViewUpdate()}destroy(){this._renderer.htmlText.returnTexturePromise(this.texturePromise),this.texturePromise=null,this._renderer=null}}function j(a,e){const{texture:t,bounds:r}=a;et(r,e._anchor,t);const n=e._style._getFinalPadding();r.minX-=n,r.minY-=n,r.maxX-=n,r.maxY-=n}class Ve{constructor(e){this._renderer=e}validateRenderable(e){return e._didTextUpdate}addRenderable(e,t){const r=this._getGpuText(e);e._didTextUpdate&&(this._updateGpuText(e).catch(n=>{console.error(n)}),e._didTextUpdate=!1,j(r,e)),this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuText(e);t._batcher.updateElement(t)}async _updateGpuText(e){e._didTextUpdate=!1;const t=this._getGpuText(e);if(t.generatingTexture)return;t.texturePromise&&(this._renderer.htmlText.returnTexturePromise(t.texturePromise),t.texturePromise=null),t.generatingTexture=!0,e._resolution=e._autoResolution?this._renderer.resolution:e.resolution;const r=this._renderer.htmlText.getTexturePromise(e);t.texturePromise=r,t.texture=await r;const n=e.renderGroup||e.parentRenderGroup;n&&(n.structureDidChange=!0),t.generatingTexture=!1,j(t,e)}_getGpuText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new At(this._renderer);return t.renderable=e,t.transform=e.groupTransform,t.texture=C.EMPTY,t.bounds={minX:0,maxX:1,minY:0,maxY:0},t.roundPixels=this._renderer._roundPixels|e._roundPixels,e._resolution=e._autoResolution?this._renderer.resolution:e.resolution,e._gpuData[this._renderer.uid]=t,t}destroy(){this._renderer=null}}Ve.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"htmlText"};function kt(){const{userAgent:a}=ye.get().getNavigator();return/^((?!chrome|android).)*safari/i.test(a)}const Vt=new pe;function ze(a,e,t,r){const n=Vt;n.minX=0,n.minY=0,n.maxX=a.width/r|0,n.maxY=a.height/r|0;const s=T.getOptimalTexture(n.width,n.height,r,!1);return s.source.uploadMethodId="image",s.source.resource=a,s.source.alphaMode="premultiply-alpha-on-upload",s.frame.width=e/r,s.frame.height=t/r,s.source.emit("update",s.source),s.updateUvs(),s}function zt(a,e){const t=e.fontFamily,r=[],n={},s=/font-family:([^;"\s]+)/g,o=a.match(s);function i(l){n[l]||(r.push(l),n[l]=!0)}if(Array.isArray(t))for(let l=0;l<t.length;l++)i(t[l]);else i(t);o&&o.forEach(l=>{const u=l.split(":")[1].trim();i(u)});for(const l in e.tagStyles){const u=e.tagStyles[l].fontFamily;i(u)}return r}async function Ot(a){const t=await(await ye.get().fetch(a)).blob(),r=new FileReader;return await new Promise((s,o)=>{r.onloadend=()=>s(r.result),r.onerror=o,r.readAsDataURL(t)})}async function ce(a,e){const t=await Ot(e);return`@font-face {
        font-family: "${a.fontFamily}";
        src: url('${t}');
        font-weight: ${a.fontWeight};
        font-style: ${a.fontStyle};
    }`}const R=new Map;async function Et(a,e,t){const r=a.filter(n=>X.has(`${n}-and-url`)).map((n,s)=>{if(!R.has(n)){const{url:o}=X.get(`${n}-and-url`);s===0?R.set(n,ce({fontWeight:e.fontWeight,fontStyle:e.fontStyle,fontFamily:n},o)):R.set(n,ce({fontWeight:t.fontWeight,fontStyle:t.fontStyle,fontFamily:n},o))}return R.get(n)});return(await Promise.all(r)).join(`
`)}function Wt(a,e,t,r,n){const{domElement:s,styleElement:o,svgRoot:i}=n;s.innerHTML=`<style>${e.cssStyle}</style><div style='padding:0;'>${a}</div>`,s.setAttribute("style",`transform: scale(${t});transform-origin: top left; display: inline-block`),o.textContent=r;const{width:l,height:u}=n.image;return i.setAttribute("width",l.toString()),i.setAttribute("height",u.toString()),new XMLSerializer().serializeToString(i)}function Lt(a,e){const t=Te.getOptimalCanvasAndContext(a.width,a.height,e),{context:r}=t;return r.clearRect(0,0,a.width,a.height),r.drawImage(a,0,0),t}function It(a,e,t){return new Promise(async r=>{t&&await new Promise(n=>setTimeout(n,100)),a.onload=()=>{r()},a.src=`data:image/svg+xml;charset=utf8,${encodeURIComponent(e)}`,a.crossOrigin="anonymous"})}class Oe{constructor(e){this._renderer=e,this._createCanvas=e.type===N.WEBGPU}getTexture(e){return this.getTexturePromise(e)}getTexturePromise(e){return this._buildTexturePromise(e)}async _buildTexturePromise(e){const{text:t,style:r,resolution:n,textureStyle:s}=e,o=k.get(Me),i=zt(t,r),l=await Et(i,r,K.defaultTextStyle),u=ut(t,r,l,o),h=Math.ceil(Math.ceil(Math.max(1,u.width)+r.padding*2)*n),d=Math.ceil(Math.ceil(Math.max(1,u.height)+r.padding*2)*n),c=o.image,p=2;c.width=(h|0)+p,c.height=(d|0)+p;const g=Wt(t,r,n,l,o);await It(c,g,kt()&&i.length>0);const x=c;let _;this._createCanvas&&(_=Lt(c,n));const m=ze(_?_.canvas:x,c.width-p,c.height-p,n);return s&&(m.source.style=s),this._createCanvas&&(this._renderer.texture.initSource(m.source),Te.returnCanvasAndContext(_)),k.return(o),m}returnTexturePromise(e){e.then(t=>{this._cleanUp(t)}).catch(()=>{D("HTMLTextSystem: Failed to clean texture")})}_cleanUp(e){T.returnTexture(e,!0),e.source.resource=null,e.source.uploadMethodId="unknown"}destroy(){this._renderer=null}}Oe.extension={type:[f.WebGLSystem,f.WebGPUSystem,f.CanvasSystem],name:"htmlText"};class $t extends ve{constructor(e){super(),this._renderer=e,e.runners.resolutionChange.add(this)}resolutionChange(){const e=this.renderable;e._autoResolution&&e.onViewUpdate()}destroy(){this._renderer.canvasText.returnTexture(this.texture),this._renderer=null}}class Ee{constructor(e){this._renderer=e}validateRenderable(e){return e._didTextUpdate}addRenderable(e,t){const r=this._getGpuText(e);e._didTextUpdate&&(this._updateGpuText(e),e._didTextUpdate=!1),this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuText(e);t._batcher.updateElement(t)}_updateGpuText(e){const t=this._getGpuText(e);t.texture&&this._renderer.canvasText.returnTexture(t.texture),e._resolution=e._autoResolution?this._renderer.resolution:e.resolution,t.texture=t.texture=this._renderer.canvasText.getTexture(e),j(t,e)}_getGpuText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new $t(this._renderer);return t.renderable=e,t.transform=e.groupTransform,t.bounds={minX:0,maxX:1,minY:0,maxY:0},t.roundPixels=this._renderer._roundPixels|e._roundPixels,e._gpuData[this._renderer.uid]=t,t}destroy(){this._renderer=null}}Ee.extension={type:[f.WebGLPipes,f.WebGPUPipes,f.CanvasPipes],name:"text"};class We{constructor(e){this._renderer=e}getTexture(e,t,r,n){typeof e=="string"&&(y("8.0.0","CanvasTextSystem.getTexture: Use object TextOptions instead of separate arguments"),e={text:e,style:r,resolution:t}),e.style instanceof $||(e.style=new $(e.style)),e.textureStyle instanceof Y||(e.textureStyle=new Y(e.textureStyle)),typeof e.text!="string"&&(e.text=e.text.toString());const{text:s,style:o,textureStyle:i}=e,l=e.resolution??this._renderer.resolution,{frame:u,canvasAndContext:h}=O.getCanvasAndContext({text:s,style:o,resolution:l}),d=ze(h.canvas,u.width,u.height,l);if(i&&(d.source.style=i),o.trim&&(u.pad(o.padding),d.frame.copyFrom(u),d.updateUvs()),o.filters){const c=this._applyFilters(d,o.filters);return this.returnTexture(d),O.returnCanvasAndContext(h),c}return this._renderer.texture.initSource(d._source),O.returnCanvasAndContext(h),d}returnTexture(e){const t=e.source;t.resource=null,t.uploadMethodId="unknown",t.alphaMode="no-premultiply-alpha",T.returnTexture(e,!0)}renderTextToCanvas(){y("8.10.0","CanvasTextSystem.renderTextToCanvas: no longer supported, use CanvasTextSystem.getTexture instead")}_applyFilters(e,t){const r=this._renderer.renderTarget.renderTarget,n=this._renderer.filter.generateFilteredTexture({texture:e,filters:t});return this._renderer.renderTarget.bind(r,!1),n}destroy(){this._renderer=null}}We.extension={type:[f.WebGLSystem,f.WebGPUSystem,f.CanvasSystem],name:"canvasText"};b.add(Ue);b.add(tt);b.add(Be);b.add(Re);b.add(Fe);b.add(We);b.add(Ee);b.add(ke);b.add(Oe);b.add(Ve);b.add(Ae);b.add(De);b.add(Ce);b.add(we);
