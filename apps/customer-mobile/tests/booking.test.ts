import test from "node:test";
import assert from "node:assert/strict";
import { EMPTY_DRAFT, normalizePhone, summarize, validateStage } from "../src/lib/booking";

const valid = {
  ...EMPTY_DRAFT,
  pickup:"21 Adetokunbo Ademola Crescent, Wuse 2",
  dropoff:"3rd Avenue, Gwarinpa, Abuja",
  vehicle:"motorcycle" as const,
  parcelType:"parcel" as const,
  weightKg:"2.5",
  recipientName:"Ada Bello",
  recipientPhone:"0801 234 5678",
};

test("Nigerian local phone normalizes to E.164",()=>{
 assert.equal(normalizePhone("0801 234 5678"),"+2348012345678");
 assert.equal(normalizePhone("+2348012345678"),"+2348012345678");
 assert.equal(normalizePhone("123"),null);
 assert.equal(normalizePhone("+447700900000"),null);
});
test("location step rejects incomplete or identical addresses",()=>{
 assert.ok(validateStage(1,{...valid,pickup:"Wuse"}));
 assert.ok(validateStage(1,{...valid,dropoff:valid.pickup.toUpperCase()}));
 assert.equal(validateStage(1,valid),null);
});
test("package step requires positive finite weight",()=>{
 for(const weightKg of ["","0","-1","1001","Infinity","abc"]) {
  assert.ok(validateStage(2,{...valid,weightKg}),weightKg);
 }
 assert.equal(validateStage(2,valid),null);
});
test("package step requires real recipient data",()=>{
 assert.ok(validateStage(2,{...valid,recipientName:"A"}));
 assert.ok(validateStage(2,{...valid,recipientPhone:"12345"}));
 assert.equal(validateStage(2,valid),null);
});
test("summary contains normalized address and phone, no monetary fields",()=>{
 const summary=summarize(valid);
 assert.deepEqual(summary.route,[valid.pickup,valid.dropoff]);
 assert.equal(summary.phone,"+2348012345678");
 assert.equal(summary.weightKg,2.5);
 assert.equal("amount" in summary,false);
});
