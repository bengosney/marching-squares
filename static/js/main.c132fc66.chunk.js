(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{10:function(e,t,n){e.exports=n(18)},15:function(e,t,n){},17:function(e,t,n){},18:function(e,t,n){"use strict";n.r(t);var a=n(0),i=n.n(a),r=n(5),o=n.n(r),c=(n(15),n(6)),s=n(1),u=n(8),h=n(9),l=n(2),v=n(3),d=n(7);n(17);function f(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}();return function(){var n,a=Object(l.a)(e);if(t){var i=Object(l.a)(this).constructor;n=Reflect.construct(a,arguments,i)}else n=a.apply(this,arguments);return Object(h.a)(this,n)}}var m=function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;Object(v.a)(this,e),this.x=t,this.y=n},g=function(e){Object(u.a)(n,e);var t=f(n);function n(e){var a;return Object(v.a)(this,n),(a=t.call(this,e)).state={pixelSize:10,height:500,width:150,mouseX:-9999,mouseY:-9999,mouseEvent:0,effectMod:2,strength:40,strengthCur:0,mouseOver:!1,cutoff:128},a.drawing=!1,a.ctx=null,a.data=[[]],a.updateWindowDimensions=a.updateWindowDimensions.bind(Object(s.a)(a)),a.startts=a.getTS(),a.noise=Object(d.makeNoise3D)(1),a}return Object(c.a)(n,[{key:"getValues",value:function(e,t,n){for(var a=this.state.pixelSize,i=this.noise,r=Math.ceil(t/a)+1,o=Math.ceil(e/a)+1,c=a/100,s=new Array(o),u=0;u<o;u++){s[u]=new Array(r);for(var h=0;h<r;h++)s[u][h]=parseFloat(i(u*c,h*c,n)).toFixed(4)}return s}},{key:"componentDidMount",value:function(){var e=this,t=this.refs.canvas;this.canvas=t,this.ctx=t.getContext("2d"),this.rAF=requestAnimationFrame(function(){return e.updateAnimationState()}),this.updateWindowDimensions(),window.addEventListener("resize",this.updateWindowDimensions)}},{key:"updateWindowDimensions",value:function(){var e=this.canvas.getBoundingClientRect(),t=window,n=t.innerWidth,a=t.innerHeight,i=e.width,r=e.height,o=Math.min(i,n),c=Math.min(r,a);this.setState({width:o,height:c}),this.nextFrame()}},{key:"componentWillUnmount",value:function(){cancelAnimationFrame(this.rAF),window.removeEventListener("resize",this.updateWindowDimensions)}},{key:"updateAnimationState",value:function(){this.ts=this.getTS(),this.clearFrame(),this.drawDots(),this.nextFrame()}},{key:"nextFrame",value:function(){var e=this,t=this.state;t.width,t.height;this.rAF=requestAnimationFrame(function(){return e.updateAnimationState()})}},{key:"clearFrame",value:function(){var e=this.state,t=e.width,n=e.height;this.ctx.clearRect(0,0,t,n)}},{key:"getTS",value:function(){return(new Date).getTime()}},{key:"convertRange",value:function(e,t,n){return(e-t[0])*(n[1]-n[0])/(t[1]-t[0])+n[0]}},{key:"distance",value:function(e,t,n,a){var i=e-n,r=t-a;return Math.sqrt(i*i+r*r)}},{key:"scale",value:function(e,t,n){return(e-t[0])*(n[1]-n[0])/(t[1]-t[0])+n[0]}},{key:"drawDots",value:function(){for(var e=this,t=this.state,n=t.width,a=t.height,i=t.pixelSize,r=t.cutoff,o=this.ctx,c=(this.getTS(),this.getValues(n,a,Date.now()/1e4)),s=this.convertRange(r,[0,255],[-1,1]),u=function(e){return e>s?1:0},h=function(t){for(var n=function(n){var a=c[t][n],r=c[t+1][n],s=c[t+1][n+1],h=c[t][n+1],l="".concat(u(a)).concat(u(r)).concat(u(s)).concat(u(h)),v=function(e,a){var r=arguments.length>2&&void 0!==arguments[2]&&arguments[2];o.beginPath(),o.strokeStyle=r?"".concat(r):"rgba(0, 255, 0, 1)",o.moveTo(t*i+e.x,n*i+e.y),o.lineTo(t*i+a.x,n*i+a.y),o.stroke()},d=e.convertRange(c[t][n],[-1,1],[0,1]),f=e.convertRange(c[t+1][n],[-1,1],[0,1]),g=e.convertRange(c[t+1][n+1],[-1,1],[0,1]),w=e.convertRange(c[t][n+1],[-1,1],[0,1]),y=new m;y.x=i*((d+f)/2),y.y=0;var p=new m;p.x=i,p.y=i*((f+g)/2);var k=new m;k.x=i*((g+w)/2),k.y=i;var b=new m;switch(b.x=0,b.y=i*((w+d)/2),l){case"1110":case"0001":v(k,b);break;case"1101":case"0010":v(p,k);break;case"1011":case"0100":v(y,p);break;case"0111":case"1000":v(b,y);break;case"1100":case"0011":v(b,p);break;case"1001":case"0110":v(y,k);break;case"1010":(d+f)/2>.5?(v(y,b),v(p,k)):(v(y,p),v(k,b));break;case"0101":v(y,p),v(k,b)}},a=0;a<c[t].length-1;a++)n(a)},l=0;l<c.length-1;l++)h(l)}},{key:"render",value:function(){var e=this,t=this.state,n=t.width,a=t.height,r=t.cutoff;return i.a.createElement("div",{className:"grid"},i.a.createElement("div",{class:"ui"},i.a.createElement("p",null,"Controles"),i.a.createElement("label",{htmlFor:"height"},"Height"),i.a.createElement("input",{type:"range",min:"0",max:"255",value:r,onChange:function(t){return e.setState({cutoff:t.target.value})},className:"slider",id:"height",name:"height"})),i.a.createElement("div",{className:"dots"},i.a.createElement("canvas",{ref:"canvas",width:n,height:a})))}}]),n}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(i.a.createElement(g,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[10,1,2]]]);
//# sourceMappingURL=main.c132fc66.chunk.js.map