import { NextResponse } from "next/server";
import { authorizeOperator } from "@/lib/ops-auth";
import type { OpsDriver,OpsShipment,OperationsSnapshot } from "@/lib/ops-model";

export const runtime="nodejs";
export const dynamic="force-dynamic";
const HEADER={"Cache-Control":"no-store, private"};
const readError=()=>NextResponse.json({error:"Unable to load operations data"},{status:503,headers:HEADER});
const FIELDS_SHIPMENT="id,reference,pickup_area,dropoff_area,vehicle_type,status,driver_id,created_at,updated_at";
const FIELDS_DRIVER="id,display_name,verification_state,availability_state,vehicle_type,updated_at";
export async function GET(request:Request){
 const result=await authorizeOperator(request);
 if(result.error)return result.error;
 const {client,orgId,role}=result.session;
 try{
  const [orders,drivers]=await Promise.all([
   client.from("zaiola_dispatch_shipments").select(FIELDS_SHIPMENT)
    .eq("organization_id",orgId).order("created_at",{ascending:false}).limit(100),
   client.from("zaiola_dispatch_drivers").select(FIELDS_DRIVER)
    .eq("organization_id",orgId).order("updated_at",{ascending:false}).limit(100)
  ]);
  if(orders.error||drivers.error)return readError();
  const payload:OperationsSnapshot={
   organizationId:orgId,role,shipments:(orders.data??[]) as OpsShipment[],
   drivers:(drivers.data??[]) as OpsDriver[],fetchedAt:new Date().toISOString(),
   readOnly:true,limitPerCollection:100
  };
  return NextResponse.json(payload,{headers:HEADER});
 }catch{return readError();}
}
