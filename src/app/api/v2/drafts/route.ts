import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { isConflict, parseCustomerDraft } from "@/lib/v2-drafts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FIELDS="id,pickup,dropoff,vehicle,parcel_type,weight_kg,recipient_name,recipient_phone,notes,created_at";

const errorResponse=(message:string,status:number)=>NextResponse.json({error:message},{status,headers:{"Cache-Control":"no-store"}});
function readBearer(request:Request) {
  const value=request.headers.get("authorization")||"";
  const match=/^Bearer ([A-Za-z0-9._-]+)$/.exec(value);
  return match?.[1]??null;
}

async function authorizedClient(request:Request) {
  const token=readBearer(request);
  if(!token)return {error:errorResponse("Authentication required",401)} as const;
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!key||!url.startsWith("https://"))return {error:errorResponse("Booking draft service unavailable",503)} as const;
  // No service-role key. Data queries run as the customer's verified JWT.
  const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},
    global:{headers:{Authorization:`Bearer ${token}`}}});
  const {data,error}=await client.auth.getUser(token);
  if(error||!data.user||data.user.is_anonymous)return {error:errorResponse("Sign in required",401)} as const;
  return {client,userId:data.user.id} as const;
}
export async function GET(request:Request) {
  try{
    const a=await authorizedClient(request);
    if("error" in a)return a.error;
    const {data,error}=await a.client.from("zaiola_customer_drafts").select(FIELDS)
      .eq("user_id",a.userId).order("created_at",{ascending:false}).limit(15);
    if(error){console.error("Draft read rejected:",error.code);return errorResponse("Unable to load drafts",503);}
    return NextResponse.json({drafts:data??[]},{headers:{"Cache-Control":"no-store"}});
  }catch{return errorResponse("Draft service unavailable",503);}
}
export async function POST(request:Request) {
  try{
    if(!request.headers.get("content-type")?.toLowerCase().includes("application/json"))
      return errorResponse("Expected JSON",415);
    const a=await authorizedClient(request);
    if("error" in a)return a.error;
    const rawBody=await request.text();
    if(rawBody.length>8192)return errorResponse("Request too large",413);
    let raw:unknown;try{raw=JSON.parse(rawBody);}catch{return errorResponse("Malformed JSON",400);}
    const parsed=parseCustomerDraft(raw);
    if(!parsed.ok)return errorResponse(parsed.error,400);
    const input={...parsed.data,user_id:a.userId};
    const {data,error}=await a.client.from("zaiola_customer_drafts")
      .insert(input).select(FIELDS).single();
    if(error){
      if(isConflict(error)) {
        const existing=await a.client.from("zaiola_customer_drafts").select("id,pickup,dropoff,vehicle,parcel_type,weight_kg,recipient_name,recipient_phone,notes,created_at,idempotency_key")
          .eq("user_id",a.userId).eq("idempotency_key",parsed.data.idempotency_key).maybeSingle();
        if(existing.error||!existing.data)return errorResponse("Unable to retrieve prior draft",409);
        const x=existing.data;
        // An idempotency key must not authorize a different payload.
        const same=x.pickup===parsed.data.pickup&&x.dropoff===parsed.data.dropoff&&x.vehicle===parsed.data.vehicle
          &&x.parcel_type===parsed.data.parcel_type&&Number(x.weight_kg)===parsed.data.weight_kg
          &&x.recipient_name===parsed.data.recipient_name&&x.recipient_phone===parsed.data.recipient_phone
          &&x.notes===parsed.data.notes;
        if(!same)return errorResponse("Request key already used for different details",409);
        const {idempotency_key:_ignored,...safe}=x;
        return NextResponse.json({draft:safe,replayed:true},{headers:{"Cache-Control":"no-store"}});
      }
      console.error("Draft save rejected:",error.code);
      return errorResponse("Unable to save draft",503);
    }
    return NextResponse.json({draft:data,replayed:false},{status:201,headers:{"Cache-Control":"no-store"}});
  }catch{return errorResponse("Draft service unavailable",503);}
}
