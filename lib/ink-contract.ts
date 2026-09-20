import { Interface, ZeroAddress, isAddress } from "ethers";

export const CONTRACT = "0x41715938926CDd0D822F4727Db8F6a2a18E1A605";
export const PUBLIC_KEY = "0x" + "1".padStart(64,"0");
export const CHAIN_ID = 57073;
export const EXPLORER = "https://explorer.inkonchain.com";
export const RPC_URLS = ["https://rpc-gel.inkonchain.com","https://rpc-qnd.inkonchain.com"];
export const ABI = [
  "function config() view returns (string baseUri,address affiliateSigner,uint32 maxSupply,uint32 maxBatchSize,uint16 affiliateFee,uint16 affiliateDiscount,uint16 defaultRoyalty)",
  "function totalSupply() view returns (uint256)",
  "function tokensOfOwner(address) view returns (uint256[])",
  "function tokenURI(uint256) view returns (string)",
  "function invites(bytes32) view returns (uint128 price,uint128 reservePrice,uint128 delta,uint32 start,uint32 end,uint32 limit,uint32 maxSupply,uint32 interval,uint32 unitSize,address tokenAddress,bool isBlacklist)",
  "function listSupply(bytes32) view returns (uint256)",
  "function minted(address,bytes32) view returns (uint256)",
  "function packedBonusDiscounts(bytes32) view returns (uint256)",
  "function computePrice(bytes32,uint256,bool) view returns (uint256)",
  "function mint((bytes32 key,bytes32[] proof) auth,uint256 quantity,address affiliate,bytes signature) payable",
  "event Transfer(address indexed from,address indexed to,uint256 indexed tokenId)",
  "error MintingPaused()", "error MintNotYetStarted()", "error MintEnded()", "error NumberOfMintsExceeded()", "error ListMaxSupplyExceeded()", "error MaxBatchSizeExceeded()", "error MaxSupplyExceeded()", "error InsufficientEthSent()", "error WalletUnauthorizedToMint()", "error Blacklisted()"
];
export const contractInterface = new Interface(ABI);
export type ContractRead = [string, unknown[]];
export async function readContractSnapshot(calls:ContractRead[]) {
  let lastError:unknown;
  for(const rpc of RPC_URLS){
    try{
      const post=async(payload:unknown)=>{
        const response=await fetch(rpc,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload),signal:AbortSignal.timeout(12000),cache:"no-store"});
        if(!response.ok)throw new Error("Ink is temporarily unavailable.");
        return await response.json() as Array<{id:number;result?:unknown;error?:unknown}>;
      };
      const heads=await post([{jsonrpc:"2.0",id:0,method:"eth_chainId",params:[]},{jsonrpc:"2.0",id:1,method:"eth_getBlockByNumber",params:["latest",false]}]);
      if(!Array.isArray(heads)||Number(BigInt(String(heads.find(x=>x.id===0)?.result)))!==CHAIN_ID)throw new Error("Unable to verify the Ink network.");
      const head=heads.find(x=>x.id===1)?.result as {number?:string;timestamp?:string}|undefined;
      if(!head?.number||!head.timestamp)throw new Error("Unable to read the latest Ink block.");
      const response=await post(calls.map(([name,args],id)=>({jsonrpc:"2.0",id,method:"eth_call",params:[{to:CONTRACT,data:contractInterface.encodeFunctionData(name,args)},head.number]})));
      if(!Array.isArray(response))throw new Error("Invalid Ink response.");
      const results=calls.map(([name],id)=>{const value=response.find(x=>x.id===id)?.result;if(typeof value!=="string")throw new Error("Unable to read the collection.");return contractInterface.decodeFunctionResult(name,value);});
      return{results,block:Number(BigInt(head.number)),timestamp:Number(BigInt(head.timestamp))};
    }catch(error){lastError=error;}
  }
  throw lastError??new Error("Unable to reach Ink.");
}
export type MintState = { supply:number; maxSupply:number; walletLimit:number; batchLimit:number; walletMinted:number|null; remaining:number; available:number; price:string; total:string; quantity:number; address:string|null; active:boolean; reason:string; block:number; timestamp:number; };

// Only fixed, read-only methods and a fixed contract are exposed to the website.
export async function readMintState(quantity=1,address?:string):Promise<MintState> {
  if(!Number.isInteger(quantity)||quantity<1||quantity>250) throw new Error("Invalid quantity");
  if(address&&!isAddress(address)) throw new Error("Invalid wallet address");
      const calls:ContractRead[]=[["config",[]],["totalSupply",[]],["invites",[PUBLIC_KEY]],["listSupply",[PUBLIC_KEY]],["computePrice",[PUBLIC_KEY,1,false]],["computePrice",[PUBLIC_KEY,quantity,false]],["packedBonusDiscounts",[PUBLIC_KEY]]];
      if(address)calls.push(["minted",[address,PUBLIC_KEY]]);
      const {results,block,timestamp}=await readContractSnapshot(calls);
      const [config,[supply],invite,[listSupply],[price],[total],[bonus]]=results;
      const walletMinted=address?Number(results[7][0]):null;
      const maxSupply=Number(config.maxSupply),walletLimit=Number(invite.limit),batchLimit=Number(config.maxBatchSize);
      const collectionRemaining=Math.max(0,maxSupply-Number(supply));
      const listRemaining=Number(invite.maxSupply)<maxSupply?Math.max(0,Number(invite.maxSupply)-Number(listSupply)):collectionRemaining;
      const walletRemaining=walletLimit<Number(invite.maxSupply)?Math.max(0,walletLimit-(walletMinted??0)):collectionRemaining;
      const remaining=Math.min(collectionRemaining,listRemaining);
      let reason="";
      if(invite.tokenAddress!==ZeroAddress||invite.isBlacklist||Number(invite.unitSize)>1||bonus!==0n) reason="Mint settings changed. Please check the collection before minting.";
      else if(walletLimit===0)reason="Public mint is paused.";
      else if(timestamp<Number(invite.start))reason="Public mint has not started yet.";
      else if(Number(invite.end)>Number(invite.start)&&timestamp>Number(invite.end))reason="Public mint has ended.";
      else if(!remaining)reason="Sold out.";
      return {supply:Number(supply),maxSupply,walletLimit,batchLimit,walletMinted,remaining,available:Math.min(250,batchLimit,remaining,walletRemaining),price:price.toString(),total:total.toString(),quantity,address:address??null,active:!reason,reason,block,timestamp};
}
