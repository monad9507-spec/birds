import {CONTRACT,EXPLORER} from './ink-contract';
import {safeImageUrl,type Bird} from './birds';
export async function readGallery(cursor?:string){
 const url=new URL(`${EXPLORER}/api/v2/tokens/${CONTRACT}/instances`);
 if(cursor)url.searchParams.set('unique_token',cursor);
 const response=await fetch(url,{signal:AbortSignal.timeout(15000)});
 if(!response.ok)throw new Error('The gallery is taking a moment. Please try again.');
 const data=await response.json() as {items:{id:string;image_url?:string;metadata?:{name?:string;image?:string;attributes?:{trait_type:string;value:unknown}[]}}[];next_page_params?:{unique_token?:string|number}};
 if(!Array.isArray(data.items))throw new Error('Unable to load the gallery.');
 const birds:Bird[]=data.items.map(item=>({id:String(item.id),name:item.metadata?.name||`InkBirds #${item.id}`,image:safeImageUrl(item.metadata?.image)||safeImageUrl(item.image_url),traits:(item.metadata?.attributes||[]).filter(t=>typeof t.trait_type==='string'&&['string','number'].includes(typeof t.value)).map(t=>({label:t.trait_type,value:String(t.value)}))}));
 return {birds,next:data.next_page_params?.unique_token!=null?String(data.next_page_params.unique_token):null};
}
