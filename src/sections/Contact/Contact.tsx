import { useState } from "react";
import { ArrowUpRight, Check, Copy, Send } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";
import { SectionHeader, Reveal, LineReveal } from "@/components/motion";
import { Magnet, StarBorder } from "@/components/rb";
import { LINKS } from "@/content/content";
import { isLive } from "@/lib/links";

const FORMSPREE_ID = "[FORMSPREE_ID]";

const field =
  "w-full border-0 border-b border-ink/50 bg-transparent px-0 py-3 text-lg text-ink placeholder:text-ink-mute outline-none transition-colors focus:border-accent";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(LINKS.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // No Formspree id yet: fall back to the visitor's mail app so nothing is lost.
    if (!isLive(FORMSPREE_ID)) {
      const subject = encodeURIComponent(`Hello from ${String(data.get("name") ?? "")}`);
      const body = encodeURIComponent(`${String(data.get("message") ?? "")}\n\n— ${String(data.get("name") ?? "")} (${String(data.get("email") ?? "")})`);
      window.location.href = `mailto:${LINKS.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const pill = "btn";
  return (
    <section id="contact" className="band theme-dark section">
      <div className="wrap">
        <SectionHeader num="07" label="Contact" title={["Let's build", <>something <em>smart.</em></>]} />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow mb-4 !text-accent">Write to me</p>
              <a
                href={`mailto:${LINKS.email}`}
                className="display block break-all text-[clamp(2.3rem,4.8vw,4rem)] leading-tight transition-colors hover:text-accent"
              >
                <LineReveal lines={[LINKS.email]} />
              </a>
            </Reveal>

            <Reveal delay={0.08} className="mt-8 flex flex-wrap items-center gap-3">
              <Magnet padding={50} magnetStrength={3}>
                <StarBorder
                  as="a"
                  href={`mailto:${LINKS.email}`}
                  radius="0px"
                  innerClassName="px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em]"
                  backgroundColor="#eadbc3"
                  color="#e2be8a"
                  borderColor="#eadbc3"
                  textColor="#16203a"
                >
                  Email me
                </StarBorder>
              </Magnet>
              <button type="button" onClick={copyEmail} aria-live="polite" className={pill}>
                {copied ? <Check size={14} strokeWidth={2} aria-hidden /> : <Copy size={14} strokeWidth={1.5} aria-hidden />}
                {copied ? "Copied" : "Copy email"}
              </button>
            </Reveal>

            <Reveal delay={0.12} className="mt-10 flex flex-wrap gap-3">
              {isLive(LINKS.github) && (
                <a href={LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={pill}>
                  <FaGithub size={16} aria-hidden /> GitHub <ArrowUpRight size={13} aria-hidden />
                </a>
              )}
              {isLive(LINKS.linkedin) && (
                <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={pill}>
                  <FaLinkedinIn size={16} aria-hidden /> LinkedIn <ArrowUpRight size={13} aria-hidden />
                </a>
              )}
              {isLive(LINKS.instagram) && (
                <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={pill}>
                  <FaInstagram size={16} aria-hidden /> {LINKS.instagramHandle} <ArrowUpRight size={13} aria-hidden />
                </a>
              )}
              {isLive(LINKS.leetcode) && (
                <a href={LINKS.leetcode} target="_blank" rel="noopener noreferrer" aria-label="LeetCode" className={pill}>
                  <SiLeetcode size={15} aria-hidden /> LeetCode <ArrowUpRight size={13} aria-hidden />
                </a>
              )}
              {isLive(LINKS.resume) && (
                <a href={LINKS.resume} target="_blank" rel="noopener noreferrer" className={pill}>
                  Résumé <ArrowUpRight size={13} aria-hidden />
                </a>
              )}
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-6">
            <form className="flex flex-col gap-6" onSubmit={onSubmit} aria-label="Contact form">
              <div className="grid gap-6 sm:grid-cols-2">
                <input required name="name" placeholder="Your name" autoComplete="name" className={field} />
                <input required type="email" name="email" placeholder="Email" autoComplete="email" className={field} />
              </div>
              <textarea required name="message" placeholder="What are we building?" rows={5} className={`${field} resize-none`} />
              <button type="submit" disabled={status === "sending"} className="btn btn-solid self-start !bg-ink !text-base hover:!bg-accent disabled:opacity-50">
                {status === "sending" ? "Sending…" : "Send it"}
                <Send size={14} strokeWidth={1.75} aria-hidden />
              </button>
              <p className="eyebrow min-h-4 !normal-case !tracking-[0.08em]" aria-live="polite">
                {status === "success" && "Sent. Talk soon."}
                {status === "error" && "Something broke. Email me directly instead."}
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
