import test from "node:test";
import assert from "node:assert/strict";
import {
 advanceTraining,canReceiveRealOffers,INITIAL_TRAINING,
 TRAINING_PICKUP_PIN,TRAINING_DROPOFF_PIN,stageLabel
} from "../src/lib/workflow";

test("real dispatch cannot activate without all four security gates",()=>{
 const eligible={approved:true,authenticated:true,locationAuthorized:true,verifiedVehicle:true};
 assert.equal(canReceiveRealOffers(eligible),true);
 for(const k of Object.keys(eligible) as (keyof typeof eligible)[]){
  assert.equal(canReceiveRealOffers({...eligible,[k]:false}),false,k);
 }
});
test("ordered training stages require explicit valid verification",()=>{
 let current=INITIAL_TRAINING;
 for(const [event,code,next] of [
   ["accept",undefined,"heading_to_pickup"],["arrive_pickup",undefined,"at_pickup"],
   ["collect",TRAINING_PICKUP_PIN,"in_transit"],
   ["arrive_dropoff",undefined,"at_dropoff"],
   ["complete",TRAINING_DROPOFF_PIN,"delivered"]
 ] as const){
  const result=advanceTraining(current,event,code);
  assert.equal(result.ok,true,event);
  if(!result.ok)throw Error(result.error);
  assert.equal(result.state.stage,next);
  current=result.state;
 }
 assert.equal(current.eventCount,5);
 assert.equal(advanceTraining(current,"complete",TRAINING_DROPOFF_PIN).ok,false);
});
test("cannot skip pickup or delivery stages",()=>{
 assert.equal(advanceTraining(INITIAL_TRAINING,"collect",TRAINING_PICKUP_PIN).ok,false);
 assert.equal(advanceTraining(INITIAL_TRAINING,"complete",TRAINING_DROPOFF_PIN).ok,false);
});
test("pickup and recipient PINs cannot be bypassed",()=>{
 const atPickup={stage:"at_pickup" as const,eventCount:2};
 for(const code of ["","1111"," 1234 ",undefined,TRAINING_DROPOFF_PIN]){
  assert.equal(advanceTraining(atPickup,"collect",code).ok,false,String(code));
 }
 const atDrop={stage:"at_dropoff" as const,eventCount:4};
 for(const code of ["","000000",TRAINING_PICKUP_PIN,undefined]){
  assert.equal(advanceTraining(atDrop,"complete",code).ok,false,String(code));
 }
});
test("declining ends the example and blocks further transitions",()=>{
 const declined=advanceTraining(INITIAL_TRAINING,"decline");
 assert.equal(declined.ok,true);
 if(!declined.ok)throw Error(declined.error);
 assert.equal(declined.state.stage,"declined");
 assert.equal(advanceTraining(declined.state,"accept").ok,false);
});
test("stage labels never imply live payment or driver assignment",()=>{
 assert.equal(stageLabel("at_dropoff"),"At the destination");
 assert.equal(stageLabel("delivered"),"Training completed");
});
