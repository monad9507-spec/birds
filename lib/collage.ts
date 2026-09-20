import {readBird} from './birds';
export const THEMES={purple:{background:'#7863e5',text:'#fffdf9',accent:'#d4f588'},dark:{background:'#211a45',text:'#fffdf9',accent:'#d4f588'},light:{background:'#f5f2ff',text:'#211a45',accent:'#7863e5'}};
export type CollageTheme=keyof typeof THEMES;
export async function drawCollage(canvas:HTMLCanvasElement,images:CanvasImageSource[],size:number,theme:CollageTheme,title:string){
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Your browser cannot create the image.');
 canvas.width=2400;canvas.height=2700;const colors=THEMES[theme];ctx.fillStyle=colors.background;ctx.fillRect(0,0,2400,2700);ctx.imageSmoothingEnabled=false;
 ctx.fillStyle=colors.text;ctx.font='bold 104px Arial, sans-serif';let font=104;while(ctx.measureText(title).width>2200&&font>30){font-=2;ctx.font=`bold ${font}px Arial, sans-serif`;}ctx.fillText(title,100,170);
 const columns=Math.sqrt(size),gap=24,cell=(2200-gap*(columns-1))/columns;
 for(let i=0;i<images.length;i++){const img=images[i] as HTMLImageElement;const width=img.naturalWidth||img.width,height=img.naturalHeight||img.height;const scale=Math.min(cell/width,cell/height);ctx.drawImage(img,100+(i%columns)*(cell+gap)+(cell-width*scale)/2,270+Math.floor(i/columns)*(cell+gap)+(cell-height*scale)/2,width*scale,height*scale);}
 ctx.fillStyle=colors.text;ctx.font='bold 52px Arial, sans-serif';ctx.fillText('INKBIRDS · ON INK',100,2600);ctx.fillStyle=colors.accent;ctx.fillRect(2220,2555,70,70);
}
export async function loadExportImage(id:string){
 let response:Response;try{const bird=await readBird(id);if(!bird.image)throw new Error('No artwork');response=await fetch(bird.image,{mode:'cors',signal:AbortSignal.timeout(15000)});if(!response.ok)throw new Error('Artwork unavailable');}catch{response=await fetch(`/api/bird-image?id=${encodeURIComponent(id)}`,{signal:AbortSignal.timeout(35000)});}if(!response.ok)throw new Error(`Could not load bird #${id}. Please try again.`);
 const blob=await response.blob();const url=URL.createObjectURL(blob);try{return await new Promise<HTMLImageElement>((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error(`Could not decode bird #${id}.`));img.src=url;});}finally{URL.revokeObjectURL(url);}
}
