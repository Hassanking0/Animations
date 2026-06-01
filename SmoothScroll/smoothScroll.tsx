"use client";

import { ReactNode, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handle = () => setIsMobile(mq.matches);
    handle();
    setReady(true);
    if (mq.addEventListener) mq.addEventListener("change", handle);
    else mq.addListener(handle);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handle);
      else mq.removeListener(handle);
    };
  }, []);

  useEffect(() => {
    if (!ready || isMobile) return;

    const smoother = ScrollSmoother.create({
      smooth: 2,
      effects: true,
      normalizeScroll: true,
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
    });

    return () => {
      smoother.kill();
    };
  }, [ready, isMobile]);

  // Before the client detection finishes, render children to avoid blocking scroll.
  if (!ready || isMobile) return <>{children}</>;

  return (
    <div id="smooth-wrapper" className="overflow-hidden">
      <div id="smooth-content">{children}</div>
    </div>
  );
}