import{mkdirSync,readdirSync,readFileSync,writeFileSync}from'node:fs';
import{join}from'node:path';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
function run(P:Buffer,N:Buffer):[Buffer,number]{
 let s=new Int32Array(256),sp=0,k=new Int32Array(64),kp=0,m=new Int32Array(256),pc=0,ip=0,st=0,o:number[]=[],e=-1,a=0,b=0,t=0,u='',L=P.length;
 while(e<0){
  if(st++>=1e6){e=10;break}
  if(pc<0||pc>=L){e=9;break}
  const op=P[pc],il=op==1?1:op==2?4:op>=48&&op<=51?2:0;
  if(!((op<=7)||(op>=16&&op<=34)||(op>=48&&op<=52)||op==64||op==65||(op>=80&&op<=83))){e=5;break}
  if(pc+1+il>L){e=9;break}
  let np=pc+1+il;
  switch(op){
   case 0:e=0;break;
   case 1:if(sp>255)e=3;else s[sp++]=P[pc+1]>127?P[pc+1]-256:P[pc+1];break;
   case 2:if(sp>255)e=3;else s[sp++]=P[pc+1]|P[pc+2]<<8|P[pc+3]<<16|P[pc+4]<<24;break;
   case 3:if(sp<1)e=2;else sp--;break;
   case 4:if(sp<1)e=2;else if(sp>255)e=3;else s[sp]=s[sp-1],sp++;break;
   case 5:if(sp<2)e=2;else t=s[sp-1],s[sp-1]=s[sp-2],s[sp-2]=t;break;
   case 6:if(sp<2)e=2;else if(sp>255)e=3;else s[sp]=s[sp-2],sp++;break;
   case 7:if(sp<3)e=2;else t=s[sp-3],s[sp-3]=s[sp-2],s[sp-2]=s[sp-1],s[sp-1]=t;break;
   case 16:case 17:case 18:case 19:case 20:case 21:case 22:case 24:case 25:case 26:case 28:case 29:case 30:case 32:case 33:case 34:
    if(sp<2){e=2;break}
    a=s[sp-2];b=s[sp-1];
    if(op>=19&&op<=22&&b==0){e=4;break}
    s[sp-2]=op==16?a+b|0:op==17?a-b|0:op==18?Math.imul(a,b):op==19?(a/b)|0:op==20?a%b:op==21?((a>>>0)/(b>>>0))|0:op==22?((a>>>0)%(b>>>0))|0:op==24?a&b:op==25?a|b:op==26?a^b:op==28?a<<(b&31):op==29?a>>(b&31):op==30?(a>>>(b&31))|0:op==32?a==b?1:0:op==33?a<b?1:0:(a>>>0)<(b>>>0)?1:0;
    sp--;break;
   case 23:if(sp<1)e=2;else s[sp-1]=-s[sp-1]|0;break;
   case 27:if(sp<1)e=2;else s[sp-1]=~s[sp-1];break;
   case 48:t=P[pc+1]|P[pc+2]<<8;if(t>32767)t-=65536;np=pc+3+t;break;
   case 49:if(sp<1){e=2;break}t=P[pc+1]|P[pc+2]<<8;if(t>32767)t-=65536;if(s[--sp]==0)np=pc+3+t;break;
   case 50:if(sp<1){e=2;break}t=P[pc+1]|P[pc+2]<<8;if(t>32767)t-=65536;if(s[--sp]!=0)np=pc+3+t;break;
   case 51:if(kp>63)e=7;else k[kp++]=pc+3,np=P[pc+1]|P[pc+2]<<8;break;
   case 52:if(kp<1)e=8;else np=k[--kp];break;
   case 64:if(sp<1)e=2;else if((a=s[sp-1])<0||a>255)e=6;else s[sp-1]=m[a];break;
   case 65:if(sp<2)e=2;else if((a=s[sp-1])<0||a>255)e=6;else m[a]=s[sp-2],sp-=2;break;
   case 80:if(sp<1){e=2;break}u=String(s[--sp]);if(o.length+u.length>65536)e=11;else for(const c of u)o.push(c.charCodeAt(0));break;
   case 81:if(sp<1){e=2;break}if(o.length>65535)e=11;else o.push(s[--sp]&255);break;
   case 82:if(sp>255)e=3;else s[sp++]=ip<N.length?N[ip++]:-1;break;
   case 83:if(sp<1)e=2;else e=s[--sp]&255;break;
  }
  if(e>=0)break;
  pc=np;
 }
 return[Buffer.from(o),e<0?0:e];
}
for(const d of readdirSync(I).sort()){
 const[x,y]=run(readFileSync(join(I,d,'program.bin')),readFileSync(join(I,d,'input.bin')));
 mkdirSync(join(O,d),{recursive:true});
 writeFileSync(join(O,d,'stdout.bin'),x);
 writeFileSync(join(O,d,'exit.txt'),y+'\n');
}
