import type { Draft } from "./booking";
import { normalizePhone,validateStage } from "./booking";
import { randomUUID } from "expo-crypto";

type Receipt={id:string;created_at:string;pickup:string;dropoff:string};
const base=process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

export function bookingApiConfigured():boolean {
  try {const url=new URL(base||"");return url.protocol==="https:"&&Boolean(url.hostname)&&!url.hostname.includes("YOUR_APPROVED");}
  catch{return false;}
}
export type SaveResult={ok:true;receipt:Receipt;replayed:boolean}|{ok:false;message:string};
export async function saveCustomerDraft(draft:Draft,token:string,requestKey:string):Promise<SaveResult>{
  const issue=validateStage(1,draft)||validateStage(2,draft);
  if(issue)return{ok:false,message:issue};
  if(!bookingApiConfigured())return{ok:false,message:"Secure booking API has not been configured."};
  if(!token)return{ok:false,message:"Please sign in to save this draft."};
  const origin=(base||"").replace(/\/+$/,"");
  const payload={
    pickup:draft.pickup.trim(),dropoff:draft.dropoff.trim(),vehicle:draft.vehicle,
    parcel_type:draft.parcelType,weight_kg:Number(draft.weightKg),
    recipient_name:draft.recipientName.trim(),recipient_phone:normalizePhone(draft.recipientPhone),
    notes:draft.notes,idempotency_key:requestKey
  };
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
  try {
    const response=await fetch(origin+"/api/v2/drafts",{
      method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},
      body:JSON.stringify(payload),signal:controller.signal
    });
    if(response.status===401)return{ok:false,message:"Your session has expired. Please sign in again."};
    if(response.status===503)return{ok:false,message:"Draft service is unavailable. Try again later."};
    if(!response.ok)return{ok:false,message:"The draft could not be saved. Please check your details."};
    const json:unknown=await response.json();
    if(!json||typeof json!=="object"||!("draft" in json))return{ok:false,message:"Invalid server response."};
    const data=json as {draft:Receipt;replayed?:boolean};
    if(!data.draft||typeof data.draft.id!=="string")return{ok:false,message:"Invalid server response."};
    return{ok:true,receipt:data.draft,replayed:Boolean(data.replayed)};
  }catch{return{ok:false,message:"Connection failed. Your details remain in this app until you close it."};}
  finally{clearTimeout(timer);}
}
/** A fresh idempotency key per logical draft; reuse for retries of the same payload. */
export function createDraftRequestKey(){return randomUUID();}
