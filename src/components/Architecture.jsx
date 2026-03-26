'use client';
import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────
const tiers = [
  { id:1, number:"1", subtitle:"ATTACK ENTRY",    title:"Computer A: Attack Initiation",         desc:"A zero-day attack is introduced into an unprotected system through external media or insider access.",                                  color:"#ff4444", fluidColor:{r:0.12,g:0.01,b:0.01}, icon:"⚠",  statLabel:"THREAT LEVEL",   stat:"Critical",    statValue:100 },
  { id:2, number:"2", subtitle:"SYSTEM FAILURE",  title:"File Corruption Begins",                desc:"The malicious code alters critical files, disrupting operations and damaging data integrity.",                                        color:"#ff6666", fluidColor:{r:0.12,g:0.01,b:0.01}, icon:"⚙",  statLabel:"SYSTEM STATE",   stat:"Degraded",    statValue:75  },
  { id:3, number:"3", subtitle:"FULL BREACH",     title:"Unauthorized Access & Takeover",        desc:"The attacker gains full system access, leading to complete compromise and loss of control.",                                          color:"#b829ff", fluidColor:{r:0.07,g:0.01,b:0.13}, icon:"☠",  statLabel:"STATUS",         stat:"Compromised", statValue:100 },
  { id:4, number:"4", subtitle:"ATTACK ATTEMPT",  title:"Computer B: Attack Hits Protected System",desc:"The same attack targets a system equipped with an Offline AI Security Layer.",                                                        color:"#ff8800", fluidColor:{r:0.12,g:0.06,b:0.00}, icon:"🎯", statLabel:"ATTACK STATUS",  stat:"Intercepted", statValue:60  },
  { id:5, number:"5", subtitle:"SENSORY LAYER",   title:"Real-Time Monitoring Activated",        desc:"The sensory layer continuously scans system activity, detecting anomalies instantly.",                                                color:"#00ccff", fluidColor:{r:0.0, g:0.08,b:0.15}, icon:"👁",  statLabel:"SCAN COVERAGE",  stat:"100% Active", statValue:100 },
  { id:6, number:"6", subtitle:"PROCESSING",      title:"Threat Analysis & Neutralization",      desc:"The processing layer analyzes behavior using a local AI model and blocks the threat before execution.",                               color:"#00aaff", fluidColor:{r:0.0, g:0.06,b:0.14}, icon:"🔒", statLabel:"THREAT STATUS",  stat:"Neutralized", statValue:0   },
  { id:7, number:"7", subtitle:"ATTACK EVOLUTION",title:"Modified Attack Deployed",              desc:"The attacker creates a mutated version of the attack to bypass traditional defenses.",                                                color:"#ff4444", fluidColor:{r:0.12,g:0.01,b:0.01}, icon:"🧬", statLabel:"VARIANT",        stat:"Mutated",     statValue:75  },
  { id:8, number:"8", subtitle:"AI LEARNING",     title:"Adaptive Intelligence Engaged",         desc:"The system leverages past attack data to recognize patterns and predict malicious intent.",                                           color:"#00ccff", fluidColor:{r:0.0, g:0.08,b:0.15}, icon:"🧠", statLabel:"AI STATUS",      stat:"Learning",    statValue:92  },
  { id:9, number:"9", subtitle:"FINAL DEFENSE",   title:"Threat Blocked Faster",                 desc:"The evolved system neutralizes the new attack instantly, demonstrating a self-learning, resilient defense.",                          color:"#00fa9a", fluidColor:{r:0.0, g:0.15,b:0.08}, icon:"🛡",  statLabel:"DEFENSE",        stat:"100% Secure", statValue:100 },
];

