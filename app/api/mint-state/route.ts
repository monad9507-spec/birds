import { readMintState } from "@/lib/ink-contract";
import { isAddress } from "ethers";
export const dynamic = "force-dynamic";
export async function GET(request:Request){
  const url=new URL(request.url);const quantity=Number(url.searchParams.get("quantity")??1);const address=url.searchParams.get("address")||undefined;
  if(!Number.isInteger(quantity)||quantity<1||quantity>250||(address&&!isAddress(address)))return Response.json({error:"Invalid request"},{status:400});
  try{return Response.json(await readMintState(quantity,address),{headers:{"Cache-Control":"no-store"}});}
  catch(error){console.warn("Ink read failed",String(error));return Response.json({error:"Ink is temporarily unavailable. Please retry; no transaction has been sent."},{status:503,headers:{"Cache-Control":"no-store"}});}
}
