var _t=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')});var za=Object.defineProperty,dm=Object.getOwnPropertyDescriptor,pm=Object.getOwnPropertyNames,cm=Object.prototype.hasOwnProperty,fm=(e=>typeof _t<"u"?_t:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof _t<"u"?_t:t)[r]}):e)(function(e){if(typeof _t<"u")return _t.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),W=(e,t)=>()=>(e&&(t=e(e=0)),t),Pt=(e,t)=>{for(var r in t)za(e,r,{get:t[r],enumerable:!0})},hm=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of pm(t))!cm.call(e,a)&&a!==r&&za(e,a,{get:()=>t[a],enumerable:!(i=dm(t,a))||i.enumerable});return e},sr=e=>hm(za({},"__esModule",{value:!0}),e),Gt,dt,Bt,vs,td,rd=W(()=>{"use strict";Gt=new Map,dt=[],Bt=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let i=Gt.get(e);if(i===void 0)Gt.set(e,{backend:t,priority:r});else{if(i.priority>r)return;if(i.priority===r&&i.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let a=dt.indexOf(e);a!==-1&&dt.splice(a,1);for(let n=0;n<dt.length;n++)if(Gt.get(dt[n]).priority<=r){dt.splice(n,0,e);return}dt.push(e)}return}throw new TypeError("not a valid backend")},vs=async e=>{let t=Gt.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{return r||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(i){return r||(t.error=`${i}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},td=async e=>{let t=e.executionProviders||[],r=t.map(l=>typeof l=="string"?l:l.name),i=r.length===0?dt:r,a,n=[],s=new Set;for(let l of i){let d=await vs(l);typeof d=="string"?n.push({name:l,err:d}):(a||(a=d),a===d&&s.add(l))}if(!a)throw new Error(`no available backend found. ERR: ${n.map(l=>`[${l.name}] ${l.err}`).join(", ")}`);for(let{name:l,err:d}of n)r.includes(l)&&console.warn(`removing requested execution provider "${l}" from session options because it is not available: ${d}`);let u=t.filter(l=>s.has(typeof l=="string"?l:l.name));return[a,new Proxy(e,{get:(l,d)=>d==="executionProviders"?u:Reflect.get(l,d)})]}}),mm=W(()=>{"use strict";rd()}),id,gm=W(()=>{"use strict";id="1.22.0-dev.20250409-89f8206ba4"}),hi,Ne,ad=W(()=>{"use strict";gm(),hi="warning",Ne={wasm:{},webgl:{},webgpu:{},versions:{common:id},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);hi=e}},get logLevel(){return hi}},Object.defineProperty(Ne,"logLevel",{enumerable:!0})}),fe,_m=W(()=>{"use strict";ad(),fe=Ne}),nd,sd,ym=W(()=>{"use strict";nd=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let i=r.getContext("2d");if(i!=null){let a,n;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(a=e.dims[2],n=e.dims[3]):(a=e.dims[3],n=e.dims[2]);let s=t?.format!==void 0?t.format:"RGB",u=t?.norm,l,d;u===void 0||u.mean===void 0?l=[255,255,255,255]:typeof u.mean=="number"?l=[u.mean,u.mean,u.mean,u.mean]:(l=[u.mean[0],u.mean[1],u.mean[2],0],u.mean[3]!==void 0&&(l[3]=u.mean[3])),u===void 0||u.bias===void 0?d=[0,0,0,0]:typeof u.bias=="number"?d=[u.bias,u.bias,u.bias,u.bias]:(d=[u.bias[0],u.bias[1],u.bias[2],0],u.bias[3]!==void 0&&(d[3]=u.bias[3]));let c=n*a,f=0,h=c,_=c*2,g=-1;s==="RGBA"?(f=0,h=c,_=c*2,g=c*3):s==="RGB"?(f=0,h=c,_=c*2):s==="RBG"&&(f=0,_=c,h=c*2);for(let $=0;$<n;$++)for(let x=0;x<a;x++){let y=(e.data[f++]-d[0])*l[0],w=(e.data[h++]-d[1])*l[1],k=(e.data[_++]-d[2])*l[2],S=g===-1?255:(e.data[g++]-d[3])*l[3];i.fillStyle="rgba("+y+","+w+","+k+","+S+")",i.fillRect(x,$,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},sd=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),i;if(r!=null){let a,n,s;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(a=e.dims[2],n=e.dims[1],s=e.dims[3]):(a=e.dims[3],n=e.dims[2],s=e.dims[1]);let u=t!==void 0&&t.format!==void 0?t.format:"RGB",l=t?.norm,d,c;l===void 0||l.mean===void 0?d=[255,255,255,255]:typeof l.mean=="number"?d=[l.mean,l.mean,l.mean,l.mean]:(d=[l.mean[0],l.mean[1],l.mean[2],255],l.mean[3]!==void 0&&(d[3]=l.mean[3])),l===void 0||l.bias===void 0?c=[0,0,0,0]:typeof l.bias=="number"?c=[l.bias,l.bias,l.bias,l.bias]:(c=[l.bias[0],l.bias[1],l.bias[2],0],l.bias[3]!==void 0&&(c[3]=l.bias[3]));let f=n*a;if(t!==void 0&&(t.format!==void 0&&s===4&&t.format!=="RGBA"||s===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let h=4,_=0,g=1,$=2,x=3,y=0,w=f,k=f*2,S=-1;u==="RGBA"?(y=0,w=f,k=f*2,S=f*3):u==="RGB"?(y=0,w=f,k=f*2):u==="RBG"&&(y=0,k=f,w=f*2),i=r.createImageData(a,n);for(let I=0;I<n*a;_+=h,g+=h,$+=h,x+=h,I++)i.data[_]=(e.data[y++]-c[0])*d[0],i.data[g]=(e.data[w++]-c[1])*d[1],i.data[$]=(e.data[k++]-c[2])*d[2],i.data[x]=S===-1?255:(e.data[S++]-c[3])*d[3]}else throw new Error("Can not access image data");return i}}),vr,od,ud,ld,dd,pd,bm=W(()=>{"use strict";Ca(),vr=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:i}=t,a=t.norm??{mean:255,bias:0},n,s;typeof a.mean=="number"?n=[a.mean,a.mean,a.mean,a.mean]:n=[a.mean[0],a.mean[1],a.mean[2],a.mean[3]??255],typeof a.bias=="number"?s=[a.bias,a.bias,a.bias,a.bias]:s=[a.bias[0],a.bias[1],a.bias[2],a.bias[3]??0];let u=t.format!==void 0?t.format:"RGBA",l=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",d=r*i,c=l==="RGBA"?new Float32Array(d*4):new Float32Array(d*3),f=4,h=0,_=1,g=2,$=3,x=0,y=d,w=d*2,k=-1;u==="RGB"&&(f=3,h=0,_=1,g=2,$=-1),l==="RGBA"?k=d*3:l==="RBG"?(x=0,w=d,y=d*2):l==="BGR"&&(w=0,y=d,x=d*2);for(let S=0;S<d;S++,h+=f,g+=f,_+=f,$+=f)c[x++]=(e[h]+s[0])/n[0],c[y++]=(e[_]+s[1])/n[1],c[w++]=(e[g]+s[2])/n[2],k!==-1&&$!==-1&&(c[k++]=(e[$]+s[3])/n[3]);return l==="RGBA"?new Ae("float32",c,[1,4,r,i]):new Ae("float32",c,[1,3,r,i])},od=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,i=typeof ImageData<"u"&&e instanceof ImageData,a=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,n=typeof e=="string",s,u=t??{},l=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},d=c=>typeof HTMLCanvasElement<"u"&&c instanceof HTMLCanvasElement||c instanceof OffscreenCanvas?c.getContext("2d"):null;if(r){let c=l();c.width=e.width,c.height=e.height;let f=d(c);if(f!=null){let h=e.height,_=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(h=t.resizedHeight,_=t.resizedWidth),t!==void 0){if(u=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");u.tensorFormat="RGBA",u.height=h,u.width=_}else u.tensorFormat="RGBA",u.height=h,u.width=_;f.drawImage(e,0,0),s=f.getImageData(0,0,_,h).data}else throw new Error("Can not access image data")}else if(i){let c,f;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(c=t.resizedHeight,f=t.resizedWidth):(c=e.height,f=e.width),t!==void 0&&(u=t),u.format="RGBA",u.height=c,u.width=f,t!==void 0){let h=l();h.width=f,h.height=c;let _=d(h);if(_!=null)_.putImageData(e,0,0),s=_.getImageData(0,0,f,c).data;else throw new Error("Can not access image data")}else s=e.data}else if(a){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let c=l();c.width=e.width,c.height=e.height;let f=d(c);if(f!=null){let h=e.height,_=e.width;return f.drawImage(e,0,0,_,h),s=f.getImageData(0,0,_,h).data,u.height=h,u.width=_,vr(s,u)}else throw new Error("Can not access image data")}else{if(n)return new Promise((c,f)=>{let h=l(),_=d(h);if(!e||!_)return f();let g=new Image;g.crossOrigin="Anonymous",g.src=e,g.onload=()=>{h.width=g.width,h.height=g.height,_.drawImage(g,0,0,h.width,h.height);let $=_.getImageData(0,0,h.width,h.height);u.height=h.height,u.width=h.width,c(vr($.data,u))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(s!==void 0)return vr(s,u);throw new Error("Input data provided is not supported - aborted tensor creation")},ud=(e,t)=>{let{width:r,height:i,download:a,dispose:n}=t,s=[1,i,r,4];return new Ae({location:"texture",type:"float32",texture:e,dims:s,download:a,dispose:n})},ld=(e,t)=>{let{dataType:r,dims:i,download:a,dispose:n}=t;return new Ae({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:i,download:a,dispose:n})},dd=(e,t)=>{let{dataType:r,dims:i,download:a,dispose:n}=t;return new Ae({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:i,download:a,dispose:n})},pd=(e,t,r)=>new Ae({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),vt,tr,mi,cd,wm=W(()=>{"use strict";vt=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),tr=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),mi=!1,cd=()=>{if(!mi){mi=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,i=typeof r<"u"&&r.from;e&&(vt.set("int64",BigInt64Array),tr.set(BigInt64Array,"int64")),t&&(vt.set("uint64",BigUint64Array),tr.set(BigUint64Array,"uint64")),i?(vt.set("float16",r),tr.set(r,"float16")):vt.set("float16",Uint16Array)}}}),fd,hd,$m=W(()=>{"use strict";Ca(),fd=e=>{let t=1;for(let r=0;r<e.length;r++){let i=e[r];if(typeof i!="number"||!Number.isSafeInteger(i))throw new TypeError(`dims[${r}] must be an integer, got: ${i}`);if(i<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${i}`);t*=i}return t},hd=(e,t)=>{switch(e.location){case"cpu":return new Ae(e.type,e.data,t);case"cpu-pinned":return new Ae({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new Ae({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new Ae({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new Ae({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),Ae,Ca=W(()=>{"use strict";ym(),bm(),wm(),$m(),Ae=class{constructor(e,t,r){cd();let i,a;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,i=e.type,a=e.dims,e.location){case"cpu-pinned":{let s=vt.get(i);if(!s)throw new TypeError(`unsupported type "${i}" to create tensor from pinned buffer`);if(!(e.data instanceof s))throw new TypeError(`buffer should be of type ${s.name}`);this.cpuData=e.data;break}case"texture":{if(i!=="float32")throw new TypeError(`unsupported type "${i}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint64"&&i!=="int8"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let s,u;if(typeof e=="string")if(i=e,u=r,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");s=t}else{let l=vt.get(e);if(l===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&l===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${l.name} as data.`);e==="uint64"||e==="int64"?s=l.from(t,BigInt):s=l.from(t)}else if(t instanceof l)s=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")s=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&l!==Uint16Array)s=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${i} tensor's data must be type of ${l}`)}else if(u=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let l=typeof e[0];if(l==="string")i="string",s=e;else if(l==="boolean")i="bool",s=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${l}.`)}else if(e instanceof Uint8ClampedArray)i="uint8",s=Uint8Array.from(e);else{let l=tr.get(e.constructor);if(l===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);i=l,s=e}if(u===void 0)u=[s.length];else if(!Array.isArray(u))throw new TypeError("A tensor's dims must be a number array");a=u,this.cpuData=s,this.dataLocation="cpu"}let n=fd(a);if(this.cpuData&&n!==this.cpuData.length&&!((i==="uint4"||i==="int4")&&Math.ceil(n/2)===this.cpuData.length))throw new Error(`Tensor's size(${n}) does not match data length(${this.cpuData.length}).`);this.type=i,this.dims=a,this.size=n}static async fromImage(e,t){return od(e,t)}static fromTexture(e,t){return ud(e,t)}static fromGpuBuffer(e,t){return ld(e,t)}static fromMLTensor(e,t){return dd(e,t)}static fromPinnedBuffer(e,t,r){return pd(e,t,r)}toDataURL(e){return nd(this,e)}toImageData(e){return sd(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return hd(this,e)}}}),Oe,md=W(()=>{"use strict";Ca(),Oe=Ae}),Pr,gi,Qe,je,gd=W(()=>{"use strict";ad(),Pr=(e,t)=>{(typeof Ne.trace>"u"?!Ne.wasm.trace:!Ne.trace)||console.timeStamp(`${e}::ORT::${t}`)},gi=(e,t)=>{let r=new Error().stack?.split(/\r\n|\r|\n/g)||[],i=!1;for(let a=0;a<r.length;a++){if(i&&!r[a].includes("TRACE_FUNC")){let n=`FUNC_${e}::${r[a].trim().split(" ")[1]}`;t&&(n+=`::${t}`),Pr("CPU",n);return}r[a].includes("TRACE_FUNC")&&(i=!0)}},Qe=e=>{(typeof Ne.trace>"u"?!Ne.wasm.trace:!Ne.trace)||gi("BEGIN",e)},je=e=>{(typeof Ne.trace>"u"?!Ne.wasm.trace:!Ne.trace)||gi("END",e)}}),_d,vm=W(()=>{"use strict";rd(),md(),gd(),_d=class yd{constructor(t){this.handler=t}async run(t,r,i){Qe();let a={},n={};if(typeof t!="object"||t===null||t instanceof Oe||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let s=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof Oe)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");s=!1;for(let d of r){if(typeof d!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(d)===-1)throw new RangeError(`'fetches' contains invalid output name: ${d}.`);a[d]=null}if(typeof i=="object"&&i!==null)n=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else{let d=!1,c=Object.getOwnPropertyNames(r);for(let f of this.outputNames)if(c.indexOf(f)!==-1){let h=r[f];(h===null||h instanceof Oe)&&(d=!0,s=!1,a[f]=h)}if(d){if(typeof i=="object"&&i!==null)n=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else n=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let d of this.inputNames)if(typeof t[d]>"u")throw new Error(`input '${d}' is missing in 'feeds'.`);if(s)for(let d of this.outputNames)a[d]=null;let u=await this.handler.run(t,a,n),l={};for(let d in u)if(Object.hasOwnProperty.call(u,d)){let c=u[d];c instanceof Oe?l[d]=c:l[d]=new Oe(c.type,c.data,c.dims)}return je(),l}async release(){return this.handler.dispose()}static async create(t,r,i,a){Qe();let n,s={};if(typeof t=="string"){if(n=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(n=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let c=t,f=0,h=t.byteLength;if(typeof r=="object"&&r!==null)s=r;else if(typeof r=="number"){if(f=r,!Number.isSafeInteger(f))throw new RangeError("'byteOffset' must be an integer.");if(f<0||f>=c.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${c.byteLength}).`);if(h=t.byteLength-f,typeof i=="number"){if(h=i,!Number.isSafeInteger(h))throw new RangeError("'byteLength' must be an integer.");if(h<=0||f+h>c.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${c.byteLength-f}].`);if(typeof a=="object"&&a!==null)s=a;else if(typeof a<"u")throw new TypeError("'options' must be an object.")}else if(typeof i<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");n=new Uint8Array(c,f,h)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[u,l]=await td(s),d=await u.createInferenceSessionHandler(n,l);return je(),new yd(d)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),ur,xm=W(()=>{"use strict";vm(),ur=_d}),Sm=W(()=>{"use strict"}),km=W(()=>{"use strict"}),Im=W(()=>{"use strict"}),Tm=W(()=>{"use strict"}),Em={};Pt(Em,{InferenceSession:()=>ur,TRACE:()=>Pr,TRACE_FUNC_BEGIN:()=>Qe,TRACE_FUNC_END:()=>je,Tensor:()=>Oe,env:()=>fe,registerBackend:()=>Bt});var Ge=W(()=>{"use strict";mm(),_m(),xm(),md(),Sm(),km(),gd(),Im(),Tm()}),Aa=W(()=>{"use strict"}),bd={};Pt(bd,{default:()=>wd});var _i,yi,wd,zm=W(()=>{"use strict";If(),Tt(),Oa(),_i="ort-wasm-proxy-worker",yi=globalThis.self?.name===_i,yi&&(self.onmessage=e=>{let{type:t,in:r}=e.data;try{switch(t){case"init-wasm":Ra(r.wasm).then(()=>{Qa(r).then(()=>{postMessage({type:t})},i=>{postMessage({type:t,err:i})})},i=>{postMessage({type:t,err:i})});break;case"init-ep":{let{epName:i,env:a}=r;Ya(a,i).then(()=>{postMessage({type:t})},n=>{postMessage({type:t,err:n})});break}case"copy-from":{let{buffer:i}=r,a=Gr(i);postMessage({type:t,out:a});break}case"create":{let{model:i,options:a}=r;Ja(i,a).then(n=>{postMessage({type:t,out:n})},n=>{postMessage({type:t,err:n})});break}case"release":en(r),postMessage({type:t});break;case"run":{let{sessionId:i,inputIndices:a,inputs:n,outputIndices:s,options:u}=r;tn(i,a,n,s,new Array(s.length).fill(null),u).then(l=>{l.some(d=>d[3]!=="cpu")?postMessage({type:t,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:t,out:l},an([...n,...l]))},l=>{postMessage({type:t,err:l})});break}case"end-profiling":rn(r),postMessage({type:t});break;default:}}catch(i){postMessage({type:t,err:i})}}),wd=yi?null:e=>new Worker(e??Ce,{type:"module",name:_i})}),$d={};Pt($d,{default:()=>vd});var bi,wi,vd,xs,Cm=W(()=>{"use strict";wi=(bi=import.meta.url,async function(e={}){var t,r,i=e,a=new Promise((o,p)=>{t=o,r=p}),n=typeof window=="object",s=typeof WorkerGlobalScope<"u",u=s&&self.name?.startsWith("em-pthread");i.mountExternalData=(o,p)=>{o.startsWith("./")&&(o=o.substring(2)),(i.Eb||(i.Eb=new Map)).set(o,p)},i.unmountExternalData=()=>{delete i.Eb};var l=globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,pc:!0}).buffer.constructor;let d=o=>async(...p)=>{try{if(i.Fb)throw Error("Session already started");let m=i.Fb={dc:p[0],errors:[]},b=await o(...p);if(i.Fb!==m)throw Error("Session mismatch");i.Jb?.flush();let v=m.errors;if(0<v.length){let E=await Promise.all(v);if(E=E.filter(R=>R),0<E.length)throw Error(E.join(`
`))}return b}finally{i.Fb=null}};i.jsepInit=(o,p)=>{if(o==="webgpu"){[i.Jb,i.Ub,i.Yb,i.Kb,i.Xb,i.jb,i.Zb,i.ac,i.Vb,i.Wb,i.$b]=p;let m=i.Jb;i.jsepRegisterBuffer=(b,v,E,R)=>m.registerBuffer(b,v,E,R),i.jsepGetBuffer=b=>m.getBuffer(b),i.jsepCreateDownloader=(b,v,E)=>m.createDownloader(b,v,E),i.jsepOnCreateSession=b=>{m.onCreateSession(b)},i.jsepOnReleaseSession=b=>{m.onReleaseSession(b)},i.jsepOnRunStart=b=>m.onRunStart(b),i.bc=(b,v)=>{m.upload(b,v)}}else if(o==="webnn"){let m=p[0];[i.nc,i.Nb,i.webnnEnsureTensor,i.Ob,i.webnnDownloadTensor]=p.slice(1),i.webnnReleaseTensorId=i.Nb,i.webnnUploadTensor=i.Ob,i.webnnOnRunStart=b=>m.onRunStart(b),i.webnnOnRunEnd=m.onRunEnd.bind(m),i.webnnRegisterMLContext=(b,v)=>{m.registerMLContext(b,v)},i.webnnOnReleaseSession=b=>{m.onReleaseSession(b)},i.webnnCreateMLTensorDownloader=(b,v)=>m.createMLTensorDownloader(b,v),i.webnnRegisterMLTensor=(b,v,E,R)=>m.registerMLTensor(b,v,E,R),i.webnnCreateMLContext=b=>m.createMLContext(b),i.webnnRegisterMLConstant=(b,v,E,R,U,V)=>m.registerMLConstant(b,v,E,R,U,i.Eb,V),i.webnnRegisterGraphInput=m.registerGraphInput.bind(m),i.webnnIsGraphInput=m.isGraphInput.bind(m),i.webnnCreateTemporaryTensor=m.createTemporaryTensor.bind(m),i.webnnIsInt64Supported=m.isInt64Supported.bind(m)}};let c=()=>{let o=(p,m,b)=>(...v)=>{let E=Ke,R=m?.();v=p(...v);let U=m?.();return R!==U&&(p=U,b(R),m=b=null),Ke!=E?new Promise((V,K)=>{si={resolve:V,reject:K}}):v};(()=>{for(let p of["_OrtAppendExecutionProvider","_OrtCreateSession","_OrtRun","_OrtRunWithBinding","_OrtBindInput"])i[p]=o(i[p],()=>i[p],m=>i[p]=m)})(),d!==void 0&&(i._OrtRun=d(i._OrtRun),i._OrtRunWithBinding=d(i._OrtRunWithBinding)),c=void 0};i.asyncInit=()=>{c?.()};var f,h,_=Object.assign({},i),g=(o,p)=>{throw p},$="";(n||s)&&(s?$=self.location.href:typeof document<"u"&&document.currentScript&&($=document.currentScript.src),bi&&($=bi),$=$.startsWith("blob:")?"":$.slice(0,$.replace(/[?#].*/,"").lastIndexOf("/")+1),s&&(h=o=>{var p=new XMLHttpRequest;return p.open("GET",o,!1),p.responseType="arraybuffer",p.send(null),new Uint8Array(p.response)}),f=async o=>{if(J(o))return new Promise((m,b)=>{var v=new XMLHttpRequest;v.open("GET",o,!0),v.responseType="arraybuffer",v.onload=()=>{v.status==200||v.status==0&&v.response?m(v.response):b(v.status)},v.onerror=b,v.send(null)});var p=await fetch(o,{credentials:"same-origin"});if(p.ok)return p.arrayBuffer();throw Error(p.status+" : "+p.url)});var x=console.log.bind(console),y=console.error.bind(console),w=x,k=y;Object.assign(i,_),_=null;var S,I,T,z,A,M,q,G,P,N,Z,te,L,Q=i.wasmBinary,ie=!1,J=o=>o.startsWith("file://");function he(){return S.buffer!=z.buffer&&Ee(),z}function D(){return S.buffer!=z.buffer&&Ee(),A}function j(){return S.buffer!=z.buffer&&Ee(),M}function re(){return S.buffer!=z.buffer&&Ee(),q}function O(){return S.buffer!=z.buffer&&Ee(),G}function ne(){return S.buffer!=z.buffer&&Ee(),P}function De(){return S.buffer!=z.buffer&&Ee(),N}function be(){return S.buffer!=z.buffer&&Ee(),L}if(u){let o=function(p){try{var m=p.data,b=m.Bb;if(b==="load"){let v=[];self.onmessage=E=>v.push(E),self.startWorker=()=>{postMessage({Bb:"loaded"});for(let E of v)o(E);self.onmessage=o};for(let E of m.Rb)i[E]&&!i[E].proxy||(i[E]=(...R)=>{postMessage({Bb:"callHandler",Qb:E,args:R})},E=="print"&&(w=i[E]),E=="printErr"&&(k=i[E]));S=m.kc,Ee(),He(m.lc)}else if(b==="run"){Gf(m.Ab),di(m.Ab,0,0,1,0,0),gn(),ai(m.Ab),qt||(ds(),qt=!0);try{Hf(m.fc,m.Hb)}catch(v){if(v!="unwind")throw v}}else m.target!=="setimmediate"&&(b==="checkMailbox"?qt&&pr():b&&(k(`worker: received unknown command ${b}`),k(m)))}catch(v){throw ps(),v}};var ve=o,He,qt=!1;k=function(...p){p=p.join(" "),console.error(p)},self.alert=function(...p){postMessage({Bb:"alert",text:p.join(" "),ic:br()})},self.onunhandledrejection=p=>{throw p.reason||p},self.onmessage=o}function Ee(){var o=S.buffer;i.HEAP8=z=new Int8Array(o),i.HEAP16=M=new Int16Array(o),i.HEAPU8=A=new Uint8Array(o),i.HEAPU16=q=new Uint16Array(o),i.HEAP32=G=new Int32Array(o),i.HEAPU32=P=new Uint32Array(o),i.HEAPF32=N=new Float32Array(o),i.HEAPF64=L=new Float64Array(o),i.HEAP64=Z=new BigInt64Array(o),i.HEAPU64=te=new BigUint64Array(o)}function un(){u?startWorker(i):Y.Ca()}u||(S=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),Ee());var Hr,Wt=0,Lt=null;function ln(){if(--Wt==0&&Lt){var o=Lt;Lt=null,o()}}function at(o){throw k(o="Aborted("+o+")"),ie=!0,o=new WebAssembly.RuntimeError(o+". Build with -sASSERTIONS for more info."),r(o),o}function dn(){return{a:{L:jf,Aa:Vf,b:Kf,$:wn,A:xn,pa:Sn,X:In,Z:Tn,qa:En,na:zn,ga:Cn,ma:An,J:On,Y:Rn,V:Bn,oa:Mn,W:Nn,va:Xf,E:Qf,Q:Yf,O:eh,D:rh,u:ih,r:ah,P:nh,z:ch,R:fh,ja:hh,T:mh,aa:gh,M:_h,F:yh,ia:ai,sa:bh,t:wh,Ba:$h,w:Sh,o:kh,l:Th,c:ti,n:Eh,j:Ah,v:Oh,p:Rh,f:Bh,s:Mh,m:Nh,e:Dh,k:Ph,i:Uh,g:qh,d:Wh,da:Lh,ea:Vh,fa:jh,ba:Zn,ca:Qn,N:Yn,xa:Hh,ua:Xh,h:Zh,C:Qh,G:Yh,ta:Fh,x:Jh,ra:em,U:tm,q:Gh,y:rm,K:im,S:am,za:nm,ya:sm,ka:rs,la:is,_:Qr,B:as,I:ns,ha:ss,H:os,a:S,wa:Zr}}}var Fr={829644:(o,p,m,b,v)=>{if(i===void 0||!i.Eb)return 1;if((o=$e(Number(o>>>0))).startsWith("./")&&(o=o.substring(2)),!(o=i.Eb.get(o)))return 2;if(p=Number(p>>>0),m=Number(m>>>0),b=Number(b>>>0),p+m>o.byteLength)return 3;try{let E=o.subarray(p,p+m);switch(v){case 0:D().set(E,b>>>0);break;case 1:i.mc?i.mc(b,E):i.bc(b,E);break;default:return 4}return 0}catch{return 4}},830468:(o,p,m)=>{i.Ob(o,D().subarray(p>>>0,p+m>>>0))},830532:()=>i.nc(),830574:o=>{i.Nb(o)},830611:()=>{i.Vb()},830642:()=>{i.Wb()},830671:()=>{i.$b()},830696:o=>i.Ub(o),830729:o=>i.Yb(o),830761:(o,p,m)=>{i.Kb(Number(o),Number(p),Number(m),!0)},830824:(o,p,m)=>{i.Kb(Number(o),Number(p),Number(m))},830881:()=>typeof wasmOffsetConverter<"u",830938:o=>{i.jb("Abs",o,void 0)},830989:o=>{i.jb("Neg",o,void 0)},831040:o=>{i.jb("Floor",o,void 0)},831093:o=>{i.jb("Ceil",o,void 0)},831145:o=>{i.jb("Reciprocal",o,void 0)},831203:o=>{i.jb("Sqrt",o,void 0)},831255:o=>{i.jb("Exp",o,void 0)},831306:o=>{i.jb("Erf",o,void 0)},831357:o=>{i.jb("Sigmoid",o,void 0)},831412:(o,p,m)=>{i.jb("HardSigmoid",o,{alpha:p,beta:m})},831491:o=>{i.jb("Log",o,void 0)},831542:o=>{i.jb("Sin",o,void 0)},831593:o=>{i.jb("Cos",o,void 0)},831644:o=>{i.jb("Tan",o,void 0)},831695:o=>{i.jb("Asin",o,void 0)},831747:o=>{i.jb("Acos",o,void 0)},831799:o=>{i.jb("Atan",o,void 0)},831851:o=>{i.jb("Sinh",o,void 0)},831903:o=>{i.jb("Cosh",o,void 0)},831955:o=>{i.jb("Asinh",o,void 0)},832008:o=>{i.jb("Acosh",o,void 0)},832061:o=>{i.jb("Atanh",o,void 0)},832114:o=>{i.jb("Tanh",o,void 0)},832166:o=>{i.jb("Not",o,void 0)},832217:(o,p,m)=>{i.jb("Clip",o,{min:p,max:m})},832286:o=>{i.jb("Clip",o,void 0)},832338:(o,p)=>{i.jb("Elu",o,{alpha:p})},832396:o=>{i.jb("Gelu",o,void 0)},832448:o=>{i.jb("Relu",o,void 0)},832500:(o,p)=>{i.jb("LeakyRelu",o,{alpha:p})},832564:(o,p)=>{i.jb("ThresholdedRelu",o,{alpha:p})},832634:(o,p)=>{i.jb("Cast",o,{to:p})},832692:o=>{i.jb("Add",o,void 0)},832743:o=>{i.jb("Sub",o,void 0)},832794:o=>{i.jb("Mul",o,void 0)},832845:o=>{i.jb("Div",o,void 0)},832896:o=>{i.jb("Pow",o,void 0)},832947:o=>{i.jb("Equal",o,void 0)},833e3:o=>{i.jb("Greater",o,void 0)},833055:o=>{i.jb("GreaterOrEqual",o,void 0)},833117:o=>{i.jb("Less",o,void 0)},833169:o=>{i.jb("LessOrEqual",o,void 0)},833228:(o,p,m,b,v)=>{i.jb("ReduceMean",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:b?Array.from(O().subarray(Number(b)>>>0,Number(v)>>>0)):[]})},833403:(o,p,m,b,v)=>{i.jb("ReduceMax",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:b?Array.from(O().subarray(Number(b)>>>0,Number(v)>>>0)):[]})},833577:(o,p,m,b,v)=>{i.jb("ReduceMin",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:b?Array.from(O().subarray(Number(b)>>>0,Number(v)>>>0)):[]})},833751:(o,p,m,b,v)=>{i.jb("ReduceProd",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:b?Array.from(O().subarray(Number(b)>>>0,Number(v)>>>0)):[]})},833926:(o,p,m,b,v)=>{i.jb("ReduceSum",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:b?Array.from(O().subarray(Number(b)>>>0,Number(v)>>>0)):[]})},834100:(o,p,m,b,v)=>{i.jb("ReduceL1",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:b?Array.from(O().subarray(Number(b)>>>0,Number(v)>>>0)):[]})},834273:(o,p,m,b,v)=>{i.jb("ReduceL2",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:b?Array.from(O().subarray(Number(b)>>>0,Number(v)>>>0)):[]})},834446:(o,p,m,b,v)=>{i.jb("ReduceLogSum",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:b?Array.from(O().subarray(Number(b)>>>0,Number(v)>>>0)):[]})},834623:(o,p,m,b,v)=>{i.jb("ReduceSumSquare",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:b?Array.from(O().subarray(Number(b)>>>0,Number(v)>>>0)):[]})},834803:(o,p,m,b,v)=>{i.jb("ReduceLogSumExp",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:b?Array.from(O().subarray(Number(b)>>>0,Number(v)>>>0)):[]})},834983:o=>{i.jb("Where",o,void 0)},835036:(o,p,m)=>{i.jb("Transpose",o,{perm:p?Array.from(O().subarray(Number(p)>>>0,Number(m)>>>0)):[]})},835160:(o,p,m,b)=>{i.jb("DepthToSpace",o,{blocksize:p,mode:$e(m),format:b?"NHWC":"NCHW"})},835293:(o,p,m,b)=>{i.jb("DepthToSpace",o,{blocksize:p,mode:$e(m),format:b?"NHWC":"NCHW"})},835426:(o,p,m,b,v,E,R,U,V,K,oe,le,me,ke,At)=>{i.jb("ConvTranspose",o,{format:V?"NHWC":"NCHW",autoPad:p,dilations:[m],group:b,kernelShape:[v],pads:[E,R],strides:[U],wIsConst:()=>!!he()[K>>>0],outputPadding:oe?Array.from(O().subarray(Number(oe)>>>0,Number(le)>>>0)):[],outputShape:me?Array.from(O().subarray(Number(me)>>>0,Number(ke)>>>0)):[],activation:$e(At)})},835859:(o,p,m,b,v,E,R,U,V,K,oe,le,me,ke)=>{i.jb("ConvTranspose",o,{format:U?"NHWC":"NCHW",autoPad:p,dilations:Array.from(O().subarray(Number(m)>>>0,2+(Number(m)>>>0)>>>0)),group:b,kernelShape:Array.from(O().subarray(Number(v)>>>0,2+(Number(v)>>>0)>>>0)),pads:Array.from(O().subarray(Number(E)>>>0,4+(Number(E)>>>0)>>>0)),strides:Array.from(O().subarray(Number(R)>>>0,2+(Number(R)>>>0)>>>0)),wIsConst:()=>!!he()[V>>>0],outputPadding:K?Array.from(O().subarray(Number(K)>>>0,Number(oe)>>>0)):[],outputShape:le?Array.from(O().subarray(Number(le)>>>0,Number(me)>>>0)):[],activation:$e(ke)})},836520:(o,p,m,b,v,E,R,U,V,K,oe,le,me,ke,At)=>{i.jb("ConvTranspose",o,{format:V?"NHWC":"NCHW",autoPad:p,dilations:[m],group:b,kernelShape:[v],pads:[E,R],strides:[U],wIsConst:()=>!!he()[K>>>0],outputPadding:oe?Array.from(O().subarray(Number(oe)>>>0,Number(le)>>>0)):[],outputShape:me?Array.from(O().subarray(Number(me)>>>0,Number(ke)>>>0)):[],activation:$e(At)})},836953:(o,p,m,b,v,E,R,U,V,K,oe,le,me,ke)=>{i.jb("ConvTranspose",o,{format:U?"NHWC":"NCHW",autoPad:p,dilations:Array.from(O().subarray(Number(m)>>>0,2+(Number(m)>>>0)>>>0)),group:b,kernelShape:Array.from(O().subarray(Number(v)>>>0,2+(Number(v)>>>0)>>>0)),pads:Array.from(O().subarray(Number(E)>>>0,4+(Number(E)>>>0)>>>0)),strides:Array.from(O().subarray(Number(R)>>>0,2+(Number(R)>>>0)>>>0)),wIsConst:()=>!!he()[V>>>0],outputPadding:K?Array.from(O().subarray(Number(K)>>>0,Number(oe)>>>0)):[],outputShape:le?Array.from(O().subarray(Number(le)>>>0,Number(me)>>>0)):[],activation:$e(ke)})},837614:(o,p)=>{i.jb("GlobalAveragePool",o,{format:p?"NHWC":"NCHW"})},837705:(o,p,m,b,v,E,R,U,V,K,oe,le,me,ke)=>{i.jb("AveragePool",o,{format:ke?"NHWC":"NCHW",auto_pad:p,ceil_mode:m,count_include_pad:b,storage_order:v,dilations:E?Array.from(O().subarray(Number(E)>>>0,Number(R)>>>0)):[],kernel_shape:U?Array.from(O().subarray(Number(U)>>>0,Number(V)>>>0)):[],pads:K?Array.from(O().subarray(Number(K)>>>0,Number(oe)>>>0)):[],strides:le?Array.from(O().subarray(Number(le)>>>0,Number(me)>>>0)):[]})},838184:(o,p)=>{i.jb("GlobalAveragePool",o,{format:p?"NHWC":"NCHW"})},838275:(o,p,m,b,v,E,R,U,V,K,oe,le,me,ke)=>{i.jb("AveragePool",o,{format:ke?"NHWC":"NCHW",auto_pad:p,ceil_mode:m,count_include_pad:b,storage_order:v,dilations:E?Array.from(O().subarray(Number(E)>>>0,Number(R)>>>0)):[],kernel_shape:U?Array.from(O().subarray(Number(U)>>>0,Number(V)>>>0)):[],pads:K?Array.from(O().subarray(Number(K)>>>0,Number(oe)>>>0)):[],strides:le?Array.from(O().subarray(Number(le)>>>0,Number(me)>>>0)):[]})},838754:(o,p)=>{i.jb("GlobalMaxPool",o,{format:p?"NHWC":"NCHW"})},838841:(o,p,m,b,v,E,R,U,V,K,oe,le,me,ke)=>{i.jb("MaxPool",o,{format:ke?"NHWC":"NCHW",auto_pad:p,ceil_mode:m,count_include_pad:b,storage_order:v,dilations:E?Array.from(O().subarray(Number(E)>>>0,Number(R)>>>0)):[],kernel_shape:U?Array.from(O().subarray(Number(U)>>>0,Number(V)>>>0)):[],pads:K?Array.from(O().subarray(Number(K)>>>0,Number(oe)>>>0)):[],strides:le?Array.from(O().subarray(Number(le)>>>0,Number(me)>>>0)):[]})},839316:(o,p)=>{i.jb("GlobalMaxPool",o,{format:p?"NHWC":"NCHW"})},839403:(o,p,m,b,v,E,R,U,V,K,oe,le,me,ke)=>{i.jb("MaxPool",o,{format:ke?"NHWC":"NCHW",auto_pad:p,ceil_mode:m,count_include_pad:b,storage_order:v,dilations:E?Array.from(O().subarray(Number(E)>>>0,Number(R)>>>0)):[],kernel_shape:U?Array.from(O().subarray(Number(U)>>>0,Number(V)>>>0)):[],pads:K?Array.from(O().subarray(Number(K)>>>0,Number(oe)>>>0)):[],strides:le?Array.from(O().subarray(Number(le)>>>0,Number(me)>>>0)):[]})},839878:(o,p,m,b,v)=>{i.jb("Gemm",o,{alpha:p,beta:m,transA:b,transB:v})},839982:o=>{i.jb("MatMul",o,void 0)},840036:(o,p,m,b)=>{i.jb("ArgMax",o,{keepDims:!!p,selectLastIndex:!!m,axis:b})},840144:(o,p,m,b)=>{i.jb("ArgMin",o,{keepDims:!!p,selectLastIndex:!!m,axis:b})},840252:(o,p)=>{i.jb("Softmax",o,{axis:p})},840315:(o,p)=>{i.jb("Concat",o,{axis:p})},840375:(o,p,m,b,v)=>{i.jb("Split",o,{axis:p,numOutputs:m,splitSizes:b?Array.from(O().subarray(Number(b)>>>0,Number(v)>>>0)):[]})},840531:o=>{i.jb("Expand",o,void 0)},840585:(o,p)=>{i.jb("Gather",o,{axis:Number(p)})},840656:(o,p)=>{i.jb("GatherElements",o,{axis:Number(p)})},840735:(o,p)=>{i.jb("GatherND",o,{batch_dims:Number(p)})},840814:(o,p,m,b,v,E,R,U,V,K,oe)=>{i.jb("Resize",o,{antialias:p,axes:m?Array.from(O().subarray(Number(m)>>>0,Number(b)>>>0)):[],coordinateTransformMode:$e(v),cubicCoeffA:E,excludeOutside:R,extrapolationValue:U,keepAspectRatioPolicy:$e(V),mode:$e(K),nearestMode:$e(oe)})},841176:(o,p,m,b,v,E,R)=>{i.jb("Slice",o,{starts:p?Array.from(O().subarray(Number(p)>>>0,Number(m)>>>0)):[],ends:b?Array.from(O().subarray(Number(b)>>>0,Number(v)>>>0)):[],axes:E?Array.from(O().subarray(Number(E)>>>0,Number(R)>>>0)):[]})},841440:o=>{i.jb("Tile",o,void 0)},841492:(o,p,m)=>{i.jb("InstanceNormalization",o,{epsilon:p,format:m?"NHWC":"NCHW"})},841606:(o,p,m)=>{i.jb("InstanceNormalization",o,{epsilon:p,format:m?"NHWC":"NCHW"})},841720:o=>{i.jb("Range",o,void 0)},841773:(o,p)=>{i.jb("Einsum",o,{equation:$e(p)})},841854:(o,p,m,b,v)=>{i.jb("Pad",o,{mode:p,value:m,pads:b?Array.from(O().subarray(Number(b)>>>0,Number(v)>>>0)):[]})},841997:(o,p,m,b,v,E)=>{i.jb("BatchNormalization",o,{epsilon:p,momentum:m,spatial:!!v,trainingMode:!!b,format:E?"NHWC":"NCHW"})},842166:(o,p,m,b,v,E)=>{i.jb("BatchNormalization",o,{epsilon:p,momentum:m,spatial:!!v,trainingMode:!!b,format:E?"NHWC":"NCHW"})},842335:(o,p,m)=>{i.jb("CumSum",o,{exclusive:Number(p),reverse:Number(m)})},842432:(o,p,m)=>{i.jb("DequantizeLinear",o,{axis:p,blockSize:m})},842522:(o,p,m,b,v)=>{i.jb("GridSample",o,{align_corners:p,mode:$e(m),padding_mode:$e(b),format:v?"NHWC":"NCHW"})},842692:(o,p,m,b,v)=>{i.jb("GridSample",o,{align_corners:p,mode:$e(m),padding_mode:$e(b),format:v?"NHWC":"NCHW"})},842862:(o,p)=>{i.jb("ScatterND",o,{reduction:$e(p)})},842947:(o,p,m,b,v,E,R,U,V)=>{i.jb("Attention",o,{numHeads:p,isUnidirectional:m,maskFilterValue:b,scale:v,doRotary:E,qkvHiddenSizes:R?Array.from(O().subarray(Number(U)>>>0,Number(U)+R>>>0)):[],pastPresentShareBuffer:!!V})},843219:o=>{i.jb("BiasAdd",o,void 0)},843274:o=>{i.jb("BiasSplitGelu",o,void 0)},843335:o=>{i.jb("FastGelu",o,void 0)},843391:(o,p,m,b,v,E,R,U,V,K,oe,le,me,ke,At,lm)=>{i.jb("Conv",o,{format:le?"NHWC":"NCHW",auto_pad:p,dilations:m?Array.from(O().subarray(Number(m)>>>0,Number(b)>>>0)):[],group:v,kernel_shape:E?Array.from(O().subarray(Number(E)>>>0,Number(R)>>>0)):[],pads:U?Array.from(O().subarray(Number(U)>>>0,Number(V)>>>0)):[],strides:K?Array.from(O().subarray(Number(K)>>>0,Number(oe)>>>0)):[],w_is_const:()=>!!he()[Number(me)>>>0],activation:$e(ke),activation_params:At?Array.from(De().subarray(Number(At)>>>0,Number(lm)>>>0)):[]})},843975:o=>{i.jb("Gelu",o,void 0)},844027:(o,p,m,b,v,E,R,U,V)=>{i.jb("GroupQueryAttention",o,{numHeads:p,kvNumHeads:m,scale:b,softcap:v,doRotary:E,rotaryInterleaved:R,smoothSoftmax:U,localWindowSize:V})},844244:(o,p,m,b)=>{i.jb("LayerNormalization",o,{axis:p,epsilon:m,simplified:!!b})},844355:(o,p,m,b)=>{i.jb("LayerNormalization",o,{axis:p,epsilon:m,simplified:!!b})},844466:(o,p,m,b,v,E)=>{i.jb("MatMulNBits",o,{k:p,n:m,accuracyLevel:b,bits:v,blockSize:E})},844593:(o,p,m,b,v,E)=>{i.jb("MultiHeadAttention",o,{numHeads:p,isUnidirectional:m,maskFilterValue:b,scale:v,doRotary:E})},844752:(o,p)=>{i.jb("QuickGelu",o,{alpha:p})},844816:(o,p,m,b,v)=>{i.jb("RotaryEmbedding",o,{interleaved:!!p,numHeads:m,rotaryEmbeddingDim:b,scale:v})},844955:(o,p,m)=>{i.jb("SkipLayerNormalization",o,{epsilon:p,simplified:!!m})},845057:(o,p,m)=>{i.jb("SkipLayerNormalization",o,{epsilon:p,simplified:!!m})},845159:(o,p,m,b)=>{i.jb("GatherBlockQuantized",o,{gatherAxis:p,quantizeAxis:m,blockSize:b})},845280:o=>{i.Zb(o)},845314:(o,p)=>i.ac(Number(o),Number(p),i.Fb.dc,i.Fb.errors)};function Vf(o,p,m){return jn(async()=>{await i.Xb(Number(o),Number(p),Number(m))})}function jf(){return typeof wasmOffsetConverter<"u"}class Kr{name="ExitStatus";constructor(p){this.message=`Program terminated with exit(${p})`,this.status=p}}var pn=o=>{o.terminate(),o.onmessage=()=>{}},Xr=[],cn=o=>{st.length==0&&(yn(),_n(st[0]));var p=st.pop();if(!p)return 6;Vt.push(p),gt[o.Ab]=p,p.Ab=o.Ab;var m={Bb:"run",fc:o.ec,Hb:o.Hb,Ab:o.Ab};return p.postMessage(m,o.Mb),0},nt=0,_e=(o,p,...m)=>{for(var b=2*m.length,v=fi(),E=ci(8*b),R=E>>>3,U=0;U<m.length;U++){var V=m[U];typeof V=="bigint"?(Z[R+2*U]=1n,Z[R+2*U+1]=V):(Z[R+2*U]=0n,be()[R+2*U+1>>>0]=V)}return o=cs(o,0,b,E,p),$r(v),o};function Zr(o){if(u)return _e(0,1,o);if(T=o,!(0<nt)){for(var p of Vt)pn(p);for(p of st)pn(p);st=[],Vt=[],gt={},ie=!0}g(0,new Kr(o))}function fn(o){if(u)return _e(1,0,o);Qr(o)}var Qr=o=>{if(T=o,u)throw fn(o),"unwind";Zr(o)},st=[],Vt=[],hn=[],gt={},mn=o=>{var p=o.Ab;delete gt[p],st.push(o),Vt.splice(Vt.indexOf(o),1),o.Ab=0,fs(p)};function gn(){hn.forEach(o=>o())}var _n=o=>new Promise(p=>{o.onmessage=v=>{var E=(v=v.data).Bb;if(v.Gb&&v.Gb!=br()){var R=gt[v.Gb];R?R.postMessage(v,v.Mb):k(`Internal error! Worker sent a message "${E}" to target pthread ${v.Gb}, but that thread no longer exists!`)}else E==="checkMailbox"?pr():E==="spawnThread"?cn(v):E==="cleanupThread"?mn(gt[v.hc]):E==="loaded"?(o.loaded=!0,p(o)):E==="alert"?alert(`Thread ${v.ic}: ${v.text}`):v.target==="setimmediate"?o.postMessage(v):E==="callHandler"?i[v.Qb](...v.args):E&&k(`worker sent an unknown command ${E}`)},o.onerror=v=>{throw k(`worker sent an error! ${v.filename}:${v.lineno}: ${v.message}`),v};var m,b=[];for(m of[])i.propertyIsEnumerable(m)&&b.push(m);o.postMessage({Bb:"load",Rb:b,kc:S,lc:I})});function yn(){var o=new Worker((()=>{let p=URL;return import.meta.url>"file:"&&import.meta.url<"file;"?new p("ort.bundle.min.mjs",import.meta.url):new URL(import.meta.url)})(),{type:"module",workerData:"em-pthread",name:"em-pthread"});st.push(o)}var Gf=o=>{Ee();var p=ne()[o+52>>>2>>>0];o=ne()[o+56>>>2>>>0],gs(p,p-o),$r(p)},Hf=(o,p)=>{nt=0,o=_s(o,p),0<nt?T=o:pi(o)};class Ff{constructor(p){this.Ib=p-24}}function Kf(o,p,m){var b=new Ff(o>>>=0);throw p>>>=0,m>>>=0,ne()[b.Ib+16>>>2>>>0]=0,ne()[b.Ib+4>>>2>>>0]=p,ne()[b.Ib+8>>>2>>>0]=m,o}function bn(o,p,m,b){return u?_e(2,1,o,p,m,b):wn(o,p,m,b)}function wn(o,p,m,b){if(o>>>=0,m>>>=0,b>>>=0,l===void 0)return 6;var v=[];return u&&v.length===0?bn(o,p>>>=0,m,b):(o={ec:m,Ab:o,Hb:b,Mb:v},u?(o.Bb="spawnThread",postMessage(o,v),0):cn(o))}var $n=typeof TextDecoder<"u"?new TextDecoder:void 0,vn=(o,p=0,m=NaN)=>{var b=(p>>>=0)+m;for(m=p;o[m]&&!(m>=b);)++m;if(16<m-p&&o.buffer&&$n)return $n.decode(o.buffer instanceof ArrayBuffer?o.subarray(p,m):o.slice(p,m));for(b="";p<m;){var v=o[p++];if(128&v){var E=63&o[p++];if((224&v)==192)b+=String.fromCharCode((31&v)<<6|E);else{var R=63&o[p++];65536>(v=(240&v)==224?(15&v)<<12|E<<6|R:(7&v)<<18|E<<12|R<<6|63&o[p++])?b+=String.fromCharCode(v):(v-=65536,b+=String.fromCharCode(55296|v>>10,56320|1023&v))}}else b+=String.fromCharCode(v)}return b},$e=(o,p)=>(o>>>=0)?vn(D(),o,p):"";function xn(o,p,m){return u?_e(3,1,o,p,m):0}function Sn(o,p){if(u)return _e(4,1,o,p)}var kn=o=>{for(var p=0,m=0;m<o.length;++m){var b=o.charCodeAt(m);127>=b?p++:2047>=b?p+=2:55296<=b&&57343>=b?(p+=4,++m):p+=3}return p},zt=(o,p,m)=>{var b=D();if(p>>>=0,0<m){var v=p;m=p+m-1;for(var E=0;E<o.length;++E){var R=o.charCodeAt(E);if(55296<=R&&57343>=R&&(R=65536+((1023&R)<<10)|1023&o.charCodeAt(++E)),127>=R){if(p>=m)break;b[p++>>>0]=R}else{if(2047>=R){if(p+1>=m)break;b[p++>>>0]=192|R>>6}else{if(65535>=R){if(p+2>=m)break;b[p++>>>0]=224|R>>12}else{if(p+3>=m)break;b[p++>>>0]=240|R>>18,b[p++>>>0]=128|R>>12&63}b[p++>>>0]=128|R>>6&63}b[p++>>>0]=128|63&R}}b[p>>>0]=0,o=p-v}else o=0;return o};function In(o,p){if(u)return _e(5,1,o,p)}function Tn(o,p,m){if(u)return _e(6,1,o,p,m)}function En(o,p,m){return u?_e(7,1,o,p,m):0}function zn(o,p){if(u)return _e(8,1,o,p)}function Cn(o,p,m){if(u)return _e(9,1,o,p,m)}function An(o,p,m,b){if(u)return _e(10,1,o,p,m,b)}function On(o,p,m,b){if(u)return _e(11,1,o,p,m,b)}function Rn(o,p,m,b){if(u)return _e(12,1,o,p,m,b)}function Bn(o){if(u)return _e(13,1,o)}function Mn(o,p){if(u)return _e(14,1,o,p)}function Nn(o,p,m){if(u)return _e(15,1,o,p,m)}var Dn,ot,Xf=()=>at(""),Fe=o=>{for(var p="";D()[o>>>0];)p+=Dn[D()[o++>>>0]];return p},Yr={},Jr={},Zf={};function Ye(o,p,m={}){return(function(b,v,E={}){var R=v.name;if(!b)throw new ot(`type "${R}" must have a positive integer typeid pointer`);if(Jr.hasOwnProperty(b)){if(E.Sb)return;throw new ot(`Cannot register type '${R}' twice`)}Jr[b]=v,delete Zf[b],Yr.hasOwnProperty(b)&&(v=Yr[b],delete Yr[b],v.forEach(U=>U()))})(o,p,m)}var Pn=(o,p,m)=>{switch(p){case 1:return m?b=>he()[b>>>0]:b=>D()[b>>>0];case 2:return m?b=>j()[b>>>1>>>0]:b=>re()[b>>>1>>>0];case 4:return m?b=>O()[b>>>2>>>0]:b=>ne()[b>>>2>>>0];case 8:return m?b=>Z[b>>>3]:b=>te[b>>>3];default:throw new TypeError(`invalid integer width (${p}): ${o}`)}};function Qf(o,p,m){m>>>=0,Ye(o>>>=0,{name:p=Fe(p>>>0),fromWireType:b=>b,toWireType:function(b,v){if(typeof v!="bigint"&&typeof v!="number")throw v=v===null?"null":(b=typeof v)=="object"||b==="array"||b==="function"?v.toString():""+v,new TypeError(`Cannot convert "${v}" to ${this.name}`);return typeof v=="number"&&(v=BigInt(v)),v},Cb:ut,readValueFromPointer:Pn(p,m,p.indexOf("u")==-1),Db:null})}var ut=8;function Yf(o,p,m,b){Ye(o>>>=0,{name:p=Fe(p>>>0),fromWireType:function(v){return!!v},toWireType:function(v,E){return E?m:b},Cb:ut,readValueFromPointer:function(v){return this.fromWireType(D()[v>>>0])},Db:null})}var ei=[],Je=[];function ti(o){9<(o>>>=0)&&--Je[o+1]==0&&(Je[o]=void 0,ei.push(o))}var ze=o=>{if(!o)throw new ot("Cannot use deleted val. handle = "+o);return Je[o]},Be=o=>{switch(o){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let p=ei.pop()||Je.length;return Je[p]=o,Je[p+1]=1,p}};function ri(o){return this.fromWireType(ne()[o>>>2>>>0])}var Jf={name:"emscripten::val",fromWireType:o=>{var p=ze(o);return ti(o),p},toWireType:(o,p)=>Be(p),Cb:ut,readValueFromPointer:ri,Db:null};function eh(o){return Ye(o>>>0,Jf)}var th=(o,p)=>{switch(p){case 4:return function(m){return this.fromWireType(De()[m>>>2>>>0])};case 8:return function(m){return this.fromWireType(be()[m>>>3>>>0])};default:throw new TypeError(`invalid float width (${p}): ${o}`)}};function rh(o,p,m){m>>>=0,Ye(o>>>=0,{name:p=Fe(p>>>0),fromWireType:b=>b,toWireType:(b,v)=>v,Cb:ut,readValueFromPointer:th(p,m),Db:null})}function ih(o,p,m,b,v){if(o>>>=0,m>>>=0,p=Fe(p>>>0),v===-1&&(v=4294967295),v=U=>U,b===0){var E=32-8*m;v=U=>U<<E>>>E}var R=p.includes("unsigned")?function(U,V){return V>>>0}:function(U,V){return V};Ye(o,{name:p,fromWireType:v,toWireType:R,Cb:ut,readValueFromPointer:Pn(p,m,b!==0),Db:null})}function ah(o,p,m){function b(E){var R=ne()[E>>>2>>>0];return E=ne()[E+4>>>2>>>0],new v(he().buffer,E,R)}var v=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][p];Ye(o>>>=0,{name:m=Fe(m>>>0),fromWireType:b,Cb:ut,readValueFromPointer:b},{Sb:!0})}function nh(o,p){Ye(o>>>=0,{name:p=Fe(p>>>0),fromWireType:function(m){for(var b,v=ne()[m>>>2>>>0],E=m+4,R=E,U=0;U<=v;++U){var V=E+U;U!=v&&D()[V>>>0]!=0||(R=$e(R,V-R),b===void 0?b=R:(b+="\0",b+=R),R=V+1)}return Xe(m),b},toWireType:function(m,b){b instanceof ArrayBuffer&&(b=new Uint8Array(b));var v=typeof b=="string";if(!(v||b instanceof Uint8Array||b instanceof Uint8ClampedArray||b instanceof Int8Array))throw new ot("Cannot pass non-string to std::string");var E=v?kn(b):b.length,R=wr(4+E+1),U=R+4;if(ne()[R>>>2>>>0]=E,v)zt(b,U,E+1);else if(v)for(v=0;v<E;++v){var V=b.charCodeAt(v);if(255<V)throw Xe(R),new ot("String has UTF-16 code units that do not fit in 8 bits");D()[U+v>>>0]=V}else for(v=0;v<E;++v)D()[U+v>>>0]=b[v];return m!==null&&m.push(Xe,R),R},Cb:ut,readValueFromPointer:ri,Db(m){Xe(m)}})}var Un=typeof TextDecoder<"u"?new TextDecoder("utf-16le"):void 0,sh=(o,p)=>{for(var m=o>>1,b=m+p/2;!(m>=b)&&re()[m>>>0];)++m;if(32<(m<<=1)-o&&Un)return Un.decode(D().slice(o,m));for(m="",b=0;!(b>=p/2);++b){var v=j()[o+2*b>>>1>>>0];if(v==0)break;m+=String.fromCharCode(v)}return m},oh=(o,p,m)=>{if(m??=2147483647,2>m)return 0;var b=p;m=(m-=2)<2*o.length?m/2:o.length;for(var v=0;v<m;++v){var E=o.charCodeAt(v);j()[p>>>1>>>0]=E,p+=2}return j()[p>>>1>>>0]=0,p-b},uh=o=>2*o.length,lh=(o,p)=>{for(var m=0,b="";!(m>=p/4);){var v=O()[o+4*m>>>2>>>0];if(v==0)break;++m,65536<=v?(v-=65536,b+=String.fromCharCode(55296|v>>10,56320|1023&v)):b+=String.fromCharCode(v)}return b},dh=(o,p,m)=>{if(p>>>=0,m??=2147483647,4>m)return 0;var b=p;m=b+m-4;for(var v=0;v<o.length;++v){var E=o.charCodeAt(v);if(55296<=E&&57343>=E&&(E=65536+((1023&E)<<10)|1023&o.charCodeAt(++v)),O()[p>>>2>>>0]=E,(p+=4)+4>m)break}return O()[p>>>2>>>0]=0,p-b},ph=o=>{for(var p=0,m=0;m<o.length;++m){var b=o.charCodeAt(m);55296<=b&&57343>=b&&++m,p+=4}return p};function ch(o,p,m){if(o>>>=0,p>>>=0,m=Fe(m>>>=0),p===2)var b=sh,v=oh,E=uh,R=U=>re()[U>>>1>>>0];else p===4&&(b=lh,v=dh,E=ph,R=U=>ne()[U>>>2>>>0]);Ye(o,{name:m,fromWireType:U=>{for(var V,K=ne()[U>>>2>>>0],oe=U+4,le=0;le<=K;++le){var me=U+4+le*p;le!=K&&R(me)!=0||(oe=b(oe,me-oe),V===void 0?V=oe:(V+="\0",V+=oe),oe=me+p)}return Xe(U),V},toWireType:(U,V)=>{if(typeof V!="string")throw new ot(`Cannot pass non-string to C++ string type ${m}`);var K=E(V),oe=wr(4+K+p);return ne()[oe>>>2>>>0]=K/p,v(V,oe+4,K+p),U!==null&&U.push(Xe,oe),oe},Cb:ut,readValueFromPointer:ri,Db(U){Xe(U)}})}function fh(o,p){Ye(o>>>=0,{Tb:!0,name:p=Fe(p>>>0),Cb:0,fromWireType:()=>{},toWireType:()=>{}})}function hh(o){di(o>>>0,!s,1,!n,131072,!1),gn()}var ii=o=>{if(!ie)try{if(o(),!(0<nt))try{u?pi(T):Qr(T)}catch(p){p instanceof Kr||p=="unwind"||g(0,p)}}catch(p){p instanceof Kr||p=="unwind"||g(0,p)}};function ai(o){o>>>=0,typeof Atomics.jc=="function"&&(Atomics.jc(O(),o>>>2,o).value.then(pr),o+=128,Atomics.store(O(),o>>>2,1))}var pr=()=>{var o=br();o&&(ai(o),ii(ms))};function mh(o,p){(o>>>=0)==p>>>0?setTimeout(pr):u?postMessage({Gb:o,Bb:"checkMailbox"}):(o=gt[o])&&o.postMessage({Bb:"checkMailbox"})}var ni=[];function gh(o,p,m,b,v){for(p>>>=0,b/=2,ni.length=b,m=v>>>0>>>3,v=0;v<b;v++)ni[v]=Z[m+2*v]?Z[m+2*v+1]:be()[m+2*v+1>>>0];return(p?Fr[p]:um[o])(...ni)}var _h=()=>{nt=0};function yh(o){o>>>=0,u?postMessage({Bb:"cleanupThread",hc:o}):mn(gt[o])}function bh(o){}var cr=(o,p)=>{var m=Jr[o];if(m===void 0)throw o=ls(o),m=Fe(o),Xe(o),new ot(`${p} has unknown type ${m}`);return m},qn=(o,p,m)=>{var b=[];return o=o.toWireType(b,m),b.length&&(ne()[p>>>2>>>0]=Be(b)),o};function wh(o,p,m){return p>>>=0,m>>>=0,o=ze(o>>>0),p=cr(p,"emval::as"),qn(p,m,o)}function $h(o,p){return p>>>=0,o=ze(o>>>0),(p=cr(p,"emval::as")).toWireType(null,o)}var fr=o=>{try{o()}catch(p){at(p)}},lt=0,Ke=null,Wn=0,hr=[],Ln={},Vn={},vh=0,si=null,xh=[];function jn(o){return(function(p){if(!ie){if(lt===0){var m=!1,b=!1;p((v=0)=>{if(!ie&&(Wn=v,m=!0,b)){lt=2,fr(()=>ws(Ke)),typeof MainLoop<"u"&&MainLoop.Pb&&MainLoop.resume(),v=!1;try{var E=(function(){var V=O()[Ke+8>>>2>>>0];return V=Y[Vn[V]],--nt,V()})()}catch(V){E=V,v=!0}var R=!1;if(!Ke){var U=si;U&&(si=null,(v?U.reject:U.resolve)(E),R=!0)}if(v&&!R)throw E}}),b=!0,m||(lt=1,Ke=(function(){var v=wr(65548),E=v+12;ne()[v>>>2>>>0]=E,ne()[v+4>>>2>>>0]=E+65536,E=hr[0];var R=Ln[E];return R===void 0&&(R=vh++,Ln[E]=R,Vn[R]=E),E=R,O()[v+8>>>2>>>0]=E,v})(),typeof MainLoop<"u"&&MainLoop.Pb&&MainLoop.pause(),fr(()=>ys(Ke)))}else lt===2?(lt=0,fr($s),Xe(Ke),Ke=null,xh.forEach(ii)):at(`invalid state: ${lt}`);return Wn}})(p=>{o().then(p)})}function Sh(o){return o>>>=0,jn(async()=>{var p=await ze(o);return Be(p)})}var mr=[];function kh(o,p,m,b){return m>>>=0,b>>>=0,(o=mr[o>>>0])(null,p=ze(p>>>0),m,b)}var Ih={},gr=o=>{var p=Ih[o];return p===void 0?Fe(o):p};function Th(o,p,m,b,v){return m>>>=0,b>>>=0,v>>>=0,(o=mr[o>>>0])(p=ze(p>>>0),p[m=gr(m)],b,v)}var Gn=()=>typeof globalThis=="object"?globalThis:Function("return this")();function Eh(o){return(o>>>=0)==0?Be(Gn()):(o=gr(o),Be(Gn()[o]))}var zh=o=>{var p=mr.length;return mr.push(o),p},Ch=(o,p)=>{for(var m=Array(o),b=0;b<o;++b)m[b]=cr(ne()[p+4*b>>>2>>>0],"parameter "+b);return m},Hn=(o,p)=>Object.defineProperty(p,"name",{value:o});function Ah(o,p,m){var b=(p=Ch(o,p>>>0)).shift();o--;var v=`return function (obj, func, destructorsRef, args) {
`,E=0,R=[];m===0&&R.push("obj");for(var U=["retType"],V=[b],K=0;K<o;++K)R.push("arg"+K),U.push("argType"+K),V.push(p[K]),v+=`  var arg${K} = argType${K}.readValueFromPointer(args${E?"+"+E:""});
`,E+=p[K].Cb;return v+=`  var rv = ${m===1?"new func":"func.call"}(${R.join(", ")});
`,b.Tb||(U.push("emval_returnValue"),V.push(qn),v+=`  return emval_returnValue(retType, destructorsRef, rv);
`),U.push(v+`};
`),o=(function(oe){var le=Function;if(!(le instanceof Function))throw new TypeError(`new_ called with constructor type ${typeof le} which is not a function`);var me=Hn(le.name||"unknownFunctionName",function(){});return me.prototype=le.prototype,me=new me,(oe=le.apply(me,oe))instanceof Object?oe:me})(U)(...V),m=`methodCaller<(${p.map(oe=>oe.name).join(", ")}) => ${b.name}>`,zh(Hn(m,o))}function Oh(o){return o=gr(o>>>0),Be(i[o])}function Rh(o,p){return p>>>=0,o=ze(o>>>0),p=ze(p),Be(o[p])}function Bh(o){9<(o>>>=0)&&(Je[o+1]+=1)}function Mh(){return Be([])}function Nh(o){o=ze(o>>>0);for(var p=Array(o.length),m=0;m<o.length;m++)p[m]=o[m];return Be(p)}function Dh(o){return Be(gr(o>>>0))}function Ph(){return Be({})}function Uh(o){for(var p=ze(o>>>=0);p.length;){var m=p.pop();p.pop()(m)}ti(o)}function qh(o,p,m){p>>>=0,m>>>=0,o=ze(o>>>0),p=ze(p),m=ze(m),o[p]=m}function Wh(o,p){return p>>>=0,o=(o=cr(o>>>0,"_emval_take_value")).readValueFromPointer(p),Be(o)}function Lh(o,p){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),p>>>=0,o=new Date(1e3*o),O()[p>>>2>>>0]=o.getUTCSeconds(),O()[p+4>>>2>>>0]=o.getUTCMinutes(),O()[p+8>>>2>>>0]=o.getUTCHours(),O()[p+12>>>2>>>0]=o.getUTCDate(),O()[p+16>>>2>>>0]=o.getUTCMonth(),O()[p+20>>>2>>>0]=o.getUTCFullYear()-1900,O()[p+24>>>2>>>0]=o.getUTCDay(),o=(o.getTime()-Date.UTC(o.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,O()[p+28>>>2>>>0]=o}var Fn=o=>o%4==0&&(o%100!=0||o%400==0),Kn=[0,31,60,91,121,152,182,213,244,274,305,335],Xn=[0,31,59,90,120,151,181,212,243,273,304,334];function Vh(o,p){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),p>>>=0,o=new Date(1e3*o),O()[p>>>2>>>0]=o.getSeconds(),O()[p+4>>>2>>>0]=o.getMinutes(),O()[p+8>>>2>>>0]=o.getHours(),O()[p+12>>>2>>>0]=o.getDate(),O()[p+16>>>2>>>0]=o.getMonth(),O()[p+20>>>2>>>0]=o.getFullYear()-1900,O()[p+24>>>2>>>0]=o.getDay();var m=(Fn(o.getFullYear())?Kn:Xn)[o.getMonth()]+o.getDate()-1|0;O()[p+28>>>2>>>0]=m,O()[p+36>>>2>>>0]=-60*o.getTimezoneOffset(),m=new Date(o.getFullYear(),6,1).getTimezoneOffset();var b=new Date(o.getFullYear(),0,1).getTimezoneOffset();o=0|(m!=b&&o.getTimezoneOffset()==Math.min(b,m)),O()[p+32>>>2>>>0]=o}function jh(o){o>>>=0;var p=new Date(O()[o+20>>>2>>>0]+1900,O()[o+16>>>2>>>0],O()[o+12>>>2>>>0],O()[o+8>>>2>>>0],O()[o+4>>>2>>>0],O()[o>>>2>>>0],0),m=O()[o+32>>>2>>>0],b=p.getTimezoneOffset(),v=new Date(p.getFullYear(),6,1).getTimezoneOffset(),E=new Date(p.getFullYear(),0,1).getTimezoneOffset(),R=Math.min(E,v);return 0>m?O()[o+32>>>2>>>0]=+(v!=E&&R==b):0<m!=(R==b)&&(v=Math.max(E,v),p.setTime(p.getTime()+6e4*((0<m?R:v)-b))),O()[o+24>>>2>>>0]=p.getDay(),m=(Fn(p.getFullYear())?Kn:Xn)[p.getMonth()]+p.getDate()-1|0,O()[o+28>>>2>>>0]=m,O()[o>>>2>>>0]=p.getSeconds(),O()[o+4>>>2>>>0]=p.getMinutes(),O()[o+8>>>2>>>0]=p.getHours(),O()[o+12>>>2>>>0]=p.getDate(),O()[o+16>>>2>>>0]=p.getMonth(),O()[o+20>>>2>>>0]=p.getYear(),o=p.getTime(),BigInt(isNaN(o)?-1:o/1e3)}function Zn(o,p,m,b,v,E,R){return u?_e(16,1,o,p,m,b,v,E,R):-52}function Qn(o,p,m,b,v,E){if(u)return _e(17,1,o,p,m,b,v,E)}var jt={},Gh=()=>performance.timeOrigin+performance.now();function Yn(o,p){if(u)return _e(18,1,o,p);if(jt[o]&&(clearTimeout(jt[o].id),delete jt[o]),!p)return 0;var m=setTimeout(()=>{delete jt[o],ii(()=>hs(o,performance.timeOrigin+performance.now()))},p);return jt[o]={id:m,qc:p},0}function Hh(o,p,m,b){o>>>=0,p>>>=0,m>>>=0,b>>>=0;var v=new Date().getFullYear(),E=new Date(v,0,1).getTimezoneOffset();v=new Date(v,6,1).getTimezoneOffset();var R=Math.max(E,v);ne()[o>>>2>>>0]=60*R,O()[p>>>2>>>0]=+(E!=v),o=(p=U=>{var V=Math.abs(U);return`UTC${0<=U?"-":"+"}${String(Math.floor(V/60)).padStart(2,"0")}${String(V%60).padStart(2,"0")}`})(E),p=p(v),v<E?(zt(o,m,17),zt(p,b,17)):(zt(o,b,17),zt(p,m,17))}var Fh=()=>Date.now(),Kh=1;function Xh(o,p,m){if(!(0<=o&&3>=o))return 28;if(o===0)o=Date.now();else{if(!Kh)return 52;o=performance.timeOrigin+performance.now()}return Z[m>>>0>>>3]=BigInt(Math.round(1e6*o)),0}var oi=[],Jn=(o,p)=>{oi.length=0;for(var m;m=D()[o++>>>0];){var b=m!=105;p+=(b&=m!=112)&&p%8?4:0,oi.push(m==112?ne()[p>>>2>>>0]:m==106?Z[p>>>3]:m==105?O()[p>>>2>>>0]:be()[p>>>3>>>0]),p+=b?8:4}return oi};function Zh(o,p,m){return o>>>=0,p=Jn(p>>>0,m>>>0),Fr[o](...p)}function Qh(o,p,m){return o>>>=0,p=Jn(p>>>0,m>>>0),Fr[o](...p)}var Yh=()=>{};function Jh(o,p){return k($e(o>>>0,p>>>0))}var em=()=>{throw nt+=1,"unwind"};function tm(){return 4294901760}var rm=()=>navigator.hardwareConcurrency;function im(){return at("Cannot use emscripten_pc_get_function without -sUSE_OFFSET_CONVERTER"),0}function am(o){o>>>=0;var p=D().length;if(o<=p||4294901760<o)return!1;for(var m=1;4>=m;m*=2){var b=p*(1+.2/m);b=Math.min(b,o+100663296);e:{b=(Math.min(4294901760,65536*Math.ceil(Math.max(o,b)/65536))-S.buffer.byteLength+65535)/65536|0;try{S.grow(b),Ee();var v=1;break e}catch{}v=void 0}if(v)return!0}return!1}var _r=()=>(at("Cannot use convertFrameToPC (needed by __builtin_return_address) without -sUSE_OFFSET_CONVERTER"),0),Ct={},es=o=>{o.forEach(p=>{var m=_r();m&&(Ct[m]=p)})};function nm(){var o=Error().stack.toString().split(`
`);return o[0]=="Error"&&o.shift(),es(o),Ct.Lb=_r(),Ct.cc=o,Ct.Lb}function sm(o,p,m){if(o>>>=0,p>>>=0,Ct.Lb==o)var b=Ct.cc;else(b=Error().stack.toString().split(`
`))[0]=="Error"&&b.shift(),es(b);for(var v=3;b[v]&&_r()!=o;)++v;for(o=0;o<m&&b[o+v];++o)O()[p+4*o>>>2>>>0]=_r();return o}var ui,li={},ts=()=>{if(!ui){var o,p={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:"./this.program"};for(o in li)li[o]===void 0?delete p[o]:p[o]=li[o];var m=[];for(o in p)m.push(`${o}=${p[o]}`);ui=m}return ui};function rs(o,p){if(u)return _e(19,1,o,p);o>>>=0,p>>>=0;var m=0;return ts().forEach((b,v)=>{var E=p+m;for(v=ne()[o+4*v>>>2>>>0]=E,E=0;E<b.length;++E)he()[v++>>>0]=b.charCodeAt(E);he()[v>>>0]=0,m+=b.length+1}),0}function is(o,p){if(u)return _e(20,1,o,p);o>>>=0,p>>>=0;var m=ts();ne()[o>>>2>>>0]=m.length;var b=0;return m.forEach(v=>b+=v.length+1),ne()[p>>>2>>>0]=b,0}function as(o){return u?_e(21,1,o):52}function ns(o,p,m,b){return u?_e(22,1,o,p,m,b):52}function ss(o,p,m,b){return u?_e(23,1,o,p,m,b):70}var om=[null,[],[]];function os(o,p,m,b){if(u)return _e(24,1,o,p,m,b);p>>>=0,m>>>=0,b>>>=0;for(var v=0,E=0;E<m;E++){var R=ne()[p>>>2>>>0],U=ne()[p+4>>>2>>>0];p+=8;for(var V=0;V<U;V++){var K=D()[R+V>>>0],oe=om[o];K===0||K===10?((o===1?w:k)(vn(oe)),oe.length=0):oe.push(K)}v+=U}return ne()[b>>>2>>>0]=v,0}u||(function(){for(var o=i.numThreads-1;o--;)yn();Xr.unshift(()=>{Wt++,(function(p){u?p():Promise.all(st.map(_n)).then(p)})(()=>ln())})})();for(var us=Array(256),yr=0;256>yr;++yr)us[yr]=String.fromCharCode(yr);Dn=us,ot=i.BindingError=class extends Error{constructor(o){super(o),this.name="BindingError"}},i.InternalError=class extends Error{constructor(o){super(o),this.name="InternalError"}},Je.push(0,1,void 0,1,null,1,!0,1,!1,1),i.count_emval_handles=()=>Je.length/2-5-ei.length;var Y,um=[Zr,fn,bn,xn,Sn,In,Tn,En,zn,Cn,An,On,Rn,Bn,Mn,Nn,Zn,Qn,Yn,rs,is,as,ns,ss,os];(async function(){function o(b,v){return Y=b.exports,Y=(function(){var E=Y,R={};for(let[U,V]of Object.entries(E))R[U]=typeof V=="function"?(...K)=>{hr.push(U);try{return V(...K)}finally{ie||(hr.pop(),Ke&&lt===1&&hr.length===0&&(lt=0,nt+=1,fr(bs),typeof Fibers<"u"&&Fibers.rc()))}}:V;return R})(),Y=(function(){var E=Y,R=V=>K=>V(K)>>>0,U=V=>()=>V()>>>0;return(E=Object.assign({},E)).Da=R(E.Da),E.fb=U(E.fb),E.hb=R(E.hb),E.tb=R(E.tb),E.ub=U(E.ub),E.__cxa_get_exception_ptr=R(E.__cxa_get_exception_ptr),E})(),hn.push(Y.ib),I=v,ln(),Y}Wt++;var p=dn();if(i.instantiateWasm)return new Promise(b=>{i.instantiateWasm(p,(v,E)=>{o(v,E),b(v.exports)})});if(u)return new Promise(b=>{He=v=>{var E=new WebAssembly.Instance(v,dn());b(o(E,v))}});Hr??=i.locateFile?i.locateFile?i.locateFile("ort-wasm-simd-threaded.jsep.wasm",$):$+"ort-wasm-simd-threaded.jsep.wasm":new URL("ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href;try{var m=await(async function(b){var v=Hr;if(!Q&&typeof WebAssembly.instantiateStreaming=="function"&&!J(v))try{var E=fetch(v,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(E,b)}catch(R){k(`wasm streaming compile failed: ${R}`),k("falling back to ArrayBuffer instantiation")}return(async function(R,U){try{var V=await(async function(K){if(!Q)try{var oe=await f(K);return new Uint8Array(oe)}catch{}if(K==Hr&&Q)K=new Uint8Array(Q);else{if(!h)throw"both async and sync fetching of the wasm failed";K=h(K)}return K})(R);return await WebAssembly.instantiate(V,U)}catch(K){k(`failed to asynchronously prepare wasm: ${K}`),at(K)}})(v,b)})(p);return o(m.instance,m.module)}catch(b){return r(b),Promise.reject(b)}})();var ls=o=>(ls=Y.Da)(o),ds=()=>(ds=Y.Ea)();i._OrtInit=(o,p)=>(i._OrtInit=Y.Fa)(o,p),i._OrtGetLastError=(o,p)=>(i._OrtGetLastError=Y.Ga)(o,p),i._OrtCreateSessionOptions=(o,p,m,b,v,E,R,U,V,K)=>(i._OrtCreateSessionOptions=Y.Ha)(o,p,m,b,v,E,R,U,V,K),i._OrtAppendExecutionProvider=(o,p,m,b,v)=>(i._OrtAppendExecutionProvider=Y.Ia)(o,p,m,b,v),i._OrtAddFreeDimensionOverride=(o,p,m)=>(i._OrtAddFreeDimensionOverride=Y.Ja)(o,p,m),i._OrtAddSessionConfigEntry=(o,p,m)=>(i._OrtAddSessionConfigEntry=Y.Ka)(o,p,m),i._OrtReleaseSessionOptions=o=>(i._OrtReleaseSessionOptions=Y.La)(o),i._OrtCreateSession=(o,p,m)=>(i._OrtCreateSession=Y.Ma)(o,p,m),i._OrtReleaseSession=o=>(i._OrtReleaseSession=Y.Na)(o),i._OrtGetInputOutputCount=(o,p,m)=>(i._OrtGetInputOutputCount=Y.Oa)(o,p,m),i._OrtGetInputOutputMetadata=(o,p,m,b)=>(i._OrtGetInputOutputMetadata=Y.Pa)(o,p,m,b),i._OrtFree=o=>(i._OrtFree=Y.Qa)(o),i._OrtCreateTensor=(o,p,m,b,v,E)=>(i._OrtCreateTensor=Y.Ra)(o,p,m,b,v,E),i._OrtGetTensorData=(o,p,m,b,v)=>(i._OrtGetTensorData=Y.Sa)(o,p,m,b,v),i._OrtReleaseTensor=o=>(i._OrtReleaseTensor=Y.Ta)(o),i._OrtCreateRunOptions=(o,p,m,b)=>(i._OrtCreateRunOptions=Y.Ua)(o,p,m,b),i._OrtAddRunConfigEntry=(o,p,m)=>(i._OrtAddRunConfigEntry=Y.Va)(o,p,m),i._OrtReleaseRunOptions=o=>(i._OrtReleaseRunOptions=Y.Wa)(o),i._OrtCreateBinding=o=>(i._OrtCreateBinding=Y.Xa)(o),i._OrtBindInput=(o,p,m)=>(i._OrtBindInput=Y.Ya)(o,p,m),i._OrtBindOutput=(o,p,m,b)=>(i._OrtBindOutput=Y.Za)(o,p,m,b),i._OrtClearBoundOutputs=o=>(i._OrtClearBoundOutputs=Y._a)(o),i._OrtReleaseBinding=o=>(i._OrtReleaseBinding=Y.$a)(o),i._OrtRunWithBinding=(o,p,m,b,v)=>(i._OrtRunWithBinding=Y.ab)(o,p,m,b,v),i._OrtRun=(o,p,m,b,v,E,R,U)=>(i._OrtRun=Y.bb)(o,p,m,b,v,E,R,U),i._OrtEndProfiling=o=>(i._OrtEndProfiling=Y.cb)(o),i._JsepOutput=(o,p,m)=>(i._JsepOutput=Y.db)(o,p,m),i._JsepGetNodeName=o=>(i._JsepGetNodeName=Y.eb)(o);var br=()=>(br=Y.fb)(),Xe=i._free=o=>(Xe=i._free=Y.gb)(o),wr=i._malloc=o=>(wr=i._malloc=Y.hb)(o),di=(o,p,m,b,v,E)=>(di=Y.kb)(o,p,m,b,v,E),ps=()=>(ps=Y.lb)(),cs=(o,p,m,b,v)=>(cs=Y.mb)(o,p,m,b,v),fs=o=>(fs=Y.nb)(o),pi=o=>(pi=Y.ob)(o),hs=(o,p)=>(hs=Y.pb)(o,p),ms=()=>(ms=Y.qb)(),gs=(o,p)=>(gs=Y.rb)(o,p),$r=o=>($r=Y.sb)(o),ci=o=>(ci=Y.tb)(o),fi=()=>(fi=Y.ub)(),_s=i.dynCall_ii=(o,p)=>(_s=i.dynCall_ii=Y.vb)(o,p),ys=o=>(ys=Y.wb)(o),bs=()=>(bs=Y.xb)(),ws=o=>(ws=Y.yb)(o),$s=()=>($s=Y.zb)();return i.stackSave=()=>fi(),i.stackRestore=o=>$r(o),i.stackAlloc=o=>ci(o),i.setValue=function(o,p,m="i8"){switch(m.endsWith("*")&&(m="*"),m){case"i1":case"i8":he()[o>>>0]=p;break;case"i16":j()[o>>>1>>>0]=p;break;case"i32":O()[o>>>2>>>0]=p;break;case"i64":Z[o>>>3]=BigInt(p);break;case"float":De()[o>>>2>>>0]=p;break;case"double":be()[o>>>3>>>0]=p;break;case"*":ne()[o>>>2>>>0]=p;break;default:at(`invalid type for setValue: ${m}`)}},i.getValue=function(o,p="i8"){switch(p.endsWith("*")&&(p="*"),p){case"i1":case"i8":return he()[o>>>0];case"i16":return j()[o>>>1>>>0];case"i32":return O()[o>>>2>>>0];case"i64":return Z[o>>>3];case"float":return De()[o>>>2>>>0];case"double":return be()[o>>>3>>>0];case"*":return ne()[o>>>2>>>0];default:at(`invalid type for getValue: ${p}`)}},i.UTF8ToString=$e,i.stringToUTF8=zt,i.lengthBytesUTF8=kn,(function o(){if(0<Wt)Lt=o;else if(u)t(i),un();else{for(;0<Xr.length;)Xr.shift()(i);0<Wt?Lt=o:(i.calledRun=!0,ie||(un(),t(i)))}})(),i.PTR_SIZE=4,a}),vd=wi,xs=globalThis.self?.name?.startsWith("em-pthread"),xs&&wi()}),$i,fa,Ss,Ce,xd,xr,ks,Is,vi,Ts,xi,Sd,Si,kd,Oa=W(()=>{"use strict";Aa(),$i=typeof location>"u"?void 0:location.origin,fa=import.meta.url>"file:"&&import.meta.url<"file;",Ss=()=>{if(fa){let e=URL;return new URL(new e("ort.bundle.min.mjs",import.meta.url).href,$i).href}return import.meta.url},Ce=Ss(),xd=()=>{if(Ce&&!Ce.startsWith("blob:"))return Ce.substring(0,Ce.lastIndexOf("/")+1)},xr=(e,t)=>{try{let r=t??Ce;return(r?new URL(e,r):new URL(e)).origin===$i}catch{return!1}},ks=(e,t)=>{let r=t??Ce;try{return(r?new URL(e,r):new URL(e)).href}catch{return}},Is=(e,t)=>`${t??"./"}${e}`,vi=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},Ts=async e=>(await import(e)).default,xi=(zm(),sr(bd)).default,Sd=async()=>{if(!Ce)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(xr(Ce))return[void 0,xi()];let e=await vi(Ce);return[e,xi(e)]},Si=(Cm(),sr($d)).default,kd=async(e,t,r)=>{if(!e&&!t&&Si&&Ce&&xr(Ce))return[void 0,Si];{let i="ort-wasm-simd-threaded.jsep.mjs",a=e??ks(i,t),n=r&&a&&!xr(a,t),s=n?await vi(a):a??Is(i,t);return[n?s:void 0,await Ts(s)]}}}),ki,Sr,Ht,Ii,Es,zs,Cs,Ra,ge,Tt=W(()=>{"use strict";Oa(),Sr=!1,Ht=!1,Ii=!1,Es=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},zs=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},Cs=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},Ra=async e=>{if(Sr)return Promise.resolve();if(Ht)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(Ii)throw new Error("previous call to 'initializeWebAssembly()' failed.");Ht=!0;let t=e.initTimeout,r=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!Cs())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!zs())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let i=Es();r>1&&!i&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let a=e.wasmPaths,n=typeof a=="string"?a:void 0,s=a?.mjs,u=s?.href??s,l=a?.wasm,d=l?.href??l,c=e.wasmBinary,[f,h]=await kd(u,n,r>1),_=!1,g=[];if(t>0&&g.push(new Promise($=>{setTimeout(()=>{_=!0,$()},t)})),g.push(new Promise(($,x)=>{let y={numThreads:r};if(c)y.wasmBinary=c;else if(d||n)y.locateFile=w=>d??n+w;else if(u&&u.indexOf("blob:")!==0)y.locateFile=w=>new URL(w,u).href;else if(f){let w=xd();w&&(y.locateFile=k=>w+k)}h(y).then(w=>{Ht=!1,Sr=!0,ki=w,$(),f&&URL.revokeObjectURL(f)},w=>{Ht=!1,Ii=!0,x(w)})})),await Promise.race(g),_)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},ge=()=>{if(Sr&&ki)return ki;throw new Error("WebAssembly is not initialized yet.")}}),Ve,Ur,ce,Ba=W(()=>{"use strict";Tt(),Ve=(e,t)=>{let r=ge(),i=r.lengthBytesUTF8(e)+1,a=r._malloc(i);return r.stringToUTF8(e,a,i),t.push(a),a},Ur=(e,t,r,i)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([a,n])=>{let s=t?t+a:a;if(typeof n=="object")Ur(n,s+".",r,i);else if(typeof n=="string"||typeof n=="number")i(s,n.toString());else if(typeof n=="boolean")i(s,n?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof n}`)})},ce=e=>{let t=ge(),r=t.stackSave();try{let i=t.PTR_SIZE,a=t.stackAlloc(2*i);t._OrtGetLastError(a,a+i);let n=Number(t.getValue(a,i===4?"i32":"i64")),s=t.getValue(a+i,"*"),u=s?t.UTF8ToString(s):"";throw new Error(`${e} ERROR_CODE: ${n}, ERROR_MESSAGE: ${u}`)}finally{t.stackRestore(r)}}}),Id,Am=W(()=>{"use strict";Tt(),Ba(),Id=e=>{let t=ge(),r=0,i=[],a=e||{};try{if(e?.logSeverityLevel===void 0)a.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log serverity level is not valid: ${e.logSeverityLevel}`);if(e?.logVerbosityLevel===void 0)a.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);e?.terminate===void 0&&(a.terminate=!1);let n=0;return e?.tag!==void 0&&(n=Ve(e.tag,i)),r=t._OrtCreateRunOptions(a.logSeverityLevel,a.logVerbosityLevel,!!a.terminate,n),r===0&&ce("Can't create run options."),e?.extra!==void 0&&Ur(e.extra,"",new WeakSet,(s,u)=>{let l=Ve(s,i),d=Ve(u,i);t._OrtAddRunConfigEntry(r,l,d)!==0&&ce(`Can't set a run config entry: ${s} - ${u}.`)}),[r,i]}catch(n){throw r!==0&&t._OrtReleaseRunOptions(r),i.forEach(s=>t._free(s)),n}}}),As,Os,Rs,Ft,Bs,Td,Om=W(()=>{"use strict";Tt(),Ba(),As=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},Os=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},Rs=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},Ft=(e,t,r,i)=>{let a=Ve(t,i),n=Ve(r,i);ge()._OrtAddSessionConfigEntry(e,a,n)!==0&&ce(`Can't set a session config entry: ${t} - ${r}.`)},Bs=async(e,t,r)=>{for(let i of t){let a=typeof i=="string"?i:i.name,n=[];switch(a){case"webnn":if(a="WEBNN",typeof i!="string"){let c=i?.deviceType;c&&Ft(e,"deviceType",c,r)}break;case"webgpu":if(a="JS",typeof i!="string"){let c=i;if(c?.preferredLayout){if(c.preferredLayout!=="NCHW"&&c.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${c.preferredLayout}`);Ft(e,"preferredLayout",c.preferredLayout,r)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${a}`)}let s=Ve(a,r),u=n.length,l=0,d=0;if(u>0){l=ge()._malloc(u*ge().PTR_SIZE),r.push(l),d=ge()._malloc(u*ge().PTR_SIZE),r.push(d);for(let c=0;c<u;c++)ge().setValue(l+c*ge().PTR_SIZE,n[c][0],"*"),ge().setValue(d+c*ge().PTR_SIZE,n[c][1],"*")}await ge()._OrtAppendExecutionProvider(e,s,l,d,u)!==0&&ce(`Can't append execution provider: ${a}.`)}},Td=async e=>{let t=ge(),r=0,i=[],a=e||{};Rs(a);try{let n=As(a.graphOptimizationLevel??"all"),s=Os(a.executionMode??"sequential"),u=typeof a.logId=="string"?Ve(a.logId,i):0,l=a.logSeverityLevel??2;if(!Number.isInteger(l)||l<0||l>4)throw new Error(`log serverity level is not valid: ${l}`);let d=a.logVerbosityLevel??0;if(!Number.isInteger(d)||d<0||d>4)throw new Error(`log verbosity level is not valid: ${d}`);let c=typeof a.optimizedModelFilePath=="string"?Ve(a.optimizedModelFilePath,i):0;if(r=t._OrtCreateSessionOptions(n,!!a.enableCpuMemArena,!!a.enableMemPattern,s,!!a.enableProfiling,0,u,l,d,c),r===0&&ce("Can't create session options."),a.executionProviders&&await Bs(r,a.executionProviders,i),a.enableGraphCapture!==void 0){if(typeof a.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${a.enableGraphCapture}`);Ft(r,"enableGraphCapture",a.enableGraphCapture.toString(),i)}if(a.freeDimensionOverrides)for(let[f,h]of Object.entries(a.freeDimensionOverrides)){if(typeof f!="string")throw new Error(`free dimension override name must be a string: ${f}`);if(typeof h!="number"||!Number.isInteger(h)||h<0)throw new Error(`free dimension override value must be a non-negative integer: ${h}`);let _=Ve(f,i);t._OrtAddFreeDimensionOverride(r,_,h)!==0&&ce(`Can't set a free dimension override: ${f} - ${h}.`)}return a.extra!==void 0&&Ur(a.extra,"",new WeakSet,(f,h)=>{Ft(r,f,h,i)}),[r,i]}catch(n){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&ce("Can't release session options."),i.forEach(s=>t._free(s)),n}}}),Rt,tt,xt,Ma,qr,Na,Da,ha,ee=W(()=>{"use strict";Rt=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},tt=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},xt=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],i=typeof t=="number"?t:t.reduce((a,n)=>a*n,1);return r>0?Math.ceil(i*r):void 0},Ma=e=>{switch(e){case"float16":return typeof Float16Array<"u"&&Float16Array.from?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},qr=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},Na=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",Da=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",ha=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),Pa,Ed=W(()=>{"use strict";Aa(),Pa=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),i=r?parseInt(r,10):0;if(i<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let a=t.body.getReader(),n;try{n=new ArrayBuffer(i)}catch(u){if(u instanceof RangeError){let l=Math.ceil(i/65536);n=new WebAssembly.Memory({initial:l,maximum:l}).buffer}else throw u}let s=0;for(;;){let{done:u,value:l}=await a.read();if(u)break;let d=l.byteLength;new Uint8Array(n,s,d).set(l),s+=d}return new Uint8Array(n,0,i)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),Ms,Ns,Ds,Ps,Ua,Us,ue,rt=W(()=>{"use strict";ee(),Ms=["V","I","W","E","F"],Ns=(e,t)=>{console.log(`[${Ms[e]},${new Date().toISOString()}]${t}`)},Ua=(e,t)=>{Ds=e,Ps=t},Us=(e,t)=>{let r=qr(e),i=qr(Ds);r>=i&&Ns(r,typeof t=="function"?t():t)},ue=(...e)=>{Ps&&Us(...e)}}),qs,Nt,C,Wr,zd,Cd,Ad,ae=W(()=>{"use strict";qs=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},Nt=class{static calcShape(e,t,r=!1){let i=e.length,a=t.length;if(i===0)return t;if(a===0)return e;let n=Math.max(e.length,t.length),s=new Array(n);if(r){if(i<2||a<2)return;let u=qs.calcMatMulShape([e[i-2],e[i-1]],[t[a-2],t[a-1]]);if(u===void 0)return;[s[n-2],s[n-1]]=u}for(let u=r?3:1;u<=n;u++){let l=i-u<0?1:e[i-u],d=a-u<0?1:t[a-u];if(l!==d&&l>1&&d>1)return;let c=Math.max(l,d);if(l&&d)s[n-u]=Math.max(l,d);else{if(c>1)return;s[n-u]=0}}return s}static isValidBroadcast(e,t){let r=e.length,i=t.length;if(r>i)return!1;for(let a=1;a<=r;a++)if(e[r-a]!==1&&e[r-a]!==t[i-a])return!1;return!0}},C=class Nr{static size(t){return Nr.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,r=4){let i=t.length;if(i===0)return[];let a=new Array(i),n=i-1;for(;n>=0;){if(t[n]%r===0){a[n]=t[n]/r;break}if(r%t[n]!==0)throw new Error("cannot convert shape");a[n]=1,r/=t[n],n--}for(n--;n>=0;n--)a[n]=t[n];return a}static sizeFromDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return Nr.getSizeFromDimensionRange(t,r,t.length)}static sizeToDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${t.length} dimensions.`);return Nr.getSizeFromDimensionRange(t,0,r)}static getSizeFromDimensionRange(t,r,i){let a=1;for(let n=r;n<i;n++){if(t[n]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");a*=Number(t[n])}return a}static computeStrides(t){let r=t.length;if(r===0)return[];if(r===1)return[1];let i=new Array(r);i[r-1]=1,i[r-2]=t[r-1];for(let a=r-3;a>=0;--a)i[a]=i[a+1]*t[a+1];return i}static normalizeAxis(t,r){if(t<-r&&t>=r)throw new Error("unsupported axis for this operation.");return t<0?t+r:t}static normalizeAxes(t,r){return t.map(i=>this.normalizeAxis(i,r??t.length))}static sortBasedOnPerm(t,r){return r?r.map(i=>t[i]):t.slice().reverse()}static padShape(t,r){let i=t.length;return t.map((a,n)=>a+r[n]+r[n+i])}static areEqual(t,r){return t.length!==r.length?!1:t.every((i,a)=>i===r[a])}},Wr=class rr{static adjustPoolAttributes(t,r,i,a,n,s){if(!t&&i.length!==r.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let u=0;u<r.length-2;u++)u>=i.length?i.push(r[u+2]):i[u]=r[u+2];for(let u=0;u<i.length;u++)if(u<a.length){if(a[u]<0)throw new Error("strides should be greater than or equal to 1")}else a.push(1);for(let u=0;u<i.length;u++)if(u<n.length){if(n[u]<0)throw new Error("dilations should be greater than or equal to 1")}else n.push(1);for(let u=0;u<i.length*2;u++)if(u<s.length){if(s[u]<0)throw new Error("pad should be greater than or equal to 1")}else s.push(0);for(let u=0;u<i.length;u++){if(i[u]<=0)throw new Error("kernel shapes need to be greater than 0");if(s[u]>=i[u]||s[u+i.length]>=i[u])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,r,i,a,n,s,u){if(u){if(n.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(r.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(a.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let l=0;l<t.length-2;l++)rr.adjustPadAndReturnShape(t[l+(s?1:2)],r[l],i[l],a[l],n,l,l+t.length-2,u)}}static computePoolOutputShape(t,r,i,a,n,s,u){if(r.length<=0)throw new Error("input shape must be of size greater than 0");let l=[r[0],r[1]];return rr.computeShapeHelper(t,r,l,i,a,n,s,u),l}static computeConvOutputShape(t,r,i,a,n,s,u){if(t.length<=0||r.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let l=[t[0],r[0]];return rr.computeShapeHelper(!1,t,l,i,a,n,s,u),l}static computeShapeHelper(t,r,i,a,n,s,u,l){if(t)for(let d=0;d<r.length-2;d++)i.push(1);else for(let d=0;d<r.length-2;d++)i.push(rr.adjustPadAndReturnShape(r[d+2],a[d],n[d],s[d],u,d,d+r.length-2,l))}static adjustPadAndReturnShape(t,r,i,a,n,s,u,l){let d=i*(a-1)+1;if(l&&l!=="NOTSET")switch(l){case"VALID":return n[s]=0,n[u]=0,Math.floor((t-d)/r+1);case"SAME_LOWER":case"SAME_UPPER":if(i!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let c=((t+r-1)/r-1)*r+a-t;return n[s]=Math.floor(l==="SAME_LOWER"?(c+1)/2:c/2),n[u]=c-n[s],Math.floor((t+c-a)/r+1)}default:throw new Error("Unsupported AutoPad type")}else return Math.floor((t+n[s]+n[u]-d)/r+1)}},zd=class{static getShapeOfGemmResult(e,t,r,i,a){if(e.length!==2||r.length!==2)throw new Error("shape need to be of size 2");let n,s,u;t?(n=e[1],s=e[0]):(n=e[0],s=e[1]);let l=-1;if(i?(u=r[0],l=1):(u=r[1],l=0),r[l]!==s)throw new Error("dimension mismatch");if(n<=0||u<=0||s<=0)throw new Error("invalid shape specified");if(a&&!Nt.isValidBroadcast(a,[n,u]))throw new Error("gemm: invalid bias shape for broadcast");return[n,u,s]}},Cd=-34028234663852886e22,Ad=34028234663852886e22}),qa,Od=W(()=>{"use strict";ee(),qa=(e,t)=>new(Ma(t))(e)}),ma,Ti,Ws,Ei,Ls,zi,Ci,Ai,Vs,Rd,Rm=W(()=>{"use strict";rt(),ma=(e,t=!0)=>{if(e.byteLength%8!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 8 (BigInt).");let r=e.byteLength/8,i=new BigInt64Array(e.buffer,e.byteOffset,r),a=new Int32Array(r);for(let n=0;n<r;n++){let s=i[n];if(s>2147483647n||s<-2147483648n)throw new Error(`Overflow occurred when converting BigInt to Int32 at index ${n}: ${s}`);a[n]=Number(s)}return t?new Uint8Array(a.buffer):a},Ti=(e,t=!0)=>{if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (Int32).");let r=e.byteLength/4,i=new Int32Array(e.buffer,e.byteOffset,r),a=BigInt64Array.from(i,BigInt);return t?new Uint8Array(a.buffer):a},Ws=1,Ei=()=>Ws++,Ls=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),zi=(e,t)=>{let r=Ls.get(e);if(!r)throw new Error("Unsupported data type.");return t.length>0?Math.ceil(t.reduce((i,a)=>i*a)*r/8):0},Ci=class{constructor(e){this.shouldConvertInt64toInt32=!1,this.isInt64ToInt32Converted=!1;let{sessionId:t,context:r,tensor:i,dataType:a,shape:n,shouldConvertInt64toInt32:s=!1}=e;this.sessionId=t,this.mlContext=r,this.mlTensor=i,this.dataType=a,this.tensorShape=n,this.shouldConvertInt64toInt32=s}get tensor(){return this.mlTensor}get type(){return this.dataType}get shape(){return this.tensorShape}get byteLength(){return zi(this.dataType,this.tensorShape)}destroy(){ue("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e,t){if(e){let r=await this.mlContext.readTensor(this.mlTensor),i=Ti(new Uint8Array(r));if(t){(t instanceof ArrayBuffer?new Uint8Array(t):new Uint8Array(t.buffer,t.byteOffset,t.byteLength)).set(i);return}else return i.buffer}else return t?this.mlContext.readTensor(this.mlTensor,t):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.every((i,a)=>i===r[a])}setIsInt64ToInt32Converted(e){this.isInt64ToInt32Converted=e}},Ai=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,i){let a=t,n=this.tensorManager.getMLContext(e),s=a==="int64"&&!n.opSupportLimits().input.dataTypes.includes("int64");if(s&&(a="int32",ue("verbose",()=>"[WebNN] TensorIdTracker.ensureTensor: convert dataType from int64 to int32")),this.wrapper){if(this.wrapper.canReuseTensor(n,a,r))return this.wrapper.tensor;if(i){if(this.wrapper.byteLength!==zi(a,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let u=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,a,r,u,!0,!0,s),i&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper)if(this.wrapper.shouldConvertInt64toInt32&&(t=ma(e,!0),this.wrapper.setIsInt64ToInt32Converted(!0)),t.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else ue("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor();this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){if(this.activeUpload){let t=this.wrapper?.isInt64ToInt32Converted?Ti(this.activeUpload):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(t):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(t);return}else return t.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(this.wrapper?.shouldConvertInt64toInt32,e):this.wrapper.read(this.wrapper?.shouldConvertInt64toInt32)}},Vs=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}reserveTensorId(){let e=Ei();return this.tensorTrackersById.set(e,new Ai(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,r,i,a){ue("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${r}, shape: ${i}, copyOld: ${a}}`);let n=this.tensorTrackersById.get(t);if(!n)throw new Error("Tensor not found.");return n.ensureTensor(e,r,i,a)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");r.upload(t)}async download(e,t){ue("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t?.byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,i){let a=this.getMLContext(e),n=Ei(),s=new Ci({sessionId:e,context:a,tensor:t,dataType:r,shape:i});return this.tensorTrackersById.set(n,new Ai(this,s)),this.externalTensors.add(s),n}async getCachedTensor(e,t,r,i,a,n,s=!1){let u=this.getMLContext(e);for(let[d,c]of this.freeTensors.entries())if(c.canReuseTensor(u,t,r)){ue("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, shape: ${r}}`);let f=this.freeTensors.splice(d,1)[0];return f.sessionId=e,f}ue("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, shape: ${r}}`);let l=await u.createTensor({dataType:t,shape:r,dimensions:r,usage:i,writable:a,readable:n});return new Ci({sessionId:e,context:u,tensor:l,dataType:t,shape:r,shouldConvertInt64toInt32:s})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},Rd=(...e)=>new Vs(...e)}),kr,js,Bd,Bm=W(()=>{"use strict";ee(),Tt(),Od(),Rm(),rt(),kr=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),js=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.keys(e).sort(),i=Object.keys(t).sort();return r.length===i.length&&r.every((a,n)=>a===i[n]&&e[a]===t[a])},Bd=class{constructor(e){this.tensorManager=Rd(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.temporaryGraphInputs=[],this.temporarySessionTensorIds=new Map,Ua(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){ue("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){ue("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)ue("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(i=>i.gpuDevice===e);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:i}),i}}else if(e===void 0){let r=this.mlContextCache.findIndex(i=>i.options===void 0&&i.gpuDevice===void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:i}),i}}let t=this.mlContextCache.findIndex(r=>js(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(t,r)),r.add(e),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let i=this.mlContextCache.findIndex(a=>a.mlContext===t);i!==-1&&this.mlContextCache.splice(i,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){ue("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,r,i,a){let n=kr.get(r);if(!n)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,n,i,a)}async createTemporaryTensor(e,t,r){ue("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${r}}`);let i=kr.get(t);if(!i)throw new Error(`Unsupported ONNX data type: ${t}`);let a=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,a,i,r,!1);let n=this.temporarySessionTensorIds.get(e);return n?n.push(a):this.temporarySessionTensorIds.set(e,[a]),a}uploadTensor(e,t){if(!ge().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");ue("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return qa(r,t)}}registerMLTensor(e,t,r,i){let a=kr.get(r);if(!a)throw new Error(`Unsupported ONNX data type: ${r}`);let n=this.tensorManager.registerTensor(e,t,a,i);return ue("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${a}, dimensions: ${i}} -> {tensorId: ${n}}`),n}registerMLConstant(e,t,r,i,a,n,s=!1){if(!n)throw new Error("External mounted files are not available.");let u=e;e.startsWith("./")&&(u=e.substring(2));let l=n.get(u);if(!l)throw new Error(`File with name ${u} not found in preloaded files.`);if(t+r>l.byteLength)throw new Error("Out of bounds: data offset and length exceed the external file data size.");let d=l.slice(t,t+r).buffer,c;switch(a.dataType){case"float32":c=new Float32Array(d);break;case"float16":c=typeof Float16Array<"u"&&Float16Array.from?new Float16Array(d):new Uint16Array(d);break;case"int32":c=new Int32Array(d);break;case"uint32":c=new Uint32Array(d);break;case"int64":s?(c=ma(new Uint8Array(d),!1),a.dataType="int32"):c=new BigInt64Array(d);break;case"uint64":c=new BigUint64Array(d);break;case"int8":c=new Int8Array(d);break;case"int4":case"uint4":case"uint8":c=new Uint8Array(d);break;default:throw new Error(`Unsupported data type: ${a.dataType} in creating WebNN Constant from external data.`)}return ue("verbose",()=>`[WebNN] registerMLConstant {dataType: ${a.dataType}, shape: ${a.shape}}} ${s?"(Note: it was int64 data type and registered to int32 as workaround)":""}`),i.constant(a,c)}registerGraphInput(e){this.temporaryGraphInputs.push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}isInt64Supported(e){return!!this.mlContextBySessionId.get(e)?.opSupportLimits().input.dataTypes.includes("int64")}flush(){}}}),Wa=W(()=>{"use strict"}),Oi,Ir,Tr,Gs,Hs,Ri,ga,Fs,Md,Mm=W(()=>{"use strict";rt(),Wa(),Oi=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),Ir=[],Tr=e=>Math.ceil(Number(e)/16)*16,Gs=e=>{for(let t=0;t<Ir.length;t++){let r=Ir[t];if(e<=r)return r}return Math.ceil(e/16)*16},Hs=1,Ri=()=>Hs++,ga=async(e,t,r,i)=>{let a=Tr(r),n=e.device.createBuffer({size:a,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let s=e.getCommandEncoder();e.endComputePass(),s.copyBufferToBuffer(t,0,n,0,a),e.flush(),await n.mapAsync(GPUMapMode.READ);let u=n.getMappedRange();if(i){let l=i();return l.set(new Uint8Array(u,0,r)),l}else return new Uint8Array(u.slice(0,r))}finally{n.destroy()}},Fs=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of Oi)Ir.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let r=t.buffer,i=t.byteOffset,a=t.byteLength,n=Tr(a),s=this.storageCache.get(e);if(!s)throw new Error("gpu data for uploading does not exist");if(Number(s.originalSize)!==a)throw new Error(`inconsistent data size. gpu data size=${s.originalSize}, data size=${a}`);let u=this.backend.device.createBuffer({mappedAtCreation:!0,size:n,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC}),l=u.getMappedRange();new Uint8Array(l).set(new Uint8Array(r,i,a)),u.unmap();let d=this.backend.device.createCommandEncoder();d.copyBufferToBuffer(u,0,s.gpuData.buffer,0,n),this.backend.device.queue.submit([d.finish()]),u.destroy(),ue("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let r=this.storageCache.get(e);if(!r)throw new Error("source gpu data for memcpy does not exist");let i=this.storageCache.get(t);if(!i)throw new Error("destination gpu data for memcpy does not exist");if(r.originalSize!==i.originalSize)throw new Error("inconsistent source and destination gpu data size");let a=Tr(r.originalSize),n=this.backend.getCommandEncoder();this.backend.endComputePass(),n.copyBufferToBuffer(r.gpuData.buffer,0,i.gpuData.buffer,0,a)}registerExternalBuffer(e,t,r){let i;if(r){if(i=r[0],e===r[1])return ue("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, buffer is the same, skip.`),i;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else i=Ri();return this.storageCache.set(i,{gpuData:{id:i,type:0,buffer:e},originalSize:t}),ue("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, registered.`),i}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),ue("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let r=Gs(e),i,a=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,n=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(a||n){let u=(a?this.freeBuffers:this.freeUniformBuffers).get(r);u?u.length>0?i=u.pop():i=this.backend.device.createBuffer({size:r,usage:t}):i=this.backend.device.createBuffer({size:r,usage:t})}else i=this.backend.device.createBuffer({size:r,usage:t});let s={id:Ri(),type:0,buffer:i};return this.storageCache.set(s.id,{gpuData:s,originalSize:Number(e)}),ue("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${s.id}`),s}get(e){return this.storageCache.get(e)?.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,r=this.storageCache.get(t);if(!r){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return ue("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${r.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(r.gpuData.buffer),r.originalSize}async download(e,t){let r=this.storageCache.get(Number(e));if(!r)throw new Error("data does not exist");await ga(this.backend,r.gpuData.buffer,r.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=Oi.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let r=this.freeBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let r=this.freeUniformBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(r=>{r.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(ue("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(r=>{r.gpuData.buffer.destroy()}),this.storageCache=new Map)}},Md=(...e)=>new Fs(...e)}),Ks,pe,we=W(()=>{"use strict";Ks=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},pe=e=>new Ks(e)}),Dt,Er,xe,Ie,X,ye,_a,Mt,ft,F,Kt,B,H,Nd,La,Xs,Dd,se=W(()=>{"use strict";ee(),ae(),Dt=64,Er=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},xe=(e,t=1)=>{let r=Er(e,t);return typeof r=="string"?r:r[0]},Ie=(e,t=1)=>{let r=Er(e,t);return typeof r=="string"?r:r[1]},X=(...e)=>{let t=[];return e.forEach(r=>{r.length!==0&&t.push({type:12,data:r},{type:12,data:C.computeStrides(r)})}),t},ye=e=>e%4===0?4:e%2===0?2:1,_a=(e="f32",t,r="0")=>!t||t===1?`${e}(${r})`:`vec${t}<${e}>(${r})`,Mt=(e,t,r)=>e==="f32"?r:t===1?`f32(${r})`:`vec${t}<f32>(${r})`,ft=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,F=(e,t,r,i)=>e.startsWith("uniforms.")&&r>4?typeof t=="string"?i==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:i==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:r>1?`${e}[${t}]`:e,Kt=(e,t,r,i,a)=>{let n=typeof r=="number",s=n?r:r.length,u=[...new Array(s).keys()],l=s<2?"u32":s<=4?`vec${s}<u32>`:`array<u32, ${s}>`,d=Er(t,a),c=typeof d=="string"?d:d[1],f=typeof d=="string"?d:d[0],h={indices:l,value:c,storage:f,tensor:t},_=D=>typeof D=="string"?D:`${D}u`,g={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},$=n?"uniforms.":"",x=`${$}${e}_shape`,y=`${$}${e}_strides`,w="";for(let D=0;D<s-1;D++)w+=`
    let dim${D} = current / ${F(y,D,s)};
    let rest${D} = current % ${F(y,D,s)};
    indices[${D}] = dim${D};
    current = rest${D};
    `;w+=`indices[${s-1}] = current;`;let k=s<2?"":`
  fn o2i_${e}(offset: u32) -> ${h.indices} {
    var indices: ${h.indices};
    var current = offset;
    ${w}
    return indices;
  }`,S=D=>(g.offsetToIndices=!0,s<2?D:`o2i_${e}(${D})`),I=[];if(s>=2)for(let D=s-1;D>=0;D--)I.push(`${F(y,D,s)} * (indices[${D}])`);let T=s<2?"":`
  fn i2o_${e}(indices: ${h.indices}) -> u32 {
    return ${I.join("+")};
  }`,z=D=>(g.indicesToOffset=!0,s<2?D:`i2o_${e}(${D})`),A=(...D)=>s===0?"0u":`${h.indices}(${D.map(_).join(",")})`,M=(D,j)=>s<2?`${D}`:`${F(D,j,s)}`,q=(D,j,re)=>s<2?`${D}=${re};`:`${F(D,j,s)}=${re};`,G={},P=(D,j)=>{g.broadcastedIndicesToOffset=!0;let re=`${j.name}broadcastedIndicesTo${e}Offset`;if(re in G)return`${re}(${D})`;let O=[];for(let ne=s-1;ne>=0;ne--){let De=j.indicesGet("outputIndices",ne+j.rank-s);O.push(`${M(y,ne)} * (${De} % ${M(x,ne)})`)}return G[re]=`fn ${re}(outputIndices: ${j.type.indices}) -> u32 {
             return ${O.length>0?O.join("+"):"0u"};
           }`,`${re}(${D})`},N=(D,j)=>(()=>{if(h.storage===h.value)return`${e}[${D}]=${j};`;if(h.storage==="vec2<u32>"&&h.value==="i32")return`${e}[${D}]=vec2<u32>(u32(${j}), select(0u, 0xFFFFFFFFu, ${j} < 0));`;if(h.storage==="vec2<u32>"&&h.value==="u32")return`${e}[${D}]=vec2<u32>(u32(${j}), 0u);`;if(h.storage==="u32"&&h.value==="vec4<bool>")return`${e}[${D}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${j}));`;throw new Error(`not supported combination of storage type ${h.storage} and value type ${h.value} yet`)})(),Z=D=>(()=>{if(h.storage===h.value)return`${e}[${D}]`;if(h.storage==="vec2<u32>"&&h.value==="i32")return`i32(${e}[${D}].x)`;if(h.storage==="vec2<u32>"&&h.value==="u32")return`u32(${e}[${D}].x)`;if(h.storage==="u32"&&h.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${D}] & 0xFFu), bool(${e}[${D}] & 0xFF00u), bool(${e}[${D}] & 0xFF0000u), bool(${e}[${D}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${h.storage} and value type ${h.value} yet`)})(),te=s<2?"":`
  fn get_${e}ByIndices(indices: ${h.indices}) -> ${c} {
    return ${Z(`i2o_${e}(indices)`)};
  }`,L=s<2?"":(()=>{let D=u.map(re=>`d${re}: u32`).join(", "),j=u.map(re=>`d${re}`).join(", ");return`
  fn get_${e}(${D}) -> ${c} {
    return get_${e}ByIndices(${A(j)});
  }`})(),Q=(...D)=>{if(D.length!==s)throw new Error(`indices length must be ${s}`);let j=D.map(_).join(",");return s===0?Z("0u"):s===1?Z(j[0]):(g.get=!0,g.getByIndices=!0,g.indicesToOffset=!0,`get_${e}(${j})`)},ie=D=>s<2?Z(D):(g.getByIndices=!0,g.indicesToOffset=!0,`get_${e}ByIndices(${D})`),J=s<2?"":`
  fn set_${e}ByIndices(indices: ${h.indices}, value: ${c}) {
    ${N(`i2o_${e}(indices)`,"value")}
  }`,he=s<2?"":(()=>{let D=u.map(re=>`d${re}: u32`).join(", "),j=u.map(re=>`d${re}`).join(", ");return`
  fn set_${e}(${D}, value: ${c}) {
    set_${e}ByIndices(${A(j)}, value);
  }`})();return{impl:()=>{let D=[],j=!1;return g.offsetToIndices&&(D.push(k),j=!0),g.indicesToOffset&&(D.push(T),j=!0),g.broadcastedIndicesToOffset&&(Object.values(G).forEach(re=>D.push(re)),j=!0),g.set&&(D.push(he),j=!0),g.setByIndices&&(D.push(J),j=!0),g.get&&(D.push(L),j=!0),g.getByIndices&&(D.push(te),j=!0),!n&&j&&D.unshift(`const ${x} = ${h.indices}(${r.join(",")});`,`const ${y} = ${h.indices}(${C.computeStrides(r).join(",")});`),D.join(`
`)},type:h,offsetToIndices:S,indicesToOffset:z,broadcastedIndicesToOffset:P,indices:A,indicesGet:M,indicesSet:q,set:(...D)=>{if(D.length!==s+1)throw new Error(`indices length must be ${s}`);let j=D[s];if(typeof j!="string")throw new Error("value must be string");let re=D.slice(0,s).map(_).join(",");return s===0?N("0u",j):s===1?N(re[0],j):(g.set=!0,g.setByIndices=!0,g.indicesToOffset=!0,`set_${e}(${re}, ${j})`)},setByOffset:N,setByIndices:(D,j)=>s<2?N(D,j):(g.setByIndices=!0,g.indicesToOffset=!0,`set_${e}ByIndices(${D}, ${j});`),get:Q,getByOffset:Z,getByIndices:ie,usage:i,name:e,strides:y,shape:x,rank:s}},B=(e,t,r,i=1)=>Kt(e,t,r,"input",i),H=(e,t,r,i=1)=>Kt(e,t,r,"output",i),Nd=(e,t,r)=>Kt(e,t,r,"atomicOutput",1),La=(e,t,r,i=1)=>Kt(e,t,r,"internal",i),Xs=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=Dt){let t=typeof e=="number"?e:e[0],r=typeof e=="number"?1:e[1],i=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||r>this.limits.maxComputeWorkgroupSizeY||i>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*r*i>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let a=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,n=a?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,s=a?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*r*i}u + local_idx;`;return`@compute @workgroup_size(${t}, ${r}, ${i})
  fn main(${n}) {
    ${s}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,t){if(e.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let r=e.usage==="input"?"read":"read_write",i=e.usage==="atomicOutput"?"atomic<i32>":e.type.storage;return`@group(0) @binding(${t}) var<storage, ${r}> ${e.name}: array<${i}>;`}declareVariables(...e){return e.map(t=>this.declareVariable(t,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(t=>this.registerInternalVariable(t)),this}registerUniform(e,t,r=1){return this.uniforms.push({name:e,type:t,length:r}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let e=[];for(let{name:t,type:r,length:i}of this.uniforms)if(i&&i>4)r==="f16"?e.push(`@align(16) ${t}:array<mat2x4<${r}>, ${Math.ceil(i/8)}>`):e.push(`${t}:array<vec4<${r}>, ${Math.ceil(i/4)}>`);else{let a=i==null||i===1?r:`vec${i}<${r}>`;e.push(`${t}:${a}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},Dd=(e,t)=>new Xs(e,t)}),Zs,Bi,Qs,Ys,Js,eo,Re,Pd,Ud,ht=W(()=>{"use strict";ee(),ae(),we(),se(),Zs=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},Bi=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),Qs=(e,t)=>C.sortBasedOnPerm(e,Bi(e.length,t)),Ys=(e,t,r,i)=>{let a=`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;for(let n=0;n<t;++n)a+=`a[${e[n]}]=i[${n}];`;return a+="return a;}"},Js=(e,t)=>{let r=[],i=[];for(let a=0;a<e.length;++a)e[a]!==1&&r.push(e[a]),e[t[a]]!==1&&i.push(t[a]);return{newShape:r,newPerm:i}},eo=(e,t)=>{let r=0;for(let i=0;i<e.length;++i)if(t[e[i]]!==1){if(e[i]<r)return!1;r=e[i]}return!0},Re=(e,t)=>{let r=e.dataType,i=e.dims.length,a=Bi(i,t),n=Qs(e.dims,a),s=e.dims,u=n,l=i<2||eo(a,e.dims),d;if(l)return d=g=>{let $=B("input",r,s,4),x=H("output",r,u,4);return`
  ${g.registerUniform("output_size","u32").declareVariables($,x)}
  ${g.mainStart()}
    ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let g=C.size(n);return{outputs:[{dims:n,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(g/64/4)},programUniforms:[{type:12,data:Math.ceil(g/4)}]}},getShaderSource:d};let{newShape:c,newPerm:f}=Js(e.dims,a),h=C.areEqual(f,[2,3,1]),_=C.areEqual(f,[3,1,2]);if(c.length===2||h||_){s=h?[c[0],c[1]*c[2]]:_?[c[0]*c[1],c[2]]:c,u=[s[1],s[0]];let g=16;return d=$=>{let x=B("a",r,s.length),y=H("output",r,u.length);return`
  ${$.registerUniform("output_size","u32").declareVariables(x,y)}
  var<workgroup> tile : array<array<${y.type.value}, ${g+1}>, ${g}>;
  ${$.mainStart([g,g,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${g} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${g}u + local_id.x;
    let input_row = workgroup_id_x * ${g}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${x.getByIndices(`${x.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${g}u + local_id.x;
    let output_row = workgroup_id_y * ${g}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${y.setByIndices(`${y.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let $=C.size(n);return{outputs:[{dims:n,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(u[1]/g),y:Math.ceil(u[0]/g)},programUniforms:[{type:12,data:$},...X(s,u)]}},getShaderSource:d}}return d=g=>{let $=B("a",r,s.length),x=H("output",r,u.length);return`
  ${g.registerUniform("output_size","u32").declareVariables($,x)}

  ${Ys(a,i,$,x)}

  ${g.mainStart()}
    ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${x.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${x.setByOffset("global_idx",$.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let g=C.size(n);return{outputs:[{dims:n,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:[{type:12,data:g},...X(s,u)]}},getShaderSource:d}},Pd=(e,t)=>{Zs(e.inputs,t.perm),e.compute(Re(e.inputs[0],t.perm))},Ud=e=>pe({perm:e.perm})}),to,ro,io,ao,no,so,oo,uo,lo,po,Pe,qd,Wd,Ld,Vd,jd,Gd,Hd,Fd,Kd,Xd,Nm=W(()=>{"use strict";ee(),ae(),se(),Va(),ht(),to={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},ro={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},io={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},ao={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},no=(e,t)=>{let r=[];for(let i=t-e;i<t;++i)r.push(i);return r},so=(e,t)=>{let r=[],i=e.length;for(let n=0;n<i;n++)t.indexOf(n)===-1&&r.push(e[n]);let a=t.map(n=>e[n]);return[r,a]},oo=(e,t)=>{let r=e.length+t.length,i=[],a=0;for(let n=0;n<r;n++)t.indexOf(n)===-1?i.push(e[a++]):i.push(1);return i},uo=(e,t)=>{for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0},lo=(e,t)=>{let r=[];if(!uo(e,t)){for(let i=0;i<t;++i)e.indexOf(i)===-1&&r.push(i);e.forEach(i=>r.push(i))}return r},po=(e,t,r,i,a,n,s)=>{let u=r[0].dims,l=C.size(n),d=C.size(s),c=B("_A",r[0].dataType,u),f=H("output",a,n),h=64;l===1&&(h=256);let _=`
          var<workgroup> aBestValues : array<f32, ${h}>;
       `,g=$=>`
        ${$.registerUniform("reduceSize","u32").declareVariables(c,f)}
        ${_}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${$.mainStart(h)}

          let outputIndex = global_idx / ${h};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${io[i]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${h}) {
           let candidate = f32(${c.getByOffset("offset + k")});
           bestValue = ${to[i]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${h}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${ro[i]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${f.setByOffset("outputIndex",`${i==="mean"?`${f.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${f.type.storage}(${ao[i]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${h}`,inputDependencies:["type"]},getShaderSource:g,getRunData:()=>({outputs:[{dims:n,dataType:a}],dispatchGroup:{x:l},programUniforms:[{type:12,data:d}]})}},Pe=(e,t,r,i)=>{let a=e.inputs.length===1?r:ya(e.inputs,r),n=a.axes;n.length===0&&!a.noopWithEmptyAxes&&(n=e.inputs[0].dims.map((_,g)=>g));let s=C.normalizeAxes(n,e.inputs[0].dims.length),u=s,l=e.inputs[0],d=lo(u,e.inputs[0].dims.length);d.length>0&&(l=e.compute(Re(e.inputs[0],d),{inputs:[0],outputs:[-1]})[0],u=no(u.length,l.dims.length));let[c,f]=so(l.dims,u),h=c;a.keepDims&&(h=oo(c,s)),e.compute(po(t,a.cacheKey,[l],i,e.inputs[0].dataType,h,f),{inputs:[l]})},qd=(e,t)=>{Pe(e,"ReduceMeanShared",t,"mean")},Wd=(e,t)=>{Pe(e,"ReduceL1Shared",t,"l1")},Ld=(e,t)=>{Pe(e,"ReduceL2Shared",t,"l2")},Vd=(e,t)=>{Pe(e,"ReduceLogSumExpShared",t,"logSumExp")},jd=(e,t)=>{Pe(e,"ReduceMaxShared",t,"max")},Gd=(e,t)=>{Pe(e,"ReduceMinShared",t,"min")},Hd=(e,t)=>{Pe(e,"ReduceProdShared",t,"prod")},Fd=(e,t)=>{Pe(e,"ReduceSumShared",t,"sum")},Kd=(e,t)=>{Pe(e,"ReduceSumSquareShared",t,"sumSquare")},Xd=(e,t)=>{Pe(e,"ReduceLogSumShared",t,"logSum")}}),Ue,co,Lr,ya,qe,fo,ho,mo,go,_o,yo,bo,wo,$o,vo,We,Zd,Qd,Yd,Jd,ep,tp,rp,ip,ap,np,Va=W(()=>{"use strict";ee(),ae(),we(),se(),Nm(),Ue=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},co=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],Lr=(e,t,r,i,a,n,s=!1,u=!1)=>{let l=[],d=r[0].dims,c=d.length,f=C.normalizeAxes(a,c),h=!u&&f.length===0;d.forEach(($,x)=>{h||f.indexOf(x)>=0?s&&l.push(1):l.push($)});let _=l.length,g=C.size(l);return{name:e,shaderCache:t,getShaderSource:$=>{let x=[],y=B("_A",r[0].dataType,c),w=H("output",n,_),k=i(y,w,f),S=k[2];for(let I=0,T=0;I<c;I++)h||f.indexOf(I)>=0?(s&&T++,S=`for(var j${I}: u32 = 0; j${I} < ${d[I]}; j${I}++) {
                  ${k[2].includes("last_index")?`let last_index = j${I};`:""}
                  ${y.indicesSet("input_indices",I,`j${I}`)}
                  ${S}
                }`):(x.push(`${y.indicesSet("input_indices",I,w.indicesGet("output_indices",T))};`),T++);return`

        ${$.registerUniform("output_size","u32").declareVariables(y,w)}

        ${$.mainStart()}
          ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${y.type.indices};
          let output_indices = ${w.offsetToIndices("global_idx")};

          ${x.join(`
`)}
          ${k[0]}       // init ops for reduce max/min
          ${k[1]}
          ${S}
          ${k[3]}
          ${k.length===4?w.setByOffset("global_idx","value"):k.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:l,dataType:n}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:[{type:12,data:g},...X(d,l)]})}},ya=(e,t)=>{let r=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(i=>r.push(Number(i))),pe({axes:r,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},qe=(e,t,r,i)=>{let a=e.inputs,n=a.length===1?r:ya(a,r);e.compute(Lr(t,{hint:n.cacheKey,inputDependencies:["rank"]},[a[0]],n.noopWithEmptyAxes&&n.axes.length===0?co:i,n.axes,a[0].dataType,n.keepDims,n.noopWithEmptyAxes),{inputs:[0]})},fo=(e,t)=>{Ue(e.inputs),qe(e,"ReduceLogSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,"value = log(value);"])},ho=(e,t)=>{Ue(e.inputs),qe(e,"ReduceL1",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += abs(${r.getByIndices("input_indices")});`,""])},mo=(e,t)=>{Ue(e.inputs),qe(e,"ReduceL2",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},go=(e,t)=>{Ue(e.inputs),qe(e,"ReduceLogSumExp",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += exp(${r.getByIndices("input_indices")});`,"value = log(value);"])},_o=(e,t)=>{Ue(e.inputs),qe(e,"ReduceMax",t,(r,i,a)=>{let n=[];for(let s=0;s<r.rank;s++)(a.indexOf(s)>=0||a.length===0)&&n.push(r.indicesSet("input_indices",s,0));return[`${n.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = max(value, ${r.getByIndices("input_indices")});`,""]})},yo=(e,t)=>{Ue(e.inputs),qe(e,"ReduceMean",t,(r,i,a)=>{let n=1;for(let s=0;s<r.rank;s++)(a.indexOf(s)>=0||a.length===0)&&(n*=e.inputs[0].dims[s]);return["var sum = f32(0);","",`sum += f32(${r.getByIndices("input_indices")});`,`let value = ${i.type.value}(sum / ${n});`]})},bo=(e,t)=>{Ue(e.inputs),qe(e,"ReduceMin",t,(r,i,a)=>{let n=[];for(let s=0;s<r.rank;s++)(a.indexOf(s)>=0||a.length===0)&&n.push(`input_indices[${s}] = 0;`);return[`${n.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = min(value, ${r.getByIndices("input_indices")});`,""]})},wo=(e,t)=>{Ue(e.inputs),qe(e,"ReduceProd",t,(r,i)=>[`var value = ${i.type.storage}(1);`,"",`value *= ${r.getByIndices("input_indices")};`,""])},$o=(e,t)=>{Ue(e.inputs),qe(e,"ReduceSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,""])},vo=(e,t)=>{Ue(e.inputs),qe(e,"ReduceSumSquare",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += t * t;`,""])},We=(e,t,r)=>{if(t.length===0)return r;let i=1,a=1;for(let n=0;n<t.length;n++)t.indexOf(n)===-1?i*=e[n]:a*=e[n];return a<32&&i>1024},Zd=(e,t)=>{We(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?yo(e,t):qd(e,t)},Qd=(e,t)=>{We(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?ho(e,t):Wd(e,t)},Yd=(e,t)=>{We(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?mo(e,t):Ld(e,t)},Jd=(e,t)=>{We(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?go(e,t):Vd(e,t)},ep=(e,t)=>{We(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?_o(e,t):jd(e,t)},tp=(e,t)=>{We(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?bo(e,t):Gd(e,t)},rp=(e,t)=>{We(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?wo(e,t):Hd(e,t)},ip=(e,t)=>{We(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?$o(e,t):Fd(e,t)},ap=(e,t)=>{We(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?vo(e,t):Kd(e,t)},np=(e,t)=>{We(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?fo(e,t):Xd(e,t)}}),Mi,sp,op,ba,Dm=W(()=>{"use strict";ee(),we(),Va(),Mi=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},sp=(e,t)=>{Mi(e.inputs);let r=(i,a,n)=>{let s=[];for(let u=0;u<i.rank;u++)(n.indexOf(u)>=0||n.length===0)&&s.push(`input_indices[${u}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",a.setByOffset("global_idx","best_index")]};e.compute(Lr("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},op=(e,t)=>{Mi(e.inputs);let r=(i,a,n)=>{let s=[];for(let u=0;u<i.rank;u++)(n.indexOf(u)>=0||n.length===0)&&s.push(`input_indices[${u}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",a.setByOffset("global_idx","best_index")]};e.compute(Lr("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},ba=e=>pe(e)}),xo,zr,So,ko,Io,or,To,up,ja=W(()=>{"use strict";ee(),ae(),Wa(),se(),xo=(e,t)=>{let r=e[0],i=e[1],a=e[2],n=e[3],s=e[4],u=e[5];if(s&&u)throw new Error("Attention cannot have both past and attention_bias");if(r.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let l=r.dims[0],d=r.dims[1],c=r.dims[2];if(a.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(i.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(i.dims[0]!==c)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(a.dims[0]!==i.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let f=a.dims[0]/3,h=f,_=h;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let k of t.qkvHiddenSizes)if(k%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");f=t.qkvHiddenSizes[0],h=t.qkvHiddenSizes[1],_=t.qkvHiddenSizes[2]}let g=d;if(f!==h)throw new Error("qkv_hidden_sizes first element should be same as the second");if(a.dims[0]!==f+h+_)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let $=0;if(s){if(h!==_)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(s.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(s.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(s.dims[1]!==l)throw new Error('Input "past" second dimension must be batch_size');if(s.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(s.dims[4]!==h/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||($=s.dims[3])}let x=g+$,y=-1,w=0;if(n)throw new Error("Mask not supported");if(s)throw new Error("past is not supported");if(u){if(u.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(u.dims[0]!==l||u.dims[1]!==t.numHeads||u.dims[2]!==d||u.dims[3]!==x)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:l,sequenceLength:d,pastSequenceLength:$,kvSequenceLength:g,totalSequenceLength:x,maxSequenceLength:y,inputHiddenSize:c,hiddenSize:f,vHiddenSize:_,headSize:Math.floor(f/t.numHeads),vHeadSize:Math.floor(_/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:w,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},zr=(e,t,r)=>t&&e?`
      let total_sequence_length_input = u32(${t.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e?.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${r?"let past_sequence_length = uniforms.past_sequence_length":""};
    let present_sequence_length = total_sequence_length;
    `,So=(e,t,r,i,a,n,s,u)=>{let l=ye(s?1:n),d=64,c=n/l;c<d&&(d=32);let f=Math.ceil(n/l/d),h=[{type:12,data:t},{type:12,data:r},{type:12,data:i},{type:12,data:a},{type:12,data:c},{type:12,data:f}],_=xe(e.dataType,l),g=Ie(1,l),$=["type"];s&&$.push("type"),u&&$.push("type");let x=y=>{let w=H("x",e.dataType,e.dims,l),k=[w],S=s?B("seq_lens",s.dataType,s.dims):void 0;S&&k.push(S);let I=u?B("total_sequence_length_input",u.dataType,u.dims):void 0;I&&k.push(I);let T=Ie(e.dataType),z=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${d}>;
  var<workgroup> thread_sum: array<f32, ${d}>;
  ${y.registerUniforms(z).declareVariables(...k)}
  ${y.mainStart([d,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${zr(S,I,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${d}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${s?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${g}(-3.402823e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${g}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(l){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.402823e+38f);
    for (var i = 0u; i < ${d}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${g}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${g}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(l){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${d}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${w.type.value}(${T}(1.0) / ${T}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${g}(x[offset + i]);
        x[offset + i] = ${w.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${s?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${w.type.value}(${T}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${d};${_};${l}`,inputDependencies:$},getShaderSource:x,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:a,z:t*r},programUniforms:h})}},ko=(e,t,r,i,a,n,s,u,l)=>{let d=s+n.kvSequenceLength,c=[n.batchSize,n.numHeads,n.sequenceLength,d],f=e>1&&i,h=n.kvNumHeads?n.kvNumHeads:n.numHeads,_=f?[n.batchSize,h,d,n.headSize]:void 0,g=n.nReps?n.nReps:1,$=n.scale===0?1/Math.sqrt(n.headSize):n.scale,x=ye(n.headSize),y=n.headSize/x,w=12,k={x:Math.ceil(d/w),y:Math.ceil(n.sequenceLength/w),z:n.batchSize*n.numHeads},S=[{type:12,data:n.sequenceLength},{type:12,data:y},{type:12,data:d},{type:12,data:n.numHeads},{type:12,data:n.headSize},{type:1,data:$},{type:12,data:s},{type:12,data:n.kvSequenceLength},{type:12,data:g}],I=f&&i&&C.size(i.dims)>0,T=["type","type"];I&&T.push("type"),a&&T.push("type"),u&&T.push("type"),l&&T.push("type");let z=[{dims:c,dataType:t.dataType,gpuDataType:0}];f&&z.push({dims:_,dataType:t.dataType,gpuDataType:0});let A=M=>{let q=B("q",t.dataType,t.dims,x),G=B("key",r.dataType,r.dims,x),P=[q,G];if(I){let J=B("past_key",i.dataType,i.dims,x);P.push(J)}a&&P.push(B("attention_bias",a.dataType,a.dims));let N=u?B("seq_lens",u.dataType,u.dims):void 0;N&&P.push(N);let Z=l?B("total_sequence_length_input",l.dataType,l.dims):void 0;Z&&P.push(Z);let te=H("output",t.dataType,c),L=[te];f&&L.push(H("present_key",t.dataType,_,x));let Q=Ie(1,x),ie=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${w}u;

  var<workgroup> tileQ: array<${q.type.storage}, ${w*w}>;
  var<workgroup> tileK: array<${q.type.storage}, ${w*w}>;
  ${M.registerUniforms(ie).declareVariables(...P,...L)}
  ${M.mainStart([w,w,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${g===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${g===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${zr(N,Z,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${I&&f?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${f?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${Q}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${I&&f?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${f?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${Q}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(x){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${x}`)}})()};
        output[outputIdx] = ${te.type.value} (sum * uniforms.alpha) + ${a?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${x};${a!==void 0};${i!==void 0};${e}`,inputDependencies:T},getRunData:()=>({outputs:z,dispatchGroup:k,programUniforms:S}),getShaderSource:A}},Io=(e,t,r,i,a,n,s=void 0,u=void 0)=>{let l=n+a.kvSequenceLength,d=a.nReps?a.nReps:1,c=a.vHiddenSize*d,f=e>1&&i,h=a.kvNumHeads?a.kvNumHeads:a.numHeads,_=f?[a.batchSize,h,l,a.headSize]:void 0,g=[a.batchSize,a.sequenceLength,c],$=12,x={x:Math.ceil(a.vHeadSize/$),y:Math.ceil(a.sequenceLength/$),z:a.batchSize*a.numHeads},y=[{type:12,data:a.sequenceLength},{type:12,data:l},{type:12,data:a.vHeadSize},{type:12,data:a.numHeads},{type:12,data:a.headSize},{type:12,data:c},{type:12,data:n},{type:12,data:a.kvSequenceLength},{type:12,data:d}],w=f&&i&&C.size(i.dims)>0,k=["type","type"];w&&k.push("type"),s&&k.push("type"),u&&k.push("type");let S=[{dims:g,dataType:t.dataType,gpuDataType:0}];f&&S.push({dims:_,dataType:t.dataType,gpuDataType:0});let I=T=>{let z=B("probs",t.dataType,t.dims),A=B("v",r.dataType,r.dims),M=[z,A];w&&M.push(B("past_value",i.dataType,i.dims));let q=s?B("seq_lens",s.dataType,s.dims):void 0;s&&M.push(q);let G=u?B("total_sequence_length_input",u.dataType,u.dims):void 0;u&&M.push(G);let P=[H("output",t.dataType,g)];f&&P.push(H("present_value",t.dataType,_));let N=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${$}u;
  var<workgroup> tileQ: array<${z.type.value}, ${$*$}>;
  var<workgroup> tileV: array<${z.type.value}, ${$*$}>;
  ${T.registerUniforms(N).declareVariables(...M,...P)}
  ${T.mainStart([$,$,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${d===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${d===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${zr(q,G,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${w&&f?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${f?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${z.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${w&&f?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${f?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`};return{name:"AttentionScore",shaderCache:{hint:`${i!==void 0};${e}`,inputDependencies:k},getRunData:()=>({outputs:S,dispatchGroup:x,programUniforms:y}),getShaderSource:I}},or=(e,t,r,i,a,n,s,u,l,d,c=void 0,f=void 0)=>{let h=Math.min(e.outputCount,1+(s?1:0)+(u?1:0)),_=h>1?d.pastSequenceLength:0,g=_+d.kvSequenceLength,$=l&&C.size(l.dims)>0?l:void 0,x=[t,r];h>1&&s&&C.size(s.dims)>0&&x.push(s),$&&x.push($),c&&x.push(c),f&&x.push(f);let y=e.compute(ko(h,t,r,s,$,d,_,c,f),{inputs:x,outputs:h>1?[-1,1]:[-1]})[0];e.compute(So(y,d.batchSize,d.numHeads,_,d.sequenceLength,g,c,f),{inputs:c&&f?[y,c,f]:[y],outputs:[]});let w=[y,i];h>1&&u&&C.size(u.dims)>0&&w.push(u),c&&w.push(c),f&&w.push(f),e.compute(Io(h,y,i,u,d,_,c,f),{inputs:w,outputs:h>1?[0,2]:[0]})},To=(e,t)=>{let r=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],i=t.sequenceLength,a=t.inputHiddenSize,n=t.headSize,s=12,u={x:Math.ceil(t.headSize/s),y:Math.ceil(t.sequenceLength/s),z:t.batchSize*t.numHeads},l=[e.inputs[0],e.inputs[1],e.inputs[2]],d=[{type:12,data:i},{type:12,data:a},{type:12,data:n},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],c=f=>{let h=H("output_q",l[0].dataType,r),_=H("output_k",l[0].dataType,r),g=H("output_v",l[0].dataType,r),$=B("input",l[0].dataType,l[0].dims),x=B("weight",l[1].dataType,l[1].dims),y=B("bias",l[2].dataType,l[2].dims),w=$.type.storage,k=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${s}u;
  var<workgroup> tileInput: array<${w}, ${s*s}>;
  var<workgroup> tileWeightQ: array<${w}, ${s*s}>;
  var<workgroup> tileWeightK: array<${w}, ${s*s}>;
  var<workgroup> tileWeightV: array<${w}, ${s*s}>;
  ${f.registerUniforms(k).declareVariables($,x,y,h,_,g)}
  ${f.mainStart([s,s,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${w}(0);
    var valueK = ${w}(0);
    var valueV = ${w}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:u,programUniforms:d}),getShaderSource:c},{inputs:l,outputs:[-1,-1,-1]})},up=(e,t)=>{let r=xo(e.inputs,t),[i,a,n]=To(e,r);return or(e,i,a,n,e.inputs[4],void 0,void 0,void 0,e.inputs[5],r)}}),Eo,zo,Co,lp,Pm=W(()=>{"use strict";Ge(),ee(),ae(),we(),se(),Eo=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let r=(i,a,n)=>{let s=a.length;if(s!==i.length)throw new Error(`${n}: num dimensions != ${s}`);a.forEach((u,l)=>{if(u!==i[l])throw new Error(`${n}: dim[${l}] do not match`)})};if(e[0].dims.length>1){let i=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);r(e[1].dims,i,"Invalid input scale"),r(e[2].dims,i,"Invalid input B"),r(e[3].dims,i,"Invalid input mean"),r(e[4].dims,i,"Invalid input var")}else r(e[1].dims,[1],"Invalid input scale"),r(e[2].dims,[1],"Invalid input B"),r(e[3].dims,[1],"Invalid input mean"),r(e[4].dims,[1],"Invalid input var")},zo=(e,t)=>{let{epsilon:r,spatial:i,format:a}=t,n=e[0].dims,s=i?ye(n[n.length-1]):1,u=a==="NHWC"&&n.length>1?s:1,l=C.size(n)/s,d=i,c=d?n.length:n,f=B("x",e[0].dataType,e[0].dims,s),h=B("scale",e[1].dataType,e[1].dims,u),_=B("bias",e[2].dataType,e[2].dims,u),g=B("inputMean",e[3].dataType,e[3].dims,u),$=B("inputVar",e[4].dataType,e[4].dims,u),x=H("y",e[0].dataType,c,s),y=()=>{let k="";if(i)k=`let cOffset = ${n.length===1?"0u":a==="NHWC"?`outputIndices[${n.length-1}] / ${s}`:"outputIndices[1]"};`;else if(a==="NCHW")k=`
            ${x.indicesSet("outputIndices","0","0")}
            let cOffset = ${x.indicesToOffset("outputIndices")};`;else{k=`var cIndices = ${h.type.indices}(0);
                       cIndices[0] = outputIndices[${n.length-1}];`;for(let S=1;S<h.rank;S++)k+=`cIndices[${S}] = outputIndices[${S}];`;k+=`let cOffset = ${h.indicesToOffset("cIndices")};`}return k},w=k=>`
  const epsilon = ${r};
  ${k.registerUniform("outputSize","u32").declareVariables(f,h,_,g,$,x)}
  ${k.mainStart()}
  ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${x.offsetToIndices(`global_idx * ${s}`)};
    ${y()}
    let scale = ${h.getByOffset("cOffset")};
    let bias = ${_.getByOffset("cOffset")};
    let inputMean = ${g.getByOffset("cOffset")};
    let inputVar = ${$.getByOffset("cOffset")};
    let x = ${f.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${x.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${i}_${s}`,inputDependencies:d?["rank","type","type","type","type"]:void 0},getShaderSource:w,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d?[{type:12,data:l},...X(n)]:[{type:12,data:l}]})}},Co=e=>pe(e),lp=(e,t)=>{let{inputs:r,outputCount:i}=e,a=Co({...t,outputCount:i});if(fe.webgpu.validateInputContent&&Eo(r,a),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(zo(r,a))}}),Ao,Oo,dp,Um=W(()=>{"use strict";ae(),se(),Ao=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},Oo=e=>{let t=e[0].dims,r=e[0].dims[2],i=C.size(t)/4,a=e[0].dataType,n=B("input",a,t,4),s=B("bias",a,[r],4),u=B("residual",a,t,4),l=H("output",a,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)}}),getShaderSource:d=>`
  const channels = ${r}u / 4;
  ${d.declareVariables(n,s,u,l)}

  ${d.mainStart()}
    ${d.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let value = ${n.getByOffset("global_idx")}
      + ${s.getByOffset("global_idx % channels")} + ${u.getByOffset("global_idx")};
    ${l.setByOffset("global_idx","value")}
  }`}},dp=e=>{Ao(e.inputs),e.compute(Oo(e.inputs))}}),Ro,de,pp,cp,fp,hp,mp,gp,_p,yp,bp,Bo,wp,$p,vp,xp,ir,Sp,Dr,kp,Ip,Tp,Ep,zp,Cp,Ap,Op,Rp,Bp,Mp,Np,Dp,Pp,Up,qp,Ni,Wp,wa,$a,Lp,Vp,jp,Mo,No,Gp,Ga=W(()=>{"use strict";ee(),ae(),we(),se(),Ro=(e,t,r,i,a,n,s)=>{let u=Math.ceil(t/4),l="";typeof a=="string"?l=`${a}(a)`:l=a("a");let d=B("inputData",r,[u],4),c=H("outputData",i,[u],4),f=[{name:"vec_size",type:"u32"}];return s&&f.push(...s),`
      ${e.registerUniforms(f).declareVariables(d,c)}

  ${n??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${d.getByOffset("global_idx")};
    ${c.setByOffset("global_idx",l)}
  }`},de=(e,t,r,i,a,n=e.dataType,s,u)=>{let l=[{type:12,data:Math.ceil(C.size(e.dims)/4)}];return s&&l.push(...s),{name:t,shaderCache:{hint:a,inputDependencies:["type"]},getShaderSource:d=>Ro(d,C.size(e.dims),e.dataType,n,r,i,u),getRunData:d=>({outputs:[{dims:e.dims,dataType:n}],dispatchGroup:{x:Math.ceil(C.size(d[0].dims)/64/4)},programUniforms:l})}},pp=e=>{e.compute(de(e.inputs[0],"Abs","abs"))},cp=e=>{e.compute(de(e.inputs[0],"Acos","acos"))},fp=e=>{e.compute(de(e.inputs[0],"Acosh","acosh"))},hp=e=>{e.compute(de(e.inputs[0],"Asin","asin"))},mp=e=>{e.compute(de(e.inputs[0],"Asinh","asinh"))},gp=e=>{e.compute(de(e.inputs[0],"Atan","atan"))},_p=e=>{e.compute(de(e.inputs[0],"Atanh","atanh"))},yp=e=>pe(e),bp=(e,t)=>{let r;switch(t.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(de(e.inputs[0],"Cast",r,void 0,t.cacheKey,t.to))},Bo=e=>{let t,r,i=e.length>=2&&e[1].data!==0,a=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=i?e[1].getFloat32Array()[0]:-34028234663852886e22,r=a?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=i?e[1].getUint16Array()[0]:64511,r=a?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return pe({min:t,max:r})},wp=(e,t)=>{let r=t||Bo(e.inputs),i=Ie(e.inputs[0].dataType);e.compute(de(e.inputs[0],"Clip",a=>`clamp(${a}, vec4<${i}>(uniforms.min), vec4<${i}>(uniforms.max))`,void 0,r.cacheKey,void 0,[{type:e.inputs[0].dataType,data:r.min},{type:e.inputs[0].dataType,data:r.max}],[{name:"min",type:i},{name:"max",type:i}]),{inputs:[0]})},$p=e=>{e.compute(de(e.inputs[0],"Ceil","ceil"))},vp=e=>{e.compute(de(e.inputs[0],"Cos","cos"))},xp=e=>{e.compute(de(e.inputs[0],"Cosh","cosh"))},ir=e=>pe(e),Sp=(e,t)=>{let r=Ie(e.inputs[0].dataType);e.compute(de(e.inputs[0],"Elu",i=>`elu_vf32(${i})`,`
  const elu_alpha_ = ${r}(${t.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},Dr=(e="f32")=>`
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,kp=e=>{let t=Ie(e.inputs[0].dataType);e.compute(de(e.inputs[0],"Erf",r=>`erf_vf32(${r})`,Dr(t)))},Ip=e=>{e.compute(de(e.inputs[0],"Exp","exp"))},Tp=e=>{e.compute(de(e.inputs[0],"Floor","floor"))},Ep=e=>{let t=Ie(e.inputs[0].dataType);e.compute(de(e.inputs[0],"Gelu",r=>`0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`,Dr(t)))},zp=(e,t)=>{let r=Ie(e.inputs[0].dataType);e.compute(de(e.inputs[0],"LeakyRelu",i=>`select(leaky_relu_alpha_ * ${i}, ${i}, ${i} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${t.alpha});`,t.cacheKey))},Cp=e=>{e.compute(de(e.inputs[0],"Not",t=>`!${t}`))},Ap=e=>{e.compute(de(e.inputs[0],"Neg",t=>`-${t}`))},Op=e=>{e.compute(de(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},Rp=e=>{let t=Ie(e.inputs[0].dataType);e.compute(de(e.inputs[0],"Relu",r=>`select(vec4<${t}>(0.0), ${r}, ${r} > vec4<${t}>(0.0))`))},Bp=e=>{e.compute(de(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},Mp=e=>pe(e),Np=(e,t)=>{let r=Ie(e.inputs[0].dataType);e.compute(de(e.inputs[0],"HardSigmoid",i=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${t.alpha} * ${i} + vec4<${r}>(${t.beta})))`,void 0,t.cacheKey))},Dp=e=>{e.compute(de(e.inputs[0],"Sin","sin"))},Pp=e=>{e.compute(de(e.inputs[0],"Sinh","sinh"))},Up=e=>{e.compute(de(e.inputs[0],"Sqrt","sqrt"))},qp=e=>{e.compute(de(e.inputs[0],"Tan","tan"))},Ni=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,Wp=e=>{e.compute(de(e.inputs[0],"Tanh",Ni))},wa=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${Ni("v")};
}
`,$a=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,Lp=e=>{let t=Ie(e.inputs[0].dataType);e.compute(de(e.inputs[0],"FastGelu",$a,wa(t),void 0,e.inputs[0].dataType))},Vp=(e,t)=>{let r=Ie(e.inputs[0].dataType);return e.compute(de(e.inputs[0],"ThresholdedRelu",i=>`select(vec4<${r}>(0.0), ${i}, ${i} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${t.alpha});`,t.cacheKey)),0},jp=e=>{e.compute(de(e.inputs[0],"Log","log"))},Mo=(e,t)=>`
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,No=e=>`quick_gelu_impl(${e})`,Gp=(e,t)=>{let r=Ie(e.inputs[0].dataType);e.compute(de(e.inputs[0],"QuickGelu",No,Mo(r,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),Do,Po,Hp,qm=W(()=>{"use strict";ae(),se(),Ga(),Do=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},Po=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let r=B("input",e[0].dataType,e[0].dims,4),i=B("bias",e[0].dataType,[e[0].dims[2]],4),a=H("output",e[0].dataType,t,4),n=C.size(t)/4,s=xe(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(n/64)}}),getShaderSource:u=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${u.declareVariables(r,i,a)}

  ${Dr(s)}

  ${u.mainStart()}
    ${u.guardAgainstOutOfBoundsWorkgroupSizes(n)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${a.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},Hp=e=>{Do(e.inputs),e.compute(Po(e.inputs))}}),Uo,qo,Le,Fp,Kp,Xp,Zp,Qp,Yp,Jp,ec,tc,rc,Wm=W(()=>{"use strict";ee(),ae(),se(),Uo=(e,t,r,i,a,n,s,u,l,d,c,f)=>{let h,_;typeof u=="string"?h=_=(w,k)=>`${u}((${w}),(${k}))`:typeof u=="function"?h=_=u:(h=u.scalar,_=u.vector);let g=H("outputData",c,i.length,4),$=B("aData",l,t.length,4),x=B("bData",d,r.length,4),y;if(a)if(n){let w=C.size(t)===1,k=C.size(r)===1,S=t.length>0&&t[t.length-1]%4===0,I=r.length>0&&r[r.length-1]%4===0;w||k?y=g.setByOffset("global_idx",_(w?`${$.type.value}(${$.getByOffset("0")}.x)`:$.getByOffset("global_idx"),k?`${x.type.value}(${x.getByOffset("0")}.x)`:x.getByOffset("global_idx"))):y=`
            let outputIndices = ${g.offsetToIndices("global_idx * 4u")};
            let offsetA = ${$.broadcastedIndicesToOffset("outputIndices",g)};
            let offsetB = ${x.broadcastedIndicesToOffset("outputIndices",g)};
            ${g.setByOffset("global_idx",_(s||S?$.getByOffset("offsetA / 4u"):`${$.type.value}(${$.getByOffset("offsetA / 4u")}[offsetA % 4u])`,s||I?x.getByOffset("offsetB / 4u"):`${x.type.value}(${x.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else y=g.setByOffset("global_idx",_($.getByOffset("global_idx"),x.getByOffset("global_idx")));else{if(!n)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let w=(k,S,I="")=>{let T=`aData[indexA${S}][componentA${S}]`,z=`bData[indexB${S}][componentB${S}]`;return`
            let outputIndices${S} = ${g.offsetToIndices(`global_idx * 4u + ${S}u`)};
            let offsetA${S} = ${$.broadcastedIndicesToOffset(`outputIndices${S}`,g)};
            let offsetB${S} = ${x.broadcastedIndicesToOffset(`outputIndices${S}`,g)};
            let indexA${S} = offsetA${S} / 4u;
            let indexB${S} = offsetB${S} / 4u;
            let componentA${S} = offsetA${S} % 4u;
            let componentB${S} = offsetB${S} % 4u;
            ${k}[${S}] = ${I}(${h(T,z)});
          `};c===9?y=`
            var data = vec4<u32>(0);
            ${w("data",0,"u32")}
            ${w("data",1,"u32")}
            ${w("data",2,"u32")}
            ${w("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:y=`
            ${w("outputData[global_idx]",0)}
            ${w("outputData[global_idx]",1)}
            ${w("outputData[global_idx]",2)}
            ${w("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables($,x,g)}

        ${f??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${y}
      }`},qo=(e,t,r,i,a,n,s=r.dataType)=>{let u=r.dims.map($=>Number($)??1),l=i.dims.map($=>Number($)??1),d=!C.areEqual(u,l),c=u,f=C.size(u),h=!1,_=!1,g=[d];if(d){let $=Nt.calcShape(u,l,!1);if(!$)throw new Error("Can't perform binary op on the given tensors");c=$.slice(),f=C.size(c);let x=C.size(u)===1,y=C.size(l)===1,w=u.length>0&&u[u.length-1]%4===0,k=l.length>0&&l[l.length-1]%4===0;g.push(x),g.push(y),g.push(w),g.push(k);let S=1;for(let I=1;I<c.length;I++){let T=u[u.length-I],z=l[l.length-I];if(T===z)S*=T;else break}S%4===0?(_=!0,h=!0):(x||y||w||k)&&(h=!0)}else h=!0;return g.push(h),{name:e,shaderCache:{hint:t+g.map($=>$.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:$=>Uo($,u,l,c,h,d,_,a,r.dataType,i.dataType,s,n),getRunData:()=>({outputs:[{dims:c,dataType:s}],dispatchGroup:{x:Math.ceil(f/64/4)},programUniforms:[{type:12,data:Math.ceil(C.size(c)/4)},...X(u,l,c)]})}},Le=(e,t,r,i,a,n)=>{e.compute(qo(t,a??"",e.inputs[0],e.inputs[1],r,i,n))},Fp=e=>{Le(e,"Add",(t,r)=>`${t}+${r}`)},Kp=e=>{Le(e,"Div",(t,r)=>`${t}/${r}`)},Xp=e=>{Le(e,"Equal",{scalar:(t,r)=>`u32(${t}==${r})`,vector:(t,r)=>`vec4<u32>(${t}==${r})`},void 0,void 0,9)},Zp=e=>{Le(e,"Mul",(t,r)=>`${t}*${r}`)},Qp=e=>{let t=B("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;Le(e,"Pow",{scalar:(r,i)=>`pow_custom(${r},${i})`,vector:(r,i)=>`pow_vector_custom(${r},${i})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t==="i32"?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},Yp=e=>{Le(e,"Sub",(t,r)=>`${t}-${r}`)},Jp=e=>{Le(e,"Greater",{scalar:(t,r)=>`u32(${t}>${r})`,vector:(t,r)=>`vec4<u32>(${t}>${r})`},void 0,void 0,9)},ec=e=>{Le(e,"Less",{scalar:(t,r)=>`u32(${t}<${r})`,vector:(t,r)=>`vec4<u32>(${t}<${r})`},void 0,void 0,9)},tc=e=>{Le(e,"GreaterOrEqual",{scalar:(t,r)=>`u32(${t}>=${r})`,vector:(t,r)=>`vec4<u32>(${t}>=${r})`},void 0,void 0,9)},rc=e=>{Le(e,"LessOrEqual",{scalar:(t,r)=>`u32(${t}<=${r})`,vector:(t,r)=>`vec4<u32>(${t}<=${r})`},void 0,void 0,9)}}),Wo,Lo,Vo,jo,ic,ac,Lm=W(()=>{"use strict";ee(),ae(),we(),se(),Wo=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let r=0,i=e[r],a=i.dataType,n=i.dims.length;e.forEach((s,u)=>{if(u!==r){if(s.dataType!==a)throw new Error("input tensors should be one type");if(s.dims.length!==n)throw new Error("input tensors should have the same shape");s.dims.forEach((l,d)=>{if(d!==t&&l!==i.dims[d])throw new Error("non concat dimensions must match")})}})},Lo=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,Vo=(e,t)=>{let r=e.length,i=[];for(let a=0;a<r;++a){let n=t.setByOffset("global_idx",e[a].getByIndices("indices"));r===1?i.push(n):a===0?i.push(`if (inputIndex == ${a}u) { ${n} }`):a===r-1?i.push(`else { ${n} }`):i.push(`else if (inputIndex == ${a}) { ${n} }`)}return i.join(`
`)},jo=(e,t,r,i)=>{let a=C.size(r),n=new Array(e.length),s=new Array(e.length),u=0,l=[],d=[],c=[{type:12,data:a}];for(let $=0;$<e.length;++$)u+=e[$].dims[t],n[$]=u,d.push(e[$].dims.length),s[$]=B(`input${$}`,i,d[$]),l.push("rank"),c.push({type:12,data:n[$]});for(let $=0;$<e.length;++$)c.push(...X(e[$].dims));c.push(...X(r));let f=H("output",i,r.length),h=f.indicesGet("indices",t),_=Array.from(Array(n.length).keys()).map($=>`uniforms.sizeInConcatAxis${$}`).join(","),g=$=>`

  ${(()=>{$.registerUniform("outputSize","u32");for(let x=0;x<e.length;x++)$.registerUniform(`sizeInConcatAxis${x}`,"u32");return $.declareVariables(...s,f)})()}

  ${Lo(n.length,_)}

  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${f.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${h});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${n.length}u>(${_});
      ${h} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${Vo(s,f)}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:r,dataType:i}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:c}),getShaderSource:g}},ic=(e,t)=>{let r=e.inputs,i=r[0].dims,a=C.normalizeAxis(t.axis,i.length);Wo(r,a);let n=i.slice();n[a]=r.reduce((u,l)=>u+(l.dims.length>a?l.dims[a]:0),0);let s=r.filter(u=>C.size(u.dims)>0);e.compute(jo(s,a,n,r[0].dataType),{inputs:s})},ac=e=>pe({axis:e.axis})}),St,kt,It,Ha,Et=W(()=>{"use strict";ee(),ae(),St=(e,t,r="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${r}(uniforms.clip_min)), ${t}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},kt=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},It=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},Ha=e=>{let t=e?.activation||"";if(t==="HardSigmoid"){let[r,i]=e?.activation_params||[.2,.5];return{activation:t,alpha:r,beta:i}}else if(t==="Clip"){let[r,i]=e?.activation_params||[Cd,Ad];return{activation:t,clipMax:i,clipMin:r}}else if(t==="LeakyRelu"){let[r]=e?.activation_params||[.01];return{activation:t,alpha:r}}return{activation:t}}}),Se,nc,Fa=W(()=>{"use strict";Se=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},nc=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),sc,Vm=W(()=>{"use strict";sc=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),nr,Ka,Xa=W(()=>{"use strict";ee(),ae(),se(),Et(),nr=(e,t,r,i,a)=>{let n=i-r;return`
      ${Array.from({length:r}).map((s,u)=>`
      if (${F(t.shape,u,t.rank)} != 1) {
        ${t.indicesSet(e,u,F(a,u+n,i))}
      } else {
        ${t.indicesSet(e,u,0)}
      }`).join("")}
`},Ka=(e,t,r,i,a=!1,n)=>{let s=e[0].dims,u=e[1].dims,l=s[s.length-2],d=u[u.length-1],c=s[s.length-1],f=ye(d),h=ye(c),_=ye(l),g=C.size(r)/f/_,$=e.length>2,x=i?i.slice(0,-2):r.slice(0,-2),y=[C.size(x),l,d],w=[{type:12,data:g},{type:12,data:l},{type:12,data:d},{type:12,data:c}];kt(t,w),w.push(...X(x,s,u)),$&&w.push(...X(e[2].dims)),w.push(...X(y));let k=S=>{let I=La("batch_dims",e[0].dataType,x.length),T=B("a",e[0].dataType,s.length,h),z=B("b",e[1].dataType,u.length,f),A=H("output",e[0].dataType,y.length,f),M=xe(A.type.tensor),q=St(t,A.type.value,M),G=[T,z],P="";if($){let te=a?f:1;G.push(B("bias",e[2].dataType,e[2].dims.length,te)),P=`${a?`value += bias[col / ${te}];`:`value += ${A.type.value}(bias[row + i]);`}`}let N=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];It(t,N);let Z=()=>{let te=`var a_data: ${T.type.value};`;for(let L=0;L<h;L++)te+=`
              let b_data${L} = b[(b_offset + (k + ${L}) * uniforms.N + col) / ${f}];`;for(let L=0;L<_;L++){te+=`a_data = a[(a_offset + (row + ${L}) * uniforms.K + k) / ${h}];`;for(let Q=0;Q<h;Q++)te+=`
            values[${L}] = fma(${z.type.value}(a_data${h===1?"":`[${Q}]`}), b_data${Q}, values[${L}]);
`}return te};return`
  ${S.registerUniforms(N).registerInternalVariables(I).declareVariables(...G,A)}
  ${S.mainStart()}
    ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${f})) * ${f};
    var index1 = global_idx / (uniforms.N / ${f});
    let stride1 = uniforms.M / ${_};
    let row = (index1 % stride1) * ${_};
    let batch = index1 / stride1;

    ${r.length===2?"":`let batch_indices = ${I.offsetToIndices("batch")};`}

    var a_indices: ${T.type.indices};
    ${nr("a_indices",T,T.rank-2,I.rank,"batch_indices")}
    ${T.indicesSet("a_indices",T.rank-2,0)}
    ${T.indicesSet("a_indices",T.rank-1,0)}
    let a_offset = ${T.indicesToOffset("a_indices")};

    var b_indices: ${z.type.indices};
    ${nr("b_indices",z,z.rank-2,I.rank,"batch_indices")}
    ${z.indicesSet("b_indices",z.rank-2,0)}
    ${z.indicesSet("b_indices",z.rank-1,0)}
    let b_offset = ${z.indicesToOffset("b_indices")};
    var values: array<${A.type.value}, ${_}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${h}) {
      ${Z()}
    }
    for (var i = 0u; i < ${_}u; i++) {
      var value = values[i];
      ${P}
      ${q}
      let cur_indices = ${A.type.indices}(batch, row + i, col);
      let offset = ${A.indicesToOffset("cur_indices")};
      ${A.setByOffset(`offset / ${f}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${f};${h};${_};${a}`,inputDependencies:$?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:n?n(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:w}),getShaderSource:k}}}),Go,Ho,va,Di,Fo,xa,Ko,Vr,Za=W(()=>{"use strict";ee(),ae(),se(),Et(),Xa(),Fa(),Go=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,Ho=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t===3?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,va=(e,t,r="f32",i,a=!1,n=32,s=!1,u=32)=>{let l=t[1]*e[1],d=t[0]*e[0],c=a?l:n,f=a?n:l,h=c/t[0],_=n/t[1];if(!((a&&h===4&&e[1]===4||!a&&(h===3||h===4))&&c%t[0]===0&&n%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${a} is true, innerElementSize ${h} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${h} must be 3 or 4.
  tileAWidth ${c} must be divisible by workgroupSize[0]${t[0]}. tileInner ${n} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${h}<${r}>, ${c/h}>, ${f}>;
var<workgroup> mm_Bsub: array<array<vec4<${r}>, ${d/e[0]}>, ${n}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${h};
const tileInner = ${n};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${s?"0":"i32(globalId.z)"};
  ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${l};

  let num_tiles = ${s?`${Math.ceil(u/n)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${s?`i32(globalId.z) * ${u}`:"0"};

  var acc: array<vec4<${r}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${_};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${Go(a,i)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${_}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${i?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${h===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${Ho(a,h)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},Di=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,Fo=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",xa=(e,t,r="f32",i,a=!1,n=32,s=!1,u=32,l=!1)=>{let d=e[1]*t[1],c=e[0]*t[0],f=a?d:n,h=a?n:d;if(!(h%t[1]===0&&f%t[0]===0&&n%t[1]===0))throw new Error(`tileAHight ${h} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${f} must be divisible by workgroupSize[0]${t[0]}, tileInner ${n} must be divisible by workgroupSize[1]${t[1]}`);let _=h/t[1],g=f/t[0],$=n/t[1],x=l?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${d};
    let globalColStart = i32(workgroupId.x) * ${c};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${h}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${f}; inputCol = inputCol + ${t[0]}) {
          ${Di(a,i)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${n}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${c}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${i?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${r}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${a?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${d};

let tileRowA = i32(localId.y) * ${_};
let tileColA = i32(localId.x) * ${g};
let tileRowB = i32(localId.y) * ${$};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${_}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${g}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${Di(a,i)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${$}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${i?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${r}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${Fo(a)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${r}, ${f}>, ${h}>;
  var<workgroup> mm_Bsub : array<array<${r}, ${c}>, ${n}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${n};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${s?"0":"i32(globalId.z)"};
    ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${s?`${Math.ceil(u/n)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${s?`i32(globalId.z) * ${u}`:"0"};

    var acc : array<array<${r}, colPerThread>, rowPerThread>;
    ${x}
  }
`},Ko=(e,t,r,i,a=!1)=>{let[n,s,u,l]=i,d=xe(i[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${n.type.indices}) -> ${Se(e,d)} {
      var value = ${Se(e,d)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${s.type.indices};
        ${nr("aIndices",s,s.rank-2,n.rank,"batchIndices")}
        ${s.indicesSet("aIndices",s.rank-2,"u32(row)")}
        ${s.indicesSet("aIndices",s.rank-1,"u32(colIn)")}
        value = ${s.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${n.type.indices}) -> ${Se(e,d)} {
      var value = ${Se(e,d)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${u.type.indices};
        ${nr("bIndices",u,u.rank-2,n.rank,"batchIndices")}
        ${u.indicesSet("bIndices",u.rank-2,"u32(row)")}
        ${u.indicesSet("bIndices",u.rank-1,"u32(colIn)")}
        value = ${u.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${Se(e,d)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${a?"bias[colIn]":`${Se(e,d)}(bias[row])`};`:""}
        ${r}
        ${l.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},Vr=(e,t,r,i,a=!1,n)=>{let s=e[0].dims,u=e[1].dims,l=s.slice(0,-2),d=u.slice(0,-2),c=i?i.slice(0,-2):r.slice(0,-2),f=C.size(c),h=s[s.length-2],_=s[s.length-1],g=u[u.length-1],$=_%4===0&&g%4===0,x=h<=8?[4,1,1]:[4,4,1],y=[8,8,1],w=[Math.ceil(g/y[0]/x[0]),Math.ceil(h/y[1]/x[1]),Math.ceil(f/y[2]/x[2])],k=$?4:1,S=[...l,h,_/k],I=S.length,T=[...d,_,g/k],z=T.length,A=[f,h,g/k],M=[{type:6,data:h},{type:6,data:g},{type:6,data:_}];kt(t,M),M.push(...X(c,S,T));let q=["rank","rank"],G=e.length>2;G&&(M.push(...X(e[2].dims)),q.push("rank")),M.push(...X(A));let P=N=>{let Z=c.length,te=La("batchDims",e[0].dataType,Z,1),L=xe(e[0].dataType),Q=B("a",e[0].dataType,I,k),ie=B("b",e[1].dataType,z,k),J=H("result",e[0].dataType,A.length,k),he=[Q,ie];if(G){let ne=a?k:1;he.push(B("bias",e[2].dataType,e[2].dims.length,ne))}let D=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];It(t,D);let j=xe(J.type.tensor),re=St(t,J.type.value,j),O=Ko(k,G,re,[te,Q,ie,J],a);return`
  ${N.registerUniforms(D).registerInternalVariables(te).declareVariables(...he,J)}
  ${O}
  ${$?va(x,y,L,te):xa(x,y,L,te)}
                   `};return{name:"MatMul",shaderCache:{hint:`${x};${t.activation};${$};${a}`,inputDependencies:q},getRunData:()=>({outputs:[{dims:n?n(r):r,dataType:e[0].dataType}],dispatchGroup:{x:w[0],y:w[1],z:w[2]},programUniforms:M}),getShaderSource:P}}}),Xo,oc,jm=W(()=>{"use strict";ee(),rt(),se(),Et(),Fa(),Vm(),Za(),Xo=(e,t,r,i,a=!1,n,s=4,u=4,l=4,d="f32")=>{let c=M=>{switch(M){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${d}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${M} is not supported.`)}},f=M=>{switch(M){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${M} is not supported.`)}},h=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,_=e?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,g=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",$=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",x=e?"row":"col",y=e?"col":"row",w=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${x} / outWidth;
    let outCol = ${x} % outWidth;

    let WRow = ${y} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${y} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${y} % inChannels;
    var resData = ${Se(s,d)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${g} && xCol >= 0 && xCol < ${$}) {
      ${h}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${c(s)}
    }
    return resData;`,k=e?t&&i?`
    let col = colIn * ${s};
    ${w}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${w}
    }
    return ${Se(s,d)}(0.0);`:i&&r?`
    let col = colIn * ${s};
    ${w}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${w}
    }
    return ${Se(s,d)}(0.0);`,S=e?i&&r?f(u):`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${f(u)}
    }
    return ${Se(u,d)}(0.0);`:`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${f(u)}
    }
    return ${Se(u,d)}(0.0);`,I=Se(l,d),T=Se(e?s:u,d),z=Se(e?u:s,d),A=St(n,I,d);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${T} {
      ${e?k:S}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${z} {
      ${e?S:k}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${I}) {
      let col = colIn * ${l};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${_}
      ${nc(a)}
      ${A}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},oc=(e,t,r,i,a,n,s,u,l)=>{let d=t.format==="NHWC",c=d?e[0].dims[3]:e[0].dims[1],f=r[0],h=d?r[2]:r[3],_=d?r[1]:r[2],g=d?r[3]:r[1],$=d&&(c%4===0||c%3===0)&&g%4===0,x=d?g:h*_,y=d?h*_:g,w=[8,8,1],k=i<=8?[4,1,1]:[4,4,1],S=[Math.ceil(x/w[0]/k[0]),Math.ceil(y/w[1]/k[1]),Math.ceil(f/w[2]/k[2])];ue("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${S}`);let I=$?d&&c%4!==0?3:4:1,T=w[1]*k[1],z=w[0]*k[0],A=Math.max(w[0]*I,w[1]),M=i%T===0,q=a%z===0,G=n%A===0,P=$?[I,4,4]:[1,1,1],N=[{type:6,data:i},{type:6,data:a},{type:6,data:n},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];kt(t,N),N.push(...X(e[0].dims,e[1].dims));let Z=["rank","rank"];s&&(N.push(...X(e[2].dims)),Z.push("rank")),N.push(...X(r));let te=L=>{let Q=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];It(t,Q);let ie=$?4:1,J=xe(e[0].dataType),he=`
      fn setOutputAtIndex(flatIndex : i32, value : ${$?`vec4<${J}>`:J}) {
        result[flatIndex] = ${$?`vec4<${J}>`:J}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${$?`vec4<${J}>`:J}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${$?"/ 4":""}, value);
      }`,D=B("x",e[0].dataType,e[0].dims.length,I===3?1:I),j=B("w",e[1].dataType,e[1].dims.length,ie),re=[D,j],O=H("result",e[0].dataType,r.length,ie);if(s){let ne=B("bias",e[2].dataType,e[2].dims.length,ie);re.push(ne),he+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${$?`vec4<${J}>`:J} {
          return bias[coords.${d?"w":"y"}${$?"/ 4":""}];
        }`}return`
        ${sc("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${L.registerUniforms(Q).declareVariables(...re,O)}
        ${he}
        ${Xo(d,M,q,G,s,t,P[0],P[1],P[2],J)}
        ${$?va(k,w,J,void 0,!d,A):xa(k,w,J,void 0,!d,A,!1,void 0,u)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${I};${$};${M};${q};${G};${T};${z};${A}`,inputDependencies:Z},getRunData:()=>({outputs:[{dims:l?l(r):r,dataType:e[0].dataType}],dispatchGroup:{x:S[0],y:S[1],z:S[2]},programUniforms:N}),getShaderSource:te}}}),Zo,Pi,Xt,Qo,Ui,Yo,uc,lc,Gm=W(()=>{"use strict";ee(),rt(),ae(),se(),Et(),Fa(),Zo=e=>{let t=1;for(let r=0;r<e.length;r++)t*=e[r];return t},Pi=e=>typeof e=="number"?[e,e,e]:e,Xt=(e,t)=>t<=1?e:e+(e-1)*(t-1),Qo=(e,t,r,i=1)=>{let a=Xt(t,i);return Math.floor((e[0]*(r-1)-r+a)/2)},Ui=(e,t,r,i,a)=>{a==null&&(a=Qo(e,t[0],i[0]));let n=[0,0,0,r];for(let s=0;s<3;s++)e[s]+2*a>=t[s]&&(n[s]=Math.trunc((e[s]-t[s]+2*a)/i[s]+1));return n},Yo=(e,t,r,i,a,n,s,u,l,d)=>{let c,f,h,_;if(e==="VALID"&&(e=0),typeof e=="number"){c={top:e,bottom:e,left:e,right:e,front:e,back:e};let g=Ui([t,r,i,1],[u,l,d],1,[a,n,s],e);f=g[0],h=g[1],_=g[2]}else if(Array.isArray(e)){if(!e.every(($,x,y)=>$===y[0]))throw Error(`Unsupported padding parameter: ${e}`);c={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let g=Ui([t,r,i,1],[u,l,d],1,[a,n,s],e[0]);f=g[0],h=g[1],_=g[2]}else if(e==="SAME_UPPER"){f=Math.ceil(t/a),h=Math.ceil(r/n),_=Math.ceil(i/s);let g=(f-1)*a+u-t,$=(h-1)*n+l-r,x=(_-1)*s+d-i,y=Math.floor(g/2),w=g-y,k=Math.floor($/2),S=$-k,I=Math.floor(x/2),T=x-I;c={top:k,bottom:S,left:I,right:T,front:y,back:w}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:c,outDepth:f,outHeight:h,outWidth:_}},uc=(e,t,r,i,a,n=!1,s="channelsLast")=>{let u,l,d,c,f;if(s==="channelsLast")[u,l,d,c,f]=e;else if(s==="channelsFirst")[u,f,l,d,c]=e;else throw new Error(`Unknown dataFormat ${s}`);let[h,,_,g,$]=t,[x,y,w]=Pi(r),[k,S,I]=Pi(i),T=Xt(_,k),z=Xt(g,S),A=Xt($,I),{padInfo:M,outDepth:q,outHeight:G,outWidth:P}=Yo(a,l,d,c,x,y,w,T,z,A),N=n?h*f:h,Z=[0,0,0,0,0];return s==="channelsFirst"?Z=[u,N,q,G,P]:s==="channelsLast"&&(Z=[u,q,G,P,N]),{batchSize:u,dataFormat:s,inDepth:l,inHeight:d,inWidth:c,inChannels:f,outDepth:q,outHeight:G,outWidth:P,outChannels:N,padInfo:M,strideDepth:x,strideHeight:y,strideWidth:w,filterDepth:_,filterHeight:g,filterWidth:$,effectiveFilterDepth:T,effectiveFilterHeight:z,effectiveFilterWidth:A,dilationDepth:k,dilationHeight:S,dilationWidth:I,inShape:e,outShape:Z,filterShape:t}},lc=(e,t,r,i,a,n)=>{let s=n==="channelsLast",u=s?e[0].dims[3]:e[0].dims[1],l=!1,d=[64,1,1],c={x:r.map((w,k)=>k)},f=[Math.ceil(Zo(c.x.map(w=>r[w]))/d[0]),1,1];ue("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${f}`);let h=l?s&&u%4!==0?3:4:1,_=C.size(r),g=[{type:12,data:_},{type:12,data:i},{type:12,data:a},{type:12,data:t.strides},{type:12,data:t.dilations}];kt(t,g),g.push(...X(e[0].dims,e[1].dims));let $=["rank","rank"],x=e.length===3;x&&(g.push(...X(e[2].dims)),$.push("rank")),g.push(...X(r));let y=w=>{let k=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:i.length},{name:"pads",type:"u32",length:a.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];It(t,k);let S=l?4:1,I=xe(e[0].dataType),T=B("x",e[0].dataType,e[0].dims.length,h===3?1:h),z=B("W",e[1].dataType,e[1].dims.length,S),A=[T,z],M=H("result",e[0].dataType,r.length,S),q="";if(x){let N=B("bias",e[2].dataType,e[2].dims.length,S);A.push(N),q+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${l?`vec4<${I}>`:I} {
          return bias[${s?F("coords",4,5):F("coords",1,5)}${l?"/ 4":""}];
        }`}let G=Se(h,I),P=St(t,G,I);return`
            ${q}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${T.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${z.getByIndices("aIndices")};
            }
          ${w.registerUniforms(k).declareVariables(...A,M)}
          ${w.mainStart()}
          ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${M.offsetToIndices("global_idx")};
              let batch = ${F("coords",0,T.rank)};
              let d2 = ${s?F("coords",T.rank-1,T.rank):F("coords",1,T.rank)};
              let xFRCCorner = vec3<u32>(${s?F("coords",1,T.rank):F("coords",2,T.rank)},
              ${s?F("coords",2,T.rank):F("coords",3,T.rank)},
              ${s?F("coords",3,T.rank):F("coords",4,T.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${s?F("uniforms.x_shape",1,T.rank):F("uniforms.x_shape",2,T.rank)};
              let xShapeZ = ${s?F("uniforms.x_shape",2,T.rank):F("uniforms.x_shape",3,T.rank)};
              let xShapeW = ${s?F("uniforms.x_shape",3,T.rank):F("uniforms.x_shape",4,T.rank)};
              let xShapeU = ${s?F("uniforms.x_shape",4,T.rank):F("uniforms.x_shape",1,T.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = 0.0;
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${s?`let xValues = vec4<f32>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<f32>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<f32>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${s?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${s?`let xValues = vec2<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${s?`let xValues = vec3<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${x?"value = value + getBiasByOutputCoords(coords)":""};
              ${P}
              result[global_idx] = f32(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${s};${h};${x}`,inputDependencies:$},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:f[0],y:f[1],z:f[2]},programUniforms:g}),getShaderSource:y}}}),dc,pc,Hm=W(()=>{"use strict";ee(),ae(),se(),Et(),dc=(e,t,r,i)=>{let a=e.length>2,n=a?"value += b[output_channel];":"",s=e[0].dims,u=e[1].dims,l=t.format==="NHWC",d=l?r[3]:r[1],c=d/t.group,f=l&&c>=4?ye(d):1,h=C.size(r)/f,_=[{type:12,data:h},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:c}];kt(t,_),_.push(...X(s,[u[0],u[1],u[2],u[3]/f]));let g=a?["rank","rank","rank"]:["rank","rank"];_.push(...X([r[0],r[1],r[2],r[3]/f]));let $=x=>{let y=H("output",e[0].dataType,r.length,f),w=xe(y.type.tensor),k=St(t,y.type.value,w),S=B("x",e[0].dataType,s.length),I=B("w",e[1].dataType,u.length,f),T=[S,I];a&&T.push(B("b",e[2].dataType,e[2].dims,f));let z=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];It(t,z);let A=l?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${S.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${I.get("wHeight","wWidth","wInChannel","output_channel")};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${S.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${I.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${x.registerUniforms(z).declareVariables(...T,y)}

  ${x.mainStart()}
    ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${y.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${l?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${l?1:2}], outputIndices[${l?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${f} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${l?2:1}];

    var value: ${y.type.value} = ${y.type.value}(0);
    ${A}
    ${n}
    ${k}
    ${y.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${f}`,inputDependencies:g},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:_}),getShaderSource:$}},pc=(e,t,r,i)=>{let a=e.length>2,n=ye(r[3]),s=ye(r[2]),u=C.size(r)/n/s,l=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/n],d=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/n],c=[r[0],r[1],r[2],r[3]/n],f=[{type:12,data:u},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];kt(t,f),f.push(...X(l,d,c));let h=(s-1)*t.strides[1]+d[1],_=g=>{let $=H("output",e[0].dataType,c.length,n),x=xe($.type.tensor),y=St(t,$.type.value,x),w=B("x",e[0].dataType,l.length,n),k=B("w",e[1].dataType,d.length,n),S=[w,k];a&&S.push(B("b",e[2].dataType,e[2].dims,n));let I=a?"value += b[output_channel];":"",T=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return It(t,T),`
  ${g.registerUniforms(T).declareVariables(...S,$)}
  ${g.mainStart()}
    ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${s}u;
    let col = (index1 % width1) * ${s}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${w.type.value}, ${h}>;
    var values: array<${$.type.value}, ${s}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${d[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${h}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${w.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${w.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${d[1]}; w_width++) {
          let w_val = ${k.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${s}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${s}u; i++) {
      var value = values[i];
      ${I}
      ${y}
      ${$.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${n};${s};${h};${d[0]};${d[1]}`,inputDependencies:a?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:f}),getShaderSource:_}}}),Jo,Cr,eu,Ar,Sa,qi,tu,ru,ka,Fm=W(()=>{"use strict";ae(),jm(),Gm(),Za(),Hm(),Et(),Xa(),ht(),Jo=(e,t,r,i,a,n)=>{let s=e[0],u=e.slice(n?1:2,n?3:4),l=u.length,d=t[0],c=t.slice(2).map((h,_)=>h+(h-1)*(r[_]-1)),f=u.map((h,_)=>h+i[_]+i[_+l]).map((h,_)=>Math.floor((h-c[_]+a[_])/a[_]));return f.splice(0,0,s),f.splice(n?3:1,0,d),f},Cr=[2,3,1,0],eu=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[1]*t.group;if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let a=e[0].dims.length-2;if(t.dilations.length!==a)throw new Error(`dilations should be ${a}D`);if(t.strides.length!==a)throw new Error(`strides should be ${a}D`);if(t.pads.length!==a*2)throw new Error(`pads should be ${a*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},Ar=(e,t)=>{let r=e.kernelShape.slice();r.length<t[1].dims.length-2&&r.push(...Array(t[1].dims.length-2-r.length).fill(0));for(let n=2;n<t[1].dims.length;++n)r[n-2]===0&&(r[n-2]=t[1].dims[n]);let i=e.pads.slice();Wr.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,r,i,e.format==="NHWC",e.autoPad);let a=Object.assign({},e);return Object.assign(a,{kernelShape:r,pads:i}),a},Sa=e=>{let t=Ha(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],a=e.dilations,n=e.group,s=e.kernel_shape,u=e.pads,l=e.strides,d=e.w_is_const();return{autoPad:i,format:r,dilations:a,group:n,kernelShape:s,pads:u,strides:l,wIsConst:d,...t,cacheKey:`${e.format};${t.activation};`}},qi=(e,t,r,i)=>{let a=r.format==="NHWC",n=Jo(t[0].dims,t[1].dims,r.dilations,r.pads,r.strides,a);if(r.group!==1){let T=[t[0]];if(a){let z=e.kernelCustomData.wT??e.compute(Re(t[1],Cr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=z),T.push(z)}else T.push(t[1]);t.length===3&&T.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&a&&t[1].dims[0]===r.group&&t[1].dims[1]===1&&r.dilations[0]===1&&r.dilations[1]===1?e.compute(pc(T,r,n,i),{inputs:T}):e.compute(dc(T,r,n,i),{inputs:T});return}let s=t.length===3,u=t[0].dims[a?1:2],l=t[0].dims[a?2:3],d=t[0].dims[a?3:1],c=t[1].dims[2],f=t[1].dims[3],h=n[a?1:2],_=n[a?2:3],g=n[a?3:1],$=a&&c===u&&f===l&&r.pads[0]===0&&r.pads[1]===0;if($||c===1&&f===1&&r.dilations[0]===1&&r.dilations[1]===1&&r.strides[0]===1&&r.strides[1]===1&&r.pads[0]===0&&r.pads[1]===0){let T=n[0],z,A,M,q=[];if(a){let N=e.kernelCustomData.wT??e.compute(Re(t[1],Cr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=N),$){let Z=u*l*d;z=t[0].reshape([1,T,Z]),A=N.reshape([1,Z,g]),M=[1,T,g]}else z=t[0].reshape([T,u*l,d]),A=N.reshape([1,d,g]),M=[T,h*_,g];q.push(z),q.push(A)}else z=t[0].reshape([T,d,u*l]),A=t[1].reshape([1,g,d]),M=[T,g,h*_],q.push(A),q.push(z);s&&q.push(t[2]);let G=M[2],P=q[0].dims[q[0].dims.length-1];G<8&&P<8?e.compute(Ka(q,r,n,M,a,i),{inputs:q}):e.compute(Vr(q,r,n,M,a,i),{inputs:q});return}let x=!0,y=e.kernelCustomData.wT??e.compute(Re(t[1],Cr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=y);let w=[t[0],y];s&&w.push(t[2]);let k=a?h*_:g,S=a?g:h*_,I=c*f*d;e.compute(oc(w,r,n,k,S,I,s,x,i),{inputs:w})},tu=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let a=[0,t.pads[0],0,t.pads[1]],n=[1].concat(t.strides),s=[1].concat(t.dilations),u=[1].concat(t.kernelShape),l=Ar({...t,pads:a,strides:n,dilations:s,kernelShape:u},i);qi(e,i,l,d=>r?[d[0],d[2],d[3]]:[d[0],d[1],d[3]])},ru=(e,t,r)=>{let i=r.format==="NHWC"?"channelsLast":"channelsFirst",a=Ar(r,t),n=r.autoPad==="NOTSET"?r.pads:r.autoPad,s=uc(t[0].dims,t[1].dims,r.strides,r.dilations,n,!1,i);e.compute(lc(t,a,s.outShape,[s.filterDepth,s.filterHeight,s.filterWidth],[s.padInfo.front,s.padInfo.top,s.padInfo.left],i))},ka=(e,t)=>{if(eu(e.inputs,t),e.inputs[0].dims.length===3)tu(e,t);else if(e.inputs[0].dims.length===5)ru(e,e.inputs,t);else{let r=Ar(t,e.inputs);qi(e,e.inputs,r)}}}),cc,Km=W(()=>{"use strict";ee(),rt(),ae(),se(),cc=(e,t,r)=>{let i=e.length>2,a=t.outputShape,n=t.format==="NHWC",s=t.group,u=e[1].dims,l=u[2]/s,d=u[3],c=n?ye(l):1,f=n&&d===1&&l>=4,h=f?Math.floor(l/4)*4:Math.floor(l/c)*c,_=l-h,g=n?ye(d):1,$=n?d===1?c:g:1,x=C.size(a)/g,y=[Math.ceil(x/64),1,1];ue("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${y}`);let w=["rank","rank"],k=[t.strides[0],t.strides[1]],S=[t.kernelShape[n?1:2],t.kernelShape[n?2:3]],I=[t.dilations[0],t.dilations[1]],T=[S[0]+(t.dilations[0]<=1?0:(t.kernelShape[n?1:2]-1)*(t.dilations[0]-1)),S[1]+(t.dilations[1]<=1?0:(t.kernelShape[n?2:3]-1)*(t.dilations[1]-1))],z=[T[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),T[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],A=[{type:12,data:x},{type:12,data:k},{type:12,data:S},{type:12,data:I},{type:12,data:T},{type:6,data:z},{type:12,data:h},{type:12,data:l},{type:12,data:d},...X(e[0].dims,e[1].dims)];i&&(A.push(...X(e[2].dims)),w.push("rank")),A.push(...X(a));let M=q=>{let G=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:k.length},{name:"filter_dims",type:"u32",length:S.length},{name:"dilations",type:"u32",length:S.length},{name:"effective_filter_dims",type:"u32",length:T.length},{name:"pads",type:"i32",length:z.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],P=xe(e[0].dataType),N=n?1:2,Z=n?2:3,te=n?3:1,L=B("W",e[1].dataType,e[1].dims.length,$),Q=B("Dy",e[0].dataType,e[0].dims.length,c),ie=[Q,L];i&&ie.push(B("bias",e[2].dataType,[a[te]].length,g));let J=H("result",e[0].dataType,a.length,g),he=()=>{let re="";if(f)c===4?re+=`
        let xValue = ${Q.getByOffset("x_offset")};
        let wValue = ${L.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:c===2?re+=`
          dotProd = dotProd + dot(vec4<${P}>(${Q.getByOffset("x_offset")}, ${Q.getByOffset("x_offset + 1u")}), vec4<${P}>(${L.getByOffset("w_offset")}, ${L.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:c===1&&(re+=`
          dotProd = dotProd + dot(vec4<${P}>(${Q.getByOffset("x_offset")}, ${Q.getByOffset("x_offset + 1u")}, ${Q.getByOffset("x_offset + 2u")}, ${Q.getByOffset("x_offset + 3u")}), vec4<${P}>(${L.getByOffset("w_offset")}, ${L.getByOffset("w_offset + 1u")}, ${L.getByOffset("w_offset + 2u")}, ${L.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(re+=`
                  let xValue = ${n?Q.getByOffset(`${Q.indicesToOffset(`${Q.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${c}`):Q.get("batch","inputChannel","idyR","idyC")};
        `,c===1)re+=`
          let w_offset = ${L.indicesToOffset(`${L.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${L.getByOffset(`w_offset / ${$}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let O=0;O<c;O++)re+=`
            let wValue${O} = ${L.getByOffset(`${L.indicesToOffset(`${L.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${O}, wOutChannel)`)} / ${$}`)};
            dotProd = dotProd + xValue[${O}] * wValue${O};`;return re},D=()=>{if(_===0)return"";if(!f)throw new Error(`packInputAs4 ${f} is not true.`);let re="";if(c===1){re+="dotProd = dotProd";for(let O=0;O<_;O++)re+=`
            + ${Q.getByOffset(`x_offset + ${O}`)} * ${L.getByOffset(`w_offset + ${O}`)}`;re+=";"}else if(c===2){if(_!==2)throw new Error(`Invalid inputChannelsRemainder ${_}.`);re+=`
          let xValue = ${Q.getByOffset("x_offset")};
          let wValue = ${L.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return re},j=`
            let outputIndices = ${J.offsetToIndices(`global_idx * ${g}`)};
            let batch = ${J.indicesGet("outputIndices",0)};
            let d1 = ${J.indicesGet("outputIndices",te)};
            let r = ${J.indicesGet("outputIndices",N)};
            let c = ${J.indicesGet("outputIndices",Z)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${J.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${P}(dyRCorner) + ${P}(wR)) / ${P}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${P}(uniforms.Dy_shape[${N}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }
              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${P}(dyCCorner) + ${P}(wC)) / ${P}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${P}(uniforms.Dy_shape[${Z}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${f?`
                var x_offset = ${Q.indicesToOffset(`${Q.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${c};
                var w_offset = ${L.indicesToOffset(`${L.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${$};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${f?4:c}) {
                  ${he()}
                  inputChannel = inputChannel + ${f?4:c};
                }
                ${D()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${i?` + bias[d1 / ${g}]`:""};
            ${J.setByOffset("global_idx","value")};
          `;return`
    ${q.registerUniforms(G).declareVariables(...ie,J)}
      ${q.mainStart()}
      ${q.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${j}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${c}${$}${g}${f}${_}`,inputDependencies:w},getRunData:()=>({dispatchGroup:{x:y[0],y:y[1],z:y[2]},outputs:[{dims:r?r(a):a,dataType:e[0].dataType}],programUniforms:A}),getShaderSource:M}}}),iu,au,nu,Wi,fc,su,Li,ou,hc,Xm=W(()=>{"use strict";Km(),Et(),ht(),iu=(e,t,r,i,a,n)=>(e-1)*t+r+(i-1)*a+1-n,au=(e,t,r,i,a)=>{let n=Math.floor(e/2);t==="SAME_UPPER"?(r[i]=n,r[a]=e-n):t==="SAME_LOWER"&&(r[i]=e-n,r[a]=n)},nu=(e,t,r,i,a,n,s,u,l,d)=>{let c=e.length-2,f=d.length===0;l.length<c&&l.push(...Array(c-l.length).fill(0));let h=e[0],_=t[u?3:1]*a;for(let g=0,$=e.length-c-(u?1:0);g<c;++g,++$){let x=e[$],y=f?x*s[g]:d[g],w=iu(x,s[g],n[g],t[$],r[g],y);au(w,i,n,g,g+c),f&&d.push(s[g]*(x-1)+l[g]+(t[$]-1)*r[g]+1-n[g]-n[g+c])}d.splice(0,0,h),d.splice(u?3:1,0,_)},Wi=(e,t)=>{let r=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((f,h)=>f*h,1)===0){r.length=0;for(let f=2;f<t[1].dims.length;++f)r.push(t[1].dims[f])}let i=e.format==="NHWC";r.splice(0,0,t[1].dims[0]),r.splice(i?3:1,0,t[1].dims[1]);let a=e.pads.slice(),n=e.outputShape.slice(),s=e.outputPadding.slice(),u=t[0].dims,l=e.dilations.slice();if(l.reduce((f,h)=>f+h,0)===0){let f=t[0].dims.length-2;l=new Array(f).fill(1)}let d=e.strides.slice();if(d.reduce((f,h)=>f+h,0)===0){let f=t[0].dims.length-2;d=new Array(f).fill(1)}nu(u,r,l,e.autoPad,e.group,a,d,i,s,n);let c=Object.assign({},e);return Object.assign(c,{kernelShape:r,pads:a,outputPadding:s,outputShape:n,dilations:l,strides:d}),c},fc=e=>{let t=Ha(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],a=e.dilations,n=e.group,s=e.kernelShape,u=e.pads,l=e.strides,d=e.wIsConst(),c=e.outputPadding,f=e.outputShape;return{autoPad:i,format:r,dilations:a,group:n,kernelShape:s,outputPadding:c,outputShape:f,pads:u,strides:l,wIsConst:d,...t,cacheKey:`${e.format};${t.activation};`}},su=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[0];if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let a=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==a))throw new Error("invalid bias");let n=e[0].dims.length-2;if(t.dilations.reduce((s,u)=>s+u,0)>0&&t.dilations.length!==n)throw new Error(`dilations should be ${n}D`);if(t.strides.reduce((s,u)=>s+u,0)>0&&t.strides.length!==n)throw new Error(`strides should be ${n}D`);if(t.pads.reduce((s,u)=>s+u,0)>0&&t.pads.length!==n*2)throw new Error(`pads should be ${n*2}D`);if(t.outputPadding.length!==n&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${n}D`);if(t.kernelShape.reduce((s,u)=>s+u,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},Li=(e,t,r,i)=>{let a=e.kernelCustomData.wT??e.compute(Re(t[1],[2,3,0,1]),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=a);let n=[t[0],a];t.length===3&&n.push(t[2]),e.compute(cc(n,r,i),{inputs:n})},ou=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let a=t.kernelShape;(a.length===0||a[0]===0)&&(a=[e.inputs[1].dims[2]]);let n=t.dilations;(n.length===0||n[0]===0)&&(n=[1]);let s=t.strides;(s.length===0||s[0]===0)&&(s=[1]);let u=t.pads;u.length===0&&(u=[0,0]),u=[0,u[0],0,u[1]],s=[1].concat(s),n=[1].concat(n),a=[1].concat(a);let l=t.outputPadding;l=[0].concat(l);let d=Wi({...t,pads:u,strides:s,dilations:n,kernelShape:a,outputPadding:l},i);Li(e,i,d,c=>r?[c[0],c[2],c[3]]:[c[0],c[1],c[3]])},hc=(e,t)=>{if(su(e.inputs,t),e.inputs[0].dims.length===3)ou(e,t);else{let r=Wi(t,e.inputs);Li(e,e.inputs,r)}}}),uu,mc,gc,Zm=W(()=>{"use strict";ee(),ae(),we(),se(),uu=(e,t,r,i)=>{let a=C.size(t),n=t.length,s=B("input",e,n),u=H("output",e,n),l=r.dataType===6?r.getInt32Array()[0]:Number(r.getBigInt64Array()[0]),d=C.normalizeAxis(l,n),c=f=>{let h=` i32(${s.indicesGet("inputIndices","uniforms.axis")}) `,_=F("uniforms.input_shape","uniforms.axis",n),g=i.reverse?h+(i.exclusive?" + 1":""):"0",$=i.reverse?_:h+(i.exclusive?"":" + 1");return`
                ${f.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(s,u)}
                ${f.mainStart()}
                  ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${u.offsetToIndices("global_idx")};
                  var sum = ${u.type.value}(0);
                  let first : i32 = ${g};
                  let last : i32 = ${$};
                  for (var i : i32 = first; i < last; i++) {
                    ${s.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${s.getByIndices("inputIndices")};
                  }
                  ${u.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:i.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:[{type:12,data:a},{type:12,data:d},...X(t,t)]}),getShaderSource:c}},mc=(e,t)=>{let r=e.inputs[0].dims,i=e.inputs[0].dataType,a=e.inputs[1];e.compute(uu(i,r,a,t),{inputs:[0]})},gc=e=>{let t=e.exclusive===1,r=e.reverse===1;return pe({exclusive:t,reverse:r})}}),lu,du,pu,_c,yc,Qm=W(()=>{"use strict";ee(),ae(),we(),se(),lu=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},du=(e,t,r,i)=>{let a=[];a.push(`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let n=0;n<t;++n)a.push(r.indicesSet("a",e[n],`i[${n}]`));return a.push("return a;}"),a.join(`
`)},pu=(e,t)=>{let r,i,a,n,s,u,l=t.format==="NHWC",d=t.blocksize,c=t.mode==="DCR";l?([r,i,a,n]=e.dims,s=c?[r,i,a,d,d,n/d**2]:[r,i,a,n/d**2,d,d],u=c?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([r,i,a,n]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],s=c?[r,d,d,n/d**2,i,a]:[r,n/d**2,d,d,i,a],u=c?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let f=e.reshape(s),h=f.dims.length,_=e.dataType,g=B("a",_,h),$=H("output",_,h),x=y=>`
  ${y.registerUniform("output_size","u32").declareVariables(g,$)}

  ${du(u,h,g,$)}

  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${$.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${$.setByOffset("global_idx",g.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:y=>{let w=l?[r,i*d,a*d,n/d**2]:[r,n/d**2,i*d,a*d],k=C.size(w),S=f.dims,I=C.sortBasedOnPerm(S,u);return{outputs:[{dims:w,dataType:y[0].dataType}],dispatchGroup:{x:Math.ceil(k/64)},programUniforms:[{type:12,data:k},...X(S,I)]}},getShaderSource:x}},_c=(e,t)=>{lu(e.inputs),e.compute(pu(e.inputs[0],t))},yc=e=>pe({blocksize:e.blocksize,mode:e.mode,format:e.format})}),Or,Zt,Vi,cu,fu,hu,mu,ji,gu,bc,wc,Ym=W(()=>{"use strict";ee(),ae(),we(),se(),Or="[a-zA-Z]|\\.\\.\\.",Zt="("+Or+")+",Vi="^"+Zt+"$",cu="("+Zt+",)*"+Zt,fu="^"+cu+"$",hu=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let r=this.symbolToIndices.get(e);r===void 0?r=[t]:r.push(t),this.symbolToIndices.set(e,r)}},mu=class{constructor(e,t){this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[r,i]=t.includes("->")?t.split("->",2):[t,""];if(!r.match(RegExp(fu)))throw new Error("Invalid LHS term");if(r.split(",").forEach((a,n)=>{let s=e[n].dims.slice();if(!a.match(RegExp(Vi)))throw new Error("Invalid LHS term");let u=this.processTerm(a,!0,s,n);this.lhs.push(u)}),i==="")i+=[...this.symbolToInfo.entries()].filter(([a,n])=>n.count===1||a==="...").map(([a])=>a).join("");else if(!i.match(RegExp(Zt)))throw new Error("Invalid RHS");i.match(RegExp(Or,"g"))?.forEach(a=>{if(a==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let n=this.symbolToInfo.get(a);if(n===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(n.dimValue)}}),this.rhs=this.processTerm(i,!1,this.outputDims)}addSymbol(e,t,r){let i=this.symbolToInfo.get(e);if(i!==void 0){if(i.dimValue!==t&&i.count!==1)throw new Error("Dimension mismatch");i.count++,i.inputIndices.push(r)}else i={count:1,dimValue:t,inputIndices:[r]};this.symbolToInfo.set(e,i)}processTerm(e,t,r,i=-1){let a=r.length,n=!1,s=[],u=0;if(!e.match(RegExp(Vi))&&!t&&e!=="")throw new Error("Invalid LHS term");let l=e.match(RegExp(Or,"g")),d=new hu(i);return l?.forEach((c,f)=>{if(c==="..."){if(n)throw new Error("Only one ellipsis is allowed per input term");n=!0;let h=a-l.length+1;if(h<0)throw new Error("Ellipsis out of bounds");if(s=r.slice(u,u+h),this.hasEllipsis){if(this.ellipsisDims.length!==s.length||this.ellipsisDims.toString()!==s.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=s;else throw new Error("Ellipsis must be specified in the LHS");for(let _=0;_<s.length;_++){let g=String.fromCharCode(48+_);d.addSymbol(g,f+_),this.addSymbol(g,r[u++],i)}}else d.addSymbol(c,f+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(c,r[u++],i)}),d}},ji=e=>e+"_max",gu=(e,t,r,i)=>{let a=e.map(d=>d.length).map((d,c)=>B(`input${c}`,t,d)),n=C.size(i),s=H("output",t,i.length),u=[...r.symbolToInfo.keys()].filter(d=>!r.rhs.symbolToIndices.has(d)),l=d=>{let c=[],f="var prod = 1.0;",h="var sum = 0.0;",_="sum += prod;",g=[],$=[],x=[],y=[],w=r.symbolToInfo.size===r.rhs.symbolToIndices.size;r.symbolToInfo.forEach((S,I)=>{if(r.rhs.symbolToIndices.has(I)){let T=r.rhs.symbolToIndices.get(I)?.[0];T!==void 0&&r.lhs.forEach((z,A)=>{if(S.inputIndices.includes(A)){let M=z.symbolToIndices.get(I);if(M===void 0)throw new Error("Invalid symbol error");M.forEach(q=>{c.push(`${a[A].indicesSet(`input${A}Indices`,q,s.indicesGet("outputIndices",T))}`)})}})}else r.lhs.forEach((T,z)=>{if(S.inputIndices.includes(z)){let A=T.symbolToIndices.get(I);if(A===void 0)throw new Error("Invalid symbol error");A.forEach(M=>{g.push(`${a[z].indicesSet(`input${z}Indices`,M,`${I}`)}`)}),y.push(`prod *= ${a[z].getByIndices(`input${z}Indices`)};`)}}),$.push(`for(var ${I}: u32 = 0; ${I} < uniforms.${ji(I)}; ${I}++) {`),x.push("}")});let k=w?[...c,`let sum = ${a.map((S,I)=>S.getByIndices(`input${I}Indices`)).join(" * ")};`]:[...c,h,...$,...g,f,...y,_,...x];return`
            ${d.registerUniforms(u.map(S=>({name:`${ji(S)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...a,s)}

            ${d.mainStart()}
            ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${s.offsetToIndices("global_idx")};
            ${a.map((S,I)=>`var input${I}Indices: ${a[I].type.indices};`).join(`
`)}
            ${k.join(`
`)};
            ${s.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:r.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let d=u.filter(f=>r.symbolToInfo.has(f)).map(f=>({type:12,data:r.symbolToInfo.get(f)?.dimValue||0}));d.push({type:12,data:n});let c=e.map((f,h)=>[...X(f)]).reduce((f,h)=>f.concat(h),d);return c.push(...X(i)),{outputs:[{dims:i,dataType:t}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:c}},getShaderSource:l}},bc=(e,t)=>{let r=new mu(e.inputs,t.equation),i=r.outputDims,a=e.inputs.map((n,s)=>n.dims);e.compute(gu(a,e.inputs[0].dataType,r,i))},wc=e=>{let t=e.equation.replace(/\s+/g,"");return pe({equation:t})}}),_u,Gi,yu,bu,$c,Jm=W(()=>{"use strict";ee(),ae(),se(),_u=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=r.length<t.length?0:r.length-t.length,a=t.length<r.length?0:t.length-r.length;for(;i<r.length&&a<t.length;++i,++a)if(r[i]!==t[a]&&r[i]!==1&&t[a]!==1)throw new Error("Expand requires shape to be broadcastable to input")},Gi=(e,t)=>{let r=e.length-t.length,i=[];for(let a=0;a<r;++a)i.push(e[a]);for(let a=0;a<t.length;++a)i.push(t[a]===1?e[a+r]:t[a]);return i},yu=(e,t)=>e.length>t.length?Gi(e,t):Gi(t,e),bu=e=>{let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=yu(t,r),a=e[0].dataType,n=a===9||C.size(t)===1,s=a===9||t.length>0&&t[t.length-1]%4===0?4:1,u=n||i.length>0&&i[i.length-1]%4===0?4:1,l=Math.ceil(C.size(i)/u),d=f=>{let h=B("input",a,t.length,s),_=H("output",a,i.length,u),g;if(a===9){let $=(x,y,w="")=>`
          let outputIndices${y} = ${_.offsetToIndices(`outputOffset + ${y}u`)};
          let offset${y} = ${h.broadcastedIndicesToOffset(`outputIndices${y}`,_)};
          let index${y} = offset${y} / 4u;
          let component${y} = offset${y} % 4u;
          ${x}[${y}] = ${w}(${h.getByOffset(`index${y}`)}[component${y}]);
        `;g=`
        let outputOffset = global_idx * ${u};
        var data = vec4<u32>(0);
        ${$("data",0,"u32")}
        ${$("data",1,"u32")}
        ${$("data",2,"u32")}
        ${$("data",3,"u32")}
        ${_.setByOffset("global_idx","data")}
      }`}else g=`
        let outputIndices = ${_.offsetToIndices(`global_idx * ${u}`)};
        let inputOffset = ${h.broadcastedIndicesToOffset("outputIndices",_)};
        let data = ${_.type.value}(${h.getByOffset(`inputOffset / ${s}`)});
        ${_.setByOffset("global_idx","data")}
      }`;return`
    ${f.registerUniform("vec_size","u32").declareVariables(h,_)}
    ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${g}`},c=[{type:12,data:l},...X(t,i)];return{name:"Expand",shaderCache:{hint:`${i.length};${s}${u}`,inputDependencies:["rank"]},getShaderSource:d,getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:c})}},$c=e=>{_u(e.inputs),e.compute(bu(e.inputs),{inputs:[0]})}}),wu,vc,eg=W(()=>{"use strict";ee(),ae(),se(),Ga(),wu=e=>{let t=e[0].dataType,r=C.size(e[0].dims),i=C.size(e[1].dims),a=i%4===0,n=s=>{let u=B("x",t,[1],4),l=B("bias",t,[1],4),d=H("y",t,[1],4),c=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],f=_=>`
      let bias${_}_offset: u32 = (global_idx * 4 + ${_}) % uniforms.bias_size;
      let bias${_} = ${l.getByOffset(`bias${_}_offset / 4`)}[bias${_}_offset % 4];`,h=a?`
      let bias = ${l.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${f(0)}${f(1)}${f(2)}${f(3)}
      let bias = ${u.type.value}(bias0, bias1, bias2, bias3);`;return`${s.registerUniforms(c).declareVariables(u,l,d)}

    ${wa(Ie(t))}

    ${s.mainStart(Dt)}
      ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${u.getByOffset("global_idx")};
      ${h}
      let x_in = x + bias;
      ${d.setByOffset("global_idx",$a("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${a}`,inputDependencies:["type","type"]},getShaderSource:n,getRunData:s=>({outputs:[{dims:s[0].dims,dataType:s[0].dataType}],programUniforms:[{type:12,data:Math.ceil(r/4)},{type:12,data:i}],dispatchGroup:{x:Math.ceil(r/Dt/4)}})}},vc=e=>{e.inputs.length<2||C.size(e.inputs[1].dims)===0?Lp(e):e.compute(wu(e.inputs))}}),$u,vu,xc,Sc,tg=W(()=>{"use strict";ee(),ae(),we(),se(),$u=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},vu=(e,t)=>{let r=e[0].dims,i=e[1].dims,a=r.length,n=C.normalizeAxis(t.axis,a),s=r.slice(0);s.splice(n,1,...i);let u=r[n],l=e[0].dataType===9?4:1,d=Math.ceil(C.size(s)/l),c=[{type:12,data:d},{type:6,data:u},{type:12,data:n},...X(e[0].dims,e[1].dims,s)],f=h=>{let _=B("data",e[0].dataType,e[0].dims.length,l),g=B("inputIndices",e[1].dataType,e[1].dims.length),$=H("output",e[0].dataType,s.length,l),x=w=>{let k=i.length,S=`var indicesIndices${w}  = ${g.type.indices}(0);`;for(let I=0;I<k;I++)S+=`${k>1?`indicesIndices${w}[${I}]`:`indicesIndices${w}`} = ${s.length>1?`outputIndices${w}[uniforms.axis + ${I}]`:`outputIndices${w}`};`;S+=`
          var idx${w} = ${g.getByIndices(`indicesIndices${w}`)};
          if (idx${w} < 0) {
            idx${w} = idx${w} + uniforms.axisDimLimit;
          }
          var dataIndices${w} : ${_.type.indices};
        `;for(let I=0,T=0;I<a;I++)I===n?(S+=`${a>1?`dataIndices${w}[${I}]`:`dataIndices${w}`} = u32(idx${w});`,T+=k):(S+=`${a>1?`dataIndices${w}[${I}]`:`dataIndices${w}`} = ${s.length>1?`outputIndices${w}[${T}]`:`outputIndices${w}`};`,T++);return S},y;if(e[0].dataType===9){let w=(k,S,I="")=>`
          let outputIndices${S} = ${$.offsetToIndices(`outputOffset + ${S}u`)};
          ${x(S)};
          let offset${S} = ${_.indicesToOffset(`dataIndices${S}`)};
          let index${S} = offset${S} / 4u;
          let component${S} = offset${S} % 4u;
          ${k}[${S}] = ${I}(${_.getByOffset(`index${S}`)}[component${S}]);
        `;y=`
        let outputOffset = global_idx * ${l};
        var value = vec4<u32>(0);
        ${w("value",0,"u32")}
        ${w("value",1,"u32")}
        ${w("value",2,"u32")}
        ${w("value",3,"u32")}
        ${$.setByOffset("global_idx","value")}
      `}else y=`
      let outputIndices = ${$.offsetToIndices("global_idx")};
      ${x("")};
      let value = ${_.getByIndices("dataIndices")};
      ${$.setByOffset("global_idx","value")};
      `;return`
      ${h.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(_,g,$)}
      ${h.mainStart()}
        ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${y}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:s,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:c}),getShaderSource:f}},xc=e=>pe({axis:e.axis}),Sc=(e,t)=>{let r=e.inputs;$u(r),e.compute(vu(e.inputs,t))}}),xu,kc,Ic,rg=W(()=>{"use strict";ee(),ae(),se(),xu=(e,t,r,i,a,n,s,u,l)=>{let d=[{type:12,data:n},{type:12,data:i},{type:12,data:a},{type:12,data:r},{type:12,data:s},{type:12,data:u},{type:12,data:l}],c=[n];d.push(...X(t.dims,c));let f=h=>{let _=B("indices_data",t.dataType,t.dims.length),g=H("input_slice_offsets_data",12,1,1),$=[_,g],x=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:a.length},{name:"sizes_from_slice_dims_data",type:"u32",length:r.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${h.registerUniforms(x).declareVariables(...$)}
  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${a.length===1?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${r.length===1?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${a.length}_${r.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:c,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:d}),getShaderSource:f},{inputs:[t],outputs:[-1]})[0]},kc=(e,t)=>{let r=e.inputs,i=r[0].dims,a=r[0].dataType,n=r[1].dims,s=n[n.length-1],u=C.sizeToDimension(n,n.length-1),l=C.sizeFromDimension(i,t.batchDims+s),d=C.sizeToDimension(i,t.batchDims),c=C.sizeFromDimension(i,t.batchDims),f=u/d,h=new Array(s),_=l;for(let S=0;S<s;++S)h[s-1-S]=_,_*=i[t.batchDims+s-1-S];let g=xu(e,r[1],h,t.batchDims,i,u,f,c,s),$=t.batchDims+s;if($>i.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let x=n.slice(0,-1).concat(i.slice($)),y=C.size(x),w=[{type:12,data:y},{type:12,data:l},...X(r[0].dims,g.dims,x)],k=S=>{let I=B("data",r[0].dataType,r[0].dims.length),T=B("slice_offsets",12,g.dims.length),z=H("output",r[0].dataType,x.length);return`
          ${S.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(I,T,z)}
            ${S.mainStart()}
            ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:x,dataType:a}],dispatchGroup:{x:Math.ceil(y/64)},programUniforms:w}),getShaderSource:k},{inputs:[r[0],g]})},Ic=e=>({batchDims:e.batch_dims,cacheKey:""})}),Su,ku,Tc,Ec,ig=W(()=>{"use strict";ee(),ae(),we(),se(),Su=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let r=C.normalizeAxis(t.quantizeAxis,e[0].dims.length),i=t.blockSize,a=e[0],n=e[2],s=e.length===4?e[3]:void 0;if(n.dims.length!==a.dims.length||!a.dims.map((u,l)=>l===r?Math.ceil(u/i)===n.dims[l]:u===n.dims[l]).reduce((u,l)=>u&&l,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(s){if(s.dataType!==a.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(s.dims.length!==n.dims.length||!s.dims.map((u,l)=>u===n.dims[l]).reduce((u,l)=>u&&l,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},ku=(e,t)=>{let r=e[0].dims,i=e[1].dims,a=r.length,n=C.normalizeAxis(t.gatherAxis,a),s=C.normalizeAxis(t.quantizeAxis,a),u=r.slice(0);u.splice(n,1,...i);let l=C.size(u),d=e[2].dataType,c=e[0].dataType===22,f=[{type:12,data:l},{type:12,data:s},{type:12,data:n},{type:12,data:t.blockSize},...X(...e.map((_,g)=>_.dims),u)],h=_=>{let g=B("data",e[0].dataType,e[0].dims.length),$=B("inputIndices",e[1].dataType,e[1].dims.length),x=B("scales",e[2].dataType,e[2].dims.length),y=e.length>3?B("zeroPoint",e[3].dataType,e[3].dims.length):void 0,w=H("output",d,u.length),k=[g,$,x];y&&k.push(y);let S=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${_.registerUniforms(S).declareVariables(...k,w)}
        ${_.mainStart()}
        let output_indices = ${w.offsetToIndices("global_idx")};
        var indices_indices = ${$.type.indices}(0);
        ${i.length>1?`
          for (var i: u32 = 0; i < ${i.length}; i++) {
            let index = ${w.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${$.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${w.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${g.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${w.indicesGet("output_indices","i")};
          ${g.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${$.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${r[n]};
        }
        ${g.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${u.length}; i++) {
          let index = ${w.indicesGet("output_indices",`i + ${i.length} - 1`)};
          ${g.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${g.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${g.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${c?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${x.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${x.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${x.getByIndices("scale_indices")};
        ${y?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${y.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${y.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${c?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${Ie(d)}(quantized_data - zero_point) * scale;
        ${w.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((_,g)=>g!==1).map(_=>_.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(_,g)=>"rank")},getRunData:()=>({outputs:[{dims:u,dataType:d}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:f}),getShaderSource:h}},Tc=(e,t)=>{let r=e.inputs;Su(r,t),e.compute(ku(e.inputs,t))},Ec=e=>pe({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),Iu,Tu,zc,Cc,ag=W(()=>{"use strict";ee(),ae(),we(),se(),Iu=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},Tu=(e,t)=>{let r=e[0].dims,i=e[0].dataType,a=r.length,n=e[1].dims,s=e[1].dataType,u=C.normalizeAxis(t.axis,a),l=r[u],d=n.slice(0),c=C.size(d),f=B("input",i,a),h=B("indicesInput",s,n.length),_=H("output",i,d.length),g=[{type:12,data:c},{type:6,data:l},{type:12,data:u}];return g.push(...X(r,n,d)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:d,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:g}),getShaderSource:$=>`
      ${$.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(f,h,_)}
      ${$.mainStart()}
      ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${_.offsetToIndices("global_idx")};

      var idx = ${h.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${f.type.indices}(outputIndices);
      ${f.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${f.getByIndices("inputIndices")};

      ${_.setByOffset("global_idx","value")};
  }`}},zc=e=>pe({axis:e.axis}),Cc=(e,t)=>{let r=e.inputs;Iu(r),e.compute(Tu(e.inputs,t))}}),Eu,zu,Ac,Oc,ng=W(()=>{"use strict";ee(),ae(),se(),Eu=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},zu=(e,t)=>{let r=e[0].dims.slice(),i=e[1].dims.slice(),[a,n,s]=zd.getShapeOfGemmResult(r,t.transA,i,t.transB,e.length===3?e[2].dims:void 0),u=[a,n];if(!u)throw new Error("Can't use gemm on the given tensors");let l=16,d=Math.ceil(n/l),c=Math.ceil(a/l),f=!0,h=C.size(u),_=[{type:12,data:f?d:h},{type:12,data:a},{type:12,data:n},{type:12,data:s},{type:1,data:t.alpha},{type:1,data:t.beta}],g=["type","type"];e.length===3&&(_.push(...X(e[2].dims)),g.push("rank")),_.push(...X(u));let $=y=>{let w="";t.transA&&t.transB?w="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?w="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?w="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(w="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let k=t.alpha===1?"":"value *= uniforms.alpha;",S=B("a",e[0].dataType,e[0].dims),I=B("b",e[1].dataType,e[1].dims),T=S.type.value,z=null,A=[S,I];e.length===3&&(z=B("c",e[2].dataType,e[2].dims.length),A.push(z));let M=H("output",e[0].dataType,u.length);A.push(M);let q=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${y.registerUniforms(q).declareVariables(...A)}

  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${T}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${w}
    }

    ${k}
    ${z!=null?`let cOffset = ${z.broadcastedIndicesToOffset("vec2(m, n)",M)}; value += ${T}(uniforms.beta) * ${z.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},x=y=>{let w=B("a",e[0].dataType,e[0].dims),k=B("b",e[1].dataType,e[1].dims),S=null,I=[w,k];e.length===3&&(S=B("c",e[2].dataType,e[2].dims.length),I.push(S));let T=H("output",e[0].dataType,u.length);I.push(T);let z=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],A="",M="";t.transA&&t.transB?(M=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${k.type.value}(0);
      }
      `,A="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(M=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${k.type.value}(0);
      }
      `,A="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(M=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${k.type.value}(0);
      }
      `,A="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(M=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${k.type.value}(0);
      }
      `,A="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let q=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${y.registerUniforms(z).declareVariables(...I)}
  var<workgroup> tile_a: array<array<${w.type.storage}, ${l}>, ${l}>;
  var<workgroup> tile_b: array<array<${k.type.storage}, ${l}>, ${l}>;
  ${y.mainStart([l,l,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${l};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${l};
    let num_tiles = (uniforms.K - 1) / ${l} + 1;
    var k_start = 0u;
    var value = ${T.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${M}
      k_start = k_start + ${l};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${l}; k++) {
        ${A}
      }
      workgroupBarrier();
    }

    ${q}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${S!=null?`let cOffset = ${S.broadcastedIndicesToOffset("vec2(m, n)",T)}; value += ${T.type.value}(uniforms.beta) * ${S.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return f?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:g},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:d*c},programUniforms:_}),getShaderSource:x}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:g},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:_}),getShaderSource:$}},Ac=e=>{let t=e.transA,r=e.transB,i=e.alpha,a=e.beta;return{transA:t,transB:r,alpha:i,beta:a,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},Oc=(e,t)=>{Eu(e.inputs),e.compute(zu(e.inputs,t))}}),Ze,et,yt,bt,Cu,Au,Ou,Ru,Bu,Mu,Nu,Du,Rc,Bc,sg=W(()=>{"use strict";ee(),ae(),we(),se(),[Ze,et,yt,bt]=[0,1,2,3],Cu=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},Au=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,Ou=e=>`
  fn gs_bicubic_interpolate(p: mat4x4<${e}>, x: f32, y: f32) -> ${e} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${e}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,Ru=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,Bu=e=>`
  ${e.paddingMode==="reflection"?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:""}
`,Mu=(e,t,r)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${Ze}] = batch;
     indices[${et}] = channel;`+(()=>{switch(r.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${yt}] = u32(r);
            indices[${bt}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case"border":return`
          indices[${yt}] = u32(clamp(r, 0, H - 1));
          indices[${bt}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${yt}] = gs_reflect(r, border[1], border[3]);
          indices[${bt}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${r.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,Nu=(e,t,r)=>(()=>{switch(r.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${Ze}], indices[${et}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${Ze}], indices[${et}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${Ze}], indices[${et}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${Ze}], indices[${et}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${Ze}], indices[${et}], border);

          let dx2 = ${t}(f32(x2) - x);
          let dx1 = ${t}(x - f32(x1));
          let dy2 = ${t}(f32(y2) - y);
          let dy1 = ${t}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case"bicubic":return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${t}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${Ze}], indices[${et}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${r.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,Du=(e,t)=>{let r=B("x",e[0].dataType,e[0].dims.length),i=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],a=B("grid",e[1].dataType,i.length,2),n=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(n=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[Ze,et,yt,bt]=[0,3,1,2]);let s=H("output",e[0].dataType,n.length),u=r.type.value,l=C.size(n),d=[{type:12,data:l},...X(e[0].dims,i,n)],c=f=>`
  ${f.registerUniform("output_size","u32").declareVariables(r,a,s)}
  ${Au}
  ${Ou(u)}
  ${Ru(t)}
  ${Bu(t)}
  ${Mu(r,u,t)}

  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${yt}]);
      let W_in = i32(uniforms.x_shape[${bt}]);

      ${t.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${s.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${Ze}], indices[${yt}], indices[${bt}]);
      let nxy = ${a.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${Nu(s,u,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:f=>{let h=C.size(n);return{outputs:[{dims:n,dataType:f[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:d}},getShaderSource:c}},Rc=(e,t)=>{Cu(e.inputs),e.compute(Du(e.inputs,t))},Bc=e=>pe({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),Te,Pu,Mc,Hi,Uu,ar,Nc,Dc=W(()=>{"use strict";ee(),ae(),we(),Wa(),ja(),se(),ht(),Te=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,Pu=(e,t)=>{let r=e[0],i=Te(e,1),a=Te(e,2),n=Te(e,3),s=Te(e,4),u=Te(e,5),l=Te(e,6),d=Te(e,7);if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let c=r.dims[0],f=r.dims[1],h=r.dims.length===3?r.dims[2]:t.numHeads*r.dims[4],_=f,g=0,$=0,x=Math.floor(h/t.numHeads);if(l&&d&&C.size(l.dims)&&C.size(d.dims)){if(l.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(l.dims[0]!==c||l.dims[1]!==t.numHeads||l.dims[3]!==x)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(d.dims[0]!==c||d.dims[1]!==t.numHeads||d.dims[3]!==x)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(l.dims[2]!==d.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(d.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');g=l.dims[2],$=l.dims[2]}else if(l&&C.size(l.dims)||d&&C.size(d.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let y;if(i&&C.size(i.dims)>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(i.dims[2]!==r.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');y=2,_=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==x)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(a)throw new Error('Expect "value" be none when "key" has packed kv format.');y=5,_=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==x)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');y=0,_=i.dims[2]}}else{if(r.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(r.dims[2]!==t.numHeads||r.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');y=3}if(n&&C.size(n.dims)>0){if(n.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(i&&i.dims.length===5&&i.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let w=g+_,k=0;if(s&&C.size(s.dims)>0){k=8;let z=s.dims;throw z.length===1?z[0]===c?k=1:z[0]===3*c+2&&(k=3):z.length===2&&z[0]===c&&z[1]===w&&(k=5),k===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let S=!1,I=h;if(a&&C.size(a.dims)>0){if(a.dims.length!==3&&a.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(a.dims.length===3){if(_!==a.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');I=a.dims[2]}else{if(_!==a.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');I=a.dims[1]*a.dims[3],S=!0}}let T=!1;if(s&&C.size(s.dims)>0)throw new Error("Key padding mask is not supported");if(u&&C.size(u.dims)>0){if(u.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(u.dims[0]!==c||u.dims[1]!==t.numHeads||u.dims[2]!==f||u.dims[3]!==w)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:c,sequenceLength:f,pastSequenceLength:g,kvSequenceLength:_,totalSequenceLength:w,maxSequenceLength:$,inputHiddenSize:0,hiddenSize:h,vHiddenSize:I,headSize:x,vHeadSize:Math.floor(I/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:k,scale:t.scale,broadcastResPosBias:T,passPastInKv:S,qkvFormat:y}},Mc=e=>pe({...e}),Hi=pe({perm:[0,2,1,3]}),Uu=(e,t,r,i,a,n,s)=>{let u=[i,a,n],l=C.size(u),d=[{type:12,data:l},{type:12,data:s},{type:12,data:n}],c=f=>{let h=H("qkv_with_bias",t.dataType,u),_=B("qkv",t.dataType,u),g=B("bias",r.dataType,u),$=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${f.registerUniforms($).declareVariables(_,g,h)}
  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:u,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d}),getShaderSource:c},{inputs:[t,r],outputs:[-1]})[0]},ar=(e,t,r,i,a,n,s,u)=>{let l=n;if(s&&C.size(s.dims)>0){if(i===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return l=Uu(e,n,s,t,i,r*a,u),l=l.reshape([t,i,r,a]),r===1||i===1?l:e.compute(Re(l,Hi.perm),{inputs:[l],outputs:[-1]})[0]}else return n.dims.length===3&&(l=n.reshape([t,i,r,a])),r===1||i===1?l:e.compute(Re(l,Hi.perm),{inputs:[l],outputs:[-1]})[0]},Nc=(e,t)=>{let r=Pu(e.inputs,t),i=e.inputs[0],a=Te(e.inputs,1),n=Te(e.inputs,2),s=Te(e.inputs,3),u=Te(e.inputs,4),l=Te(e.inputs,5),d=Te(e.inputs,6),c=Te(e.inputs,7);if(i.dims.length===5)throw new Error("Packed QKV is not implemented");if(a?.dims.length===5)throw new Error("Packed KV is not implemented");let f=a&&n&&a.dims.length===4&&n.dims.length===4,h=ar(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,i,s,0);if(f)return or(e,h,a,n,u,void 0,d,c,l,r);if(!a||!n)throw new Error("key and value must be provided");let _=ar(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,a,s,r.hiddenSize),g=ar(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,n,s,2*r.hiddenSize);or(e,h,_,g,u,void 0,d,c,l,r)}}),qu,Wu,Lu,Vu,Ia,Pc,Uc,qc=W(()=>{"use strict";ee(),ae(),we(),se(),qu=e=>{if(!e||e.length<1)throw new Error("too few inputs")},Wu=(e,t)=>{let r=[],i=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(a=>r.push(Number(a))),i=r.length),pe({numOutputs:i,axis:t.axis,splitSizes:r})},Lu=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${F("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,Vu=e=>{let t=e.length,r=[];for(let i=0;i<t;++i){let a=e[i].setByIndices("indices","input[global_idx]");t===1?r.push(a):i===0?r.push(`if (output_number == ${i}u) { ${a} }`):i===t-1?r.push(`else { ${a} }`):r.push(`else if (output_number == ${i}) { ${a} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`},Ia=(e,t)=>{let r=e[0].dims,i=C.size(r),a=e[0].dataType,n=C.normalizeAxis(t.axis,r.length),s=new Array(t.numOutputs),u=B("input",a,r.length),l=new Array(t.numOutputs),d=[],c=[],f=0,h=[{type:12,data:i}];for(let g=0;g<t.numOutputs;g++){f+=t.splitSizes[g],l[g]=f;let $=r.slice();$[n]=t.splitSizes[g],c.push($),s[g]=H(`output${g}`,a,$.length),d.push({dims:c[g],dataType:e[0].dataType})}h.push({type:12,data:l},...X(r,...c));let _=g=>`
  ${g.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",l.length).declareVariables(u,...s)}
  ${Lu(l.length)}
  ${Vu(s)}

  ${g.mainStart()}
    ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${u.offsetToIndices("global_idx")};
    var index = ${u.indicesGet("indices",n)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${F("uniforms.size_in_split_axis","output_number - 1u",l.length)};
      ${u.indicesSet("indices",n,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:_,getRunData:()=>({outputs:d,dispatchGroup:{x:Math.ceil(i/64)},programUniforms:h})}},Pc=(e,t)=>{qu(e.inputs);let r=e.inputs.length===1?t:Wu(e.inputs,t);e.compute(Ia(e.inputs,r),{inputs:[0]})},Uc=e=>{let t=e.axis,r=e.splitSizes,i=e.numOutputs<0?r.length:e.numOutputs;if(i!==r.length)throw new Error("numOutputs and splitSizes lengh must be equal");return pe({axis:t,numOutputs:i,splitSizes:r})}}),ju,jr,Wc,Lc=W(()=>{"use strict";ee(),ae(),we(),se(),ju=(e,t)=>{let[r,i,a,n]=e,{numHeads:s,rotaryEmbeddingDim:u}=t;if(r.dims.length!==3&&r.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!C.areEqual(i.dims,[])&&!C.areEqual(i.dims,[1])&&i.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${i.dims.length}`);if(a.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${a.dims.length}`);if(n.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${n.dims.length}`);if(!C.areEqual(a.dims,n.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(u>0&&s===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let l=r.dims[0],d=r.dims[r.dims.length-2],c=a.dims[0],f=C.sizeFromDimension(r.dims,1)/d,h=u===0?a.dims[1]*2:f/s;if(u>h)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(i.dims.length===2){if(l!==i.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${i.dims[0]}`);if(d!==i.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${i.dims[1]}`)}if(h/2!==a.dims[1]&&u/2!==a.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${a.dims[1]}`);if(d>c)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported")},jr=(e,t)=>{let{interleaved:r,numHeads:i,rotaryEmbeddingDim:a,scale:n}=t,s=e[0].dims[0],u=C.sizeFromDimension(e[0].dims,1),l=e[0].dims[e[0].dims.length-2],d=u/l,c=e[2].dims[1],f=a===0?c*2:d/i,h=new Array(s,l,d/f,f-c),_=C.computeStrides(h),g=[{type:1,data:n},{type:12,data:h},{type:12,data:_},...e[0].dims.length===3?new Array({type:12,data:[u,d,f,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[u,f,l*f,1]}):[],...X(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],$=x=>{let y=B("input",e[0].dataType,e[0].dims.length),w=B("position_ids",e[1].dataType,e[1].dims.length),k=B("cos_cache",e[2].dataType,e[2].dims.length),S=B("sin_cache",e[3].dataType,e[3].dims.length),I=H("output",e[0].dataType,e[0].dims.length);return x.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:h.length},{name:"global_strides",type:"u32",length:_.length},{name:"input_output_strides",type:"u32",length:_.length}]),`
        ${x.declareVariables(y,w,k,S,I)}

        ${x.mainStart(Dt)}
          let half_rotary_emb_dim = uniforms.${k.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${x.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${w.broadcastedIndicesToOffset("bsnh.xy",H("",w.type.tensor,2))};
            let position_id =
                u32(${w.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${y.getByOffset("i")} * ${k.get("position_id","bsnh[3]")} -
                ${y.getByOffset("j")} * ${S.get("position_id","bsnh[3]")};
            ${I.setByOffset("i","re")}
            let im = ${y.getByOffset("i")} * ${S.get("position_id","bsnh[3]")} +
                ${y.getByOffset("j")} * ${k.get("position_id","bsnh[3]")};
            ${I.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${I.setByOffset("k",y.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:pe({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:$,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(C.size(h)/Dt)},programUniforms:g})}},Wc=(e,t)=>{ju(e.inputs,t),e.compute(jr(e.inputs,t))}}),Gu,Hu,Fi,Fu,Vc,og=W(()=>{"use strict";we(),ee(),ja(),Dc(),qc(),ht(),Lc(),se(),Gu=(e,t)=>{if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let r=e[0],i=e[1],a=e[2],n=e[3],s=e[4];if(t.doRotary!==0&&e.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let u=!1,l=r.dims[0],d=r.dims[1],c=r.dims.length===3?u?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],f=d,h=0,_=!i||i.dims.length===0,g=Math.floor(_?c/(t.numHeads+2*t.kvNumHeads):c/t.numHeads);_&&(c=g*t.numHeads);let $=n&&n.dims.length!==0,x=s&&s.dims.length!==0;if($&&n.dims.length===4&&n.dims[0]===l&&n.dims[1]!==t.kvNumHeads&&n.dims[2]===t.kvNumHeads&&n.dims[3]===g)throw new Error("BSNH pastKey/pastValue is not supported");if($&&x){if(n.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(s.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');h=n.dims[2]}else if($||x)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let y=1;if(i&&i.dims.length>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(r.dims[2]%i.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');f=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==g)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(a)throw new Error('Expect "value" be none when "key" has packed kv format.');f=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==g)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');f=i.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');y=3}let w=0,k=!1,S=t.kvNumHeads?g*t.kvNumHeads:c;if(a&&a.dims.length>0){if(a.dims.length!==3&&a.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(a.dims.length===3){if(f!==a.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');S=a.dims[2]}else{if(f!==a.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');S=a.dims[1]*a.dims[3],k=!0}}let I=e.length>4?e[5]:void 0;if(I&&I.dims.length!==1&&I.dims[0]!==l)throw new Error('Input "seqlens" is expected to have 1 dimension and the same dim 0 as batch_size');return{batchSize:l,sequenceLength:d,pastSequenceLength:h,kvSequenceLength:f,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:c,vHiddenSize:S,headSize:g,vHeadSize:Math.floor(S/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:w,scale:t.scale,broadcastResPosBias:!1,passPastInKv:k,qkvFormat:y}},Hu=pe({perm:[0,2,1,3]}),Fi=(e,t,r)=>{let i=t,a=r.kvNumHeads;return t.dims.length===3&&r.kvSequenceLength!==0&&(i=t.reshape([r.batchSize,r.kvSequenceLength,a,r.headSize]),i=e.compute(Re(i,Hu.perm),{inputs:[i],outputs:[-1]})[0]),i},Fu=(e,t,r,i)=>{let a=7,n=["type","type"],s=[e*t],u=e*t,l=[{type:12,data:u},{type:12,data:t},{type:12,data:e}],d=c=>{let f=B("seq_lens",r.dataType,r.dims),h=B("total_seq_lens",i.dataType,i.dims),_=H("pos_ids",a,s),g=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${c.registerUniforms(g).declareVariables(f,h,_)}
  ${c.mainStart()}
    ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${h.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${f.getByOffset("batch_idx")};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${_.setByOffset("global_idx","pos_id")}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${_.setByOffset("global_idx","pos_id")}
    } else if (global_idx < uniforms.batch_size) {
      ${_.setByOffset("global_idx","seqlen")}
    };
  }
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:n},getRunData:()=>({outputs:[{dims:s,dataType:a}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:l}),getShaderSource:d}},Vc=(e,t)=>{let r=Gu(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(e.inputs[1]?.dims.length===5)throw new Error("Packed KV is not implemented");let i=e.inputs[0],a=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,n=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,s=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,u=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,l=e.inputs.length>4?e.inputs[5]:void 0,d=e.inputs.length>5?e.inputs[6]:void 0,c=r.kvNumHeads?r.kvNumHeads:r.numHeads,f=pe({axis:2,numOutputs:3,splitSizes:[r.numHeads*r.headSize,c*r.headSize,c*r.headSize]}),[h,_,g]=!a&&!n?e.compute(Ia([i],f),{inputs:[i],outputs:[-1,-1,-1]}):[i,a,n],$,x;if(t.doRotary){let S=e.compute(Fu(r.batchSize,r.sequenceLength,l,d),{inputs:[l,d],outputs:[-1]})[0],I=e.inputs[7],T=e.inputs[8],z=pe({interleaved:t.rotaryInterleaved!==0,numHeads:r.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),A=[h,S,I,T],M=[-1];$=e.compute(jr(A,z),{inputs:A,outputs:M})[0],A.splice(0,1,_);let q=pe({interleaved:t.rotaryInterleaved!==0,numHeads:r.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});x=e.compute(jr(A,q),{inputs:A,outputs:M})[0]}let y=ar(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,t.doRotary?$:h,void 0,0),w=Fi(e,t.doRotary?x:_,r),k=Fi(e,g,r);or(e,y,w,k,void 0,void 0,s,u,void 0,r,l,d)}}),Ki,Ku,Xu,jc,ug=W(()=>{"use strict";ee(),ae(),ht(),se(),Ki=(e,t,r,i,a,n,s,u)=>{let l=ye(n),d=l===1?"f32":`vec${l}f`,c=l===1?"vec2f":`mat2x${l}f`,f=a*s,h=64;f===1&&(h=256);let _=[a,s,n/l],g=[a,s,2],$=["rank","type","type"],x=[];x.push(...X(_,g));let y=w=>{let k=B("x",t.dataType,3,l),S=B("scale",r.dataType,r.dims),I=B("bias",i.dataType,i.dims),T=H("output",1,3,2),z=[k,S,I,T];return`
  var<workgroup> workgroup_shared : array<${c}, ${h}>;
  const workgroup_size = ${h}u;
  ${w.declareVariables(...z)}
  ${w.mainStart(h)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${d}(0);
    var squared_sum = ${d}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${d}(${k.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${c}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${ft("workgroup_shared[0][0]",l)} / f32(hight * ${l});
      let squared_sum_final = ${ft("workgroup_shared[0][1]",l)} / f32(hight * ${l});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${u}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${l};${u};${h}`,inputDependencies:$},getRunData:()=>({outputs:[{dims:g,dataType:1}],dispatchGroup:{x:f},programUniforms:x}),getShaderSource:y},{inputs:[t,r,i],outputs:[-1]})[0]},Ku=(e,t,r)=>{let i=t[0].dims,a=i,n=2,s=i[0],u=i[1],l=C.sizeFromDimension(i,n),d=ye(l),c=C.size(a)/d,f=Ki(e,t[0],t[1],t[2],s,l,u,r.epsilon),h=[s,u,l/d],_=[s,u],g=["type","none"],$=x=>{let y=B("x",t[0].dataType,h.length,d),w=B("scale_shift",1,_.length,2),k=H("output",t[0].dataType,h.length,d),S=[y,w,k];return`
  ${x.registerUniform("output_size","u32").declareVariables(...S)}
  ${x.mainStart()}
  ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${k.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${w.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${y.getByOffset("global_idx")} * ${k.type.value}(scale_shift.x) + ${k.type.value}(scale_shift.y);
      ${k.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${d}`,inputDependencies:g},getRunData:()=>({outputs:[{dims:a,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:[{type:12,data:c},...X(h,_,h)]}),getShaderSource:$},{inputs:[t[0],f]})},Xu=(e,t,r)=>{let i=t[0].dims,a=i,n=i[0],s=i[i.length-1],u=C.sizeFromDimension(i,1)/s,l=ye(s),d=C.size(a)/l,c=[{type:12,data:u},{type:12,data:Math.floor(s/l)}],f=["type","type"],h=!1,_=[0,i.length-1];for(let y=0;y<i.length-2;y++)h=h||i[y+1]!==1,_.push(y+1);h=h&&i[i.length-1]!==1;let g=h?e.compute(Re(e.inputs[0],_),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:i.length},(y,w)=>i[_[w]])),$=Ki(e,g,t[1],t[2],n,u,s,r.epsilon),x=y=>{let w=xe(t[0].dataType),k=l===1?"vec2f":`mat${l}x2f`,S=z=>{let A=z===0?"x":"y",M=l===1?"f32":`vec${l}f`;switch(l){case 1:return`${w}(${M}(scale.${A}))`;case 2:return`vec2<${w}>(${M}(scale[0].${A}, scale[1].${A}))`;case 4:return`vec4<${w}>(${M}(scale[0].${A}, scale[1].${A}, scale[2].${A}, scale[3].${A}))`;default:throw new Error(`Not supported compoents ${l}`)}},I=B("input",t[0].dataType,t[0].dims,l),T=H("output",t[0].dataType,a,l);return`
  @group(0) @binding(0) var<storage, read> input : array<${I.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${k}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${T.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${y.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${S(0)}, ${S(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${l}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:a,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:c}),getShaderSource:x},{inputs:[t[0],$]})},jc=(e,t)=>{t.format==="NHWC"?Xu(e,e.inputs,t):Ku(e,e.inputs,t)}}),Zu,Qu,Gc,lg=W(()=>{"use strict";ee(),ae(),se(),Zu=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},Qu=(e,t,r)=>{let i=t.simplified,a=e[0].dims,n=e[1],s=!i&&e[2],u=a,l=C.normalizeAxis(t.axis,a.length),d=C.sizeToDimension(a,l),c=C.sizeFromDimension(a,l),f=C.size(n.dims),h=s?C.size(s.dims):0;if(f!==c||s&&h!==c)throw new Error(`Size of X.shape()[axis:] == ${c}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${f} and bias size of ${h}`);let _=[];for(let I=0;I<a.length;++I)I<l?_.push(a[I]):_.push(1);let g=ye(c),$=["type","type"],x=[{type:12,data:d},{type:1,data:c},{type:12,data:Math.floor(c/g)},{type:1,data:t.epsilon}];s&&$.push("type");let y=r>1,w=r>2,k=I=>{let T=xe(e[0].dataType),z=[B("x",e[0].dataType,e[0].dims,g),B("scale",n.dataType,n.dims,g)];s&&z.push(B("bias",s.dataType,s.dims,g)),z.push(H("output",e[0].dataType,u,g)),y&&z.push(H("mean_data_output",1,_)),w&&z.push(H("inv_std_output",1,_));let A=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${I.registerUniforms(A).declareVariables(...z)}
  ${I.mainStart()}
    ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${_a("f32",g)};
    var mean_square_vector = ${_a("f32",g)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${Mt(T,g,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${ft("mean_vector",g)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${ft("mean_square_vector",g)} / uniforms.norm_size ${i?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${Mt(T,g,"x[j + offset]")};
      let f32scale = ${Mt(T,g,"scale[j]")};
      output[j + offset] = ${z[0].type.value}((f32input ${i?"":"- mean"}) * inv_std_dev * f32scale
        ${s?`+ ${Mt(T,g,"bias[j]")}`:""}
      );
    }

    ${y?"mean_data_output[global_idx] = mean":""};
    ${w?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},S=[{dims:u,dataType:e[0].dataType}];return y&&S.push({dims:_,dataType:1}),w&&S.push({dims:_,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${g};${r};${i}`,inputDependencies:$},getRunData:()=>({outputs:S,dispatchGroup:{x:Math.ceil(d/64)},programUniforms:x}),getShaderSource:k}},Gc=(e,t)=>{Zu(e.inputs),e.compute(Qu(e.inputs,t,e.outputCount))}}),Yu,Hc,dg=W(()=>{"use strict";ae(),Xa(),Za(),Yu=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},Hc=e=>{Yu(e.inputs);let t=Nt.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let r=t[t.length-1],i=e.inputs[0].dims[e.inputs[0].dims.length-1];if(r<8&&i<8)e.compute(Ka(e.inputs,{activation:""},t));else{let a=t[t.length-2],n=C.size(e.inputs[0].dims.slice(0,-2)),s=C.size(e.inputs[1].dims.slice(0,-2));if(n!==1&&a===1&&s===1){let u=e.inputs[0].reshape([1,n,i]),l=e.inputs[1].reshape([1,i,r]),d=[1,n,r],c=[u,l];e.compute(Vr(c,{activation:""},t,d),{inputs:c})}else e.compute(Vr(e.inputs,{activation:""},t))}}}),Ju,el,tl,Fc,Kc,pg=W(()=>{"use strict";ee(),ae(),we(),se(),Ju=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let r=e[0],i=r.dims.length;if(r.dims[i-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let a=Math.floor((t.k+t.blockSize-1)/t.blockSize),n=t.blockSize/8*t.bits,s=e[1];if(!C.areEqual(s.dims,[t.n,a,n]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let u=e[2].dims;if(C.size(u)!==t.n*a)throw new Error("scales input size error.");if(e.length===4){let l=e[3].dims,d=t.bits>4?t.n*a:t.n*Math.floor((a+1)/2);if(C.size(l)!==d)throw new Error("zeroPoints input size error.")}},el=(e,t)=>{let r=e[0].dims,i=r.length,a=r[i-2],n=t.k,s=t.n,u=r.slice(0,i-2),l=C.size(u),d=e[1].dims[2]/4,c=e[0].dataType,f=ye(t.k),h=ye(d),_=ye(s),g=u.concat([a,s]),$=a>1&&s/_%2===0?2:1,x=C.size(g)/_/$,y=64,w=[],k=[l,a,n/f],S=C.convertShape(e[1].dims).slice();S.splice(-1,1,d/h),w.push(...X(k)),w.push(...X(S)),w.push(...X(e[2].dims)),e.length===4&&w.push(...X(C.convertShape(e[3].dims)));let I=[l,a,s/_];w.push(...X(I));let T=z=>{let A=k.length,M=B("a",e[0].dataType,A,f),q=B("b",12,S.length,h),G=B("scales",e[2].dataType,e[2].dims.length),P=[M,q,G],N=e.length===4?B("zero_points",12,e[3].dims.length):void 0;N&&P.push(N);let Z=I.length,te=H("output",e[0].dataType,Z,_),L=xe(e[0].dataType),Q=(()=>{switch(f){case 1:return`array<${L}, 8>`;case 2:return`mat4x2<${L}>`;case 4:return`mat2x4<${L}>`;default:throw new Error(`${f}-component is not supported.`)}})(),ie=()=>{let D=`
          // reuse a data
            var input_offset = ${M.indicesToOffset(`${M.type.indices}(batch, row, word_offset)`)};
            var a_data: ${Q};
            for (var j: u32 = 0; j < ${8/f}; j++) {
              a_data[j] = ${M.getByOffset("input_offset")};
              input_offset++;
            }
          `;for(let j=0;j<_*$;j++)D+=`
            b_value = ${h===1?`b${j}_data`:`b${j}_data[i]`};
            b_value_lower = unpack4xU8(b_value & b_mask);
            b_value_upper = unpack4xU8((b_value >> 4) & b_mask);
            b_quantized_values = ${Q}(${Array.from({length:4},(re,O)=>`${L}(b_value_lower[${O}]), ${L}(b_value_upper[${O}])`).join(", ")});
            b_dequantized_values = ${f===1?`${Q}(${Array.from({length:8},(re,O)=>`(b_quantized_values[${O}] - ${N?`zero_point${j}`:"zero_point"}) * scale${j}`).join(", ")});`:`(b_quantized_values - ${Q}(${Array(8).fill(`${N?`zero_point${j}`:"zero_point"}`).join(",")})) * scale${j};`};
            workgroup_shared[local_id.x * ${$} + ${Math.floor(j/_)}]${_>1?`[${j%_}]`:""} += ${Array.from({length:8/f},(re,O)=>`${f===1?`a_data[${O}] * b_dequantized_values[${O}]`:`dot(a_data[${O}], b_dequantized_values[${O}])`}`).join(" + ")};
          `;return D},J=()=>{let D=`
            var col_index = col * ${_};
            ${N?`
            let zero_point_bytes_per_col = (nBlocksPerCol + 1) / 2;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${L}(8);`}
            `;for(let j=0;j<_*$;j++)D+=`
            let scale${j} = ${G.getByOffset("col_index * nBlocksPerCol + block")};
            ${N?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block >> 0x1u);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            zero_point_word = ${N.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${j} = ${L}((zero_point_word) & 0xFu);`:""}
            col_index += 1;`;return D},he=()=>{let D=`col_index = col * ${_};`;for(let j=0;j<_*$;j++)D+=`
            let b${j}_data = ${q.getByIndices(`${q.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return D+=`
            var b_value: u32;
            let b_mask: u32 = 0x0F0F0F0Fu;
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${Q};
            var b_dequantized_values: ${Q};`,D};return`
        var<workgroup> workgroup_shared: array<${te.type.value}, ${$*y}>;
        ${z.declareVariables(...P,te)}
        ${z.mainStart([y,1,1])}
          let output_indices = ${te.offsetToIndices(`(global_idx / ${y}) * ${$}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${y}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/f};
            ${J()}
            for (var word: u32 = 0; word < ${d}; word += ${h}) {
              ${he()}
              for (var i: u32 = 0; i < ${h}; i++) {
                ${ie()}
                word_offset += ${8/f};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${$}) {
            var output_value: ${te.type.value} = ${te.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${y}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${$};
            }
            ${te.setByIndices(`${te.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${f};${h};${_};${$};${y}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:g,dataType:c}],dispatchGroup:{x},programUniforms:w}),getShaderSource:T}},tl=(e,t)=>{let r=e[0].dims,i=r.length,a=r[i-2],n=t.k,s=t.n,u=r.slice(0,i-2),l=C.size(u),d=e[1].dims[2]/4,c=e[0].dataType,f=ye(t.k),h=ye(d),_=u.concat([a,s]),g=128,$=s%8===0?8:s%4===0?4:1,x=g/$,y=x*h*8,w=y/f,k=y/t.blockSize,S=C.size(_)/$,I=[],T=[l,a,n/f],z=C.convertShape(e[1].dims).slice();z.splice(-1,1,d/h),I.push(...X(T)),I.push(...X(z)),I.push(...X(e[2].dims)),e.length===4&&I.push(...X(C.convertShape(e[3].dims)));let A=[l,a,s];I.push(...X(A));let M=q=>{let G=T.length,P=B("a",e[0].dataType,G,f),N=B("b",12,z.length,h),Z=B("scales",e[2].dataType,e[2].dims.length),te=[P,N,Z],L=e.length===4?B("zero_points",12,e[3].dims.length):void 0;L&&te.push(L);let Q=A.length,ie=H("output",e[0].dataType,Q),J=xe(e[0].dataType),he=()=>{switch(f){case 1:return`
          let a_data0 = vec4<${J}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${J}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${J}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${J}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${f}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${P.type.value}, ${w}>;
        var<workgroup> inter_results: array<array<${ie.type.value}, ${x}>, ${$}>;
        ${q.declareVariables(...te,ie)}
        ${q.mainStart([x,$,1])}
          let output_indices = ${ie.offsetToIndices(`workgroup_index * ${$}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${k} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${w};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${w}; a_offset += ${g})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${P.getByIndices(`${P.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${P.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${k} + local_id.x;
            ${L?`
            let zero_point_bytes_per_col = (n_blocks_per_col + 1) / 2;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block >> 0x1u);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            let zero_point_word = ${L.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${J}((zero_point_word) & 0xFu);`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${J}(8);`}
            let scale = ${Z.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${N.getByIndices(`${N.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/f};
            for (var i: u32 = 0; i < ${h}; i++) {
              ${he()}
              let b_value = ${h===1?"b_data":"b_data[i]"};
              let b_value_lower = unpack4xU8(b_value & 0x0F0F0F0Fu);
              let b_value_upper = unpack4xU8((b_value >> 4) & 0x0F0F0F0Fu);
              let b_quantized_values = mat2x4<${J}>(${Array.from({length:4},(D,j)=>`${J}(b_value_lower[${j}]), ${J}(b_value_upper[${j}])`).join(", ")});
              let b_dequantized_values = (b_quantized_values - mat2x4<${J}>(${Array(8).fill("zero_point").join(",")})) * scale;
              inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(D,j)=>`${`dot(a_data${j}, b_dequantized_values[${j}])`}`).join(" + ")};
              word_offset += ${8/f};
            }
            workgroupBarrier();
          }

          if (local_idx < ${$}) {
            var output_value: ${ie.type.value} = ${ie.type.value}(0);
            for (var b = 0u; b < ${x}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${ie.setByIndices(`${ie.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${f};${h};${x};${$}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:_,dataType:c}],dispatchGroup:{x:S},programUniforms:I}),getShaderSource:M}},Fc=(e,t)=>{Ju(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(tl(e.inputs,t)):e.compute(el(e.inputs,t))},Kc=e=>pe(e)}),rl,il,al,nl,sl,ol,ul,ll,Xc,cg=W(()=>{"use strict";ee(),ae(),se(),rl=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},il=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
            k = i32(${e.indicesGet("indices",a)}) - ${F("uniforms.pads",a,r)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${F("uniforms.x_shape",a,t)})) {
              break;
            }
            offset += k * i32(${F("uniforms.x_strides",a,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${i}
            value = x[offset];
          }
      `},al=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
                k = i32(${e.indicesGet("indices",a)}) - ${F("uniforms.pads",a,r)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${F("uniforms.x_shape",a,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${F("uniforms.x_shape",a,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${F("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},nl=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
                k = i32(${e.indicesGet("indices",a)}) - ${F("uniforms.pads",a,r)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${F("uniforms.x_shape",a,t)})) {
                  k = i32(${F("uniforms.x_shape",a,t)}) - 1;
                }
                offset += k * i32(${F("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},sl=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
                k = i32(${e.indicesGet("indices",a)}) - ${F("uniforms.pads",a,r)};
                if (k < 0)  {
                  k += i32(${F("uniforms.x_shape",a,t)}]);
                }
                if (k >= i32(${F("uniforms.x_shape",a,t)})) {
                  k -= i32(${F("uniforms.x_shape",a,t)});
                }
                offset += k * i32(${F("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},ol=(e,t,r)=>{switch(r.mode){case 0:return il(e,t,r.pads.length);case 1:return al(e,t,r.pads.length);case 2:return nl(e,t,r.pads.length);case 3:return sl(e,t,r.pads.length);default:throw new Error("Invalid mode")}},ul=(e,t)=>{let r=C.padShape(e[0].dims.slice(),t.pads),i=e[0].dims,a=C.size(r),n=[{type:12,data:a},{type:6,data:t.pads}],s=e.length>=3&&e[2].data;t.mode===0&&n.push({type:s?e[2].dataType:1,data:t.value}),n.push(...X(e[0].dims,r));let u=["rank"],l=d=>{let c=H("output",e[0].dataType,r.length),f=B("x",e[0].dataType,i.length),h=f.type.value,_=ol(c,i.length,t),g=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&g.push({name:"constant_value",type:s?h:"f32"}),`
            ${d.registerUniforms(g).declareVariables(f,c)}
            ${d.mainStart()}
            ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${c.offsetToIndices("global_idx")};

            var value = ${h}(0);
            ${_}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${s}`,inputDependencies:u},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(C.size(r)/64)},programUniforms:n}),getShaderSource:l}},ll=(e,t)=>{if(e.length>1){let r=e[1].getBigInt64Array(),i=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,a=e[0].dims.length,n=new Int32Array(2*a).fill(0);if(e.length>=4){let u=e[3].getBigInt64Array();for(let l=0;l<u.length;l++)n[Number(u[l])]=Number(r[l]),n[Number(u[l])+a]=Number(r[l+u.length])}else r.forEach((u,l)=>n[Number(l)]=Number(u));let s=[];return n.forEach(u=>s.push(u)),{mode:t.mode,value:i,pads:s}}else return t},Xc=(e,t)=>{rl(e.inputs);let r=ll(e.inputs,t);e.compute(ul(e.inputs,r),{inputs:[0]})}}),Qt,Xi,Zi,Qi,Yi,dl,pl,Ji,ea,Zc,Qc,ta,Yc,Jc,ra,ef,tf,rf,af,fg=W(()=>{"use strict";Ge(),ee(),ae(),se(),Qt=e=>{if(fe.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},Xi=(e,t,r)=>{let i=t.format==="NHWC",a=e.dims.slice();i&&a.splice(1,0,a.pop());let n=Object.hasOwnProperty.call(t,"dilations"),s=t.kernelShape.slice(),u=t.strides.slice(),l=n?t.dilations.slice():[],d=t.pads.slice();Wr.adjustPoolAttributes(r,a,s,u,l,d);let c=Wr.computePoolOutputShape(r,a,u,l,s,d,t.autoPad),f=Object.assign({},t);n?Object.assign(f,{kernelShape:s,strides:u,pads:d,dilations:l,cacheKey:t.cacheKey}):Object.assign(f,{kernelShape:s,strides:u,pads:d,cacheKey:t.cacheKey});let h=c.slice();return h.push(h.splice(1,1)[0]),[f,i?h:c]},Zi=(e,t)=>{let r=t.format==="NHWC",i=C.size(e),a=C.size(t.kernelShape),n=[{type:12,data:i},{type:12,data:a}],s=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let u=t.kernelShape[t.kernelShape.length-1],l=t.strides[t.strides.length-1],d=t.pads[t.pads.length/2-1],c=t.pads[t.pads.length-1],f=!!(d+c);n.push({type:12,data:u},{type:12,data:l},{type:12,data:d},{type:12,data:c}),s.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let h=!1;if(t.kernelShape.length===2){let _=t.kernelShape[t.kernelShape.length-2],g=t.strides[t.strides.length-2],$=t.pads[t.pads.length/2-2],x=t.pads[t.pads.length-2];h=!!($+x),n.push({type:12,data:_},{type:12,data:g},{type:12,data:$},{type:12,data:x}),s.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[n,s,!0,f,h]}else{if(r)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let u=C.computeStrides(t.kernelShape);n.push({type:12,data:u},{type:12,data:t.pads},{type:12,data:t.strides}),s.push({name:"kernelStrides",type:"u32",length:u.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let l=t.pads.reduce((d,c)=>d+c);return[n,s,!!l,!1,!1]}},Qi=(e,t,r,i,a,n,s,u,l,d,c,f)=>{let h=a.format==="NHWC",_=t.type.value,g=H("output",t.type.tensor,i);if(a.kernelShape.length<=2){let $="",x="",y="",w=r-(h?2:1);if(c?$=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${w}] = indices[${w}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${w}] < 0 || xIndices[${w}]
                      >= uniforms.x_shape[${w}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${n}
                }`:$=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${w}] = indices[${w}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${n}
                }`,a.kernelShape.length===2){let k=r-(h?3:2);f?x=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${k}] = indices[${k}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${k}] < 0 || xIndices[${k}] >= uniforms.x_shape[${k}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:x=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${k}] = indices[${k}] * uniforms.sh - uniforms.phStart + j;
                `,y=`
              }
            `}return`
            ${e.registerUniforms(l).declareVariables(t,g)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${g.offsetToIndices("global_idx")};
              var xIndices = ${g.offsetToIndices("global_idx")};

              var value = ${_}(${u});
              var pad = 0;
              ${x}
              ${$}
              ${y}
              ${s}

              output[global_idx] = value;
            }`}else{if(h)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let $=a.kernelShape.length,x=a.pads.length,y="";return d?y=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${n}
              }`:y=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${n}
            `,`
            ${e.registerUniforms(l).declareVariables(t,g)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${g.offsetToIndices("global_idx")};
              var xIndices = ${g.offsetToIndices("global_idx")};

              var offsets: array<u32, ${$}>;

              var value = ${_}(${u});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${$-1}u; j++) {
                  offsets[j] = offset / ${F("uniforms.kernelStrides","j",$)};
                  offset -= offsets[j] * ${F("uniforms.kernelStrides","j",$)};
                }
                offsets[${$-1}] = offset;

                isPad = false;
                for (var j = ${r-$}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${F("uniforms.strides",`j - ${r-$}u`,$)}
                    + offsets[j - ${r-$}u] - ${F("uniforms.pads","j - 2u",x)};
                  ${y}
              }
              ${s}

              output[global_idx] = value;
            }`}},Yi=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,dl=e=>`${Yi(e)};${e.countIncludePad}`,pl=e=>`${Yi(e)};${e.storageOrder};${e.dilations}`,Ji=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),ea=(e,t,r,i)=>{let[a,n]=Xi(t,i,r),s=B("x",t.dataType,t.dims.length),u=s.type.value,l="value += x_val;",d="";a.countIncludePad?d+=`value /= ${u}(uniforms.kernelSize);`:d+=`value /= ${u}(i32(uniforms.kernelSize) - pad);`;let[c,f,h,_,g]=Zi(n,a);c.push(...X(t.dims,n));let $=["rank"];return{name:e,shaderCache:{hint:`${i.cacheKey};${h};${_};${g}`,inputDependencies:$},getRunData:()=>({outputs:[{dims:n,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(C.size(n)/64)},programUniforms:c}),getShaderSource:x=>Qi(x,s,t.dims.length,n.length,a,l,d,0,f,h,_,g)}},Zc=e=>{let t=e.count_include_pad!==0,r=Ji(e);if(r.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");let i={countIncludePad:t,...r,cacheKey:""};return{...i,cacheKey:dl(i)}},Qc=(e,t)=>{Qt(e.inputs),e.compute(ea("AveragePool",e.inputs[0],!1,t))},ta={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},Yc=e=>{let t=e.format;return{format:t,...ta,cacheKey:t}},Jc=(e,t)=>{Qt(e.inputs),e.compute(ea("GlobalAveragePool",e.inputs[0],!0,t))},ra=(e,t,r,i)=>{let[a,n]=Xi(t,i,r),s=`
      value = max(x_val, value);
    `,u="",l=B("x",t.dataType,t.dims.length),d=["rank"],[c,f,h,_,g]=Zi(n,a);return c.push(...X(t.dims,n)),{name:e,shaderCache:{hint:`${i.cacheKey};${h};${_};${g}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:n,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(C.size(n)/64)},programUniforms:c}),getShaderSource:$=>Qi($,l,t.dims.length,n.length,a,s,u,t.dataType===10?-65504:-1e5,f,h,_,g)}},ef=(e,t)=>{Qt(e.inputs),e.compute(ra("MaxPool",e.inputs[0],!1,t))},tf=e=>{let t=e.storage_order,r=e.dilations,i=Ji(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(i.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");let a={storageOrder:t,dilations:r,...i,cacheKey:""};return{...a,cacheKey:pl(a)}},rf=e=>{let t=e.format;return{format:t,...ta,cacheKey:t}},af=(e,t)=>{Qt(e.inputs),e.compute(ra("GlobalMaxPool",e.inputs[0],!0,t))}}),cl,fl,nf,sf,hg=W(()=>{"use strict";ee(),ae(),we(),se(),cl=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[0].dataType===6&&e.length>2)throw new Error("In the case of dequantizing int32 there is no zero point.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((r,i)=>r===e[2].dims[i]).reduce((r,i)=>r&&i,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((a,n)=>n===t.axis||a===e[0].dims[n]).reduce((a,n)=>a&&n,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let r=e[0].dims[t.axis],i=e[1].dims[t.axis];if(t.blockSize<Math.ceil(r/i)||t.blockSize>Math.ceil(r/(i-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},fl=(e,t)=>{let r=C.normalizeAxis(t.axis,e[0].dims.length),i=e[0].dataType,a=i===3,n=e[0].dims,s=e[1].dataType,u=C.size(n),l=i===3||i===2,d=l?[Math.ceil(C.size(e[0].dims)/4)]:e[0].dims,c=e[1].dims,f=e.length>2?e[2]:void 0,h=f?l?[Math.ceil(C.size(f.dims)/4)]:f.dims:void 0,_=c.length===0||c.length===1&&c[0]===1,g=_===!1&&c.length===1,$=ye(u),x=_&&(!l||$===4),y=x?$:1,w=x&&!l?$:1,k=B("input",l?12:i,d.length,w),S=B("scale",s,c.length),I=f?B("zero_point",l?12:i,h.length):void 0,T=H("output",s,n.length,y),z=[k,S];I&&z.push(I);let A=[d,c];f&&A.push(h);let M=[{type:12,data:u/y},{type:12,data:r},{type:12,data:t.blockSize},...X(...A,n)],q=G=>{let P=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${G.registerUniforms(P).declareVariables(...z,T)}
      ${G.mainStart()}
          ${G.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${T.offsetToIndices("global_idx")};

          // Set input x
          ${l?`
            let input = ${k.getByOffset("global_idx / 4")};
            let x_vec = ${a?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${y===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${k.getByOffset("global_idx")};`};

          // Set scale input
          ${_?`let scale_value= ${S.getByOffset("0")}`:g?`
            let scale_index = ${T.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${S.getByOffset("scale_index")};`:`
            var scale_indices: ${S.type.indices} = output_indices;
            let index = ${S.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${S.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${S.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${I?_?l?`
                let zero_point_input = ${I.getByOffset("0")};
                let zero_point_vec =  ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${I.getByOffset("0")}`:g?l?`
                let zero_point_index = ${T.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${I.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${T.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${I.getByOffset("zero_point_index")};`:l?`
                let zero_point_offset = ${S.indicesToOffset("scale_indices")};
                let zero_point_input = ${I.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${I.getByIndices("scale_indices")};`:`let zero_point_value = ${l?a?"i32":"u32":k.type.value}(0);`};
      // Compute and write output
      ${T.setByOffset("global_idx",`${T.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:I?["rank","rank","rank"]:["rank","rank"]},getShaderSource:q,getRunData:()=>({outputs:[{dims:n,dataType:s}],dispatchGroup:{x:Math.ceil(u/y/64),y:1,z:1},programUniforms:M})}},nf=(e,t)=>{cl(e.inputs,t),e.compute(fl(e.inputs,t))},sf=e=>pe({axis:e.axis,blockSize:e.blockSize})}),hl,ml,of,mg=W(()=>{"use strict";Ge(),ee(),se(),hl=(e,t,r)=>{let i=e===t,a=e<t&&r<0,n=e>t&&r>0;if(i||a||n)throw new Error("Range these inputs' contents are invalid.")},ml=(e,t,r,i)=>{let a=Math.abs(Math.ceil((t-e)/r)),n=[a],s=a,u=[{type:12,data:s},{type:i,data:e},{type:i,data:r},...X(n)],l=d=>{let c=H("output",i,n.length),f=c.type.value,h=[{name:"outputSize",type:"u32"},{name:"start",type:f},{name:"delta",type:f}];return`
        ${d.registerUniforms(h).declareVariables(c)}
        ${d.mainStart()}
        ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${f}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${i}`},getShaderSource:l,getRunData:()=>({outputs:[{dims:n,dataType:i}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:u})}},of=e=>{let t=0,r=0,i=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],r=e.inputs[1].getInt32Array()[0],i=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],r=e.inputs[1].getFloat32Array()[0],i=e.inputs[2].getFloat32Array()[0]),fe.webgpu.validateInputContent&&hl(t,r,i),e.compute(ml(t,r,i,e.inputs[0].dataType),{inputs:[]})}}),gl,ia,aa,_l,uf,lf,gg=W(()=>{"use strict";ee(),ae(),we(),se(),gl=(e,t,r,i)=>{if(e!=="none"&&i!=="i32"&&i!=="u32"&&i!=="f32")throw new Error(`Input ${i} is not supported with reduction ${e}.`);let a=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,n=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case"none":return`${t}=${r};`;case"add":return i==="i32"||i==="u32"?`atomicAdd(&${t}, bitcast<${i}>(${r}));`:`
              ${a}bitcast<${i}>(oldValue) + (${r})${n}`;case"max":return i==="i32"||i==="u32"?`atomicMax(&${t}, bitcast<${i}>(${r}));`:`
                ${a}max(bitcast<f32>(oldValue), (${r}))${n}`;case"min":return i==="i32"||i==="u32"?`atomicMin(&${t}, bitcast<${i}>(${r}));`:`${a}min(bitcast<${i}>(oldValue), (${r}))${n}`;case"mul":return`${a}(bitcast<${i}>(oldValue) * (${r}))${n}`;default:throw new Error(`Reduction ${e} is not supported.`)}},ia=(e,t)=>`${e===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[${t?"i - indices_start":"i"}];
    let dim_value = uniforms.output_shape[${t?"i - indices_start":"i"} + uniforms.last_index_dimension];`}
    
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));`,aa=(e,t,r)=>`for (var i = 0u; i < uniforms.num_updates_elements; i++) {
        let value = updates[uniforms.num_updates_elements * ${r?"global_idx":"idx"} + i];
        ${gl(e.reduction,"output[data_offset + i]","value",t)}
      }`,_l=(e,t)=>{let r=e[0].dims,i=e[1].dims,a=r,n=1,s=Math.ceil(C.size(i)/n),u=i[i.length-1],l=C.sizeFromDimension(r,u),d=C.sizeFromDimension(i,0)/u,c=[{type:12,data:s},{type:12,data:u},{type:12,data:l},...X(e[1].dims,e[2].dims,a)],f=h=>{let _=B("indices",e[1].dataType,e[1].dims.length),g=B("updates",e[2].dataType,e[2].dims.length,n),$=t.reduction!=="none"&&t.reduction!==""?Nd("output",e[0].dataType,a.length):H("output",e[0].dataType,a.length,n);return`
      ${h.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(_,g,$)}
      ${h.mainStart()}
        ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var hasDuplicates = false;
  if (${t.reduction==="none"}) {
    for (var i = 0; i < ${d}; i = i + 1) {
      for (var j = i + 1; j < ${d}; j = j + 1) {
        var index_i = i32(indices[i].x);
        var index_j = i32(indices[j].x);
        if (index_i == index_j) {
          hasDuplicates = true;
          break;
        }
      }
      if (hasDuplicates) {
        break;
      }
    }
  }

  if (${t.reduction==="none"} && hasDuplicates) {
    if (global_idx != 0u) {
      return;
    }
    // Process each index-update pair individually when duplicates exist
    for (var idx = 0u; idx < ${d}u; idx++) {
      var data_offset = 0u;
      for (var i = 0u; i < uniforms.last_index_dimension; i++) {
        var index = i32(indices[idx * uniforms.last_index_dimension + i].x);
        ${ia(r.length,!1)}
      }
      ${aa(t,$.type.value,!1)}
    }
    return;
  }

  var data_offset = 0u;
  var indices_start = uniforms.last_index_dimension * global_idx;
  var indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${ia(r.length,!0)}
  }
  ${aa(t,$.type.value,!0)}
  }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:c}),getShaderSource:f}},uf=e=>pe({reduction:e.reduction}),lf=(e,t)=>{e.compute(_l(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),yl,bl,wl,na,$l,vl,xl,Sl,kl,Il,Tl,El,sa,zl,Cl,Al,Ol,Rl,df,pf,_g=W(()=>{"use strict";ee(),ae(),we(),se(),yl=(e,t)=>{if(e.every(r=>r>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},bl=(e,t,r)=>{t.every(a=>a>=0&&a<r||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let i=new Array(r).fill(1);return t.forEach((a,n)=>i[a]=e[n]),i},wl=(e,t,r,i,a,n)=>{let[s,u,l]=r>10?[1,2,3]:[-1,e.length>1?1:-1,-1],d=e[0].dims.length;if(s>0&&e.length>s&&e[s].dims.length>0)e[s].getFloat32Array().forEach(c=>n.push(c));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(u>0&&e.length>u&&e[u].dims.length===1&&e[u].dims[0]>0){if(e[u].getFloat32Array().forEach(c=>i.push(c)),i.length!==0&&i.length!==d&&r>=18&&i.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");yl(i,t),t.axes.length>0&&bl(i,t.axes,d).forEach((c,f)=>i[f]=c)}if(l>0&&e.length>l&&e[l].dims.length===1&&e[l].dims[0]>0&&(e[l].getBigInt64Array().forEach(c=>a.push(Number(c))),a.length!==0&&a.length!==d&&r>=18&&a.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(i.length!==0&&i.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(a.length!==0&&a.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof i<"u"&&typeof a<"u"&&i.length>0&&a.length>d)throw new Error("Resize requires only of scales or sizes to be specified")},na=(e,t,r,i)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${i}(big / (${r}));
  let fract = ${i}(big % (${r})) / ${i}(${r});
  return whole + fract;
`,$l=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${na("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${na("xResized","lengthOriginal - 1","lengthResized - 1",t)}
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",vl=(e,t,r)=>`fn getNearestPixelFromOriginal(xOriginal: ${r}, isDownSample: bool) -> ${r} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";case"simple":default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",xl=(e,t,r)=>{let i=new Array(r).fill(0).concat(new Array(r).fill(1)),a=e.length===0?i:e.slice();return t.length>0?(t.forEach((n,s)=>{i[n]=a[s],i[s+r]=a[t.length+s]}),i):a},Sl=(e,t,r,i)=>{let a=[];if(r.length>0)if(i.length>0){if(e.forEach(n=>a.push(n)),Math.max(...i)>e.length)throw new Error("axes is out of bound");i.forEach((n,s)=>a[n]=r[s])}else r.forEach(n=>a.push(n));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");a=e.map((n,s)=>Math.round(n*t[s]))}return a},kl=(e,t,r)=>{let i=(()=>{switch(r.keepAspectRatioPolicy){case"not_larger":return r.axes.length>0?Math.min(...r.axes.map(n=>t[n]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return r.axes.length>0?Math.max(...r.axes.map(n=>t[n]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${r.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let a=e.slice();return r.axes.length>0?(r.axes.forEach(n=>t[n]=i),r.axes.forEach(n=>a[n]=Math.round(e[n]*t[n]))):(t.fill(i,0,t.length),a.forEach((n,s)=>a[s]=Math.round(n*t[s]))),a},Il=(e,t,r,i,a)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${r.length}> {
      var original_indices: array<${e.type.value}, ${r.length}>;
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${F("uniforms.scales","i",i)};
        var roi_low = ${F("uniforms.roi","i",a)};
        var roi_hi = ${F("uniforms.roi",`i + ${t.length}`,a)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${F("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${F("uniforms.output_shape","i",r.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,Tl=(e,t,r,i,a,n,s)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${i.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${F("uniforms.scales","i",a)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${F("uniforms.roi","i",n)};
          var roi_hi = ${F("uniforms.roi",`i + ${r.length}`,n)};
          var input_shape_i = ${F("uniforms.input_shape","i",r.length)};
          var output_shape_i = ${F("uniforms.output_shape","i",i.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${s} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet("input_indices","i","input_index")}
      }
      return input_indices;
    }`,El=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${F("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,sa=(e,t,r,i)=>e.rank>i?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",r,"batch")};
`:"",zl=(e,t,r,i,a)=>{let[n,s,u,l]=r.length===2?[-1,0,1,-1]:[0,2,3,1],d=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${d} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(row, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(col, ${r[u]} - 1))`)};
      ${sa(e,l,n,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${d} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${d} = originalIndices[${s}];
      var col:${d} = originalIndices[${u}];
      ${i?`if (row < 0 || row > (${r[s]} - 1) || col < 0 || col > (${r[u]} - 1)) {
        return ${a};
      }`:""};
      row = max(0, min(row, ${r[s]} - 1));
      col = max(0, min(col, ${r[u]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${r.length>2?`u32(originalIndices[${l}])`:"0"};
      var batch: u32 =  ${r.length>2?`u32(originalIndices[${n}])`:"0"};
      var x11: ${d} = getInputValue(batch, channel, row1, col1);
      var x12: ${d} = getInputValue(batch, channel, row1, col2);
      var x21: ${d} = getInputValue(batch, channel, row2, col1);
      var x22: ${d} = getInputValue(batch, channel, row2, col2);
      var dx1: ${d} = abs(row - ${d}(row1));
      var dx2: ${d} = abs(${d}(row2) - row);
      var dy1: ${d} = abs(col - ${d}(col1));
      var dy2: ${d} = abs(${d}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},Cl=(e,t,r,i,a,n,s,u,l,d)=>{let c=r.length===2,f=!0,[h,_]=c?[0,1]:f?[2,3]:[1,2],g=e.type.value,$=x=>{let y=x===h?"row":"col";return`
      fn ${y}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${g} {
        var output_index = ${t.indicesGet("output_indices",x)};
        var originalIdx: ${g} = getOriginalCoordinateFromResizedCoordinate(output_index, ${a[x]},
        ${i[x]}, ${r[x]}, ${n[x]}, ${n[x]} + ${r.length});
        var fractOriginalIdx: ${g} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${u} && (originalIdx < 0 || originalIdx > (${r[x]} - 1))) {
          return ${l};
        }
        var data: array<${g}, 4> = array<${g}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${y}: ${g} = originalIdx + ${g}(i);
          if (${y} < 0 || ${y} >= ${r[x]}) {
            ${d?`coefs[i + 1] = 0.0;
                        continue;`:u?`return ${l};`:`${y} = max(0, min(${y}, ${r[x]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",x,`u32(${y})`)};
          data[i + 1] = ${x===h?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${$(h)};
    ${$(_)};
  fn getCubicInterpolationCoefs(s: ${g}) -> array<${g}, 4> {
    var absS = abs(s);
    var coeffs: array<${g}, 4> = array<${g}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${g} = 1.0 - absS;
    var twoMinusAbsS: ${g} = 2.0 - absS;
    var onePlusAbsS: ${g} = 1.0 + absS;
    coeffs[0] = ((${s} * onePlusAbsS - 5 * ${s}) * onePlusAbsS + 8 * ${s}) * onePlusAbsS - 4 * ${s};
    coeffs[1] = ((${s} + 2) * absS - (${s} + 3)) * absS * absS + 1;
    coeffs[2] = ((${s} + 2) * oneMinusAbsS - (${s} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${s} * twoMinusAbsS - 5 * ${s}) * twoMinusAbsS + 8 * ${s}) * twoMinusAbsS - 4 * ${s};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${g}, 4>, coefs: array<${g}, 4>) -> ${g} {
    var coefsSum: ${g} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${g} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},Al=(e,t,r,i,a)=>{let[n,s,u,l,d]=r.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],c=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${c} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(depth, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(height, ${r[u]} - 1))`)};
      ${e.indicesSet("input_indices",l,`max(0, min(width, ${r[l]} - 1))`)};
      ${sa(e,d,n,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${c} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${c} = originalIndices[${s}];
      var height:${c} = originalIndices[${u}];
      var width:${c} = originalIndices[${l}];
      ${i?`if (depth < 0 || depth > (${r[s]} - 1) || height < 0 || height > (${r[u]} - 1) || width < 0 || (width > ${r[l]} - 1)) {
      return ${a};
        }`:""};

    depth = max(0, min(depth, ${r[s]} - 1));
      height = max(0, min(height, ${r[u]} - 1));
      width = max(0, min(width, ${r[l]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${r.length>3?`u32(originalIndices[${d}])`:"0"};
      var batch: u32 =  ${r.length>3?`u32(originalIndices[${n}])`:"0"};

      var x111: ${c} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${c} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${c} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${c} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${c} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${c} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${c} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${c} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${c} = abs(depth - ${c}(depth1));
      var dx2: ${c} = abs(${c}(depth2) - depth);
      var dy1: ${c} = abs(height - ${c}(height1));
      var dy2: ${c} = abs(${c}(height2) - height);
      var dz1: ${c} = abs(width - ${c}(width1));
      var dz2: ${c} = abs(${c}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},Ol=(e,t,r,i,a,n)=>{let s=e.dims,u=xl(n,t.axes,s.length),l=Sl(s,i,a,t.axes),d=i.slice();i.length===0&&(d=s.map((w,k)=>w===0?1:l[k]/w),t.keepAspectRatioPolicy!=="stretch"&&(l=kl(s,d,t)));let c=H("output",e.dataType,l.length),f=B("input",e.dataType,s.length),h=C.size(l),_=s.length===l.length&&s.every((w,k)=>w===l[k]),g=t.coordinateTransformMode==="tf_crop_and_resize",$=t.extrapolationValue,x=f.type.value,y=w=>`
      ${_?"":`
      ${$l(t.coordinateTransformMode,x)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${El(f,s)};
              ${vl(t.nearestMode,r,x)};
              ${Tl(f,c,s,l,d.length,u.length,g)};
              `;case"linear":return`
              ${Il(c,s,l,d.length,u.length)};
              ${(()=>{if(s.length===2||s.length===4)return`${zl(f,c,s,g,$)}`;if(s.length===3||s.length===5)return`${Al(f,c,s,g,$)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(s.length===2||s.length===4)return`${Cl(f,c,s,l,d,u,t.cubicCoeffA,g,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${w.registerUniform("output_size","u32").registerUniform("scales","f32",d.length).registerUniform("roi","f32",u.length).declareVariables(f,c)}
      ${w.mainStart()}
        ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${_?"output[global_idx] = input[global_idx];":`
        let output_indices = ${c.offsetToIndices("global_idx")};
        var input_indices: ${f.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${f.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${s.length===2||s.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${r}|${d.length>0?t.mode==="cubic"?d:d.length:""}|${a.length>0?a:""}|${u.length>0?u:""}|${_}|${t.mode==="nearest"?s.length:s}`,inputDependencies:["rank"]},getShaderSource:y,getRunData:()=>({outputs:[{dims:l,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:[{type:12,data:h},{type:1,data:d},{type:1,data:u},...X(s,l)]})}},Rl=e=>{let t=e.customDataBuffer;return new Uint32Array(t,t.byteOffset,1)[0]},df=(e,t)=>{let r=[],i=[],a=[],n=Rl(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");wl(e.inputs,t,n,r,i,a),e.compute(Ol(e.inputs[0],t,n,r,i,a),{inputs:[0]})},pf=e=>{let t=e.antialias,r=e.axes,i=e.coordinateTransformMode,a=e.cubicCoeffA,n=e.excludeOutside!==0,s=e.extrapolationValue,u=e.keepAspectRatioPolicy,l=e.mode,d=e.nearestMode===""?"simple":e.nearestMode;return pe({antialias:t,axes:r,coordinateTransformMode:i,cubicCoeffA:a,excludeOutside:n,extrapolationValue:s,keepAspectRatioPolicy:u,mode:l,nearestMode:d})}}),Bl,Ml,cf,yg=W(()=>{"use strict";ee(),ae(),se(),Bl=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],r=e[1],i=e[2];if(t.dataType!==r.dataType||t.dataType!==i.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(r.dims.length!==3&&r.dims.length!==2)throw new Error("Skip must be 2D or 3D");let a=t.dims[t.dims.length-1],n=t.dims[t.dims.length-2];if(r.dims[r.dims.length-1]!==a)throw new Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==n)throw new Error("Skip must have the same sequence length as input");if(i.dims.length!==1)throw new Error("Gamma must be 1D");if(i.dims[i.dims.length-1]!==a)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let s=e[3];if(s.dims.length!==1)throw new Error("Beta must be 1D");if(s.dims[s.dims.length-1]!==a)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let s=e[4];if(s.dims.length!==1)throw new Error("Bias must be 1D");if(s.dims[s.dims.length-1]!==a)throw new Error("Bias must have the same hidden size as input")}},Ml=(e,t,r,i)=>{let a=t.simplified,n=e[0].dims,s=C.size(n),u=n,l=s,d=n.slice(-1)[0],c=i?n.slice(0,-1).concat(1):[],f=!a&&e.length>3,h=e.length>4,_=i&&r>1,g=i&&r>2,$=r>3,x=64,y=ye(d),w=[{type:12,data:l},{type:12,data:y},{type:12,data:d},{type:1,data:t.epsilon}],k=I=>{let T=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],z=[B("x",e[0].dataType,e[0].dims,y),B("skip",e[1].dataType,e[1].dims,y),B("gamma",e[2].dataType,e[2].dims,y)];f&&z.push(B("beta",e[3].dataType,e[3].dims,y)),h&&z.push(B("bias",e[4].dataType,e[4].dims,y)),z.push(H("output",e[0].dataType,u,y)),_&&z.push(H("mean_output",1,c)),g&&z.push(H("inv_std_output",1,c)),$&&z.push(H("input_skip_bias_sum",e[0].dataType,u,y));let A=xe(e[0].dataType),M=xe(1,y);return`

      ${I.registerUniforms(T).declareVariables(...z)}
      var<workgroup> sum_shared : array<${M}, ${x}>;
      var<workgroup> sum_squared_shared : array<${M}, ${x}>;

      ${I.mainStart([x,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${x};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${x};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${x-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${h?"bias[offset1d + i]":A+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${$?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${Mt(A,y,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${x};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${ft("sum",y)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${ft("square_sum",y)} / f32(uniforms.hidden_size) ${a?"":"- mean * mean"} + uniforms.epsilon);
        ${_?"mean_output[global_idx] = mean;":""}
        ${g?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${a?"":`- ${A}(mean)`}) *
            ${A}(inv_std_dev) * gamma[offset1d + i]
            ${f?"+ beta[offset1d + i]":""};
        }
      }`},S=[{dims:u,dataType:e[0].dataType}];return r>1&&S.push({dims:c,dataType:1}),r>2&&S.push({dims:c,dataType:1}),r>3&&S.push({dims:n,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${y};${_};${g};${$}`,inputDependencies:e.map((I,T)=>"type")},getShaderSource:k,getRunData:()=>({outputs:S,dispatchGroup:{x:Math.ceil(l/d)},programUniforms:w})}},cf=(e,t)=>{Bl(e.inputs);let r=[0];e.outputCount>1&&r.push(-3),e.outputCount>2&&r.push(-3),e.outputCount>3&&r.push(3),e.compute(Ml(e.inputs,t,e.outputCount,!1),{outputs:r})}}),Nl,Yt,Dl,oa,Pl,Ul,ff,hf,bg=W(()=>{"use strict";ee(),ae(),we(),se(),Nl=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((r,i)=>{if(e[i+1].dataType!==6&&e[i+1].dataType!==7)throw new Error(`Input ${i} must be an array of int32 or int64`)})},Yt=(e,t)=>{let r=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(i=>r.push(Number(i)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(i=>r.push(Number(i)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return r},Dl=(e,t)=>{if(e.length>1){let r=Yt(e,1),i=Yt(e,2),a=Yt(e,3);return a.length===0&&(a=[...Array(e[0].dims.length).keys()]),pe({starts:r,ends:i,axes:a})}else return t},oa=(e,t,r,i,a)=>{let n=e;return e<0&&(n+=r[i[t]]),a[t]<0?Math.max(0,Math.min(n,r[i[t]]-1)):Math.max(0,Math.min(n,r[i[t]]))},Pl=(e,t,r)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${r.length}; i >= 0; i--) {
            let input_shape_i = ${F("uniforms.input_shape","i",r.length)};
            let steps_i = ${F("uniforms.steps","i",r.length)};
            let signs_i = ${F("uniforms.signs","i",r.length)};
            let starts_i = ${F("uniforms.starts","i",r.length)};
            var output_index = ${t.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`,Ul=(e,t)=>{let r=e[0].dims,i=C.size(r),a=t.axes.length>0?C.normalizeAxes(t.axes,r.length):[...Array(r.length).keys()],n=Yt(e,4);n.forEach(y=>y!==0||(()=>{throw new Error("step cannot be 0")})),n.length===0&&(n=Array(a.length).fill(1));let s=t.starts.map((y,w)=>oa(y,w,r,a,n)),u=t.ends.map((y,w)=>oa(y,w,r,a,n));if(a.length!==s.length||a.length!==u.length)throw new Error("start, ends and axes should have the same number of elements");if(a.length!==r.length)for(let y=0;y<r.length;++y)a.includes(y)||(s.splice(y,0,0),u.splice(y,0,r[y]),n.splice(y,0,1));let l=n.map(y=>Math.sign(y));n.forEach((y,w,k)=>{if(y<0){let S=(u[w]-s[w])/y,I=s[w],T=I+S*n[w];s[w]=T,u[w]=I,k[w]=-y}});let d=r.slice(0);a.forEach((y,w)=>{d[y]=Math.ceil((u[y]-s[y])/n[y])});let c={dims:d,dataType:e[0].dataType},f=H("output",e[0].dataType,d.length),h=B("input",e[0].dataType,e[0].dims.length),_=C.size(d),g=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:s.length},{name:"signs",type:"i32",length:l.length},{name:"steps",type:"u32",length:n.length}],$=[{type:12,data:_},{type:12,data:s},{type:6,data:l},{type:12,data:n},...X(e[0].dims,d)],x=y=>`
      ${y.registerUniforms(g).declareVariables(h,f)}
        ${Pl(h,f,r)}
        ${y.mainStart()}
          ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${f.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${f.setByOffset("global_idx",h.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${l.length}_${s.length}_${n.length}`,inputDependencies:["rank"]},getShaderSource:x,getRunData:()=>({outputs:[c],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:$})}},ff=(e,t)=>{Nl(e.inputs,t);let r=Dl(e.inputs,t);e.compute(Ul(e.inputs,r),{inputs:[0]})},hf=e=>{let t=e.starts,r=e.ends,i=e.axes;return pe({starts:t,ends:r,axes:i})}}),ql,Wl,mf,gf,wg=W(()=>{"use strict";ee(),ae(),we(),ht(),se(),ql=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},Wl=(e,t)=>{let r=e.inputs[0],i=r.dims,a=C.size(i),n=i.length,s=C.normalizeAxis(t.axis,n),u=s<i.length-1,l,d=[];u?(d=Array.from({length:n},(z,A)=>A),d[s]=n-1,d[n-1]=s,l=e.compute(Re(r,d),{inputs:[r],outputs:[-1]})[0]):l=r;let c=l.dims,f=c[n-1],h=a/f,_=ye(f),g=f/_,$=64;h===1&&($=256);let x=(z,A)=>A===4?`max(max(${z}.x, ${z}.y), max(${z}.z, ${z}.w))`:A===2?`max(${z}.x, ${z}.y)`:A===3?`max(max(${z}.x, ${z}.y), ${z}.z)`:z,y=B("x",l.dataType,l.dims,_),w=H("result",l.dataType,l.dims,_),k=y.type.value,S=xe(l.dataType)==="f32"?`var threadMax = ${k}(-3.402823e+38f);`:`var threadMax = ${k}(-65504.0h);`,I=z=>`
      var<workgroup> rowMaxShared : ${k};
      var<workgroup> rowSumShared : ${k};
      var<workgroup> threadShared : array<${k}, ${$}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${k} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${k}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${z.registerUniform("packedCols","i32").declareVariables(y,w)}
      ${z.mainStart($)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${$};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${S}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${k}(${x("threadShared[0]",_)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${k}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${k}(${ft("threadShared[0]",_)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          let value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          setValue(row, col, row_stride, value);
        }
      }`,T=e.compute({name:"Softmax",shaderCache:{hint:`${_};${$}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:c,dataType:l.dataType}],dispatchGroup:{x:h},programUniforms:[{type:6,data:g}]}),getShaderSource:I},{inputs:[l],outputs:[u?-1:0]})[0];u&&e.compute(Re(T,d),{inputs:[T]})},mf=(e,t)=>{ql(e.inputs),Wl(e,t)},gf=e=>pe({axis:e.axis})}),ua,Ll,Vl,jl,_f,$g=W(()=>{"use strict";ee(),ae(),se(),ua=e=>Array.from(e.getBigInt64Array(),Number),Ll=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(ua(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},Vl=(e,t)=>{let r=[];for(let i=0;i<e.length;++i)r.push(e[i]*t[i]);return r},jl=(e,t)=>{let r=e[0].dims,i=t??ua(e[1]),a=Vl(r,i),n=C.size(a),s=e[0].dataType,u=B("input",s,r.length),l=H("output",s,a.length),d=c=>`
      const inputShape = ${u.indices(...r)};
      ${c.registerUniform("output_size","u32").declareVariables(u,l)}
      ${c.mainStart()}
      ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${l.offsetToIndices("global_idx")};
      var input_indices: ${u.type.indices};
      for (var i = 0; i < ${r.length}; i++) {
        let input_dim_i = ${u.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${l.indicesGet("output_indices","i")}  % input_dim_i;

        ${u.indicesSet("input_indices","i","input_dim_value")}
      }
      ${l.setByOffset("global_idx",u.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${i}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:[{type:12,data:n},...X(e[0].dims,a)]}),getShaderSource:d}},_f=e=>{Ll(e.inputs),e.compute(jl(e.inputs),{inputs:[0]})}}),Gl,Hl,yf,vg=W(()=>{"use strict";ee(),ae(),se(),Gl=(e,t,r,i,a)=>{let n=H("output_data",a,r.length,4),s=B("a_data",t[1].dataType,t[1].dims.length,4),u=B("b_data",t[2].dataType,t[2].dims.length,4),l=B("c_data",t[0].dataType,t[0].dims.length,4),d,c=(f,h,_)=>`select(${h}, ${f}, ${_})`;if(!i)d=n.setByOffset("global_idx",c(s.getByOffset("global_idx"),u.getByOffset("global_idx"),l.getByOffset("global_idx")));else{let f=(h,_,g="")=>{let $=`a_data[index_a${_}][component_a${_}]`,x=`b_data[index_b${_}][component_b${_}]`,y=`bool(c_data[index_c${_}] & (0xffu << (component_c${_} * 8)))`;return`
            let output_indices${_} = ${n.offsetToIndices(`global_idx * 4u + ${_}u`)};
            let offset_a${_} = ${s.broadcastedIndicesToOffset(`output_indices${_}`,n)};
            let offset_b${_} = ${u.broadcastedIndicesToOffset(`output_indices${_}`,n)};
            let offset_c${_} = ${l.broadcastedIndicesToOffset(`output_indices${_}`,n)};
            let index_a${_} = offset_a${_} / 4u;
            let index_b${_} = offset_b${_} / 4u;
            let index_c${_} = offset_c${_} / 4u;
            let component_a${_} = offset_a${_} % 4u;
            let component_b${_} = offset_b${_} % 4u;
            let component_c${_} = offset_c${_} % 4u;
            ${h}[${_}] = ${g}(${c($,x,y)});
          `};a===9?d=`
            var data = vec4<u32>(0);
            ${f("data",0,"u32")}
            ${f("data",1,"u32")}
            ${f("data",2,"u32")}
            ${f("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:d=`
            ${f("output_data[global_idx]",0)}
            ${f("output_data[global_idx]",1)}
            ${f("output_data[global_idx]",2)}
            ${f("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(l,s,u,n)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${d}
      }`},Hl=e=>{let t=e[1].dims,r=e[2].dims,i=e[0].dims,a=e[1].dataType,n=!(C.areEqual(t,r)&&C.areEqual(r,i)),s=t,u=C.size(t);if(n){let d=Nt.calcShape(Nt.calcShape(t,r,!1),i,!1);if(!d)throw new Error("Can't perform where op on the given tensors");s=d,u=C.size(s)}let l=Math.ceil(u/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:d=>Gl(d,e,s,n,a),getRunData:()=>({outputs:[{dims:s,dataType:a}],dispatchGroup:{x:Math.ceil(u/64/4)},programUniforms:[{type:12,data:l},...X(i,t,r,s)]})}},yf=e=>{e.compute(Hl(e.inputs))}}),bf,xg=W(()=>{"use strict";Dm(),ja(),Pm(),Um(),qm(),Wm(),Lm(),Fm(),Xm(),Zm(),Qm(),Ym(),Jm(),eg(),tg(),rg(),ig(),ag(),ng(),sg(),og(),ug(),lg(),dg(),pg(),Dc(),cg(),fg(),hg(),mg(),gg(),Va(),_g(),Lc(),yg(),bg(),wg(),qc(),$g(),ht(),Ga(),vg(),bf=new Map([["Abs",[pp]],["Acos",[cp]],["Acosh",[fp]],["Add",[Fp]],["ArgMax",[op,ba]],["ArgMin",[sp,ba]],["Asin",[hp]],["Asinh",[mp]],["Atan",[gp]],["Atanh",[_p]],["Attention",[up]],["AveragePool",[Qc,Zc]],["BatchNormalization",[lp]],["BiasAdd",[dp]],["BiasSplitGelu",[Hp]],["Cast",[bp,yp]],["Ceil",[$p]],["Clip",[wp]],["Concat",[ic,ac]],["Conv",[ka,Sa]],["ConvTranspose",[hc,fc]],["Cos",[vp]],["Cosh",[xp]],["CumSum",[mc,gc]],["DepthToSpace",[_c,yc]],["DequantizeLinear",[nf,sf]],["Div",[Kp]],["Einsum",[bc,wc]],["Elu",[Sp,ir]],["Equal",[Xp]],["Erf",[kp]],["Exp",[Ip]],["Expand",[$c]],["FastGelu",[vc]],["Floor",[Tp]],["FusedConv",[ka,Sa]],["Gather",[Sc,xc]],["GatherElements",[Cc,zc]],["GatherBlockQuantized",[Tc,Ec]],["GatherND",[kc,Ic]],["Gelu",[Ep]],["Gemm",[Oc,Ac]],["GlobalAveragePool",[Jc,Yc]],["GlobalMaxPool",[af,rf]],["Greater",[Jp]],["GreaterOrEqual",[tc]],["GridSample",[Rc,Bc]],["GroupQueryAttention",[Vc]],["HardSigmoid",[Np,Mp]],["InstanceNormalization",[jc]],["LayerNormalization",[Gc]],["LeakyRelu",[zp,ir]],["Less",[ec]],["LessOrEqual",[rc]],["Log",[jp]],["MatMul",[Hc]],["MatMulNBits",[Fc,Kc]],["MaxPool",[ef,tf]],["Mul",[Zp]],["MultiHeadAttention",[Nc,Mc]],["Neg",[Ap]],["Not",[Cp]],["Pad",[Xc]],["Pow",[Qp]],["QuickGelu",[Gp,ir]],["Range",[of]],["Reciprocal",[Op]],["ReduceMin",[tp]],["ReduceMean",[Zd]],["ReduceMax",[ep]],["ReduceSum",[ip]],["ReduceProd",[rp]],["ReduceL1",[Qd]],["ReduceL2",[Yd]],["ReduceLogSum",[np]],["ReduceLogSumExp",[Jd]],["ReduceSumSquare",[ap]],["Relu",[Rp]],["Resize",[df,pf]],["RotaryEmbedding",[Wc]],["ScatterND",[lf,uf]],["Sigmoid",[Bp]],["Sin",[Dp]],["Sinh",[Pp]],["Slice",[ff,hf]],["SkipLayerNormalization",[cf]],["Split",[Pc,Uc]],["Sqrt",[Up]],["Softmax",[mf,gf]],["Sub",[Yp]],["Tan",[qp]],["Tanh",[Wp]],["ThresholdedRelu",[Vp,ir]],["Tile",[_f]],["Transpose",[Pd,Ud]],["Where",[yf]]])}),wf,Sg=W(()=>{"use strict";Ge(),rt(),se(),wf=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,r,i,a){Qe(e.programInfo.name);let n=this.backend.device,s=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let u=[];for(let d of t)u.push({binding:u.length,resource:{buffer:d.buffer}});for(let d of r)u.push({binding:u.length,resource:{buffer:d.buffer}});a&&u.push({binding:u.length,resource:a});let l=n.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:u,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let d={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:l,dispatchGroup:i};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(d)}s.setPipeline(e.computePipeline),s.setBindGroup(0,l),s.dispatchWorkgroups(...i),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),je(e.programInfo.name)}dispose(){}build(e,t){Qe(e.name);let r=this.backend.device,i=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(d=>{r.features.has(d.feature)&&i.push(`enable ${d.extension};`)});let a=Dd(t,this.backend.device.limits),n=e.getShaderSource(a),s=`${i.join(`
`)}
${a.additionalImplementations}
${n}`,u=r.createShaderModule({code:s,label:e.name});ue("verbose",()=>`[WebGPU] ${e.name} shader code: ${s}`);let l=r.createComputePipeline({compute:{module:u,entryPoint:"main"},layout:"auto",label:e.name});return je(e.name),{programInfo:e,computePipeline:l,uniformVariablesInfo:a.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,r=typeof e=="number"?1:e.y||1,i=typeof e=="number"?1:e.z||1,a=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=a&&r<=a&&i<=a)return[t,r,i];let n=t*r*i,s=Math.ceil(Math.sqrt(n));if(s>a){if(s=Math.ceil(Math.cbrt(n)),s>a)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[s,s,s]}else return[s,s,1]}}}),$f={};Pt($f,{WebGpuBackend:()=>vf});var Fl,Kl,Xl,vf,kg=W(()=>{"use strict";Ge(),ee(),rt(),Od(),Mm(),xg(),Sg(),Fl=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let r=[];for(let i=0;i<e.length;++i){let a=e[i].dataType;switch(t[i]){case"none":{r.push("");break}case"type":{r.push(`${a}`);break}case"rank":{let n=e[i].dims.length;r.push(`${a};${n}`);break}case"dims":{let n=e[i].dims.join(",");r.push(`${a};${n}`);break}default:throw new Error(`unsupported input dependency: ${t[i]}`)}}return r.join("|")},Kl=(e,t,r)=>{let i=e.name;return e.shaderCache?.hint&&(i+="["+e.shaderCache.hint+"]"),i+=":"+r+`:${Fl(t,e.shaderCache?.inputDependencies??new Array(t.length).fill("dims"))}`,i},Xl=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},vf=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let r=[],i={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:r},a=n=>t.features.has(n)&&r.push(n)&&!0;a("chromium-experimental-timestamp-query-inside-passes")||a("timestamp-query"),a("shader-f16"),a("subgroups"),this.device=await t.requestDevice(i),this.adapterInfo=new Xl(t.info||await t.requestAdapterInfo()),this.gpuDataManager=Md(this),this.programManager=new wf(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,Ua(e.logLevel,!!e.debug),this.device.onuncapturederror=n=>{n.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${n.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!1}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose()}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;Qe(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{let t=new BigUint64Array(e.getMappedRange()),r=this.pendingQueries.get(e);for(let i=0;i<t.length/2;i++){let a=r[i],n=a.kernelId,s=this.kernels.get(n),u=s.kernelType,l=s.kernelName,d=a.programName,c=a.inputTensorViews,f=a.outputTensorViews,h=t[i*2],_=t[i*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=h);let g=Number(h-this.queryTimeBase),$=Number(_-this.queryTimeBase);if(!Number.isSafeInteger(g)||!Number.isSafeInteger($))throw new RangeError("incorrect timestamp range");if(this.env.webgpu.profiling?.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:c.map(x=>({dims:x.dims,dataType:tt(x.dataType)})),outputsMetadata:f.map(x=>({dims:x.dims,dataType:tt(x.dataType)})),kernelId:n,kernelType:u,kernelName:l,programName:d,startTime:g,endTime:$});else{let x="";c.forEach((w,k)=>{x+=`input[${k}]: [${w.dims}] | ${tt(w.dataType)}, `});let y="";f.forEach((w,k)=>{y+=`output[${k}]: [${w.dims}] | ${tt(w.dataType)}, `}),console.log(`[profiling] kernel "${n}|${u}|${l}|${d}" ${x}${y}execution time: ${$-g} ns`)}Pr("GPU",`${d}::${h}::${_}`)}e.unmap(),this.pendingQueries.delete(e)}),je()}run(e,t,r,i,a,n){Qe(e.name);let s=[];for(let w=0;w<t.length;++w){let k=t[w].data;if(k===0)continue;let S=this.gpuDataManager.get(k);if(!S)throw new Error(`no GPU data for input: ${k}`);s.push(S)}let{outputs:u,dispatchGroup:l,programUniforms:d}=e.getRunData(t),c=r.length===0?u.map((w,k)=>k):r;if(c.length!==u.length)throw new Error(`Output size ${c.length} must be equal to ${u.length}.`);let f=[],h=[];for(let w=0;w<u.length;++w){if(!Number.isInteger(c[w])||c[w]<-3||c[w]>=n)throw new Error(`Invalid output index: ${c[w]}`);if(c[w]===-3)continue;let k=c[w]===-1,S=c[w]===-2,I=k||S?a(u[w].dataType,u[w].dims):i(c[w],u[w].dataType,u[w].dims);if(f.push(I),I.data===0)continue;let T=this.gpuDataManager.get(I.data);if(!T)throw new Error(`no GPU data for output: ${I.data}`);if(k&&this.temporaryData.push(T),S){let z=this.kernelPersistentData.get(this.currentKernelId);z||(z=[],this.kernelPersistentData.set(this.currentKernelId,z)),z.push(T)}h.push(T)}if(s.length!==t.length||h.length!==f.length){if(h.length===0)return je(e.name),f;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let _;if(d){let w=0,k=[];d.forEach(z=>{let A=typeof z.data=="number"?[z.data]:z.data;if(A.length===0)return;let M=z.type===10?2:4,q,G;z.type===10?(G=A.length>4?16:A.length>2?8:A.length*M,q=A.length>4?16:M*A.length):(G=A.length<=2?A.length*M:16,q=16),w=Math.ceil(w/G)*G,k.push(w);let P=z.type===10?8:4;w+=A.length>4?Math.ceil(A.length/P)*q:A.length*M});let S=16;w=Math.ceil(w/S)*S;let I=new ArrayBuffer(w);d.forEach((z,A)=>{let M=k[A],q=typeof z.data=="number"?[z.data]:z.data;if(z.type===6)new Int32Array(I,M,q.length).set(q);else if(z.type===12)new Uint32Array(I,M,q.length).set(q);else if(z.type===10)new Uint16Array(I,M,q.length).set(q);else if(z.type===1)new Float32Array(I,M,q.length).set(q);else throw new Error(`Unsupported uniform type: ${tt(z.type)}`)});let T=this.gpuDataManager.create(w,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(T.buffer,0,I,0,w),this.gpuDataManager.release(T.id),_={offset:0,size:w,buffer:T.buffer}}let g=this.programManager.normalizeDispatchGroupSize(l),$=g[1]===1&&g[2]===1,x=Kl(e,t,$),y=this.programManager.getArtifact(x);if(y||(y=this.programManager.build(e,g),this.programManager.setArtifact(x,y),ue("info",()=>`[artifact] key: ${x}, programName: ${e.name}`)),d&&y.uniformVariablesInfo){if(d.length!==y.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${y.uniformVariablesInfo.length}, got ${d.length} in program "${y.programInfo.name}".`);for(let w=0;w<d.length;w++){let k=d[w],S=k.type,I=typeof k.data=="number"?1:k.data.length,[T,z]=y.uniformVariablesInfo[w];if(S!==T||I!==z)throw new Error(`Uniform variable ${w} mismatch: expect type ${T} with size ${z}, got type ${S} with size ${I} in program "${y.programInfo.name}".`)}}if(ue("info",()=>`[ProgramManager] run "${e.name}" (key=${x}) with ${g[0]}x${g[1]}x${g[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let w={kernelId:this.currentKernelId,programName:y.programInfo.name,inputTensorViews:t,outputTensorViews:f};this.pendingKernels.push(w),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(w)}return this.programManager.run(y,s,h,g,_),je(e.name),f}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,r,i){let a=bf.get(e);if(!a)throw new Error(`kernel not implemented: ${e}`);let n={kernelType:e,kernelName:i,kernelEntry:a[0],attributes:[a[1],r]};this.kernels.set(t,n)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let r of t)this.gpuDataManager.release(r.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,r){let i=this.kernels.get(e);if(!i)throw new Error(`kernel not created: ${e}`);let a=i.kernelType,n=i.kernelName,s=i.kernelEntry,u=i.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${a}] ${n}" is not allowed to be called recursively`);this.currentKernelId=e,u[0]&&(u[1]=u[0](u[1]),u[0]=void 0),ue("info",()=>`[WebGPU] Start to run kernel "[${a}] ${n}"...`);let l=this.env.debug;this.temporaryData=[];try{return l&&this.device.pushErrorScope("validation"),s(t,u[1]),0}catch(d){return r.push(Promise.resolve(`[WebGPU] Kernel "[${a}] ${n}" failed. ${d}`)),1}finally{l&&r.push(this.device.popErrorScope().then(d=>d?`GPU validation error for kernel "[${a}] ${n}": ${d.message}`:null));for(let d of this.temporaryData)this.gpuDataManager.release(d.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,r,i){let a=this.sessionExternalDataMapping.get(e);a||(a=new Map,this.sessionExternalDataMapping.set(e,a));let n=a.get(t),s=this.gpuDataManager.registerExternalBuffer(r,i,n);return a.set(t,[s,r]),s}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(r=>this.gpuDataManager.unregisterExternalBuffer(r[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,r){return async()=>{let i=await ga(this,e,t);return qa(i.buffer,r)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){this.queryType="none",(this.env.webgpu.profiling?.mode==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){ue("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){ue("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){ue("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),r=e.length;this.pendingKernels=[];for(let i=0;i<r;i++){let a=this.getComputePassEncoder(),n=e[i];this.writeTimestamp(this.pendingDispatchNumber*2),a.setPipeline(n.computePipeline),a.setBindGroup(0,n.bindGroup),a.dispatchWorkgroups(...n.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[i]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),xf={};Pt(xf,{init:()=>Sf});var Rr,Zl,Sf,Ig=W(()=>{"use strict";ee(),rt(),ae(),Bm(),Rr=class kf{constructor(t,r,i,a){this.module=t,this.dataType=r,this.data=i,this.dims=a}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=C.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=C.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=C.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=C.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(C.size(t)!==C.size(this.dims))throw new Error("Invalid new shape");return new kf(this.module,this.dataType,this.data,t)}},Zl=class{constructor(e,t,r){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo;let i=e.PTR_SIZE,a=r/e.PTR_SIZE,n=i===4?"i32":"i64";this.opKernelContext=Number(e.getValue(i*a++,n));let s=Number(e.getValue(i*a++,n));this.outputCount=Number(e.getValue(i*a++,n)),this.customDataOffset=Number(e.getValue(i*a++,"*")),this.customDataSize=Number(e.getValue(i*a++,n));let u=[];for(let l=0;l<s;l++){let d=Number(e.getValue(i*a++,n)),c=Number(e.getValue(i*a++,"*")),f=Number(e.getValue(i*a++,n)),h=[];for(let _=0;_<f;_++)h.push(Number(e.getValue(i*a++,n)));u.push(new Rr(e,d,c,h))}this.inputs=u}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){let r=t?.inputs?.map(s=>typeof s=="number"?this.inputs[s]:s)??this.inputs,i=t?.outputs??[],a=(s,u,l)=>new Rr(this.module,u,this.output(s,l),l),n=(s,u)=>{let l=xt(s,u);if(!l)throw new Error(`Unsupported data type: ${s}`);let d=l>0?this.backend.gpuDataManager.create(l).id:0;return new Rr(this.module,s,d,u)};return this.backend.run(e,r,i,a,n,this.outputCount)}output(e,t){let r=this.module.stackSave();try{let i=this.module.PTR_SIZE,a=i===4?"i32":"i64",n=this.module.stackAlloc((1+t.length)*i);this.module.setValue(n,t.length,a);for(let s=0;s<t.length;s++)this.module.setValue(n+i*(s+1),t[s],a);return this.module._JsepOutput(this.opKernelContext,e,n)}catch(i){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${i}`)}finally{this.module.stackRestore(r)}}},Sf=async(e,t,r,i)=>{let a=t.jsepInit;if(!a)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let n=(kg(),sr($f)).WebGpuBackend,s=new n;await s.initialize(r,i),a("webgpu",[s,u=>s.alloc(Number(u)),u=>s.free(u),(u,l,d,c=!1)=>{if(c)ue("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(u)}, dst=${Number(l)}, size=${Number(d)}`),s.memcpy(Number(u),Number(l));else{ue("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(u)}, gpuDataId=${Number(l)}, size=${Number(d)}`);let f=t.HEAPU8.subarray(Number(u>>>0),Number(u>>>0)+Number(d));s.upload(Number(l),f)}},async(u,l,d)=>{ue("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${u}, dataOffset=${l}, size=${d}`),await s.download(Number(u),()=>t.HEAPU8.subarray(Number(l)>>>0,Number(l+d)>>>0))},(u,l,d)=>s.createKernel(u,Number(l),d,t.UTF8ToString(t._JsepGetNodeName(Number(l)))),u=>s.releaseKernel(u),(u,l,d,c)=>{ue("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${d}, kernel=${u}, contextDataOffset=${l}`);let f=new Zl(t,s,Number(l));return s.computeKernel(Number(u),f,c)},()=>s.captureBegin(),()=>s.captureEnd(),()=>s.replay()])}else{let n=new Bd(r);a("webnn",[n,()=>n.reserveTensorId(),s=>n.releaseTensorId(s),async(s,u,l,d,c)=>n.ensureTensor(s,u,l,d,c),(s,u)=>{n.uploadTensor(s,u)},async(s,u)=>n.downloadTensor(s,u)])}}}),Ql,Qa,Ya,pt,Yl,la,Gr,Ja,en,da,tn,rn,an,If=W(()=>{"use strict";Am(),Om(),ee(),Tt(),Ba(),Ed(),Ql=(e,t)=>{ge()._OrtInit(e,t)!==0&&ce("Can't initialize onnxruntime.")},Qa=async e=>{Ql(e.wasm.numThreads,qr(e.logLevel))},Ya=async(e,t)=>{ge().asyncInit?.();{let r=(Ig(),sr(xf)).init;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");let i=e.webgpu.adapter;if(i){if(typeof i.limits!="object"||typeof i.features!="object"||typeof i.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let a=e.webgpu.powerPreference;if(a!==void 0&&a!=="low-power"&&a!=="high-performance")throw new Error(`Invalid powerPreference setting: "${a}"`);let n=e.webgpu.forceFallbackAdapter;if(n!==void 0&&typeof n!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${n}"`);if(i=await navigator.gpu.requestAdapter({powerPreference:a,forceFallbackAdapter:n}),!i)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}await r("webgpu",ge(),e,i)}if(t==="webnn"){if(typeof navigator>"u"||!navigator.ml)throw new Error("WebNN is not supported in current environment");await r("webnn",ge(),e)}}},pt=new Map,Yl=e=>{let t=ge(),r=t.stackSave();try{let i=t.PTR_SIZE,a=t.stackAlloc(2*i);t._OrtGetInputOutputCount(e,a,a+i)!==0&&ce("Can't get session input/output count.");let n=i===4?"i32":"i64";return[Number(t.getValue(a,n)),Number(t.getValue(a+i,n))]}finally{t.stackRestore(r)}},la=(e,t)=>{let r=ge(),i=r.stackSave(),a=0;try{let n=r.PTR_SIZE,s=r.stackAlloc(2*n);r._OrtGetInputOutputMetadata(e,t,s,s+n)!==0&&ce("Can't get session input/output metadata.");let u=Number(r.getValue(s,"*"));a=Number(r.getValue(s+n,"*"));let l=r.HEAP32[a/4];if(l===0)return[u,0];let d=r.HEAPU32[a/4+1],c=[];for(let f=0;f<d;f++){let h=Number(r.getValue(a+8+f*n,"*"));c.push(h!==0?r.UTF8ToString(h):Number(r.getValue(a+8+(f+d)*n,"*")))}return[u,l,c]}finally{r.stackRestore(i),a!==0&&r._OrtFree(a)}},Gr=e=>{let t=ge(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},Ja=async(e,t)=>{let r,i,a=ge();Array.isArray(e)?[r,i]=e:e.buffer===a.HEAPU8.buffer?[r,i]=[e.byteOffset,e.byteLength]:[r,i]=Gr(e);let n=0,s=0,u=0,l=[],d=[],c=[];try{if([s,l]=await Td(t),t?.externalData&&a.mountExternalData){let S=[];for(let I of t.externalData){let T=typeof I=="string"?I:I.path;S.push(Pa(typeof I=="string"?I:I.data).then(z=>{a.mountExternalData(T,z)}))}await Promise.all(S)}for(let S of t?.executionProviders??[])if((typeof S=="string"?S:S.name)==="webnn"){if(a.shouldTransferToMLTensor=!1,typeof S!="string"){let I=S,T=I?.context,z=I?.gpuDevice,A=I?.deviceType,M=I?.powerPreference;T?a.currentContext=T:z?a.currentContext=await a.webnnCreateMLContext(z):a.currentContext=await a.webnnCreateMLContext({deviceType:A,powerPreference:M})}else a.currentContext=await a.webnnCreateMLContext();break}n=await a._OrtCreateSession(r,i,s),a.webgpuOnCreateSession?.(n),n===0&&ce("Can't create a session."),a.jsepOnCreateSession?.(),a.currentContext&&(a.webnnRegisterMLContext(n,a.currentContext),a.currentContext=void 0,a.shouldTransferToMLTensor=!0);let[f,h]=Yl(n),_=!!t?.enableGraphCapture,g=[],$=[],x=[],y=[],w=[];for(let S=0;S<f;S++){let[I,T,z]=la(n,S);I===0&&ce("Can't get an input name."),d.push(I);let A=a.UTF8ToString(I);g.push(A),x.push(T===0?{name:A,isTensor:!1}:{name:A,isTensor:!0,type:tt(T),shape:z})}for(let S=0;S<h;S++){let[I,T,z]=la(n,S+f);I===0&&ce("Can't get an output name."),c.push(I);let A=a.UTF8ToString(I);$.push(A),y.push(T===0?{name:A,isTensor:!1}:{name:A,isTensor:!0,type:tt(T),shape:z});{if(_&&t?.preferredOutputLocation===void 0){w.push("gpu-buffer");continue}let M=typeof t?.preferredOutputLocation=="string"?t.preferredOutputLocation:t?.preferredOutputLocation?.[A]??"cpu";if(M!=="cpu"&&M!=="cpu-pinned"&&M!=="gpu-buffer"&&M!=="ml-tensor")throw new Error(`Not supported preferred output location: ${M}.`);if(_&&M!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${M}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);w.push(M)}}let k=null;return w.some(S=>S==="gpu-buffer"||S==="ml-tensor")&&(u=a._OrtCreateBinding(n),u===0&&ce("Can't create IO binding."),k={handle:u,outputPreferredLocations:w,outputPreferredLocationsEncoded:w.map(S=>ha(S))}),pt.set(n,[n,d,c,k,_,!1]),[n,g,$,x,y]}catch(f){throw d.forEach(h=>a._OrtFree(h)),c.forEach(h=>a._OrtFree(h)),u!==0&&a._OrtReleaseBinding(u)!==0&&ce("Can't release IO binding."),n!==0&&a._OrtReleaseSession(n)!==0&&ce("Can't release session."),f}finally{a._free(r),s!==0&&a._OrtReleaseSessionOptions(s)!==0&&ce("Can't release session options."),l.forEach(f=>a._free(f)),a.unmountExternalData?.()}},en=e=>{let t=ge(),r=pt.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[i,a,n,s,u]=r;s&&(u&&t._OrtClearBoundOutputs(s.handle)!==0&&ce("Can't clear bound outputs."),t._OrtReleaseBinding(s.handle)!==0&&ce("Can't release IO binding.")),t.jsepOnReleaseSession?.(e),t.webnnOnReleaseSession?.(e),t.webgpuOnReleaseSession?.(e),a.forEach(l=>t._OrtFree(l)),n.forEach(l=>t._OrtFree(l)),t._OrtReleaseSession(i)!==0&&ce("Can't release session."),pt.delete(e)},da=async(e,t,r,i,a,n,s=!1)=>{if(!e){t.push(0);return}let u=ge(),l=u.PTR_SIZE,d=e[0],c=e[1],f=e[3],h=f,_,g;if(d==="string"&&(f==="gpu-buffer"||f==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(s&&f!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${n} when enableGraphCapture is true.`);if(f==="gpu-buffer"){let y=e[2].gpuBuffer;g=xt(Rt(d),c);{let w=u.jsepRegisterBuffer;if(!w)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');_=w(i,n,y,g)}}else if(f==="ml-tensor"){let y=e[2].mlTensor;g=xt(Rt(d),c);let w=u.webnnRegisterMLTensor;if(!w)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');_=w(i,y,Rt(d),c)}else{let y=e[2];if(Array.isArray(y)){g=l*y.length,_=u._malloc(g),r.push(_);for(let w=0;w<y.length;w++){if(typeof y[w]!="string")throw new TypeError(`tensor data at index ${w} is not a string`);u.setValue(_+w*l,Ve(y[w],r),"*")}}else{let w=u.webnnIsGraphInput;if(d!=="string"&&w){let k=u.UTF8ToString(a);if(w(i,k)){let S=Rt(d);g=xt(S,c),h="ml-tensor";let I=u.webnnCreateTemporaryTensor,T=u.webnnUploadTensor;if(!I||!T)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let z=await I(i,S,c);T(z,new Uint8Array(y.buffer,y.byteOffset,y.byteLength)),_=z}else g=y.byteLength,_=u._malloc(g),r.push(_),u.HEAPU8.set(new Uint8Array(y.buffer,y.byteOffset,g),_)}else g=y.byteLength,_=u._malloc(g),r.push(_),u.HEAPU8.set(new Uint8Array(y.buffer,y.byteOffset,g),_)}}let $=u.stackSave(),x=u.stackAlloc(4*c.length);try{c.forEach((w,k)=>u.setValue(x+k*l,w,l===4?"i32":"i64"));let y=u._OrtCreateTensor(Rt(d),_,g,x,c.length,ha(h));y===0&&ce(`Can't create tensor for input/output. session=${i}, index=${n}.`),t.push(y)}finally{u.stackRestore($)}},tn=async(e,t,r,i,a,n)=>{let s=ge(),u=s.PTR_SIZE,l=pt.get(e);if(!l)throw new Error(`cannot run inference. invalid session id: ${e}`);let d=l[0],c=l[1],f=l[2],h=l[3],_=l[4],g=l[5],$=t.length,x=i.length,y=0,w=[],k=[],S=[],I=[],T=s.stackSave(),z=s.stackAlloc($*u),A=s.stackAlloc($*u),M=s.stackAlloc(x*u),q=s.stackAlloc(x*u);try{[y,w]=Id(n);for(let N=0;N<$;N++)await da(r[N],k,I,e,c[t[N]],t[N],_);for(let N=0;N<x;N++)await da(a[N],S,I,e,f[i[N]],$+i[N],_);for(let N=0;N<$;N++)s.setValue(z+N*u,k[N],"*"),s.setValue(A+N*u,c[t[N]],"*");for(let N=0;N<x;N++)s.setValue(M+N*u,S[N],"*"),s.setValue(q+N*u,f[i[N]],"*");if(h&&!g){let{handle:N,outputPreferredLocations:Z,outputPreferredLocationsEncoded:te}=h;if(c.length!==$)throw new Error(`input count from feeds (${$}) is expected to be always equal to model's input count (${c.length}).`);for(let L=0;L<$;L++){let Q=t[L];await s._OrtBindInput(N,c[Q],k[L])!==0&&ce(`Can't bind input[${L}] for session=${e}.`)}for(let L=0;L<x;L++){let Q=i[L];a[L]?.[3]?s._OrtBindOutput(N,f[Q],S[L],0)!==0&&ce(`Can't bind pre-allocated output[${L}] for session=${e}.`):s._OrtBindOutput(N,f[Q],0,te[Q])!==0&&ce(`Can't bind output[${L}] to ${Z[L]} for session=${e}.`)}pt.set(e,[d,c,f,h,_,!0])}s.jsepOnRunStart?.(d),s.webnnOnRunStart?.(d);let G;h?G=await s._OrtRunWithBinding(d,h.handle,x,M,y):G=await s._OrtRun(d,A,z,$,q,x,M,y),G!==0&&ce("failed to call OrtRun().");let P=[];for(let N=0;N<x;N++){let Z=Number(s.getValue(M+N*u,"*"));if(Z===S[N]){P.push(a[N]);continue}let te=s.stackSave(),L=s.stackAlloc(4*u),Q=!1,ie,J=0;try{s._OrtGetTensorData(Z,L,L+u,L+2*u,L+3*u)!==0&&ce(`Can't access output tensor data on index ${N}.`);let he=u===4?"i32":"i64",D=Number(s.getValue(L,he));J=s.getValue(L+u,"*");let j=s.getValue(L+u*2,"*"),re=Number(s.getValue(L+u*3,he)),O=[];for(let be=0;be<re;be++)O.push(Number(s.getValue(j+be*u,he)));s._OrtFree(j)!==0&&ce("Can't free memory for tensor dims.");let ne=O.reduce((be,ve)=>be*ve,1);ie=tt(D);let De=h?.outputPreferredLocations[i[N]];if(ie==="string"){if(De==="gpu-buffer"||De==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let be=[];for(let ve=0;ve<ne;ve++){let He=s.getValue(J+ve*u,"*"),qt=s.getValue(J+(ve+1)*u,"*"),Ee=ve===ne-1?void 0:qt-He;be.push(s.UTF8ToString(He,Ee))}P.push([ie,O,be,"cpu"])}else if(De==="gpu-buffer"&&ne>0){let be=s.jsepGetBuffer;if(!be)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let ve=be(J),He=xt(D,ne);if(He===void 0||!Na(ie))throw new Error(`Unsupported data type: ${ie}`);Q=!0,P.push([ie,O,{gpuBuffer:ve,download:s.jsepCreateDownloader(ve,He,ie),dispose:()=>{s._OrtReleaseTensor(Z)!==0&&ce("Can't release tensor.")}},"gpu-buffer"])}else if(De==="ml-tensor"&&ne>0){let be=s.webnnEnsureTensor,ve=s.webnnIsInt64Supported;if(!be||!ve)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(xt(D,ne)===void 0||!Da(ie))throw new Error(`Unsupported data type: ${ie}`);if(ie==="int64"&&!ve(e))throw new Error('preferredLocation "ml-tensor" for int64 output is not supported by current WebNN Context.');let He=await be(e,J,D,O,!1);Q=!0,P.push([ie,O,{mlTensor:He,download:s.webnnCreateMLTensorDownloader(J,ie),dispose:()=>{s.webnnReleaseTensorId(J),s._OrtReleaseTensor(Z)}},"ml-tensor"])}else{let be=Ma(ie),ve=new be(ne);new Uint8Array(ve.buffer,ve.byteOffset,ve.byteLength).set(s.HEAPU8.subarray(J,J+ve.byteLength)),P.push([ie,O,ve,"cpu"])}}finally{s.stackRestore(te),ie==="string"&&J&&s._free(J),Q||s._OrtReleaseTensor(Z),s.webnnOnRunEnd?.(d)}}return h&&!_&&(s._OrtClearBoundOutputs(h.handle)!==0&&ce("Can't clear bound outputs."),pt.set(e,[d,c,f,h,_,!1])),P}finally{s.stackRestore(T),k.forEach(G=>s._OrtReleaseTensor(G)),S.forEach(G=>s._OrtReleaseTensor(G)),I.forEach(G=>s._free(G)),y!==0&&s._OrtReleaseRunOptions(y),w.forEach(G=>s._free(G))}},rn=e=>{let t=ge(),r=pt.get(e);if(!r)throw new Error("invalid session id");let i=r[0],a=t._OrtEndProfiling(i);a===0&&ce("Can't get an profile file name."),t._OrtFree(a)},an=e=>{let t=[];for(let r of e){let i=r[2];!Array.isArray(i)&&"buffer"in i&&t.push(i.buffer)}return t}}),ct,Me,Ot,Jt,er,Br,pa,Mr,wt,$t,Jl,Tf,Ef,zf,Cf,Af,Of,Rf,Bf=W(()=>{"use strict";Ge(),If(),Tt(),Oa(),ct=()=>!!fe.wasm.proxy&&typeof document<"u",Ot=!1,Jt=!1,er=!1,Mr=new Map,wt=(e,t)=>{let r=Mr.get(e);r?r.push(t):Mr.set(e,[t])},$t=()=>{if(Ot||!Jt||er||!Me)throw new Error("worker not ready")},Jl=e=>{switch(e.data.type){case"init-wasm":Ot=!1,e.data.err?(er=!0,pa[1](e.data.err)):(Jt=!0,pa[0]()),Br&&(URL.revokeObjectURL(Br),Br=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=Mr.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}default:}},Tf=async()=>{if(!Jt){if(Ot)throw new Error("multiple calls to 'initWasm()' detected.");if(er)throw new Error("previous call to 'initWasm()' failed.");if(Ot=!0,ct())return new Promise((e,t)=>{Me?.terminate(),Sd().then(([r,i])=>{try{Me=i,Me.onerror=n=>t(n),Me.onmessage=Jl,pa=[e,t];let a={type:"init-wasm",in:fe};!a.in.wasm.wasmPaths&&(r||fa)&&(a.in.wasm.wasmPaths={wasm:new URL("ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href}),Me.postMessage(a),Br=r}catch(a){t(a)}},t)});try{await Ra(fe.wasm),await Qa(fe),Jt=!0}catch(e){throw er=!0,e}finally{Ot=!1}}},Ef=async e=>{if(ct())return $t(),new Promise((t,r)=>{wt("init-ep",[t,r]);let i={type:"init-ep",in:{epName:e,env:fe}};Me.postMessage(i)});await Ya(fe,e)},zf=async e=>ct()?($t(),new Promise((t,r)=>{wt("copy-from",[t,r]);let i={type:"copy-from",in:{buffer:e}};Me.postMessage(i,[e.buffer])})):Gr(e),Cf=async(e,t)=>{if(ct()){if(t?.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return $t(),new Promise((r,i)=>{wt("create",[r,i]);let a={type:"create",in:{model:e,options:{...t}}},n=[];e instanceof Uint8Array&&n.push(e.buffer),Me.postMessage(a,n)})}else return Ja(e,t)},Af=async e=>{if(ct())return $t(),new Promise((t,r)=>{wt("release",[t,r]);let i={type:"release",in:e};Me.postMessage(i)});en(e)},Of=async(e,t,r,i,a,n)=>{if(ct()){if(r.some(s=>s[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(a.some(s=>s))throw new Error("pre-allocated output tensor is not supported for proxy.");return $t(),new Promise((s,u)=>{wt("run",[s,u]);let l=r,d={type:"run",in:{sessionId:e,inputIndices:t,inputs:l,outputIndices:i,options:n}};Me.postMessage(d,an(l))})}else return tn(e,t,r,i,a,n)},Rf=async e=>{if(ct())return $t(),new Promise((t,r)=>{wt("end-profiling",[t,r]);let i={type:"end-profiling",in:e};Me.postMessage(i)});rn(e)}}),ca,ed,Mf,Tg=W(()=>{"use strict";Ge(),Bf(),ee(),Aa(),Ed(),ca=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},ed=e=>{switch(e[3]){case"cpu":return new Oe(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!Na(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:i,dispose:a}=e[2];return Oe.fromGpuBuffer(r,{dataType:t,dims:e[1],download:i,dispose:a})}case"ml-tensor":{let t=e[0];if(!Da(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:i,dispose:a}=e[2];return Oe.fromMLTensor(r,{dataType:t,dims:e[1],download:i,dispose:a})}default:throw new Error(`invalid data location: ${e[3]}`)}},Mf=class{async fetchModelAndCopyToWasmMemory(e){return zf(await Pa(e))}async loadModel(e,t){Qe();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):r=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await Cf(r,t),je()}async dispose(){return Af(this.sessionId)}async run(e,t,r){Qe();let i=[],a=[];Object.entries(e).forEach(f=>{let h=f[0],_=f[1],g=this.inputNames.indexOf(h);if(g===-1)throw new Error(`invalid input '${h}'`);i.push(_),a.push(g)});let n=[],s=[];Object.entries(t).forEach(f=>{let h=f[0],_=f[1],g=this.outputNames.indexOf(h);if(g===-1)throw new Error(`invalid output '${h}'`);n.push(_),s.push(g)});let u=i.map((f,h)=>ca(f,()=>`input "${this.inputNames[a[h]]}"`)),l=n.map((f,h)=>f?ca(f,()=>`output "${this.outputNames[s[h]]}"`):null),d=await Of(this.sessionId,a,u,s,l,r),c={};for(let f=0;f<d.length;f++)c[this.outputNames[s[f]]]=n[f]??ed(d[f]);return je(),c}startProfiling(){}endProfiling(){Rf(this.sessionId)}}}),Nf={};Pt(Nf,{OnnxruntimeWebAssemblyBackend:()=>Ea,initializeFlags:()=>Ta,wasmBackend:()=>Df});var Ta,Ea,Df,Eg=W(()=>{"use strict";Ge(),Bf(),Tg(),Ta=()=>{(typeof fe.wasm.initTimeout!="number"||fe.wasm.initTimeout<0)&&(fe.wasm.initTimeout=0);let e=fe.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),fe.wasm.simd=!1),typeof fe.wasm.proxy!="boolean"&&(fe.wasm.proxy=!1),typeof fe.wasm.trace!="boolean"&&(fe.wasm.trace=!1),typeof fe.wasm.numThreads!="number"||!Number.isInteger(fe.wasm.numThreads)||fe.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)fe.wasm.numThreads=1;else{let t=typeof navigator>"u"?fm("node:os").cpus().length:navigator.hardwareConcurrency;fe.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},Ea=class{async init(e){Ta(),await Tf(),await Ef(e)}async createInferenceSessionHandler(e,t){let r=new Mf;return await r.loadModel(e,t),r}},Df=new Ea});Ge();Ge();Ge();var zg="1.22.0-dev.20250409-89f8206ba4";{let e=(Eg(),sr(Nf)).wasmBackend;Bt("webgpu",e,5),Bt("webnn",e,5),Bt("cpu",e,10),Bt("wasm",e,10)}Object.defineProperty(fe.versions,"web",{value:zg,enumerable:!0});fe.wasm.wasmPaths=new URL("./vendor/ort/",self.location.href).href;fe.wasm.numThreads=self.crossOriginIsolated?Math.min(4,navigator.hardwareConcurrency||2):1;fe.wasm.proxy=!1;var Ag=1024,nn=[.485,.456,.406],sn=[.229,.224,.225],lr=48,dr=null,it=new Map,mt=null,Ut=[],on=e=>self.postMessage(e),Pf={executionProviders:["wasm"],graphOptimizationLevel:"all"};function qf(e,t,r){let a=new OffscreenCanvas(e,t).getContext("2d",{willReadFrequently:!0});return r(a),a.getImageData(0,0,e,t).data}async function Og(){let e=mt.width,t=mt.height,r=Math.min(1.6,Ag/Math.max(e,t)),i=Math.max(32,Math.round(e*r/32)*32),a=Math.max(32,Math.round(t*r/32)*32),n=qf(i,a,y=>y.drawImage(mt,0,0,i,a)),s=i*a,u=new Float32Array(3*s);for(let y=0;y<s;y++){let w=n[y*4]/255,k=n[y*4+1]/255,S=n[y*4+2]/255;u[y]=(S-nn[0])/sn[0],u[s+y]=(k-nn[1])/sn[1],u[2*s+y]=(w-nn[2])/sn[2]}let d=(await dr.run({[dr.inputNames[0]]:new Oe("float32",u,[1,3,a,i])}))[dr.outputNames[0]].data,c=new Int32Array(s).fill(-1),f=new Int32Array(s),h=[];for(let y=0;y<s;y++){if(d[y]<=.3||c[y]!==-1)continue;let w=h.length,k=0;f[k++]=y,c[y]=w;let S=i,I=a,T=0,z=0,A=0,M=0;for(;k;){let q=f[--k],G=q%i,P=(q-G)/i;A++,M+=d[q],G<S&&(S=G),G>T&&(T=G),P<I&&(I=P),P>z&&(z=P),G>0&&d[q-1]>.3&&c[q-1]===-1&&(c[q-1]=w,f[k++]=q-1),G<i-1&&d[q+1]>.3&&c[q+1]===-1&&(c[q+1]=w,f[k++]=q+1),P>0&&d[q-i]>.3&&c[q-i]===-1&&(c[q-i]=w,f[k++]=q-i),P<a-1&&d[q+i]>.3&&c[q+i]===-1&&(c[q+i]=w,f[k++]=q+i)}h.push({minX:S,minY:I,maxX:T,maxY:z,count:A,score:M/A})}let _=e/i,g=t/a,$=new Int32Array(h.length).fill(-1),x=[];h.forEach((y,w)=>{y.score>=.5&&y.maxX-y.minX>=2&&y.maxY-y.minY>=2&&($[w]=x.length,y.colMin=new Int32Array(y.maxX-y.minX+1).fill(1<<30),y.colMax=new Int32Array(y.maxX-y.minX+1).fill(-1),x.push(y))});for(let y=0;y<s;y++){let w=c[y];if(w<0||$[w]<0)continue;let k=h[w],S=y%i,I=(y-S)/i,T=S-k.minX;I<k.colMin[T]&&(k.colMin[T]=I),I>k.colMax[T]&&(k.colMax[T]=I)}return Ut=x.map(y=>{let w=y.maxX-y.minX+1,k=y.maxY-y.minY+1,S=y.count*1.5/(2*(w+k)),I={x0:Math.max(0,(y.minX-S)*_),y0:Math.max(0,(y.minY-S)*g),x1:Math.min(e,(y.maxX+1+S)*_),y1:Math.min(t,(y.maxY+1+S)*g),score:y.score},T=[],z=new Float32Array(w);for(let M=0;M<w;M++)y.colMax[M]>=0?(T.push(y.colMax[M]-y.colMin[M]+1),z[M]=(y.colMin[M]+y.colMax[M])/2):z[M]=NaN;T.sort((M,q)=>M-q);let A=T[Math.floor(T.length/2)]||k;return w>A*2.5&&k>A*1.25&&(Rg(z),I.path={minX:y.minX,centers:Bg(z,Math.max(3,Math.round(A))),t:A,sx:_,sy:g}),I}).filter(y=>y.y1-y.y0>=6&&y.x1-y.x0>=6),Ut.length}function Rg(e){let t=-1;for(let r=0;r<e.length;r++)if(!Number.isNaN(e[r])){if(t===-1)for(let i=0;i<r;i++)e[i]=e[r];else for(let i=t+1;i<r;i++)e[i]=e[t]+(e[r]-e[t])*(i-t)/(r-t);t=r}for(let r=t+1;r<e.length;r++)e[r]=e[t]}function Bg(e,t){let r=new Float32Array(e.length),i=Math.floor(t/2);for(let a=0;a<e.length;a++){let n=0,s=0;for(let u=Math.max(0,a-i);u<=Math.min(e.length-1,a+i);u++)n+=e[u],s++;r[a]=n/s}return r}function Wf(e,t){let r=t/e.sx-e.minX,i=e.centers.length;if(r<=0){let n=i>4?(e.centers[Math.min(i-1,4)]-e.centers[0])/Math.min(i-1,4):0;return(e.centers[0]+n*r)*e.sy}if(r>=i-1){let n=i>4?(e.centers[i-1]-e.centers[Math.max(0,i-5)])/Math.min(i-1,4):0;return(e.centers[i-1]+n*(r-(i-1)))*e.sy}let a=Math.floor(r);return(e.centers[a]+(e.centers[a+1]-e.centers[a])*(r-a))*e.sy}function Mg(e){let{path:t}=e,r=t.t*.8*t.sx,i=Math.max(0,t.minX*t.sx-r),a=Math.min(mt.width,(t.minX+t.centers.length)*t.sx+r),n=t.t*1.1*t.sy,s=Math.max(1,Math.round(a-i)),u=Math.max(8,Math.round(n*2)),l=new OffscreenCanvas(s,u),d=l.getContext("2d"),c=s>1200?3:2;for(let f=0;f<s;f+=c){let h=Wf(t,i+f+c/2);d.drawImage(mt,i+f,h-n,c,u,f,0,c,u)}return{strip:l,x0:i,x1:a,half:n}}async function Lf(e,t,r){let i=await Uf({...e,path:void 0},t,r);if(!e.path)return i;let a=await Uf(e,t,r);return i?a&&a.confidence>i.confidence?a:i:a}async function Uf(e,{session:t,dict:r},i){let a=e.x1-e.x0,n=e.y1-e.y0;if(n>a*1.6&&a<60)return null;let s=mt,u=e.x0,l=e.y0,d=null;e.path&&(d=Mg(e),s=d.strip,u=0,l=0,a=d.strip.width,n=d.strip.height);let c=Math.min(2400,Math.max(16,Math.ceil(lr*a/n))),f=qf(c,lr,P=>P.drawImage(s,u,l,a,n,0,0,c,lr)),h=c*lr,_=new Float32Array(3*h);for(let P=0;P<h;P++)_[P]=f[P*4+2]/127.5-1,_[h+P]=f[P*4+1]/127.5-1,_[2*h+P]=f[P*4]/127.5-1;let $=(await t.run({[t.inputNames[0]]:new Oe("float32",_,[1,3,lr,c])}))[t.outputNames[0]],[,x,y]=$.dims,w=$.data,k=[],S=-1;for(let P=0;P<x;P++){let N=0,Z=-1/0;for(let te=0;te<y;te++){let L=w[P*y+te];L>Z&&(Z=L,N=te)}N!==0&&N!==S&&k.push({ch:r[N-1]??" ",p:Z,t:P}),S=N}let I=k.map(P=>P.ch).join("").replace(/\s+/g," ").trim();if(!I)return null;let T=k.reduce((P,N)=>P+N.p,0)/k.length,z=d?d.x0:e.x0,A=d?d.x1:e.x1,M=P=>z+P/x*(A-z),q=(P,N)=>{if(!d)return{y0:e.y0,y1:e.y1};let Z=Wf(e.path,(P+N)/2),te=e.path.t*.75*e.path.sy;return{y0:Z-te,y1:Z+te}},G=[];if(i)G.push({text:I,bbox:{x0:e.x0,y0:e.y0,x1:e.x1,y1:e.y1},confidence:T});else{let P=null;for(let N of k){if(/\s/.test(N.ch)){P&&G.push(P),P=null;continue}P||(P={text:"",ps:[],tStart:N.t,tEnd:N.t}),P.text+=N.ch,P.ps.push(N.p),P.tEnd=N.t}P&&G.push(P);for(let N of G){let Z=Math.max(z,M(N.tStart-.8)),te=Math.min(A,M(N.tEnd+1.8));N.bbox={x0:Z,x1:te,...q(Z,te)},N.confidence=N.ps.reduce((L,Q)=>L+Q,0)/N.ps.length,delete N.ps,delete N.tStart,delete N.tEnd}}return{text:I,confidence:T,bbox:{x0:e.x0,y0:e.y0,x1:e.x1,y1:e.y1},words:G}}function Ng(e){let t=(e.text.match(/[\p{L}\p{N}]/gu)??[]).length;return t?t===1&&!/[぀-ヿ一-鿿가-힯]/u.test(e.text)?e.confidence>.9:e.confidence>=.6:!1}async function Dg(e,t,r){let i=it.get(e),a=e==="cjk",n=t?t.map(u=>Ut[u]):Ut,s=[];for(let u=0;u<n.length;u++){let l=await Lf(n[u],i,a);l&&Ng(l)&&s.push(l),r&&u%4===3&&on({id:r,type:"progress",done:u+1,total:n.length})}return s}self.onmessage=async({data:e})=>{let{id:t,type:r}=e;try{let i;if(r==="loadDet")dr||(dr=await ur.create(new Uint8Array(e.model),Pf)),i=!0;else if(r==="loadRec"){if(!it.has(e.script)){for(;it.size>=3;){let[a,n]=it.entries().next().value;it.delete(a),await n.session.release?.()}it.set(e.script,{session:await ur.create(new Uint8Array(e.model),Pf),dict:e.dict})}i=!0}else if(r==="hasRec")i=it.has(e.script);else if(r==="detect")mt?.close?.(),mt=e.bitmap,i=await Og();else{if((r==="sample"||r==="read")&&!it.has(e.script))throw new Error("reader-not-loaded");if(r==="sample"){let a=Ut.map((l,d)=>[d,(l.x1-l.x0)*(l.y1-l.y0)]).sort((l,d)=>d[1]-l[1]).slice(0,4).map(([l])=>l),n=it.get(e.script),s=0,u=[];for(let l of a){let d=await Lf(Ut[l],n,e.script==="cjk");s+=d?.confidence??0,d&&u.push(d.text)}i={score:a.length?s/a.length:0,text:u.join(" ")}}else if(r==="read")i=await Dg(e.script,null,t);else throw new Error(`Unknown request: ${r}`)}on({id:t,type:"result",result:i})}catch(i){on({id:t,type:"error",message:i?.message??String(i)})}};