// ─────────────────────────────────────────────────────────────
// FLUID BACKGROUND  (WebGL – self-contained)
// ─────────────────────────────────────────────────────────────
const FluidBackground = ({ activeColor }) => {
  const canvasRef   = useRef(null);
  const rafRef      = useRef(null);
  const colorRef    = useRef(activeColor);
  useEffect(() => { colorRef.current = activeColor; }, [activeColor]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    let alive = true;

    /* ── WebGL bootstrap ── */
    const p = { alpha:true,depth:false,stencil:false,antialias:false,preserveDrawingBuffer:false };
    let gl = canvas.getContext('webgl2',p); const isGL2=!!gl;
    if (!isGL2) gl = canvas.getContext('webgl',p)||canvas.getContext('experimental-webgl',p);
    let halfFloat,slF;
    if (isGL2){gl.getExtension('EXT_color_buffer_float');slF=gl.getExtension('OES_texture_float_linear');}
    else{halfFloat=gl.getExtension('OES_texture_half_float');slF=gl.getExtension('OES_texture_half_float_linear');}
    gl.clearColor(0,0,0,1);
    const hfType = isGL2?gl.HALF_FLOAT:halfFloat?.HALF_FLOAT_OES;
    function supportFmt(iF,f,t){
      const tx=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tx);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D,0,iF,4,4,0,f,t,null);
      const fb=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tx,0);
      return gl.checkFramebufferStatus(gl.FRAMEBUFFER)===gl.FRAMEBUFFER_COMPLETE;
    }
    function getSF(iF,f,t){if(!supportFmt(iF,f,t)){if(iF===gl.R16F)return getSF(gl.RG16F,gl.RG,t);if(iF===gl.RG16F)return getSF(gl.RGBA16F,gl.RGBA,t);return null;}return{internalFormat:iF,format:f};}
    let fRGBA,fRG,fR;
    if(isGL2){fRGBA=getSF(gl.RGBA16F,gl.RGBA,hfType);fRG=getSF(gl.RG16F,gl.RG,hfType);fR=getSF(gl.R16F,gl.RED,hfType);}
    else{fRGBA=fRG=fR=getSF(gl.RGBA,gl.RGBA,hfType);}

    /* ── Shaders ── */
    function sh(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s;}
    function prog(vs,fs){const p=gl.createProgram();gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);
      const u={};const n=gl.getProgramParameter(p,gl.ACTIVE_UNIFORMS);
      for(let i=0;i<n;i++){const nm=gl.getActiveUniform(p,i).name;u[nm]=gl.getUniformLocation(p,nm);}
      return{p,u,bind(){gl.useProgram(p);}};}
    const VS=sh(gl.VERTEX_SHADER,`precision highp float;attribute vec2 aPosition;varying vec2 vUv,vL,vR,vT,vB;uniform vec2 texelSize;void main(){vUv=aPosition*.5+.5;vL=vUv-vec2(texelSize.x,0.);vR=vUv+vec2(texelSize.x,0.);vT=vUv+vec2(0.,texelSize.y);vB=vUv-vec2(0.,texelSize.y);gl_Position=vec4(aPosition,0.,1.);}`);
    const copyPr =prog(VS,sh(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;uniform sampler2D uTexture;void main(){gl_FragColor=texture2D(uTexture,vUv);}`));
    const clearPr=prog(VS,sh(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;uniform sampler2D uTexture;uniform float value;void main(){gl_FragColor=value*texture2D(uTexture,vUv);}`));
    const splatPr=prog(VS,sh(gl.FRAGMENT_SHADER,`precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uTarget;uniform float aspectRatio;uniform vec3 color;uniform vec2 point;uniform float radius;void main(){vec2 p=vUv-point;p.x*=aspectRatio;vec3 s=exp(-dot(p,p)/radius)*color;gl_FragColor=vec4(texture2D(uTarget,vUv).xyz+s,1.);}`));
    const advPr  =prog(VS,sh(gl.FRAGMENT_SHADER,`precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uVelocity,uSource;uniform vec2 texelSize;uniform float dt,dissipation;void main(){vec2 coord=vUv-dt*texture2D(uVelocity,vUv).xy*texelSize;gl_FragColor=texture2D(uSource,coord)/(1.+dissipation*dt);}`));
    const divPr  =prog(VS,sh(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity;void main(){float L=texture2D(uVelocity,vL).x,R=texture2D(uVelocity,vR).x,T=texture2D(uVelocity,vT).y,B=texture2D(uVelocity,vB).y;vec2 C=texture2D(uVelocity,vUv).xy;if(vL.x<0.)L=-C.x;if(vR.x>1.)R=-C.x;if(vT.y>1.)T=-C.y;if(vB.y<0.)B=-C.y;gl_FragColor=vec4(.5*(R-L+T-B),0.,0.,1.);}`));
    const curlPr =prog(VS,sh(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity;void main(){gl_FragColor=vec4(.5*(texture2D(uVelocity,vR).y-texture2D(uVelocity,vL).y-texture2D(uVelocity,vT).x+texture2D(uVelocity,vB).x),0.,0.,1.);}`));
    const vortPr =prog(VS,sh(gl.FRAGMENT_SHADER,`precision highp float;precision highp sampler2D;varying vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity,uCurl;uniform float curl,dt;void main(){float L=texture2D(uCurl,vL).x,R=texture2D(uCurl,vR).x,T=texture2D(uCurl,vT).x,B=texture2D(uCurl,vB).x,C=texture2D(uCurl,vUv).x;vec2 force=.5*vec2(abs(T)-abs(B),abs(R)-abs(L));force/=length(force)+.0001;force*=curl*C;force.y*=-1.;vec2 v=texture2D(uVelocity,vUv).xy+force*dt;gl_FragColor=vec4(clamp(v,-1000.,1000.),0.,1.);}`));
    const presPr =prog(VS,sh(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uPressure,uDivergence;void main(){gl_FragColor=vec4((texture2D(uPressure,vL).x+texture2D(uPressure,vR).x+texture2D(uPressure,vB).x+texture2D(uPressure,vT).x-texture2D(uDivergence,vUv).x)*.25,0.,0.,1.);}`));
    const gradPr =prog(VS,sh(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uPressure,uVelocity;void main(){vec2 v=texture2D(uVelocity,vUv).xy;v-=vec2(texture2D(uPressure,vR).x-texture2D(uPressure,vL).x,texture2D(uPressure,vT).x-texture2D(uPressure,vB).x);gl_FragColor=vec4(v,0.,1.);}`));
    const dispPr =prog(VS,sh(gl.FRAGMENT_SHADER,`precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uTexture;void main(){vec3 c=texture2D(uTexture,vUv).rgb;gl_FragColor=vec4(c,max(c.r,max(c.g,c.b)));}`));

    /* ── Quad ── */
    gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),gl.STATIC_DRAW);
    gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(0);
    const blit=(tgt,clr=false)=>{
      if(!tgt){gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight);gl.bindFramebuffer(gl.FRAMEBUFFER,null);}
      else{gl.viewport(0,0,tgt.width,tgt.height);gl.bindFramebuffer(gl.FRAMEBUFFER,tgt.fbo);}
      if(clr){gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT);}
      gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0);
    };

    /* ── FBOs ── */
    function mkFBO(w,h,iF,f,t,param){
      gl.activeTexture(gl.TEXTURE0);const tx=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tx);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,param);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,param);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D,0,iF,w,h,0,f,t,null);
      const fbo=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tx,0);
      gl.viewport(0,0,w,h);gl.clear(gl.COLOR_BUFFER_BIT);
      return{tx,fbo,width:w,height:h,tsx:1/w,tsy:1/h,attach(id){gl.activeTexture(gl.TEXTURE0+id);gl.bindTexture(gl.TEXTURE_2D,tx);return id;}};
    }
    function dFBO(w,h,iF,f,t,param){
      let a=mkFBO(w,h,iF,f,t,param),b=mkFBO(w,h,iF,f,t,param);
      return{width:w,height:h,tsx:a.tsx,tsy:a.tsy,get read(){return a;},set read(v){a=v;},get write(){return b;},set write(v){b=v;},swap(){let tmp=a;a=b;b=tmp;}};
    }
    const pxR=window.devicePixelRatio||1;
    const scale=v=>Math.floor(v*pxR);
    const getRes=r=>{let ar=gl.drawingBufferWidth/gl.drawingBufferHeight;if(ar<1)ar=1/ar;const mn=Math.round(r),mx=Math.round(r*ar);return gl.drawingBufferWidth>gl.drawingBufferHeight?{width:mx,height:mn}:{width:mn,height:mx};};
    gl.disable(gl.BLEND);
    const fltr=slF?gl.LINEAR:gl.NEAREST;
    const sR=getRes(64),dR=getRes(256);
    let dye=dFBO(dR.width,dR.height,fRGBA.internalFormat,fRGBA.format,hfType,fltr);
    let vel=dFBO(sR.width,sR.height,fRG.internalFormat,fRG.format,hfType,fltr);
    let div_=mkFBO(sR.width,sR.height,fR.internalFormat,fR.format,hfType,gl.NEAREST);
    let curl_=mkFBO(sR.width,sR.height,fR.internalFormat,fR.format,hfType,gl.NEAREST);
    let pres=dFBO(sR.width,sR.height,fR.internalFormat,fR.format,hfType,gl.NEAREST);

    /* ── Pointer ── */
    const ptr={x:0,y:0,px:0,py:0,dx:0,dy:0,moved:false,color:[0,0,0]};
    function toCoord(cx,cy){const r=canvas.getBoundingClientRect();return{x:scale(cx-r.left)/canvas.width,y:1-scale(cy-r.top)/canvas.height};}
    function onMove(cx,cy){const{x,y}=toCoord(cx,cy);ptr.px=ptr.x;ptr.py=ptr.y;ptr.x=x;ptr.y=y;const ar=canvas.width/canvas.height;ptr.dx=(ptr.x-ptr.px)*(ar<1?ar:1);ptr.dy=(ptr.y-ptr.py)*(ar>1?1/ar:1);ptr.moved=true;const c=colorRef.current;ptr.color=[c.r*.07,c.g*.07,c.b*.07];}
    const onMM=e=>onMove(e.clientX,e.clientY);
    const onTM=e=>{const t=e.targetTouches[0];onMove(t.clientX,t.clientY);};
    canvas.addEventListener('mousemove',onMM);
    canvas.addEventListener('touchmove',onTM,{passive:true});

    /* ── Splat ── */
    function splat(x,y,dx,dy,col){
      splatPr.bind();gl.uniform1i(splatPr.u.uTarget,vel.read.attach(0));
      gl.uniform1f(splatPr.u.aspectRatio,canvas.width/canvas.height);
      gl.uniform2f(splatPr.u.point,x,y);gl.uniform3f(splatPr.u.color,dx,dy,0);
      const ar=canvas.width/canvas.height;gl.uniform1f(splatPr.u.radius,(0.5/100)*(ar>1?ar:1));
      blit(vel.write);vel.swap();
      gl.uniform1i(splatPr.u.uTarget,dye.read.attach(0));gl.uniform3f(splatPr.u.color,...col);blit(dye.write);dye.swap();
    }

    /* ── Sim step ── */
    function step(dt){
      gl.disable(gl.BLEND);
      curlPr.bind();gl.uniform2f(curlPr.u.texelSize,vel.tsx,vel.tsy);gl.uniform1i(curlPr.u.uVelocity,vel.read.attach(0));blit(curl_);
      vortPr.bind();gl.uniform2f(vortPr.u.texelSize,vel.tsx,vel.tsy);gl.uniform1i(vortPr.u.uVelocity,vel.read.attach(0));gl.uniform1i(vortPr.u.uCurl,curl_.attach(1));gl.uniform1f(vortPr.u.curl,1);gl.uniform1f(vortPr.u.dt,dt);blit(vel.write);vel.swap();
      divPr.bind();gl.uniform2f(divPr.u.texelSize,vel.tsx,vel.tsy);gl.uniform1i(divPr.u.uVelocity,vel.read.attach(0));blit(div_);
      clearPr.bind();gl.uniform1i(clearPr.u.uTexture,pres.read.attach(0));gl.uniform1f(clearPr.u.value,0.1);blit(pres.write);pres.swap();
      presPr.bind();gl.uniform2f(presPr.u.texelSize,vel.tsx,vel.tsy);gl.uniform1i(presPr.u.uDivergence,div_.attach(0));
      for(let i=0;i<20;i++){gl.uniform1i(presPr.u.uPressure,pres.read.attach(1));blit(pres.write);pres.swap();}
      gradPr.bind();gl.uniform2f(gradPr.u.texelSize,vel.tsx,vel.tsy);gl.uniform1i(gradPr.u.uPressure,pres.read.attach(0));gl.uniform1i(gradPr.u.uVelocity,vel.read.attach(1));blit(vel.write);vel.swap();
      advPr.bind();gl.uniform2f(advPr.u.texelSize,vel.tsx,vel.tsy);const vi=vel.read.attach(0);gl.uniform1i(advPr.u.uVelocity,vi);gl.uniform1i(advPr.u.uSource,vi);gl.uniform1f(advPr.u.dt,dt);gl.uniform1f(advPr.u.dissipation,4);blit(vel.write);vel.swap();
      gl.uniform1i(advPr.u.uVelocity,vel.read.attach(0));gl.uniform1i(advPr.u.uSource,dye.read.attach(1));gl.uniform1f(advPr.u.dissipation,7);blit(dye.write);dye.swap();
    }
    function render(){gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.enable(gl.BLEND);dispPr.bind();gl.uniform1i(dispPr.u.uTexture,dye.read.attach(0));blit(null);}
    function resizeCanvas(){const w=scale(canvas.clientWidth),h=scale(canvas.clientHeight);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;return true;}return false;}

    /* ── Ambient splats ── */
    function ambSplat(){const c=colorRef.current;splat(Math.random(),Math.random(),(Math.random()-.5)*200,(Math.random()-.5)*200,[c.r*.05,c.g*.05,c.b*.05]);}
    ambSplat();ambSplat();

    /* ── Render loop ── */
    let last=Date.now(),ambT=0;
    function frame(){
      if(!alive)return;
      const now=Date.now(),dt=Math.min((now-last)/1000,.016666);last=now;
      resizeCanvas();ambT+=dt;if(ambT>4){ambT=0;ambSplat();}
      if(ptr.moved){ptr.moved=false;splat(ptr.x,ptr.y,ptr.dx*1500,ptr.dy*1500,ptr.color);}
      step(dt);render();
      rafRef.current=requestAnimationFrame(frame);
    }
    frame();
    return()=>{alive=false;cancelAnimationFrame(rafRef.current);canvas.removeEventListener('mousemove',onMM);canvas.removeEventListener('touchmove',onTM);};
  },[]);

  return <canvas ref={canvasRef} className="arch-fluid-canvas"/>;
};

