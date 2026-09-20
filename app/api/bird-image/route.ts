export const runtime = "nodejs";
export const maxDuration = 60;
// Fixed collection image source; never accept a caller-supplied URL.
export async function GET(request:Request){
 const id=new URL(request.url).searchParams.get('id');
 if(!id||!/^\d{1,5}$/.test(id)||Number(id)<1||Number(id)>10000)return new Response('Invalid bird',{status:400});
 try{
 const url=new URL('https://www.scatter.art/api/instareveal/media');url.searchParams.set('collectionId','fxaxzbm6yg5k5zij241rh34f');url.searchParams.set('tokenId',String(Number(id)));url.searchParams.set('mimeType','image/png');url.searchParams.set('filename',`${Number(id)}.png`);
 let response=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(15000)});
 if([301,302,303,307,308].includes(response.status)){
  const target=new URL(response.headers.get('location')||'');
  if(target.protocol!=='https:'||target.hostname!=='instareveal.a9d29174d4545e14b7f6e40e4715d493.r2.cloudflarestorage.com'||!target.pathname.startsWith('/fxaxzbm6yg5k5zij241rh34f/images/'))throw new Error('Unexpected image source');
  response=await fetch(target,{redirect:'error',signal:AbortSignal.timeout(15000)});
 }
 const type=response.headers.get('content-type')||'';
 if(!response.ok||!/^image\/(png|jpeg|webp)(;|$)/i.test(type))throw new Error('Image unavailable');
 const data=await response.arrayBuffer();if(data.byteLength>8000000)throw new Error('Image too large');
 return new Response(data,{headers:{'Content-Type':type,'Cache-Control':'public, max-age=3600','X-Content-Type-Options':'nosniff'}});
 }catch(error){console.warn('Bird image unavailable',String(error));return new Response('Artwork is unavailable. Please retry.',{status:502});}
}
