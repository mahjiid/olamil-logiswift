/** Read-only operations data contract. No delivery transitions occur here. */
export const ORDER_STATUSES=[
 "awaiting_dispatch","assigning","assigned","at_pickup","picked_up",
 "in_transit","at_dropoff","delivered","cancelled","failed"
] as const;
export type OpsStatus=typeof ORDER_STATUSES[number];
export type OpsRole="admin"|"dispatcher"|"viewer";
export type OpsArea="overview"|"orders"|"dispatch"|"drivers"|"finance"|"support"|"analytics"|"settings";
export type OpsShipment={
 id:string;reference:string;pickup_area:string;dropoff_area:string;
 vehicle_type:"motorcycle"|"car"|"van";status:OpsStatus;
 driver_id:string|null;created_at:string;updated_at:string;
};
export type OpsDriver={
 id:string;display_name:string;verification_state:"pending"|"approved"|"suspended";
 availability_state:"offline"|"available"|"busy";vehicle_type:"motorcycle"|"car"|"van";
 updated_at:string;
};
export type OperationsSnapshot={
 organizationId:string;role:OpsRole;shipments:OpsShipment[];drivers:OpsDriver[];
 fetchedAt:string;readOnly:true;limitPerCollection:number;
};
export type OverviewCounts={
 visibleShipments:number;awaitingDispatch:number;inProgress:number;
 delivered:number;driverProfiles:number;approvedDrivers:number;availableDrivers:number;
};
/** Computations cover only returned records, never invent global KPIs. */
export function overviewFromVisible(rows:OpsShipment[],drivers:OpsDriver[]):OverviewCounts{
 return{
  visibleShipments:rows.length,
  awaitingDispatch:rows.filter(x=>x.status==="awaiting_dispatch"||x.status==="assigning").length,
  inProgress:rows.filter(x=>["assigned","at_pickup","picked_up","in_transit","at_dropoff"].includes(x.status)).length,
  delivered:rows.filter(x=>x.status==="delivered").length,
  driverProfiles:drivers.length,
  approvedDrivers:drivers.filter(d=>d.verification_state==="approved").length,
  availableDrivers:drivers.filter(d=>d.verification_state==="approved"&&d.availability_state==="available").length
 };
}
export const statusLabel=(status:OpsStatus)=>({
 awaiting_dispatch:"Awaiting dispatch",assigning:"Assigning",assigned:"Assigned",
 at_pickup:"At pickup",picked_up:"Picked up",in_transit:"In transit",
 at_dropoff:"At drop-off",delivered:"Delivered",cancelled:"Cancelled",failed:"Failed"
} as const)[status];
export function dispatchGroups(rows:OpsShipment[]){
 return {
  waiting:rows.filter(o=>o.status==="awaiting_dispatch"||o.status==="assigning"),
  active:rows.filter(o=>["assigned","at_pickup","picked_up","in_transit","at_dropoff"].includes(o.status)),
  closed:rows.filter(o=>["delivered","cancelled","failed"].includes(o.status))
 };
}
export function searchShipments(rows:OpsShipment[],query:string,status:string):OpsShipment[]{
 const q=query.trim().toLowerCase();
 return rows.filter(o=>(status==="all"||o.status===status)&&(
  !q||[o.reference,o.pickup_area,o.dropoff_area].some(v=>v.toLowerCase().includes(q))
 ));
}
