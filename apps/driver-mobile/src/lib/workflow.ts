/**
 * PURE TRAINING MODEL — no network, customer data, driver assignments or payments.
 * These transitions are deliberately not authoritative for real deliveries.
 * A future server must own lifecycle and proof verification.
 */
export type Stage="offer"|"heading_to_pickup"|"at_pickup"|"in_transit"|"at_dropoff"|"delivered"|"declined";
export type Event="accept"|"decline"|"arrive_pickup"|"collect"|"arrive_dropoff"|"complete";
export type TrainingState={stage:Stage;eventCount:number};
export type Transition={ok:true;state:TrainingState}|{ok:false;error:string};
export const INITIAL_TRAINING:TrainingState={stage:"offer",eventCount:0};
export const TRAINING_PICKUP_PIN="2468";
export const TRAINING_DROPOFF_PIN="752941";
const transitions:Partial<Record<Stage,Partial<Record<Event,Stage>>>>={
 offer:{accept:"heading_to_pickup",decline:"declined"},
 heading_to_pickup:{arrive_pickup:"at_pickup"},
 at_pickup:{collect:"in_transit"},
 in_transit:{arrive_dropoff:"at_dropoff"},
 at_dropoff:{complete:"delivered"},
};
export function advanceTraining(current:TrainingState,event:Event,code?:string):Transition{
 const next=transitions[current.stage]?.[event];
 if(!next)return{ok:false,error:"That action isn't available at this delivery stage."};
 if(event==="collect" && code?.trim()!==TRAINING_PICKUP_PIN)
   return{ok:false,error:"Incorrect pickup training PIN. Use the PIN shown in this demonstration."};
 if(event==="complete" && code?.trim()!==TRAINING_DROPOFF_PIN)
   return{ok:false,error:"Incorrect drop-off training PIN. Use the PIN shown in this demonstration."};
 return{ok:true,state:{stage:next,eventCount:current.eventCount+1}};
}
export function canReceiveRealOffers(input:{approved:boolean;authenticated:boolean;locationAuthorized:boolean;verifiedVehicle:boolean}):boolean{
 return input.approved && input.authenticated && input.locationAuthorized && input.verifiedVehicle;
}
export const DEMO_JOB=Object.freeze({
 reference:"TRAINING-ONLY",pickup:"Example pickup · Wuse 2, Abuja",
 dropoff:"Example drop-off · Gwarinpa, Abuja",
 distance:"Illustrative route — not live GPS",package:"Small parcel",
 earnings:"Not available in training",
});
export function stageLabel(stage:Stage):string{
 return ({
 offer:"New assignment example",heading_to_pickup:"Heading to pickup",
 at_pickup:"Arrived at pickup",in_transit:"Package collected",
 at_dropoff:"At the destination",delivered:"Training completed",declined:"Offer declined",
 } as Record<Stage,string>)[stage];
}
