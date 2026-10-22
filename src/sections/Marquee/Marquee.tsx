import { Ticker } from "@/components/motion";
import { TICKER_ITEMS } from "@/lib/icons";

export default function Marquee() {
  return (
    <div className="band theme-dark border-y border-line py-5" aria-hidden>
      <Ticker items={TICKER_ITEMS} />
    </div>
  );
}
