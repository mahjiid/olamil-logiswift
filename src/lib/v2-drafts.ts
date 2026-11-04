import type { PostgrestError } from "@supabase/supabase-js";

/** Treat all client-supplied order data as untrusted. A validated draft is not a shipment. */
export type ValidDraft = {
  pickup:string;dropoff:string;vehicle:"motorcycle"|"car";
  parcel_type:"documents"|"parcel"|"fragile"|"other";
  weight_kg:number;recipient_name:string;recipient_phone:string;notes:string;
  idempotency_key:string;
};
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const VEHICLES = new Set(["motorcycle","car"]);
const PARCELS = new Set(["documents","parcel","fragile","other"]);

export function parseCustomerDraft(raw:unknown):{ok:true;data:ValidDraft}|{ok:false;error:string} {
  if (!raw||typeof raw!=="object"||Array.isArray(raw)) return {ok:false,error:"Invalid request"};
  const value = raw as Record<string,unknown>;
  const keys=["pickup","dropoff","vehicle","parcel_type","weight_kg","recipient_name","recipient_phone","notes","idempotency_key"];
  if(Object.keys(value).some(k=>!keys.includes(k))) return {ok:false,error:"Unexpected fields"};
  const str=(key:string,max:number)=>typeof value[key]==="string"&&value[key].length<=max?value[key] as string:null;
  const pickup=str("pickup",250)?.trim(),dropoff=str("dropoff",250)?.trim();
  const name=str("recipient_name",120)?.trim(),notes=str("notes",600);
  const phone=str("recipient_phone",24)?.replace(/[\s().-]/g,"");
  const normalizedPhone=phone&&/^0\d{10}$/.test(phone)?"+234"+phone.slice(1):phone;
  const vehicle=str("vehicle",20),parcel=str("parcel_type",20);
  const key=str("idempotency_key",40);
  const weight=value.weight_kg;
  if(!pickup||!dropoff||pickup.length<8||dropoff.length<8||pickup.toLowerCase()===dropoff.toLowerCase())
    return {ok:false,error:"Invalid pickup or destination"};
  if(!vehicle||!VEHICLES.has(vehicle)||!parcel||!PARCELS.has(parcel))
    return {ok:false,error:"Invalid vehicle or parcel type"};
  if(typeof weight!=="number"||!Number.isFinite(weight)||weight<=0||weight>1000)
    return {ok:false,error:"Invalid package weight"};
  if(!name||name.length<2||!normalizedPhone||!/^\+234\d{10}$/.test(normalizedPhone))
    return {ok:false,error:"Invalid recipient information"};
  if(notes===null||!key||!UUID.test(key)) return {ok:false,error:"Invalid notes or request key"};
  return {ok:true,data:{
    pickup,dropoff,vehicle:vehicle as ValidDraft["vehicle"],parcel_type:parcel as ValidDraft["parcel_type"],
    weight_kg:Math.round(weight*100)/100,recipient_name:name,recipient_phone:normalizedPhone,
    notes,idempotency_key:key.toLowerCase()
  }};
}
export function isConflict(error:Pick<PostgrestError,"code">|null):boolean {
  return error?.code==="23505";
}
