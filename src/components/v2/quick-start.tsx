"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Bike, CarFront, MapPin, Navigation2 } from "lucide-react";

const KEY = "logiswift-v2-delivery-draft";
type Vehicle = "motorcycle" | "car";

export function QuickStart() {
  const router = useRouter();
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [vehicle, setVehicle] = useState<Vehicle>("motorcycle");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const from = pickup.trim(), to = dropoff.trim();
    if (from.length < 8 || to.length < 8) {
      setError("Enter a recognizable pickup and drop-off address (at least 8 characters each).");
      return;
    }
    if (from.toLowerCase() === to.toLowerCase()) {
      setError("Pickup and drop-off need to be different locations.");
      return;
    }
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ pickup: from, dropoff: to, vehicle }));
    } catch {
      setError("Browser storage is unavailable. Use the full booking form instead.");
      return;
    }
    router.push("/v2/book");
  }

  return (
    <form className="ls-quick" onSubmit={submit} aria-labelledby="ls-quick-title">
      <div className="ls-quick__head">
        <div><span className="ls-quick__label">START YOUR DELIVERY</span><h2 id="ls-quick-title">Where to?</h2></div>
        <span className="ls-quick__step">01 / 03</span>
      </div>
      <div className="ls-quick__body">
        <div className="ls-location-stack">
          <div className="ls-location-stack__rail" aria-hidden="true"><span/><span/></div>
          <label className="ls-location-field">
            <span>Pickup address</span>
            <div><MapPin size={16} aria-hidden="true"/><input required autoComplete="street-address" minLength={8} value={pickup} onChange={e=>{setPickup(e.target.value);setError("");}} placeholder="Street, building or landmark"/></div>
          </label>
          <label className="ls-location-field">
            <span>Drop-off address</span>
            <div><Navigation2 size={16} aria-hidden="true"/><input required minLength={8} value={dropoff} onChange={e=>{setDropoff(e.target.value);setError("");}} placeholder="Where is it going?"/></div>
          </label>
        </div>
        <fieldset className="ls-vehicle-fieldset">
          <legend>Choose a vehicle</legend>
          <div className="ls-vehicle-picks">
            <label className={`ls-vehicle-pick ${vehicle==="motorcycle"?"is-selected":""}`}>
              <input type="radio" name="vehicle" value="motorcycle" checked={vehicle==="motorcycle"} onChange={()=>setVehicle("motorcycle")}/>
              <Bike size={22} strokeWidth={1.8}/><span>Motorcycle</span>
            </label>
            <label className={`ls-vehicle-pick ${vehicle==="car"?"is-selected":""}`}>
              <input type="radio" name="vehicle" value="car" checked={vehicle==="car"} onChange={()=>setVehicle("car")}/>
              <CarFront size={22} strokeWidth={1.8}/><span>Car</span>
            </label>
          </div>
        </fieldset>
        {error && <p className="ls-form-error" role="alert">{error}</p>}
        <button className="ls-button ls-button--orange ls-button--full" type="submit">Continue to details <ArrowRight size={18} aria-hidden="true"/></button>
        <p className="ls-quick__note">Plan first. No payment or dispatch at this stage.</p>
      </div>
    </form>
  );
}
