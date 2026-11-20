import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { gsap } from "gsap";

interface HeroProps {
  onSeeWorks: () => void;
  onReachOut: () => void;
}

const ROLES = ["Detect", "Coordinate", "Reconfigure", "Recover"];
const LOCAL_VIDEO_URL = "/videos/earth-orbit.mp4";
const POSTER_IMAGE = "/images/brand_identity_1791897232807.jpg";

export default function Hero({ onSeeWorks, onReachOut }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);

  // Cycling roles every 2 seconds
  useEffect(() => {
    const roleInterval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 2000);
    return () => clearInterval(roleInterval);
  }, []);

  // Video Initialization with reliable local fallback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const customHlsUrl = (import.meta as any).env?.VITE_HERO_HLS_URL;
    let hls: Hls | null = null;

    if (customHlsUrl && Hls.isSupported()) {
      hls = new Hls({
        autoStartLoad: true,
        startLevel: -1,
        capLevelToPlayerSize: true,
      });
      hls.loadSource(customHlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, () => {
        video.src = LOCAL_VIDEO_URL;
        video.play().catch(() => {});
      });
    } else if (customHlsUrl && video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = customHlsUrl;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => {});
      });
    } else {
      video.src = LOCAL_VIDEO_URL;
      video.play().catch(() => {});
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".name-reveal",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.1 }
      );

      tl.fromTo(
        ".blur-in",
        { opacity: 0, filter: "blur(10px)", y: 20 },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 1.0,
          stagger: 0.1,
        },
        "-=0.9"
      );
    }, heroContainerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={heroContainerRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-bg"
    >
      {/* Background Video */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster={POSTER_IMAGE}
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 opacity-70"
        >
          <source src={LOCAL_VIDEO_URL} type="video/mp4" />
        </video>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent pointer-events-none" />
      </div>

      {/* Hero Content (centered, z-10) */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center pt-24 pb-20">
        {/* Eyebrow */}
        <div className="blur-in text-xs text-muted uppercase tracking-[0.3em] mb-8 font-medium">
          AUTONOMOUS SPACE SYSTEMS
        </div>

        {/* Name */}
        <h1 className="name-reveal text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight text-text-primary mb-6">
          ASTRANET
        </h1>

        {/* Role line */}
        <div className="blur-in text-lg sm:text-xl md:text-2xl text-text-primary/90 mb-6 font-light">
          <span>A swarm that can </span>
          <span
            key={roleIndex}
            className="font-display italic text-text-primary animate-role-fade-in inline-block text-2xl sm:text-3xl md:text-4xl px-1 text-white underline decoration-[#89AACC]/40 underline-offset-4"
          >
            {ROLES[roleIndex]}
          </span>
          <span> autonomously.</span>
        </div>

        {/* Description */}
        <p className="blur-in text-sm md:text-base text-muted max-w-md mb-12 leading-relaxed">
          Autonomous self-healing coordination for resilient CubeSat swarm operations.
        </p>

        {/* CTA Buttons */}
        <div className="blur-in inline-flex flex-wrap items-center justify-center gap-4">
          {/* "See Works" Solid Button */}
          <button
            onClick={onSeeWorks}
            className="group relative rounded-full text-sm font-medium px-7 py-3.5 transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
          >
            {/* Gradient border ring on hover */}
            <span
              className="absolute -inset-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 accent-gradient -z-10"
              aria-hidden="true"
            />
            <span className="relative z-10 block transition-colors duration-300 bg-text-primary text-bg group-hover:bg-bg group-hover:text-text-primary px-7 py-3.5 -m-7 -my-3.5 rounded-full">
              Explore System
            </span>
          </button>

          {/* "Reach out..." Outlined Button */}
          <button
            onClick={onReachOut}
            className="group relative rounded-full text-sm font-medium px-7 py-3.5 transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden border-2 border-stroke bg-bg text-text-primary group-hover:border-transparent"
          >
            {/* Gradient border ring on hover */}
            <span
              className="absolute -inset-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 accent-gradient -z-10"
              aria-hidden="true"
            />
            <span className="relative z-10">Enter Mission Control</span>
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-[10px] text-muted uppercase tracking-[0.2em] font-medium">
          SCROLL
        </span>
        <div className="w-px h-10 bg-stroke relative overflow-hidden">
          <div className="w-full h-4 accent-gradient animate-scroll-down" />
        </div>
      </div>
    </section>
  );
}
