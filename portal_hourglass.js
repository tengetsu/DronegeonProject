/* RusTrata hourglass — 10s conservation-of-sand animation.
 * Three existing wordmarks share a single clock. The gold engraving is
 * the original image, while the interior sand is generated from volume.
 * Gravity changes direction when the glass turns; all sand is retained.
 */
(() => {
  'use strict';
  const canvases = [...document.querySelectorAll('canvas[data-hourglass-sand]')];
  if (!canvases.length) return;

  const W = 135, H = 305, CX = 67.5, NECK = 152;
  const FLIP_EVERY = 10000, FLIP_DURATION = 880, SETTLE_DURATION = 550;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const upper = [
    [72,36],[83,37],[95,34],[104,31],[117,24],[130,16],[141,7],[152,2]
  ];
  const lower = [
    [152,2],[164,7],[178,16],[196,28],[213,34],[234,39],[257,41],[273,37],[282,31]
  ];
  const upperWindow = [[40,71],[31,83],[32,94],[36,104],[43,117],[51,130],
    [58,140],[63,153],[72,153],[77,140],[84,129],[92,117],
    [100,104],[105,94],[106,83],[97,71]];
  const lowerWindow = [[63,152],[72,152],[76,164],[83,178],[94,196],
    [101,213],[106,234],[108,257],[105,273],[99,282],[39,282],
    [29,273],[27,257],[29,234],[35,213],[43,196],[52,178],[60,164]];
  function polygon(ctx, points) {
    ctx.beginPath();
    points.forEach(([x,y],i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
    ctx.closePath();
  }
  function radius(points,y) {
    if (y <= points[0][0]) return points[0][1];
    for(let i=1;i<points.length;i++) {
      if (y <= points[i][0]) {
        const a=points[i-1],b=points[i], t=(y-a[0])/(b[0]-a[0]);
        return a[1]+(b[1]-a[1])*t;
      }
    }
    return points[points.length-1][1];
  }
  function capacity(points) {
    let a=0;
    for(let y=points[0][0];y<points.at(-1)[0];y+=0.5) a+=2*radius(points,y)*0.5;
    return a;
  }
  // Each transfer uses the SAME amount of sand independent of orientation.
  const MASS = Math.min(capacity(upper),capacity(lower)) * 0.72;
  function surface(points,fromNeck,amount) {
    const max=capacity(points), remaining=Math.max(0,Math.min(amount,max));
    const top=points[0][0], bottom=points.at(-1)[0];
    const forward=(points===upper ? !fromNeck : fromNeck);
    const dy=0.5;
    let volume=0;
    if (forward) {
      for(let y=top;y<bottom;y+=dy) {
        volume+=2*radius(points,y)*dy;
        if(volume>=remaining) return y;
      }
      return bottom;
    }
    for(let y=bottom;y>top;y-=dy) {
      volume+=2*radius(points,y)*dy;
      if(volume>=remaining) return y;
    }
    return top;
  }
  const clamp=v=>Math.max(0,Math.min(1,v));
  function glassBackground(ctx,polygonPoints,isBottom) {
    ctx.save();
    polygon(ctx,polygonPoints);ctx.clip();
    const grad=ctx.createRadialGradient(54,isBottom?217:92,7,70,isBottom?221:115,77);
    grad.addColorStop(0,'#443a2c');
    grad.addColorStop(.6,'#30271e');
    grad.addColorStop(1,'#221a16');
    ctx.fillStyle=grad;ctx.fillRect(24,isBottom?151:70,88,isBottom?134:85);
    // Faint luminous depth mimics the glass glow in the original illustration.
    const shine=ctx.createLinearGradient(32,0,103,0);
    shine.addColorStop(0,'rgba(255,222,161,.13)');
    shine.addColorStop(.24,'rgba(255,226,171,0)');
    shine.addColorStop(.78,'rgba(255,230,180,0)');
    shine.addColorStop(1,'rgba(255,221,142,.11)');
    ctx.fillStyle=shine;ctx.fillRect(24,70,90,216);
    // Reintroduce a trace of the old glass's engraved/grain texture.
    for(let i=0;i<190;i++) {
      const gx=28+((i*37.71)%82);
      const gy=(isBottom?153:71)+((i*53.93)%(isBottom?130:80));
      ctx.fillStyle=i%3===0?'rgba(226,188,125,.035)':'rgba(15,10,8,.055)';
      ctx.fillRect(gx,gy,.7,.75);
    }
    ctx.restore();
  }
  function pile(ctx,points,nearNeck,quantity,clock) {
    if(quantity <= 1) return;
    const top=points[0][0],bottom=points.at(-1)[0], level=surface(points,nearNeck,quantity);
    const fillFromTop=points===upper ? !nearNeck : nearNeck;
    ctx.save();
    polygon(ctx,points===upper?upperWindow:lowerWindow);ctx.clip();
    // The upper chamber's sand surface is nearly level. In the lower chamber,
    // a shallow cone forms beneath the stream instead of a floating blob.
    let left=23,right=112,r=Math.max(3,radius(points,level)-2);
    const tip=nearNeck?1:6;
    ctx.beginPath();
    if(fillFromTop) {
      ctx.moveTo(17,top-5);ctx.lineTo(118,top-5);
      ctx.lineTo(118,level-2);
      ctx.lineTo(CX+r,level+1);
      ctx.quadraticCurveTo(CX,level+tip,CX-r,level+1);
      ctx.lineTo(17,level-2);
    } else {
      ctx.moveTo(17,bottom+5);ctx.lineTo(118,bottom+5);
      ctx.lineTo(118,level+2);
      ctx.lineTo(CX+r,level+2);
      ctx.quadraticCurveTo(CX,level-tip,CX-r,level+2);
      ctx.lineTo(17,level+2);
    }
    ctx.closePath();ctx.clip();
    const grad=ctx.createLinearGradient(0,level-12,0,level+55);
    grad.addColorStop(0,'#ffe7a9');
    grad.addColorStop(.13,'#e8bd6a');
    grad.addColorStop(.56,'#b8843e');
    grad.addColorStop(1,'#7f552b');
    ctx.fillStyle=grad;ctx.fillRect(0,top-5,W,bottom-top+10);
    // A little sandy shimmer, constrained to the same volume silhouette.
    const glow=ctx.createLinearGradient(27,0,108,0);
    glow.addColorStop(0,'rgba(66,36,12,.18)');
    glow.addColorStop(.32,'rgba(255,235,172,.18)');
    glow.addColorStop(.55,'rgba(255,247,205,.11)');
    glow.addColorStop(1,'rgba(91,49,17,.20)');
    ctx.fillStyle=glow;ctx.fillRect(0,top-5,W,bottom-top+10);
    // Stable textured grains: deterministic spatial hash avoids flicker.
    for(let i=0;i<250;i++) {
      const px=25+((i*71.79)%85);
      const py=top+((i*53.17)%(bottom-top));
      const value=((i*131)%17)/17;
      ctx.fillStyle=value>.49?'rgba(255,237,176,.19)':'rgba(83,46,18,.20)';
      ctx.fillRect(px,py,.7,.65);
    }
    ctx.restore();
    // Sand edge: a short translucent highlight along the free surface.
    ctx.save();polygon(ctx,points===upper?upperWindow:lowerWindow);ctx.clip();
    ctx.strokeStyle='rgba(255,223,151,.53)';ctx.lineWidth=.95;
    ctx.beginPath();ctx.moveTo(CX-r,level+(fillFromTop?2:0));
    ctx.quadraticCurveTo(CX,level+(fillFromTop?tip:-tip),CX+r,level+(fillFromTop?2:0));ctx.stroke();
    ctx.restore();
  }
  function stream(ctx,inverted,quantity,clock) {
    if(quantity < 6) return;
    // A descending ribbon (in rotated local coordinates for inverted cycles).
    const destPoints=inverted?upper:lower;
    const destLevel=surface(destPoints,false,quantity);
    const startY=inverted?NECK-1:NECK+1;
    const endY=inverted?Math.min(NECK-12,destLevel+5):Math.max(NECK+12,destLevel-5);
    const grad=ctx.createLinearGradient(CX-1,0,CX+1,0);
    grad.addColorStop(0,'rgba(172,116,54,.04)');
    grad.addColorStop(.5,'rgba(255,219,143,.90)');
    grad.addColorStop(1,'rgba(158,92,37,.10)');
    ctx.beginPath();ctx.moveTo(CX,startY);ctx.lineTo(CX,endY);
    ctx.lineWidth=1.7;ctx.strokeStyle=grad;ctx.stroke();
    for(let i=0;i<9;i++) {
      const t=((clock*.0012+i*.137)%1);
      const yy=startY+(endY-startY)*t;
      ctx.fillStyle=i%2?'rgba(255,233,165,.70)':'rgba(255,213,119,.45)';
      ctx.fillRect(CX+Math.sin(i*19.3+clock*.002)*.65,yy,.8,1.15);
    }
  }
  function render(canvas,orientation,progress,settle,clock) {
    const ctx=canvas.getContext('2d');if(!ctx)return;
    ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);
    ctx.clearRect(0,0,W,H);
    glassBackground(ctx,upperWindow,false);
    glassBackground(ctx,lowerWindow,true);
    if(reduced) {
      pile(ctx,upper,true,MASS*.5,clock);
      pile(ctx,lower,false,MASS*.5,clock);
      return;
    }
    const inverted=orientation%2===1;
    const source=inverted?lower:upper;
    const target=inverted?upper:lower;
    // Only the gravity direction changes. No sand is duplicated or discarded.
    if(settle !== null) {
      const moved=MASS*settle;
      pile(ctx,source,false,MASS-moved,clock);
      pile(ctx,source,true,moved,clock);
    } else {
      const sourceAmt=MASS*(1-progress), targetAmt=MASS*progress;
      pile(ctx,source,true,sourceAmt,clock);
      pile(ctx,target,false,targetAmt,clock);
      if(progress>.01&&progress<.99) stream(ctx,inverted,targetAmt,clock);
    }
  }
  const start=performance.now();
  let previousCycle=-1,lastFrame=0;
  const logos=[...document.querySelectorAll('[data-hourglass-logo]')];
  function animate(now) {
    const elapsed=Math.max(0,now-start);
    const cycle=Math.floor(elapsed/FLIP_EVERY);
    const phase=elapsed%FLIP_EVERY;
    if(cycle!==previousCycle) {
      previousCycle=cycle;
      logos.forEach(el=>el.style.setProperty('--rustrata-hourglass-turn',`${cycle*180}deg`));
    }
    if(now-lastFrame>29 || lastFrame===0) {
      lastFrame=now;
      let orientation=cycle,progress=0,settle=null;
      if(cycle===0) {
        progress=clamp(phase/(FLIP_EVERY-120));
      } else if (phase<FLIP_DURATION) {
        // Rotating glass keeps the pile at its previous physical position.
        orientation=cycle-1;progress=1;
      } else if(phase<FLIP_DURATION+SETTLE_DURATION) {
        settle=clamp((phase-FLIP_DURATION)/SETTLE_DURATION);
      } else {
        progress=clamp((phase-FLIP_DURATION-SETTLE_DURATION)/
          (FLIP_EVERY-FLIP_DURATION-SETTLE_DURATION-100));
      }
      canvases.forEach(c=>render(c,orientation,progress,settle,elapsed));
    }
    requestAnimationFrame(animate);
  }
  if(reduced) canvases.forEach(c=>render(c,0,0,null,0));
  else requestAnimationFrame(animate);
})();
