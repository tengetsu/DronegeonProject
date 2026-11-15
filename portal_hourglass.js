/* RusTrata / gravity-consistent gold sand hourglass (2026-11-15)
 * Three wordmarks are synchronized.  Each chamber is the same shape after
 * a half turn, and sand always occupies the downhill part of its chamber.
 * The sand's area, palette and free surface are continuous during rotation.
 */
(() => {
  'use strict';
  const canvases=[...document.querySelectorAll('canvas[data-hourglass-sand]')];
  const logos=[...document.querySelectorAll('[data-hourglass-logo]')];
  if(!canvases.length||!logos.length) return;

  const W=135,H=305,CX=67.5,NY=152;
  const FLIP_INTERVAL=10000,FLIP_TIME=880,FINISH_EARLY=180;
  const STREAM_SHARE=0.022;
  const reduced=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LOWER=[[63,152],[72,152],[76,164],[83,178],[94,196],[101,213],
    [106,234],[108,257],[105,273],[99,282],[39,282],[29,273],
    [27,257],[29,234],[35,213],[43,196],[52,178],[60,164]];
  const UPPER=LOWER.map(([x,y])=>[135-x,304-y]);
  const area=p=>Math.abs(p.reduce((sum,v,i)=>sum+v[0]*p[(i+1)%p.length][1]
    -p[(i+1)%p.length][0]*v[1],0)/2);
  const MASS=area(LOWER)*.59;
  const clamp=x=>Math.max(0,Math.min(1,x));
  const fract=x=>x-Math.floor(x);
  const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
  const path=(ctx,pts)=>{
    if(!pts.length)return;
    ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);
    for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);
    ctx.closePath();
  };
  const dot=(p,g)=>(p[0]-CX)*g[0]+(p[1]-NY)*g[1];
  function clipDownhill(points,g,threshold) {
    const out=[];
    let a=points[points.length-1],da=dot(a,g)-threshold;
    for(const b of points) {
      const db=dot(b,g)-threshold;
      if((da>=0)!==(db>=0)) {
        const f=da/(da-db);
        out.push([a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f]);
      }
      if(db>=0)out.push(b);
      a=b;da=db;
    }
    return out;
  }
  function sandPolygon(chamber,g,amount) {
    const full=area(chamber);
    if(amount<.01)return {poly:[],threshold:Infinity};
    if(amount>=full-.01)return {poly:chamber,threshold:-Infinity};
    const projections=chamber.map(p=>dot(p,g));
    let lo=Math.min(...projections)-.1,hi=Math.max(...projections)+.1;
    // Binary search over equal-area clipped polygons (same total sand mass).
    for(let i=0;i<21;i++) {
      const mid=(lo+hi)/2;
      if(area(clipDownhill(chamber,g,mid))>amount)lo=mid;
      else hi=mid;
    }
    const threshold=(lo+hi)/2;
    return {poly:clipDownhill(chamber,g,threshold),threshold};
  }
  function background(ctx,chamber) {
    ctx.save();path(ctx,chamber);ctx.clip();
    const y=chamber===UPPER?87:217;
    const grad=ctx.createRadialGradient(58,y-11,4,CX,y+3,94);
    grad.addColorStop(0,'#514333');
    grad.addColorStop(.56,'#36291e');
    grad.addColorStop(1,'#1c1715');
    ctx.fillStyle=grad;ctx.fillRect(0,12,W,286);
    const glass=ctx.createLinearGradient(20,0,115,0);
    glass.addColorStop(0,'rgba(255,214,137,.15)');
    glass.addColorStop(.24,'rgba(255,234,183,.01)');
    glass.addColorStop(.74,'rgba(255,234,183,.015)');
    glass.addColorStop(1,'rgba(255,214,137,.12)');
    ctx.fillStyle=glass;ctx.fillRect(15,12,105,286);
    ctx.restore();
  }
  function sand(ctx,chamber,g,amount,glimmer) {
    if(amount<.01)return {threshold:Infinity};
    const {poly,threshold}=sandPolygon(chamber,g,amount);
    if(poly.length<3)return {threshold};
    const sx=CX+g[0]*threshold,sy=NY+g[1]*threshold;
    ctx.save();path(ctx,poly);ctx.clip();
    // Gradient aligned with gravity, rather than the fixed original Y axis:
    // the exact same gold is used before/during/after every 180° flip.
    const grad=ctx.createLinearGradient(sx-g[0]*2,sy-g[1]*2,
      sx+g[0]*95,sy+g[1]*95);
    grad.addColorStop(0,'#ffe6a4');
    grad.addColorStop(.12,'#f3cf80');
    grad.addColorStop(.38,'#d6a153');
    grad.addColorStop(.72,'#af7738');
    grad.addColorStop(1,'#83532a');
    ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
    const shine=ctx.createLinearGradient(22,0,111,0);
    shine.addColorStop(0,'rgba(77,40,13,.2)');
    shine.addColorStop(.34,'rgba(255,242,186,.2)');
    shine.addColorStop(.65,'rgba(255,239,174,.07)');
    shine.addColorStop(1,'rgba(89,47,17,.22)');
    ctx.fillStyle=shine;ctx.fillRect(15,10,105,285);
    // Fine, deterministic granules are stable in color and position.
    for(let i=0;i<610;i++) {
      const x=21+fract(i*0.6180339887)*93;
      const y=20+fract(i*0.7548776662)*267;
      const v=fract(i*0.4142135623);
      ctx.fillStyle=v<.45?'rgba(255,236,161,.23)':'rgba(101,55,22,.25)';
      const size=(i%7===0?1.1:.65);
      ctx.fillRect(x,y,size,size);
    }
    ctx.restore();
    // The free surface is literally one horizontal line in screen space.
    const edge=[];
    for(let i=0;i<chamber.length;i++) {
      const a=chamber[i],b=chamber[(i+1)%chamber.length];
      const da=dot(a,g)-threshold,db=dot(b,g)-threshold;
      if(da*db<0) {
        const t=da/(da-db);
        edge.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);
      }
    }
    if(edge.length>=2) {
      ctx.save();ctx.beginPath();ctx.moveTo(...edge[0]);ctx.lineTo(...edge[1]);
      ctx.strokeStyle='rgba(255,231,165,.76)';ctx.lineWidth=1.05;ctx.stroke();
      ctx.restore();
    }
    return {threshold};
  }
  function trickle(ctx,targetChamber,amount,sourceAmount,clock,dir) {
    if(amount<.04||amount>=MASS-.08||sourceAmount<.08)return;
    const g=[0,dir];
    const {threshold}=sandPolygon(targetChamber,g,amount);
    const impactY=NY+dir*threshold;
    const startY=NY+dir*2.4;
    const distance=Math.max(0,(impactY-startY)*dir);
    if(distance<6)return;
    ctx.save();path(ctx,targetChamber);ctx.clip();
    // Broken, subtly luminous filament, not an implausibly solid rod.
    const ribbon=ctx.createLinearGradient(CX-1.3,0,CX+1.3,0);
    ribbon.addColorStop(0,'rgba(185,109,49,0)');
    ribbon.addColorStop(.42,'rgba(250,213,127,.65)');
    ribbon.addColorStop(.60,'rgba(255,244,188,.9)');
    ribbon.addColorStop(1,'rgba(180,101,42,0)');
    ctx.beginPath();ctx.moveTo(CX,startY);ctx.lineTo(CX,impactY);
    ctx.strokeStyle=ribbon;ctx.lineWidth=1.25;ctx.stroke();
    for(let i=0;i<38;i++) {
      const speed=0.00035*(1+fract(i*.739)*.7);
      const t=fract(clock*speed+i*.6180339);
      const fall=t*t;
      const x=CX+Math.sin(i*12.9898+clock*.0013)*(.34+fall*1.8);
      const y=startY+(impactY-startY)*fall;
      const alpha=.32+.60*Math.sin(Math.PI*t);
      ctx.fillStyle=i%5===0?`rgba(255,247,200,${alpha})`:
        `rgba(245,194,99,${alpha*.88})`;
      ctx.beginPath();ctx.arc(x,y,i%4===0?.78:.42,0,Math.PI*2);ctx.fill();
    }
    // Sand grains that reach the heap scatter and settle over a few frames.
    for(let i=0;i<17;i++) {
      const t=fract(clock*(.0006+fract(i*.31)*.00045)+i*.317);
      const side=i%2===0?1:-1;
      const x=CX+side*(1.2+9*t)+Math.sin(i*13)*.6;
      const y=impactY-dir*(5.5*Math.sin(Math.PI*t)) + dir*(1.4*t);
      const alpha=(1-t)*.83;
      ctx.fillStyle=`rgba(255,220,145,${alpha.toFixed(3)})`;
      ctx.beginPath();ctx.arc(x,y,.35+(1-t)*.5,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }
  function drawAt(ctx,clock) {
    // Each period starts with a turn (except the very first period).
    const cycle=Math.floor(clock/FLIP_INTERVAL);
    const phase=clock-cycle*FLIP_INTERVAL;
    const turning=cycle>0 && phase<FLIP_TIME;
    const before=turning?cycle-1:cycle;
    const oldAngle=Math.max(0,turning?(cycle-1)*Math.PI:cycle*Math.PI);
    const angle=turning?oldAngle+Math.PI*ease(phase/FLIP_TIME):oldAngle;
    const g=[-Math.sin(angle),Math.cos(angle)];
    // For a new cycle, the filled destination of the previous cycle is
    // *precisely* the source of this cycle: no color or location reset.
    let upperAmount,lowerAmount,flow=false,progress=0,sandInFlight=0;
    if(turning) {
      upperAmount=before%2===0?0:MASS;
      lowerAmount=MASS-upperAmount;
    } else {
      progress=clamp((phase-(cycle?FLIP_TIME:0)) /
        (FLIP_INTERVAL-(cycle?FLIP_TIME:0)-FINISH_EARLY));
      flow=progress>.001 && progress<.999;
      sandInFlight=flow ? MASS*STREAM_SHARE*Math.pow(Math.sin(Math.PI*progress),1.15) : 0;
      if(cycle%2===0) {
        // Upper chamber is the source, lower chamber is the destination.
        upperAmount=Math.max(0,MASS*(1-progress)-sandInFlight);
        lowerAmount=Math.max(0,(MASS-sandInFlight)-upperAmount);
      } else {
        // Lower chamber is the source, upper chamber is the destination.
        lowerAmount=Math.max(0,MASS*(1-progress)-sandInFlight);
        upperAmount=Math.max(0,(MASS-sandInFlight)-lowerAmount);
      }
    }
    return {angle,g,upperAmount,lowerAmount,flow,cycle,sandInFlight};
  }
  function paint(canvas,frame) {
    const ctx=canvas.getContext('2d');if(!ctx)return;
    ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);
    ctx.clearRect(0,0,W,H);
    background(ctx,UPPER);background(ctx,LOWER);
    const {g,upperAmount,lowerAmount,flow,cycle}=frame;
    sand(ctx,UPPER,g,upperAmount);sand(ctx,LOWER,g,lowerAmount);
    if(flow) {
      const direction=cycle%2===0?1:-1;
      const target=direction===1?LOWER:UPPER;
      const amount=direction===1?lowerAmount:upperAmount;
      const source=direction===1?upperAmount:lowerAmount;
      trickle(ctx,target,amount,source,frame.clock,direction);
    }
  }
  function updateAt(ms) {
    const clock=Math.max(0,ms);
    const frame=reduced?
      {angle:0,g:[0,1],upperAmount:MASS*.52,lowerAmount:MASS*.48,flow:false,cycle:0,clock}:
      {...drawAt(null,clock),clock};
    const turn=`${frame.angle}rad`;
    for(const el of logos)el.style.setProperty('--rustrata-hourglass-turn',turn);
    for(const canvas of canvases)paint(canvas,frame);
  }
  const start=performance.now();let last=-Infinity;
  function animate(now) {
    if(now-last>=27){last=now;updateAt(now-start);}
    requestAnimationFrame(animate);
  }
  if(reduced)updateAt(0);else requestAnimationFrame(animate);
  // Opt-in development preview only; does not run on normal pages.
  if(location.search.includes('hourglass_debug=1'))window.__hourglassPreview=updateAt;
})();
