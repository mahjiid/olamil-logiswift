"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Bike, CarFront, Check, Package, Trash2 } from "lucide-react";
import Link from "next/link";

const KEY = "logiswift-v2-delivery-draft";
type Vehicle = "motorcycle" | "car";
type Category = "documents" | "parcel" | "fragile" | "other";
type Draft = {
  pickup: string;
  dropoff: string;
  vehicle: Vehicle;
  category: Category;
  weight: string;
  recipientName: string;
  recipientPhone: string;
  instructions: string;
};
const EMPTY: Draft = {
  pickup: "", dropoff: "", vehicle: "motorcycle", category: "parcel",
  weight: "", recipientName: "", recipientPhone: "", instructions: "",
};
const LABELS: Record<Category, string> = {
  documents: "Documents", parcel: "General parcel", fragile: "Fragile item", other: "Other permitted item",
};
function validAddress(s: string) {return s.trim().length >= 8;}
function validPhone(s: string) {
  const n = s.replace(/[\s()\-]/g, "");
  return /^0\d{10}$/.test(n) || /^\+234\d{10}$/.test(n);
}
function parseDraft(raw: string | null): Draft {
  if (!raw) return { ...EMPTY };
  try {
    const j: unknown = JSON.parse(raw);
    if (!j || typeof j !== "object") return { ...EMPTY };
    const o = j as Record<string, unknown>;
    const text = (key: keyof Draft, max: number) => typeof o[key] === "string" ? String(o[key]).slice(0,max) : "";
    return {
      pickup: text("pickup",250), dropoff: text("dropoff",250),
      vehicle: o.vehicle === "car" ? "car" : "motorcycle",
      category: (["documents","parcel","fragile","other"] as const).find(v=>v===o.category) ?? "parcel",
      weight: text("weight",10), recipientName: text("recipientName",120),
      recipientPhone: text("recipientPhone",24), instructions: text("instructions",600),
    };
  } catch { return { ...EMPTY }; }
}

