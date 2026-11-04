/** Pure booking model + validation shared by the wizard and unit tests. */
export type Vehicle = "motorcycle" | "car";
export type ParcelType = "documents" | "parcel" | "fragile" | "other";
export type Draft = {
  pickup:string; dropoff:string; vehicle:Vehicle;
  parcelType:ParcelType; weightKg:string;
  recipientName:string; recipientPhone:string; notes:string;
};
export const EMPTY_DRAFT: Draft = {
  pickup:"",dropoff:"",vehicle:"motorcycle",parcelType:"parcel",weightKg:"",
  recipientName:"",recipientPhone:"",notes:"",
};
export type Stage = 1 | 2 | 3;
export function normalizePhone(input:string):string | null {
  const phone = input.replace(/[\s().-]/g,"");
  if (/^0\d{10}$/.test(phone)) return "+234"+phone.slice(1);
  if (/^\+234\d{10}$/.test(phone)) return phone;
  return null;
}
export function validateStage(stage:Stage,draft:Draft):string | null {
  if (stage===1) {
    const from=draft.pickup.trim(),to=draft.dropoff.trim();
    if (from.length<8||to.length<8) return "Please enter a recognizable pickup and destination address.";
    if(from.toLocaleLowerCase()===to.toLocaleLowerCase()) return "Pickup and destination cannot be the same.";
  }
  if(stage===2) {
    const weight=Number(draft.weightKg);
    if(!Number.isFinite(weight)||weight<=0||weight>1000) return "Enter a valid estimated weight between 0 and 1,000 kg.";
    if(!draft.recipientName.trim()||draft.recipientName.trim().length<2) return "Please enter the recipient's full name.";
    if(!normalizePhone(draft.recipientPhone)) return "Enter a valid Nigerian number (080… or +234…).";
  }
  return null;
}
export function summarize(draft:Draft) {
  return {route:[draft.pickup.trim(),draft.dropoff.trim()],vehicle:draft.vehicle,
    parcel:draft.parcelType,weightKg:Number(draft.weightKg),
    recipient:draft.recipientName.trim(),phone:normalizePhone(draft.recipientPhone)};
}
