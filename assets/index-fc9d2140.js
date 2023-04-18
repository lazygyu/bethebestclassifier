var B=Object.defineProperty;var L=(o,t,e)=>t in o?B(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var i=(o,t,e)=>(L(o,typeof t!="symbol"?t+"":t,e),e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const h of r)if(h.type==="childList")for(const c of h.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function e(r){const h={};return r.integrity&&(h.integrity=r.integrity),r.referrerPolicy&&(h.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?h.credentials="include":r.crossOrigin==="anonymous"?h.credentials="omit":h.credentials="same-origin",h}function s(r){if(r.ep)return;r.ep=!0;const h=e(r);fetch(r.href,h)}})();const a=640,n=480,P=["neut","lymph","mono","eo","baso","rbc"],K=30*1e3,$=9.8/1e3;class w{constructor(){i(this,"elapsed",0)}update(t){this.elapsed+=t}}const g=class{constructor(){i(this,"resources");this.resources=new Map}static getInstance(){return g.instance||(g.instance=new g),g.instance}async loadImage(t){const e=t.map(s=>new Promise((r,h)=>{const c=new Image,S=typeof s=="string"?{url:s,name:s}:s;c.src=S.url,c.onload=()=>{this.resources.set(S.name,c),r()},c.onerror=R=>{h(R)}}));await Promise.all(e)}async loadAudio(t){const e=t.map(s=>new Promise((r,h)=>{const c=new Audio;c.src=s.url,c.oncanplaythrough=()=>{this.resources.set(s.name,c),r()},c.onerror=S=>{h(S)}}));await Promise.all(e)}get(t){if(!this.resources.has(t))throw new Error(`Resource ${t} not found`);return this.resources.get(t)}};let l=g;i(l,"instance");const y=class{constructor(){i(this,"events");this.events=new Map}static getInstance(){return y.instance||(y.instance=new y),y.instance}on(t,e){this.events.has(t)||this.events.set(t,[]),this.events.get(t).push(e)}off(t,e){if(!this.events.has(t))return;const s=this.events.get(t).indexOf(e);s!==-1&&this.events.get(t).splice(s,1)}emit(t,...e){this.events.has(t)&&this.events.get(t).forEach(s=>{s(...e)})}};let m=y;i(m,"instance");class k extends w{constructor(){super()}enter(){console.log("Entering Loading State"),this.loadResources()}async loadResources(){const t=[{url:"images/cells/1_neutrophil.svg",name:"neut"},{url:"images/cells/2_lymphocyte.svg",name:"lymph"},{url:"images/cells/3_monocyte.svg",name:"mono"},{url:"images/cells/4_eosinophil.svg",name:"eo"},{url:"images/cells/5_basophil.svg",name:"baso"},{url:"images/cells/6_rbc.svg",name:"rbc"},{url:"images/milab.png",name:"milab"},{url:"images/noul.png",name:"noul"},{url:"images/correct_effect.png",name:"correct_effect"}],e=[{url:"sound/bgm_normal.mp3",name:"bgm_normal"},{url:"sound/wrong.mp3",name:"wrong"},{url:"sound/gameover.mp3",name:"gameover"},{url:"sound/score_increase.mp3",name:"score"},{url:"sound/correct.mp3",name:"correct"},{url:"sound/whistle.mp3",name:"whistle"},{url:"sound/count.mp3",name:"count"}];await Promise.all([l.getInstance().loadImage(t),l.getInstance().loadAudio(e)]),m.getInstance().emit("changeState","initial")}exit(){}update(t){super.update(t)}render(t){t.save(),t.fillStyle="#ea5504",t.fillRect(0,0,t.canvas.width,t.canvas.height),t.fillStyle="white",t.font="48px bitbit",t.textAlign="center",t.fillText("Loading...",t.canvas.width/2,t.canvas.height/2),t.restore()}}class M{constructor(){i(this,"elapsed",0);i(this,"isDestroied",!1)}update(t){this.elapsed+=t}}class D extends M{constructor(e){super();i(this,"x");i(this,"y");i(this,"radius");i(this,"dx");i(this,"dy");i(this,"gravity");i(this,"friction");i(this,"rotation",0);i(this,"type");this.radius=15,this.x=e.x,this.y=this.radius,this.dx=Math.random()*10-5,this.dy=e.dy,this.gravity=$,this.friction=.9,this.type=e.type}draw(e){e.save();const s=l.getInstance().get(this.type);e.translate(this.x,this.y),e.rotate(this.rotation),e.drawImage(s,-this.radius,-this.radius,this.radius*2,this.radius*2),e.restore()}update(e){this.dy+=this.gravity*e,this.x+=this.dx,this.y+=this.dy,this.y+this.radius>n?(this.dy=-this.dy*this.friction,this.y=n-this.radius,this.dx*=this.friction):this.y-this.radius<0&&(this.dy=-this.dy*this.friction,this.y=this.radius),this.x+this.radius>a?(this.dx=-this.dx*this.friction,this.x=a-this.radius):this.x-this.radius<0&&(this.dx=-this.dx*this.friction,this.x=this.radius),this.rotation+=this.dx*.1}impulse(e,s){this.dx=e,this.dy=s}}const b=class{constructor(){i(this,"keys");i(this,"lastKeys");this.keys=new Map,this.lastKeys=new Map}static getInstance(){return b.instance||(b.instance=new b),b.instance}init(){console.log("InputManager init"),window.addEventListener("keydown",t=>{this.keys.set(t.key,!0)}),window.addEventListener("keyup",t=>{this.keys.set(t.key,!1)})}isKeyDown(t){return this.keys.get(t)||!1}isKeyUp(t){return!this.keys.get(t)}isKeyPressed(t){return this.keys.get(t)&&!this.lastKeys.get(t)||!1}update(){this.keys.forEach((t,e)=>{this.lastKeys.set(e,t)})}isAnyKeyDown(){return Array.from(this.keys.values()).some(t=>t)}isAnyKeyPressed(){return this.isAnyKeyDown()&&!Array.from(this.lastKeys.values()).some(t=>t)}};let f=b;i(f,"instance");class O extends w{constructor(){super();i(this,"children",[])}enter(){this.makeCells()}makeCells(){for(let e=0;e<10;e++){const s=["neut","lymph","mono","eo","baso","rbc"][Math.floor(Math.random()*6)],r=Math.random()*1e3,h=Math.random()*10-5;this.children.push(new D({type:s,x:r,dy:h}))}}exit(){}update(e){super.update(e),f.getInstance().isKeyPressed(" ")&&m.getInstance().emit("changeState","ready"),this.children.forEach(s=>s.update(e))}render(e){e.save(),e.fillStyle="#ea5504",e.fillRect(0,0,e.canvas.width,e.canvas.height),this.children.forEach(s=>s.draw(e)),e.fillStyle="white",e.font="48px bitbit",e.textAlign="center",e.fillText("Be the Best Classifier!",e.canvas.width/2,e.canvas.height/2),this.elapsed%800<600&&(e.font="24px bitbit",e.fillText("Press SPACE to start!",e.canvas.width/2,e.canvas.height/2+50)),e.restore()}}function C(o,t){let e=o+"";for(;e.length<t;)e="0"+e;return e}function I(o,t,e){return o.map((s,r)=>s+(t[r]-s)*e)}const u={width:47,height:38},U=[{x:0,y:0},{x:47,y:0},{x:94,y:0},{x:141,y:0},{x:188,y:0},{x:235,y:0},{x:282,y:0}],z={normal:[0,1,2,1],correct:[3,4],incorrect:[5,6]};class F extends M{constructor(){super();i(this,"img");i(this,"frame",0);i(this,"state","normal");i(this,"duration",0);i(this,"x",0);i(this,"y",0);i(this,"width",u.width);i(this,"height",u.height);i(this,"scale",2);this.img=l.getInstance().get("milab")}draw(e){e.save(),e.translate(Math.floor(this.x),Math.floor(this.y));const s=U[this.frame];e.scale(this.scale,this.scale),e.drawImage(this.img,s.x,0,u.width,u.height,-Math.round(u.width*.5),0,u.width,u.height),e.restore()}update(e){super.update(e),this.duration>0&&(this.duration-=e,this.duration<=0&&(this.state="normal",this.duration=0));const s=z[this.state];this.frame=s[Math.floor(this.elapsed/100)%s.length]}correct(e){this.state="correct",this.duration=e}incorrect(e){this.state="incorrect",this.duration=e}}class Z extends M{constructor(e,s,r){super();i(this,"x");i(this,"y");i(this,"type");i(this,"rotation",0);i(this,"rotationSpeed",0);i(this,"radius",40);i(this,"dx");i(this,"dy");i(this,"isMoving",!1);i(this,"isWrong",!1);i(this,"img");i(this,"sizeDelta",0);i(this,"sizeInterval",0);i(this,"rotationInterval",0);i(this,"rotationIntervalMax",0);this.x=e,this.y=s,this.dx=0,this.dy=0,this.type=r,this.sizeInterval=Math.random()*400,this.rotationIntervalMax=Math.random()*1e3,this.rotationInterval=this.rotationIntervalMax,this.img=l.getInstance().get(r)}update(e){super.update(e),this.rotation+=this.rotationSpeed*e,this.x+=this.dx*e,this.y+=this.dy*e,this.sizeDelta=Math.max(0,Math.sin(this.elapsed/this.sizeInterval)*5),this.rotationInterval>0&&(this.rotationInterval-=e,this.rotationInterval<0&&(this.rotationSpeed=this.rotationSpeed>0?0:.03,this.rotationInterval=this.rotationIntervalMax)),this.isMoving&&(this.dy+=$,this.elapsed>2e3&&(this.isDestroied=!0))}draw(e){e.save(),e.translate(this.x,this.y),e.rotate(this.rotation);const s=this.radius+this.sizeDelta;this.isMoving&&(e.globalAlpha=1-this.elapsed/2e3),e.drawImage(this.img,-s*.5,-s*.5,s,s),e.restore()}impulse(e,s){this.elapsed=0,this.isMoving=!0,this.rotationSpeed=e*.1,this.dx=e,this.dy=s}}const v=class{constructor(){i(this,"highScore");i(this,"score");i(this,"combo");i(this,"maxCombo");i(this,"correct");i(this,"incorrect");this.score=0,this.highScore=0,this.combo=0,this.maxCombo=0,this.correct=0,this.incorrect=0}static getInstance(){return v.instance||(v.instance=new v),v.instance}getScore(){return this.score}getHighScore(){return this.highScore}addScore(t){this.score+=t,this.score>this.highScore&&(this.highScore=this.score)}addCorrect(){this.correct++}addIncorrect(){this.incorrect++}getCorrect(){return this.correct}getIncorrect(){return this.incorrect}setCombo(t){this.combo=t,this.maxCombo=Math.max(this.maxCombo,this.combo)}getMaxCombo(){return this.maxCombo}resetScore(){this.score=0,this.combo=0,this.maxCombo=0,this.correct=0,this.incorrect=0}};let d=v;i(d,"instance");const p=120;class G extends M{constructor(e,s){super();i(this,"img");i(this,"frame",0);i(this,"duration",200);i(this,"x",0);i(this,"y",0);this.img=l.getInstance().get("correct_effect"),this.x=e,this.y=s}update(e){super.update(e),!this.isDestroied&&(this.frame=Math.floor(this.elapsed/(this.duration/5)),this.elapsed>this.duration&&(this.isDestroied=!0))}draw(e){if(this.isDestroied)return;e.save(),e.translate(Math.floor(this.x),Math.floor(this.y));const s=this.frame;e.drawImage(this.img,s*p,0,p,p,-p/2,-p/2,p,p),e.restore()}}const T={normal:[50,50,50,1],correct:[0,125,0,1],incorrect:[255,0,0,1]};class J extends w{constructor(){super();i(this,"combo",0);i(this,"comboTimer",0);i(this,"comboTimerMax",300);i(this,"comboTimerActive",!1);i(this,"incorrectTimer",0);i(this,"incorrectTimerMax",1e3);i(this,"incorrectTimerActive",!1);i(this,"gap",0);i(this,"cells",[]);i(this,"children",[]);i(this,"effects",[]);i(this,"targetZoom",1);i(this,"currentZoom",1);i(this,"pressedJTimer",0);i(this,"pressedFTimer",0);i(this,"pressedTimerMax",200);i(this,"milab");i(this,"ended",!1);this.milab=new F}addCell(){const e=this.randomCell();this.cells.push(e),this.children.push(new Z(0,0,e))}randomCell(){return Math.random()<.5?"rbc":P[Math.floor(Math.random()*(P.length-2))]}enter(){this.reset();for(let e=0;e<10;e++)this.addCell();l.getInstance().get("bgm_normal").currentTime=0,l.getInstance().get("bgm_normal").play()}exit(){}update(e){if(super.update(e),this.ended){this.elapsed>1e3&&m.getInstance().emit("changeState","gameOver");return}this.updatePlaying(e),this.children=this.children.filter(s=>!s.isDestroied),this.children.forEach(s=>s.update(e)),this.effects.forEach(s=>s.update(e)),this.effects=this.effects.filter(s=>!s.isDestroied),this.milab.update(e)}updatePlaying(e){const s=f.getInstance();if(this.elapsed>=K){this.ended=!0,l.getInstance().get("bgm_normal").pause(),this.playSFX("whistle"),this.elapsed=0;return}if(this.gap<0?this.gap+=e*(40/200):this.gap=0,this.comboTimerActive&&(this.comboTimer+=e,this.comboTimer>this.comboTimerMax&&(this.comboTimerActive=!1,this.comboTimer=0,this.combo=0)),this.currentZoom+=(this.targetZoom-this.currentZoom)*.1,this.incorrectTimerActive){this.incorrectTimer+=e,this.incorrectTimer>this.incorrectTimerMax&&(this.incorrectTimerActive=!1,this.incorrectTimer=0);return}(this.pressedJTimer>0||this.pressedFTimer>0)&&(this.pressedJTimer-=e,this.pressedFTimer-=e),this.pressedJTimer<0&&(this.pressedJTimer=0),this.pressedFTimer<0&&(this.pressedFTimer=0),s.isKeyPressed("j")||s.isKeyPressed("ArrowRight")?(this.isRbc(this.cells[0])?this.setCorrect():this.setIncorrect(),this.pressedJTimer=this.pressedTimerMax,this.popCell()):(s.isKeyPressed("f")||s.isKeyPressed("ArrowLeft"))&&(this.isWbc(this.cells[0])?this.setCorrect():this.setIncorrect(),this.pressedFTimer=this.pressedTimerMax,this.popCell())}setCorrect(){this.combo++,this.comboTimerActive=!0,this.comboTimer=0,this.milab.correct(this.comboTimerMax),this.playSFX("correct");const e=this.children[0];e&&(e.x=a/2,e.y=n-140,this.isRbc(e.type)?e.impulse(.3,-.7):e.impulse(-.3,-.7)),this.effects.push(new G(a/2,n-140)),d.getInstance().addScore(this.combo*5),d.getInstance().setCombo(this.combo),d.getInstance().addCorrect()}playSFX(e){const s=l.getInstance().get(e);s.pause(),s.currentTime=0,s.play()}setIncorrect(){this.combo=0,this.comboTimerActive=!1,this.incorrectTimerActive=!0,this.incorrectTimer=0,this.milab.incorrect(this.incorrectTimerMax);const e=this.children[0];e&&(e.isWrong=!0,e.x=a/2,e.y=n-140,this.isRbc(e.type)?e.impulse(-.3,-.2):e.impulse(.3,-.2)),this.playSFX("wrong"),d.getInstance().addIncorrect()}popCell(){this.cells.shift();const e=this.children.shift();e&&this.effects.push(e),this.addCell(),this.gap=-40}isRbc(e){return e==="rbc"}isWbc(e){return e==="neut"||e==="lymph"||e==="mono"||e==="eo"||e==="baso"}reset(){this.elapsed=0,this.combo=0,this.cells=[],this.children=[],this.effects=[],this.targetZoom=1,this.currentZoom=1,this.gap=0,this.comboTimerActive=!1,this.comboTimer=0,this.incorrectTimerActive=!1,this.incorrectTimer=0,this.pressedJTimer=0,this.pressedFTimer=0,d.getInstance().resetScore(),this.milab.x=a/2,this.milab.y=n-this.milab.height*2;for(let e=0;e<10;e++)this.addCell()}render(e){this.renderPlaying(e)}renderPlaying(e){e.save(),this.incorrectTimerActive?(e.fillStyle=this.toColor(I(T.incorrect,T.normal,this.incorrectTimer/this.incorrectTimerMax)),e.filter="grayscale(100%)",e.translate(Math.sin(this.incorrectTimer/50)*10,0)):this.comboTimerActive?e.fillStyle=this.toColor(I(T.correct,T.normal,this.incorrectTimer/this.incorrectTimerMax)):e.fillStyle=this.toColor(T.normal),e.fillRect(0,0,e.canvas.width,e.canvas.height),this.renderCells(e),this.renderCombo(e),e.fillStyle="white",e.font="30px bitbit",e.textAlign="center",e.textBaseline="middle",e.fillText("WBC",a*.25,n*.75),e.fillText("RBC",a*.75,n*.75),this.drawKey(e,"F",a*.25,n*.75+40,this.pressedFTimer),this.drawKey(e,"J",a*.75,n*.75+40,this.pressedJTimer),e.fillStyle="#fff",e.textAlign="left",e.textBaseline="top",e.font="14px bitbit",e.fillText(`High Score: ${C(d.getInstance().getHighScore(),8)}`,20,5),e.font="20px bitbit",e.fillText(`Score: ${C(d.getInstance().getScore(),8)}`,20,20),e.textAlign="right";const s=this.ended?0:Math.max(0,(K-this.elapsed)/1e3),r=`${Math.floor((s-Math.floor(s))*100)}0`.slice(0,2);e.fillText(`${C(Math.floor(s),2)}.${r}`,a-20,20),this.milab.scale=this.currentZoom+1,this.milab.draw(e),this.drawAim(e),e.restore()}toColor(e){return`rgba(${e[0]}, ${e[1]}, ${e[2]}, ${e[3]})`}renderCells(e){e.save(),e.translate(a/2,n-100),e.scale(this.currentZoom,this.currentZoom),e.translate(0,this.gap),this.children.forEach(s=>{e.translate(0,-40),s.draw(e)}),e.restore(),this.effects.forEach(s=>{s.draw(e)})}renderCombo(e){if(this.comboTimerActive){const s=Math.min(1,this.comboTimer/(this.comboTimerMax/2))*10;e.save(),e.translate(a/2,n/2-120),e.fillStyle="#fff",e.font="30px bitbit",e.textAlign="center",e.textBaseline="top",e.fillText("COMBO",0,10),e.font="50px bitbit",e.fillText(`${this.combo}`,0,s+30),e.restore()}}drawKey(e,s,r,h,c){e.save(),e.translate(r,h),e.strokeStyle="#fff",e.fillStyle=this.toColor(I([255,255,255,.5],[0,0,0,0],1-c/this.pressedTimerMax)),e.lineWidth=2,c>0&&e.fillRect(-20,-20,40,40),e.strokeRect(-20,-20,40,40),e.fillStyle="#fff",e.font="30px bitbit",e.textAlign="center",e.textBaseline="middle",e.fillText(s,0,0),e.restore()}drawAim(e){e.save(),e.translate(a/2,n-140),e.strokeStyle="#fff",e.lineWidth=2,e.beginPath(),e.arc(0,0,20,0,Math.PI*2),e.stroke(),e.beginPath(),e.moveTo(-25,0),e.lineTo(25,0),e.moveTo(0,-25),e.lineTo(0,25),e.stroke(),e.restore()}}class W extends w{constructor(){super(...arguments);i(this,"counted",0)}enter(){}exit(){}update(e){if(super.update(e),this.elapsed>this.counted*1e3&&(this.counted++,this.counted<=3)){const s=this.counted===3?"whistle":"count",r=l.getInstance().get(s);r.currentTime=0,r.play()}this.elapsed>3e3&&m.getInstance().emit("changeState","game")}render(e){const s=[30,60,240,120],r=Math.min(Math.floor(this.elapsed/1e3),2);e.save(),e.fillStyle="#ea5504",e.fillRect(0,0,e.canvas.width,e.canvas.height),e.font=`${s[r]}px bitbit`,e.fillStyle="#fff",e.textAlign="center",e.textBaseline="middle",e.fillText(["Ready","Get Set","GO!!"][r],a/2,n/2),e.restore()}}class H extends w{constructor(){super(...arguments);i(this,"lastScoreSoundTime",0);i(this,"milab",new F)}enter(){l.getInstance().get("gameover").currentTime=0,l.getInstance().get("gameover").play(),this.milab.x=Math.floor(a/2),this.milab.y=Math.floor(n*.25+30),this.milab.scale=1}exit(){}update(e){super.update(e),this.milab.update(e),this.elapsed>3500?(l.getInstance().get("score").pause(),f.getInstance().isKeyPressed(" ")&&m.getInstance().emit("changeState","ready")):this.elapsed<3e3&&this.elapsed>500&&f.getInstance().isKeyPressed(" ")&&(this.elapsed=3e3);const s=l.getInstance().get("score");this.elapsed<3e3&&this.elapsed>this.lastScoreSoundTime+100&&(s.currentTime=0,this.lastScoreSoundTime=this.elapsed,l.getInstance().get("score").play())}render(e){e.save();const[s,r,h,c]=I([0,0,0,0],[d.getInstance().getScore(),d.getInstance().getMaxCombo(),d.getInstance().getCorrect(),d.getInstance().getIncorrect()],Math.min(1,this.elapsed/3e3)).map(Math.floor);e.fillStyle="#ea5504",e.fillRect(0,0,e.canvas.width,e.canvas.height),e.font="30px bitbit",e.fillStyle="#fff",e.textAlign="center",e.textBaseline="middle",e.fillText("Game Over",a/2,n*.25-20),e.textAlign="right",e.font="40px bitbit",e.fillText("Score",a/2,n*.5-20),e.font="20px bitbit",e.fillText("HighScore",a/2,n*.5+10),e.fillText("Max Combo",a/2,n*.5+40),e.fillText("Correct",a/2,n*.5+70),e.fillText("Incorrect",a/2,n*.5+100),e.textAlign="left",e.font="40px bitbit",e.fillText(`${s}`,a/2+10,n*.5-20),e.font="20px bitbit",e.fillText(`${d.getInstance().getHighScore()}`,a/2+10,n*.5+10),e.fillText(`${r}`,a/2+10,n*.5+40),e.fillText(`${h}`,a/2+10,n*.5+70),e.fillText(`${c}`,a/2+10,n*.5+100),this.elapsed>3e3&&(this.elapsed-3e3)%1e3<500&&(e.font="20px bitbit",e.textAlign="center",e.fillText("Press SPACE to restart",a/2,n*.5+160)),this.milab.draw(e),e.restore()}}const N={initial:O,loading:k,game:J,ready:W,gameOver:H},A=5;class X{constructor(t){i(this,"state");i(this,"lastUpdate",0);i(this,"elapsed",0);i(this,"elapsedSinceLastUpdate",0);i(this,"canvas");this.canvas=document.createElement("canvas"),this.canvas.width=a,this.canvas.height=n,t.append(this.canvas),this.changeState(new k),m.getInstance().on("changeState",e=>{const s=new N[e];this.changeState(s)}),f.getInstance().init(),this.loop()}changeState(t){this.state&&this.state.exit(),this.state=t,this.state.enter()}loop(){const t=Date.now();this.lastUpdate||(this.lastUpdate=t);const e=t-this.lastUpdate;for(this.elapsed+=e,this.elapsedSinceLastUpdate+=e,this.lastUpdate=t;this.elapsedSinceLastUpdate>=A;)this.updateState(),this.elapsedSinceLastUpdate-=A;this.canvas.width=a;const s=this.canvas.getContext("2d");s.imageSmoothingEnabled=!1,s.webkitImageSmoothingEnabled=!1,this.state.render(s),requestAnimationFrame(this.loop.bind(this))}updateState(){this.state.update(A),f.getInstance().update()}}const E=document.getElementById("app");E&&new X(E);