export function BookingFlow() {
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<1|2|3>(1);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    try { setDraft(parseDraft(sessionStorage.getItem(KEY))); } catch { /* Storage can be unavailable. */ }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try { sessionStorage.setItem(KEY, JSON.stringify(draft)); } catch { /* Draft remains in memory. */ }
  }, [draft, hydrated]);

  function change<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft(previous => ({ ...previous, [key]: value }));
    setError(""); setSaved(false);
  }
  function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 1) {
      if (!validAddress(draft.pickup) || !validAddress(draft.dropoff)) {
        setError("Enter a full pickup and drop-off description, at least 8 characters each."); return;
      }
      if (draft.pickup.trim().toLowerCase() === draft.dropoff.trim().toLowerCase()) {
        setError("Pickup and drop-off locations must differ."); return;
      }
      setStep(2);
    } else if (step === 2) {
      const weight = Number(draft.weight);
      if (!Number.isFinite(weight) || weight <= 0 || weight > 1000) {
        setError("Enter a valid estimated package weight between 0 and 1,000 kg."); return;
      }
      if (draft.recipientName.trim().length < 2 || !validPhone(draft.recipientPhone)) {
        setError("Enter the recipient's name and a valid Nigerian phone number."); return;
      }
      setStep(3);
    } else {
      try {
        sessionStorage.setItem(KEY, JSON.stringify(draft));
        setSaved(true);
      } catch {
        setError("This browser could not save your draft. Please enable session storage and retry.");
      }
    }
  }
  function clear() {
    setDraft({ ...EMPTY }); setStep(1); setError(""); setSaved(false);
    try { sessionStorage.removeItem(KEY); } catch { /* Storage can be unavailable. */ }
  }

  return (
    <section className="ls-book-card" aria-label="Delivery planning form">
      <div className="ls-book-card__heading">
        <div><span>YOUR DELIVERY</span><h2>{step===1?"Pickup & destination":step===2?"Package & recipient":"Review your details"}</h2></div>
        <span className="ls-book-card__counter">{String(step).padStart(2,"0")} / 03</span>
      </div>
      <ol className="ls-book-steps" aria-label="Booking progress">
        {(["Locations", "Package", "Review"] as const).map((label,index)=>
          <li key={label} className={`${step===index+1?"is-current":""} ${step>index+1?"is-done":""}`} aria-current={step===index+1?"step":undefined}>
            <span>{step>index+1?<Check size={13}/>:index+1}</span>{label}
          </li>
        )}
      </ol>
      {saved ? (
        <div className="ls-book-saved" role="status">
          <span className="ls-book-saved__icon"><Check size={24}/></span>
          <h3>Draft saved on this device.</h3>
          <p>Your delivery has <strong>not</strong> been submitted. No price has been charged and no driver has been assigned. Your information remains in this browser session.</p>
          <div className="ls-book-actions">
            <button className="ls-button ls-button--outline" onClick={()=>{setSaved(false);setStep(1);}}>Edit draft</button>
            <Link className="ls-button ls-button--dark" href="/v2">Back to homepage <ArrowRight size={16}/></Link>
          </div>
        </div>
      ) : (
        <form onSubmit={next} noValidate>
          <div className="ls-book-card__fields">
            {step===1 && (
              <>
                <label className="ls-form-field"><span>Pickup address <b>*</b></span><input required minLength={8} maxLength={250} autoComplete="street-address" placeholder="Building, street, area, city" value={draft.pickup} onChange={e=>change("pickup",e.target.value)}/><small>Include a landmark or building name where possible.</small></label>
                <label className="ls-form-field"><span>Drop-off address <b>*</b></span><input required minLength={8} maxLength={250} placeholder="Recipient building, street, area, city" value={draft.dropoff} onChange={e=>change("dropoff",e.target.value)}/></label>
                <fieldset className="ls-vehicle-fieldset ls-vehicle-fieldset--wide">
                  <legend>Vehicle preference</legend>
                  <div className="ls-vehicle-picks">
                    <label className={`ls-vehicle-pick ${draft.vehicle==="motorcycle"?"is-selected":""}`}><input type="radio" name="vehicle" checked={draft.vehicle==="motorcycle"} onChange={()=>change("vehicle","motorcycle")}/><Bike size={22}/><span>Motorcycle</span></label>
                    <label className={`ls-vehicle-pick ${draft.vehicle==="car"?"is-selected":""}`}><input type="radio" name="vehicle" checked={draft.vehicle==="car"} onChange={()=>change("vehicle","car")}/><CarFront size={22}/><span>Car</span></label>
                  </div>
                </fieldset>
                <p className="ls-form-info">This is a service preference, not a confirmed vehicle assignment. Availability is verified during real booking.</p>
              </>
            )}
            {step===2 && (
              <>
                <label className="ls-form-field"><span>Package category <b>*</b></span>
                  <select value={draft.category} onChange={e=>change("category",e.target.value as Category)}>
                    {Object.entries(LABELS).map(([key,label])=><option key={key} value={key}>{label}</option>)}
                  </select>
                </label>
                <label className="ls-form-field"><span>Approximate weight (kg) <b>*</b></span><input required type="number" inputMode="decimal" min="0.1" max="1000" step="0.1" placeholder="e.g. 2.5" value={draft.weight} onChange={e=>change("weight",e.target.value)}/></label>
                <div className="ls-form-two-col">
                  <label className="ls-form-field"><span>Recipient name <b>*</b></span><input required minLength={2} maxLength={120} autoComplete="name" placeholder="Full name" value={draft.recipientName} onChange={e=>change("recipientName",e.target.value)}/></label>
                  <label className="ls-form-field"><span>Recipient phone <b>*</b></span><input required type="tel" maxLength={24} autoComplete="tel" placeholder="0801 234 5678" value={draft.recipientPhone} onChange={e=>change("recipientPhone",e.target.value)}/></label>
                </div>
                <label className="ls-form-field"><span>Handling notes <span className="ls-optional">Optional</span></span><textarea rows={3} maxLength={600} placeholder="Access instructions or any handling requirements" value={draft.instructions} onChange={e=>change("instructions",e.target.value)}/></label>
                <p className="ls-form-info">Dangerous, unlawful, and restricted items are not accepted. Weight and vehicle suitability will require verification.</p>
              </>
            )}
            {step===3 && (
              <div className="ls-review">
                <div className="ls-review__group"><h3><span>01</span> Route</h3><dl><div><dt>Pickup</dt><dd>{draft.pickup}</dd></div><div><dt>Drop-off</dt><dd>{draft.dropoff}</dd></div><div><dt>Vehicle preference</dt><dd>{draft.vehicle==="car"?"Car":"Motorcycle"}</dd></div></dl></div>
                <div className="ls-review__group"><h3><span>02</span> Package</h3><dl><div><dt>Category</dt><dd>{LABELS[draft.category]}</dd></div><div><dt>Weight</dt><dd>{draft.weight} kg</dd></div></dl></div>
                <div className="ls-review__group"><h3><span>03</span> Recipient</h3><dl><div><dt>Name</dt><dd>{draft.recipientName}</dd></div><div><dt>Phone</dt><dd>{draft.recipientPhone}</dd></div>{draft.instructions&&<div><dt>Instructions</dt><dd>{draft.instructions}</dd></div>}</dl></div>
                <div className="ls-review__notice"><Package size={19}/><p><strong>No quote has been calculated.</strong> The final amount, service availability, delivery estimate, and payment will be shown after this flow is connected to the verified booking backend.</p></div>
              </div>
            )}
          </div>
          {error&&<div className="ls-form-error ls-form-error--inline" role="alert">{error}</div>}
          <div className="ls-book-actions">
            {step>1?<button type="button" className="ls-button ls-button--outline" onClick={()=>{setStep(step===3?2:1);setError("");}}><ArrowLeft size={17}/> Back</button>:<button type="button" className="ls-clear-draft" onClick={clear}><Trash2 size={16}/> Clear draft</button>}
            <button className="ls-button ls-button--orange" type="submit">{step===3?"Save my draft":"Continue"}<ArrowRight size={17}/></button>
          </div>
          <p className="ls-book-card__fineprint">No payment or real dispatch is performed in this preview.</p>
        </form>
      )}
    </section>
  );
}
