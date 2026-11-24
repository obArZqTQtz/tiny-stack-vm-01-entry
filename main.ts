// tiny stack VM: implements make.fun's tiny stack ISA (ISA.md) exactly as the reference vm.mjs; main entry: reads /input/<id>/program.bin + input.bin, writes /output/<id>/stdout.bin + exit.txt.
import{mkdirSync as M,readdirSync as D,readFileSync as R,writeFileSync as W}from'fs';
import{join as J}from'path';
const G=' 1a$&*+/pppppppp)))))))%)))%)))p)))ppppppppppppp@DD@ ppppppppppp%(pppppppppppppp$$!$';
const F=[,,,,,,,,,,,,,,,,(e,b)=>e+b|0,(e,b)=>e-b|0,Math.imul,(e,b)=>(e/b)|0,(e,b)=>b==-1?0:e%b|0,(e,b)=>(e>>>0)/(b>>>0)|0,(e,b)=>(e>>>0)%(b>>>0)|0,,(e,b)=>e&b,(e,b)=>e|b,(e,b)=>e^b,,(e,b)=>e<<(b&31),(e,b)=>e>>(b&31),(e,b)=>e>>>(b&31)|0,,(e,b)=>e===b?1:0,(e,b)=>e<b?1:0,(e,b)=>(e>>>0)<(b>>>0)?1:0];
function r(p,q){
let s=[],c=[],m=new Int32Array(256),o='',i=0,pc=0,t=0;
let d=e=>({out:Buffer.from(o,'latin1'),code:e});
for(;;){
if(t===1e6)return d(10);
if(pc<0||pc>=p.length)return d(9);
let a=p[pc],v=a>83?80:G.charCodeAt(a)-32;
if(v>79)return d(5);
let A=v>>4,P=v>>2&3,U=v&3;
if(pc+A>=p.length)return d(9);
t++;
let x=pc+1+A;
if(s.length<P)return d(2);
if(s.length-P+U>256)return d(3);
pc=x;
switch(a){
case 0:return d(0);
case 1:s.push((p[x-1]<<24)>>24);break;
case 2:s.push(p[x-4]|p[x-3]<<8|p[x-2]<<16|p[x-1]<<24);break;
case 3:s.pop();break;
case 4:s.push(s[s.length-1]);break;
case 5:s.push(s.splice(-2,1)[0]);break;
case 6:s.push(s[s.length-2]);break;
case 7:s.push(s.splice(-3,1)[0]);break;
case 23:s[s.length-1]=-s[s.length-1]|0;break;
case 27:s[s.length-1]=~s[s.length-1];break;
case 16:case 17:case 18:case 19:case 20:case 21:case 22:case 24:case 25:case 26:case 28:case 29:case 30:case 32:case 33:case 34:{
if(a>18&&a<23&&!s[s.length-1])return d(4);
let b=s.pop(),e=s.pop();
s.push(F[a](e,b));break;}
case 48:case 49:case 50:{
if(a===48||(a===49)===(s.pop()===0))pc=x+((p[x-2]|p[x-1]<<8)<<16>>16);
break;}
case 51:
if(c.length===64)return d(7);
c.push(x);pc=p[x-2]|p[x-1]<<8;break;
case 52:
if(!c.length)return d(8);
pc=c.pop();break;
case 64:{let y=s[s.length-1];if(y<0||y>=256)return d(6);s[s.length-1]=m[y];break;}
case 65:{let y=s[s.length-1];if(y<0||y>=256)return d(6);m[y]=s[s.length-2];s.length-=2;break;}
case 80:{let z=''+s[s.length-1];if(o.length+z.length>65536)return d(11);s.pop();o+=z;break;}
case 81:if(o.length+1>65536)return d(11);o+=String.fromCharCode(s.pop()&255);break;
case 82:s.push(i<q.length?q[i++]:-1);break;
case 83:return d(s.pop()&255);
}
}
}
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
for(const e of D(I).sort()){
let v=r(R(J(I,e,'program.bin')),R(J(I,e,'input.bin')));
M(J(O,e),{recursive:true});
W(J(O,e,'stdout.bin'),v.out);
W(J(O,e,'exit.txt'),v.code+'\n');
}