// ─────────────────────────────────────────────────────────────
// STAT BAR
// ─────────────────────────────────────────────────────────────
const StatBar = ({ value, color, isActive }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.transition = isActive ? 'width 1.4s cubic-bezier(0.16,1,0.3,1)' : 'width 0.25s ease';
    ref.current.style.width = isActive ? `${value}%` : '0%';
  }, [isActive, value]);
  return (
    <div className="arch-stat-track">
      <div ref={ref} className="arch-stat-fill" style={{ backgroundColor: color, width: '0%' }} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// ANIMATED COUNTER
// ─────────────────────────────────────────────────────────────
const Counter = ({ value, color, isActive }) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!isActive) { setN(0); return; }
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / 1200, 1);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isActive, value]);
  return <span className="arch-counter" style={{ color }}>{n}</span>;
};

// ─────────────────────────────────────────────────────────────
// CARD 
// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// CARD (Font sizes increased)
// ─────────────────────────────────────────────────────────────
const Card = ({ tier, index, total, scrollYProgress, isActive }) => {
  const center = index / (total - 1);
  const win    = 0.35; 

  const scale = useTransform(scrollYProgress, v => {
    const d = Math.abs(v - center);
    if (d >= win) return 0.85; 
    return 1.0 - (0.15 * (d / win));
  });

  const opacity = useTransform(scrollYProgress, v => {
    const d = Math.abs(v - center);
    if (d >= win) return 0.60;
    return 1.0 - (0.40 * (d / win));
  });

  const x = useTransform(scrollYProgress, v => {
    const off = v - center;
    if (Math.abs(off) >= win) return off > 0 ? -30 : 30;
    return (off / win) * -30;
  });

  return (
    <motion.div
      className={`arch-card ${isActive ? 'arch-card--active' : ''}`}
      style={{ scale, opacity, x, '--card-color': tier.color }}
    >
      <span className="arch-corner arch-corner--tl" style={{ borderColor: tier.color }} />
      <span className="arch-corner arch-corner--tr" style={{ borderColor: tier.color }} />
      <span className="arch-corner arch-corner--bl" style={{ borderColor: tier.color }} />
      <span className="arch-corner arch-corner--br" style={{ borderColor: tier.color }} />

      {isActive && <div className="arch-sweep" style={{ '--sw': tier.color }} />}
      <div className="arch-card-topbar" style={{ background: `linear-gradient(90deg, transparent, ${tier.color}, transparent)` }} />
      <div className="arch-card-glow" />

      <div className="arch-card-inner">
        {/* ── LEFT ── */}
        <div className="arch-card-text">
          <div className="arch-badge" style={{ color: tier.color }}>
            {/* INLINE STYLE: Increased Number Size */}
            <span className="arch-num" style={{ fontSize: '2.2rem' }}>0{tier.number}</span>
            <span className="arch-dot">·</span>
            {/* INLINE STYLE: Increased Subtitle Size */}
            <span className="arch-sub" style={{ fontSize: '0.85rem' }}>{tier.subtitle}</span>
          </div>

          {/* INLINE STYLE: Increased Title & Description Size */}
          <h3 className="arch-title" style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{tier.title}</h3>
          <p  className="arch-desc" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{tier.desc}</p>

          <div className="arch-stat-row">
            <div className="arch-stat-meta">
              <span className="arch-stat-label">{tier.statLabel}</span>
              <span className="arch-stat-value" style={{ color: tier.color }}>{tier.stat}</span>
            </div>
            <StatBar value={tier.statValue} color={tier.color} isActive={isActive} />
          </div>

          <div className="arch-live">
            <span className="arch-live-dot" style={{ background: tier.color }} />
            <span className="arch-live-lbl">SCORE</span>
            <Counter value={tier.statValue} color={tier.color} isActive={isActive} />
            <span className="arch-live-pct" style={{ color: tier.color }}>%</span>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="arch-visual" style={{ borderLeft: `1px solid ${tier.color}28` }}>
          <div className="arch-ring-wrap">
            <svg viewBox="0 0 80 80" className="arch-ring-svg" style={{ transform:'rotate(-90deg)' }}>
              <circle cx="40" cy="40" r="32" fill="none" stroke={`${tier.color}22`} strokeWidth="3"/>
              <circle cx="40" cy="40" r="32" fill="none" stroke={tier.color} strokeWidth="3"
                strokeLinecap="round"
                style={{
                  strokeDasharray: isActive ? `${2*Math.PI*32*tier.statValue/100} ${2*Math.PI*32}` : `0 ${2*Math.PI*32}`,
                  transition: isActive ? 'stroke-dasharray 1.4s cubic-bezier(0.16,1,0.3,1) 0.2s' : 'stroke-dasharray 0.2s',
                }}
              />
            </svg>
            <span className="arch-ring-num" style={{ color: tier.color }}>0{tier.number}</span>
          </div>

          <motion.div
            className="arch-icon-wrap"
            animate={isActive ? { scale:[1,1.18,1], y:[0,-6,0] } : { scale:1, y:0 }}
            transition={{ duration:2.2, repeat: isActive ? Infinity : 0, ease:'easeInOut' }}
          >
            <div className={`arch-orbit ${isActive ? 'arch-orbit--on' : ''}`} style={{ '--oc': tier.color }}>
              <div className="arch-orbit-r1"/>
              <div className="arch-orbit-r2"/>
            </div>
            <span className="arch-icon" style={{ filter:`drop-shadow(0 0 10px ${tier.color})` }}>
              {tier.icon}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────
// PROGRESS DOTS
// ─────────────────────────────────────────────────────────────
const Dots = ({ total, active }) => (
  <div className="arch-dots">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className={`arch-dot-item ${i === active ? 'arch-dot-item--on' : ''}`}
        style={i === active ? { backgroundColor: tiers[i].color } : {}} />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────
// MAIN (Header Fixed & Gaps Decreased)
// ─────────────────────────────────────────────────────────────
const Architecture = () => {
  const [activeIdx, setActiveIdx]     = useState(0);
  const [fluidColor, setFluidColor]   = useState(tiers[0].fluidColor);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const trackX = useTransform(scrollYProgress, [0, 1],
    ['0%', 'calc(-100% + 100vw)']
  );

  useMotionValueEvent(scrollYProgress, 'change', v => {
    const idx = Math.min(Math.round(v * (tiers.length - 1)), tiers.length - 1);
    if (idx !== activeIdx) {
      setActiveIdx(idx);
      setFluidColor(tiers[idx].fluidColor);
    }
  });

  return (
    <section ref={containerRef} id="architecture-section" className="arch-wrapper">

      <div className="arch-fluid-layer">
        <FluidBackground activeColor={fluidColor} />
      </div>

      <div className="arch-scrim" />
      <div className="arch-scanlines" />

      <div className="arch-sticky">

        {/* INLINE STYLE FIX: Forces Header to stay at the top and above everything (zIndex: 100) */}
        <div className="arch-header" style={{ position: 'absolute', top: '8vh', width: '100%', zIndex: 100 }}>
          <div className="arch-eyebrow">
            <span className="arch-eyebrow-line" style={{ background: tiers[activeIdx].color }} />
            <span className="arch-eyebrow-txt"  style={{ color: tiers[activeIdx].color }}>LIVE DEMONSTRATION</span>
            <span className="arch-eyebrow-line" style={{ background: tiers[activeIdx].color }} />
          </div>
          <h2 className="arch-h2">Live Demonstration Flow</h2>
          <p  className="arch-p">Scroll to walk through each stage of the attack &amp; defense cycle</p>
        </div>

        {/* INLINE STYLE FIX: Decreased the gap between cards */}
        {/* Added marginTop to pull the cards up closer to the text */}
        <motion.div className="arch-track" style={{ x: trackX, gap: '1.5rem', marginTop: '-18vh' }}>
          {tiers.map((tier, i) => (
            <Card
              key={tier.id} tier={tier} index={i}
              total={tiers.length} scrollYProgress={scrollYProgress}
              isActive={i === activeIdx}
            />
          ))}
        </motion.div>

        {/* Progress dots */}
        <Dots total={tiers.length} active={activeIdx} />

        {/* Step label */}
        <motion.div className="arch-step-label"
          key={activeIdx}
          initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.28 }}
          style={{ color: tiers[activeIdx].color }}
        >
          <span className="arch-step-n">STEP {tiers[activeIdx].number} / {tiers.length}</span>
          <span className="arch-step-sep">—</span>
          <span>{tiers[activeIdx].subtitle}</span>
        </motion.div>

      </div>
    </section>
  );
};

export default Architecture;