import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { ArrowRight, ArrowUpRight, Check, Clock3, MapPin, Package, ShieldCheck, Truck } from "lucide-react";
import { CustomerFooter, CustomerHeader, StepNumber } from "@/components/v2/customer-shell";
import { QuickStart } from "@/components/v2/quick-start";

export default function CustomerHomeV2() {
  return (
    <>
      <CustomerHeader />
      <main id="main">
        <section className="ls-hero">
          <div className="ls-container ls-hero__inner">
            <div className="ls-hero__copy">
              <div className="ls-eyebrow"><span className="ls-eyebrow__line" /> THE CITY MOVES WITH YOU</div>
              <h1>From your door <br />to <em>theirs.</em></h1>
              <p className="ls-hero__description">Send the important things without the guesswork. One simple booking, a clear plan, and every step accounted for.</p>
              <div className="ls-hero__checks" aria-label="What the service is designed to provide">
                <span><Check size={16} /> Clear process</span>
                <span><Check size={16} /> Delivery updates</span>
                <span><Check size={16} /> Verified handover</span>
              </div>
              <div className="ls-hero__index"><span>01 — 03</span><span>ZAIOLA / DELIVERY</span></div>
            </div>
            <div className="ls-hero__visual">
              <div className="ls-city-art" aria-hidden="true">
                <div className="ls-city-art__road ls-city-art__road--one" />
                <div className="ls-city-art__road ls-city-art__road--two" />
                <div className="ls-city-art__road ls-city-art__road--three" />
                <div className="ls-city-art__block ls-city-art__block--one" />
                <div className="ls-city-art__block ls-city-art__block--two" />
                <div className="ls-city-art__block ls-city-art__block--three" />
                <div className="ls-city-art__block ls-city-art__block--four" />
                <div className="ls-city-art__route" />
                <div className="ls-city-art__pin ls-city-art__pin--a" />
                <div className="ls-city-art__pin ls-city-art__pin--b" />
              </div>
              <QuickStart />
            </div>
          </div>
          <div className="ls-hero__bottom-line" />
        </section>
        <section className="ls-service-strip" aria-label={`Explore ${BRAND.productName}`}>
          <div className="ls-container ls-service-grid">
            <Link href="/v2/book" className="ls-service-item">
              <div className="ls-service-item__top"><StepNumber number="01 / INDIVIDUAL" /><ArrowUpRight size={19}/></div>
              <Package size={27} strokeWidth={1.7} aria-hidden="true" />
              <div><h2>Send a package</h2><p>From pickup to drop-off, without the paperwork.</p></div>
            </Link>
            <a href="#business" className="ls-service-item">
              <div className="ls-service-item__top"><StepNumber number="02 / BUSINESS" /><ArrowUpRight size={19}/></div>
              <Truck size={28} strokeWidth={1.6} aria-hidden="true" />
              <div><h2>Keep business moving</h2><p>A clearer process for your everyday deliveries.</p></div>
            </a>
            <a href="#how" className="ls-service-item">
              <div className="ls-service-item__top"><StepNumber number="03 / EXPERIENCE" /><ArrowUpRight size={19}/></div>
              <MapPin size={27} strokeWidth={1.7} aria-hidden="true" />
              <div><h2>Know what happens next</h2><p>Designed around clear delivery milestones.</p></div>
            </a>
          </div>
        </section>
        <section className="ls-section ls-section--light" id="how">
          <div className="ls-container">
            <div className="ls-section__top"><span className="ls-kicker">THE PROCESS</span><p>Three steps. No unnecessary detours.</p></div>
            <div className="ls-section__title-row"><h2>Less to think about. <br /><span>More on the move.</span></h2><p>We make the process easy to understand from the first address to the final handover.</p></div>
            <div className="ls-process-grid">
              <article><span className="ls-process-grid__number">01</span><MapPin size={31} strokeWidth={1.45}/><h3>Tell us where</h3><p>Set your pickup and destination. Add the details that matter to your delivery.</p></article>
              <article><span className="ls-process-grid__number">02</span><Clock3 size={31} strokeWidth={1.45}/><h3>Confirm your plan</h3><p>Review your information before any confirmed quotation or payment.</p></article>
              <article><span className="ls-process-grid__number">03</span><ShieldCheck size={31} strokeWidth={1.45}/><h3>Follow the handover</h3><p>From assignment to proof of delivery, each milestone should mean something.</p></article>
            </div>
          </div>
        </section>
        <section className="ls-business" id="business">
          <div className="ls-container ls-business__inner">
            <div className="ls-business__copy">
              <span className="ls-kicker ls-kicker--warm">MADE FOR THE EVERYDAY</span>
              <h2>Deliveries should support your business. <em>Not slow it down.</em></h2>
              <p>Whether you sell online or send supplies between locations, ZAIOLA Delivery is being designed to give your team one dependable workflow.</p>
              <Link href="/v2/book" className="ls-text-link">Explore delivery booking <ArrowRight size={19}/></Link>
            </div>
            <div className="ls-business__panel" aria-label="Example business delivery flow">
              <div className="ls-business__panel-head"><span>DELIVERY WORKFLOW</span><span>EXAMPLE / NOT LIVE</span></div>
              <div className="ls-business__panel-content">
                <div><span className="ls-business__stage-dot" /><div><strong>Booking created</strong><small>Pickup and parcel information captured</small></div><span className="ls-business__badge">01</span></div>
                <div><span className="ls-business__stage-dot" /><div><strong>Driver assigned</strong><small>Availability and assignment verified</small></div><span className="ls-business__badge">02</span></div>
                <div><span className="ls-business__stage-dot" /><div><strong>Delivery confirmed</strong><small>Handover recorded securely</small></div><span className="ls-business__badge">03</span></div>
              </div>
            </div>
          </div>
        </section>
        <section className="ls-final-cta" id="standards">
          <div className="ls-container ls-final-cta__inner">
            <div><span className="ls-kicker">DESIGNED FOR TRUST</span><h2>A good delivery starts with <em>a clear plan.</em></h2><p>Start a draft and review every detail before a booking is submitted.</p></div>
            <Link href="/v2/book" className="ls-button ls-button--orange">Plan your delivery <ArrowUpRight size={18}/></Link>
          </div>
        </section>
      </main>
      <CustomerFooter />
    </>
  );
}
