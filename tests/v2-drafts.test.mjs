import test from "node:test";
import assert from "node:assert/strict";
import { parseCustomerDraft } from "../src/lib/v2-drafts.ts";
const sample={
 pickup:"12 Wuse Market Road, Abuja",dropoff:"3rd Avenue, Gwarinpa, Abuja",
 vehicle:"motorcycle",parcel_type:"parcel",weight_kg:2.5,
 recipient_name:"Binta Ali",recipient_phone:"0801 234 5678",
 notes:"Hand to recipient",idempotency_key:"550e8400-e29b-41d4-a716-446655440000"
};
test("server accepts and normalizes only a customer draft",()=>{
 const r=parseCustomerDraft(sample);assert.equal(r.ok,true);
 assert.equal(r.data.recipient_phone,"+2348012345678");
 assert.equal("status" in r.data,false);assert.equal("amount" in r.data,false);
});
test("server rejects privileged or unknown fields",()=>{
 for(const key of ["status","amount","user_id","driver_id","payment_status"]){
  const r=parseCustomerDraft({...sample,[key]:"paid"});
  assert.equal(r.ok,false,key);
 }
});
test("server rejects invalid routes, vehicle and package types",()=>{
 assert.equal(parseCustomerDraft({...sample,dropoff:sample.pickup}).ok,false);
 assert.equal(parseCustomerDraft({...sample,vehicle:"truck"}).ok,false);
 assert.equal(parseCustomerDraft({...sample,parcel_type:"cash"}).ok,false);
});
test("server validates weight, recipient and idempotency key",()=>{
 for(const weight_kg of [-1,0,Infinity,1001,"2.5"]){
  assert.equal(parseCustomerDraft({...sample,weight_kg}).ok,false,String(weight_kg));
 }
 assert.equal(parseCustomerDraft({...sample,recipient_phone:"123"}).ok,false);
 assert.equal(parseCustomerDraft({...sample,recipient_name:"A"}).ok,false);
 assert.equal(parseCustomerDraft({...sample,idempotency_key:"not-a-uuid"}).ok,false);
});
