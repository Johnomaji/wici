"use client";

import type { ReactNode } from "react";

// Stylised (not geographic) map of the pilot cluster. 600 x 340 viewBox.
export default function ClusterMap({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 600 340" className={`block h-full w-full ${className}`} role="img" aria-label="Pilot cluster map">
      <defs>
        <pattern id="waves" width="14" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 4 Q3.5 1 7 4 T14 4" fill="none" stroke="#b9cfcb" strokeWidth="0.8" />
        </pattern>
      </defs>
      <rect width="600" height="340" fill="#d9e6e2" />
      <rect width="600" height="340" fill="url(#waves)" opacity="0.6" />
      <path
        d="M-5,72 C110,52 250,84 380,58 C470,40 560,62 605,52 L605,300 C480,316 380,300 280,318 C180,336 90,310 -5,322 Z"
        fill="#f4f0e5"
        stroke="#c9c2ad"
        strokeWidth="1.2"
      />
      {/* roads */}
      <g fill="none" stroke="#e2dccb" strokeWidth="5" strokeLinecap="round">
        <path d="M20,290 C160,280 330,295 590,270" />
        <path d="M30,190 C180,195 330,185 590,170" />
        <path d="M40,100 C200,105 360,90 590,85" />
        <path d="M150,80 L170,310" />
        <path d="M300,75 L320,305" />
        <path d="M450,60 L470,295" />
      </g>
      <g fill="none" stroke="#fffdf7" strokeWidth="1.5" strokeLinecap="round">
        <path d="M20,290 C160,280 330,295 590,270" />
        <path d="M30,190 C180,195 330,185 590,170" />
        <path d="M40,100 C200,105 360,90 590,85" />
      </g>
      <text x="22" y="34" className="fill-[#7f9c97] text-[11px] italic">Lagos Lagoon</text>
      <text x="22" y="332" className="fill-[#7f9c97] text-[11px] italic">Atlantic Ocean</text>
      <text x="580" y="255" textAnchor="end" className="fill-[#b3aa90] text-[10px] font-bold tracking-[0.2em]">
        VICTORIA ISLAND
      </text>
      {children}
    </svg>
  );
}
