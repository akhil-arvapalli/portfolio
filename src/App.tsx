import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { Analytics } from "@vercel/analytics/react";
import { LenisProvider } from "@/components/scroll/LenisProvider";
import GlobalBackground from "@/components/background/GlobalBackground";
import Preloader from "@/components/Preloader/Preloader";
import Cursor from "@/components/cursor/Cursor";
import Navigation from "@/components/Navigation/Navigation";
import Hero from "@/sections/Hero/Hero";

const Marquee = lazy(() => import("@/sections/Marquee/Marquee"));
const About = lazy(() => import("@/sections/About/About"));
const Stack = lazy(() => import("@/sections/Stack/Stack"));
const Work = lazy(() => import("@/sections/Work/Work"));
const Experience = lazy(() => import("@/sections/Experience/Experience"));
const Recognition = lazy(() => import("@/sections/Recognition/Recognition"));
const Photography = lazy(() => import("@/sections/Photography/Photography"));
const Contact = lazy(() => import("@/sections/Contact/Contact"));
const Footer = lazy(() => import("@/sections/Footer/Footer"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const ProjectDetail = lazy(() => import("@/sections/ProjectDetail/ProjectDetail"));

export default function App() {
  const onHome = useLocation().pathname === "/";
  const onVercel = typeof window !== "undefined" && !/^(localhost|127\.)/.test(window.location.hostname);

  return (
    <MotionConfig reducedMotion="user">
      <LenisProvider>
          <Preloader />
          <Cursor />
          <Navigation />
          <GlobalBackground />
          {onHome && (
            <main id="main">
              <Hero />
              <Suspense fallback={null}>
                <Marquee />
                <About />
                <Stack />
                <Work />
                <Experience />
                <Recognition />
                <Photography />
                <Contact />
                <Footer />
              </Suspense>
            </main>
          )}
          <Routes>
            <Route path="/" element={null} />
            <Route path="/projects/:slug" element={<Suspense fallback={null}><ProjectDetail /></Suspense>} />
            <Route path="*" element={<Suspense fallback={null}><NotFound /></Suspense>} />
          </Routes>
          {onVercel && <Analytics />}
      </LenisProvider>
    </MotionConfig>
  );
}
