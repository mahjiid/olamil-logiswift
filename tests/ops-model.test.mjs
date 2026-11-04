import test from "node:test";
import assert from "node:assert/strict";
import {overviewFromVisible,dispatchGroups,searchShipments,statusLabel} from "../src/lib/ops-model.ts";
const shipments=[
 {id:"1",reference:"ZD-100001",pickup_area:"Wuse 2",dropoff_area:"Gwarinpa",vehicle_type:"motorcycle",status:"awaiting_dispatch",driver_id:null,created_at:"2026-11-01T10:00:00Z",updated_at:"2026-11-01T10:00:00Z"},
 {id:"2",reference:"ZD-100002",pickup_area:"Maitama",dropoff_area:"Kubwa",vehicle_type:"car",status:"in_transit",driver_id:"driver-1",created_at:"2026-11-02T10:00:00Z",updated_at:"2026-11-02T10:00:00Z"},
 {id:"3",reference:"ZD-100003",pickup_area:"Wuse 2",dropoff_area:"Jabi",vehicle_type:"motorcycle",status:"delivered",driver_id:"driver-2",created_at:"2026-11-03T10:00:00Z",updated_at:"2026-11-03T10:00:00Z"}
];
const drivers=[
 {id:"d1",display_name:"Verified One",verification_state:"approved",availability_state:"available",vehicle_type:"motorcycle",updated_at:"2026-11-01T10:00:00Z"},
 {id:"d2",display_name:"Awaiting Review",verification_state:"pending",availability_state:"available",vehicle_type:"car",updated_at:"2026-11-01T10:00:00Z"},
 {id:"d3",display_name:"Offline Approved",verification_state:"approved",availability_state:"offline",vehicle_type:"motorcycle",updated_at:"2026-11-01T10:00:00Z"}
];
test("overview uses only loaded records and approved available drivers",()=>{
 const result=overviewFromVisible(shipments,drivers);
 assert.deepEqual(result,{visibleShipments:3,awaitingDispatch:1,inProgress:1,delivered:1,driverProfiles:3,approvedDrivers:2,availableDrivers:1});
});
test("empty source returns zero counts rather than invented activity",()=>{
 assert.deepEqual(overviewFromVisible([],[]),{visibleShipments:0,awaitingDispatch:0,inProgress:0,delivered:0,driverProfiles:0,approvedDrivers:0,availableDrivers:0});
});
test("dispatch groups preserve mutually exclusive shipment status",()=>{
 const groups=dispatchGroups(shipments);
 assert.deepEqual(groups.waiting.map(s=>s.id),["1"]);
 assert.deepEqual(groups.active.map(s=>s.id),["2"]);
 assert.deepEqual(groups.closed.map(s=>s.id),["3"]);
 assert.equal(groups.waiting.length+groups.active.length+groups.closed.length,shipments.length);
});
test("search filters reference, origin, destination and exact status",()=>{
 assert.equal(searchShipments(shipments,"wUsE","all").length,2);
 assert.equal(searchShipments(shipments,"ZD-100002","all").length,1);
 assert.equal(searchShipments(shipments,"Kubwa","in_transit").length,1);
 assert.equal(searchShipments(shipments,"Kubwa","delivered").length,0);
 assert.equal(searchShipments(shipments,"nonsense","all").length,0);
});
test("status copy maps to explicit lifecycle label",()=>{
 assert.equal(statusLabel("awaiting_dispatch"),"Awaiting dispatch");
 assert.equal(statusLabel("at_dropoff"),"At drop-off");
});
