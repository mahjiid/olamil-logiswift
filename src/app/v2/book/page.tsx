import { CustomerFooter, CustomerHeader } from "@/components/v2/customer-shell";
import { BookingFlow } from "@/components/v2/booking-flow";

export default function BookV2() {
  return (
    <>
      <CustomerHeader minimal />
      <main id="main" className="ls-book-page">
        <div className="ls-container ls-book-layout">
          <div className="ls-book-intro">
            <span className="ls-kicker">NEW DELIVERY / DRAFT</span>
            <h1>Let’s get it <em>moving.</em></h1>
            <p>Tell us about your package. Your draft is saved only in this browser session, and nothing is charged or dispatched at this stage.</p>
            <div className="ls-book-intro__aside">
              <span className="ls-book-intro__marker" aria-hidden="true" />
              <div><strong>Before you book</strong><span>Service coverage, final rates, and driver availability must be confirmed by the live dispatch service.</span></div>
            </div>
          </div>
          <BookingFlow />
        </div>
      </main>
      <CustomerFooter />
    </>
  );
}
