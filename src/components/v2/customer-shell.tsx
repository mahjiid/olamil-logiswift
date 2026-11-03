import Link from "next/link";
import { ArrowUpRight, PackageCheck } from "lucide-react";

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/v2" className={`ls-brand ${inverse ? "ls-brand--inverse" : ""}`} aria-label="LogiSwift home">
      <span className="ls-brand__mark" aria-hidden="true"><span>l</span><span className="ls-brand__dot" /></span>
      <span>logiswift<span className="ls-brand__period">.</span></span>
    </Link>
  );
}

export function CustomerHeader({ minimal = false }: { minimal?: boolean }) {
  return (
    <header className="ls-header">
      <div className="ls-container ls-header__inner">
        <Brand />
        {minimal ? (
          <Link href="/v2" className="ls-header__small-link">Back to home <ArrowUpRight size={15} aria-hidden="true" /></Link>
        ) : (
          <>
            <nav className="ls-header__links" aria-label="Primary navigation">
              <a href="#how">How it works</a>
              <a href="#business">For business</a>
              <a href="#standards">Our approach</a>
            </nav>
            <Link className="ls-button ls-button--dark ls-header__cta" href="/v2/book">
              Send a package <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export function CustomerFooter() {
  return (
    <footer className="ls-footer">
      <div className="ls-container ls-footer__main">
        <div><Brand inverse /><p>A better way to move things across town.</p></div>
        <div className="ls-footer__aside">
          <span>Built for real-world deliveries.</span>
          <span>Customer experience preview · No live orders</span>
        </div>
      </div>
      <div className="ls-container ls-footer__bottom"><span>© {new Date().getFullYear()} LogiSwift</span><span>Deliver with clarity.</span></div>
    </footer>
  );
}

export function StepNumber({ number }: { number: string }) {
  return <span className="ls-step-number">{number}</span>;
}

export function FeatureMark() {
  return <span className="ls-feature-mark" aria-hidden="true"><PackageCheck size={22} strokeWidth={1.8}/></span>;
}
