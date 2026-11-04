import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { OpsRole } from "@/lib/ops-model";

export type OperatorSession={client:SupabaseClient;orgId:string;role:OpsRole};
type Result={session:OperatorSession;error?:never}|{session?:never;error:NextResponse};
const reject=(message:string,status:number)=>NextResponse.json({error:message},{status,headers:{"Cache-Control":"no-store"}});
const ROLE_SET=new Set(["admin","dispatcher","viewer"]);

export async function authorizeOperator(request:Request):Promise<Result>{
 const bearer=request.headers.get("authorization")||"";
 const token=/^Bearer ([A-Za-z0-9._-]+)$/.exec(bearer)?.[1];
 if(!token)return {error:reject("Sign-in required",401)};
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url?.startsWith("https://")||url.includes("your-project")||!key||key.length<24){
  return {error:reject("Operations backend is not configured",503)};
 }
 try{
  // There is no service-role key. Queries inherit the verified operator JWT and RLS.
  const client=createClient(url,key,{
   auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},
   global:{headers:{Authorization:`Bearer ${token}`}}
  });
  const verified=await client.auth.getUser(token);
  const user=verified.data.user;
  if(verified.error||!user||user.is_anonymous)return{error:reject("Sign-in required",401)};
  // User-editable metadata never determines access; membership must be admin-provisioned.
  const membership=await client.from("zaiola_operator_memberships")
    .select("organization_id,role,active").eq("user_id",user.id).eq("active",true).limit(2);
  if(membership.error){return{error:reject("Unable to verify operator access",503)};}
  if(!membership.data?.length)return{error:reject("Operator access not granted",403)};
  if(membership.data.length!==1)return{error:reject("Organization selection is not enabled",409)};
  const role=membership.data[0].role;
  if(typeof role!=="string"||!ROLE_SET.has(role))return{error:reject("Operator access not granted",403)};
  return{session:{client,orgId:membership.data[0].organization_id,role:role as OpsRole}};
 }catch{return{error:reject("Operations service unavailable",503)};}
}
