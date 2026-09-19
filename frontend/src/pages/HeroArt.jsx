function HeroArt() {
  return (
    <svg
      className="hero-art"
      viewBox="0 0 680 300"
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="akSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#06343B" />
          <stop offset="52%" stopColor="#0E5C66" />
          <stop offset="78%" stopColor="#3C7E79" />
          <stop offset="100%" stopColor="#C98A4B" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="680" height="300" fill="url(#akSky)" />
      <circle cx="527" cy="150" r="27" fill="#F0B15C" opacity="0.85" />
      <ellipse cx="200" cy="52" rx="96" ry="9" fill="#0B4A54" opacity="0.5" />
      <ellipse cx="430" cy="78" rx="130" ry="10" fill="#0B4A54" opacity="0.42" />
      <ellipse cx="120" cy="96" rx="78" ry="7" fill="#12606A" opacity="0.35" />

      <path fill="#0A4E58" d="M0 146 L74 112 L142 140 L214 100 L292 138 L360 108 L438 146 L510 118 L590 150 L660 124 L680 136 L680 180 L0 180 Z" />
      <path fill="#0A424B" d="M0 160 L96 132 L186 158 L276 126 L372 156 L470 130 L562 162 L660 138 L680 148 L680 190 L0 190 Z" />

      <rect x="0" y="176" width="680" height="34" fill="#12707A" />
      <path fill="#1A8089" d="M0 176 Q 60 182 120 176 Q 180 170 240 176 Q 300 182 360 176 Q 420 170 480 176 Q 540 182 600 176 Q 640 172 680 176 L680 186 L0 186 Z" />
      <rect x="452" y="180" width="150" height="3" rx="1.5" fill="#F0B15C" opacity="0.5" />
      <rect x="472" y="188" width="110" height="2.5" rx="1.25" fill="#F0B15C" opacity="0.32" />
      <rect x="490" y="196" width="74" height="2" rx="1" fill="#F0B15C" opacity="0.2" />

      <path fill="#083840" d="M0 206 Q 170 194 340 206 Q 510 218 680 202 L680 300 L0 300 Z" />
      <path fill="#063037" d="M0 232 Q 200 218 400 234 Q 560 246 680 230 L680 300 L0 300 Z" />

      <path fill="#B8462A" d="M0 300 Q 130 268 268 252 Q 400 237 520 244 Q 610 249 680 262 L680 300 Z" />
      <path fill="#9A3A22" d="M0 300 Q 130 272 268 256 Q 400 241 520 248 Q 610 253 680 266 L680 274 Q 600 260 518 256 Q 400 249 270 264 Q 134 280 0 308 Z" />
      <path stroke="#F4E3C8" strokeWidth="2.5" strokeDasharray="20 18" strokeLinecap="round"
            fill="none" opacity="0.65"
            d="M0 300 Q 136 278 272 262 Q 402 248 520 255 Q 608 260 680 272" />

      <g fill="#04272D">
        <path d="M604 252 q-3 -34 1 -56 l5 0 q3 24 1 56 Z" />
        <path d="M609 196 q-22 -9 -34 4 q18 -1 33 6 Z" />
        <path d="M609 196 q22 -11 35 3 q-19 -1 -34 7 Z" />
        <path d="M609 196 q-13 -20 -3 -34 q6 16 6 34 Z" />
        <path d="M609 196 q16 -17 31 -14 q-17 5 -29 18 Z" />
        <path d="M648 258 q-3 -30 1 -48 l5 0 q3 21 1 48 Z" />
        <path d="M653 210 q-19 -8 -29 3 q15 -1 28 5 Z" />
        <path d="M653 210 q19 -9 30 3 q-16 -1 -29 6 Z" />
        <path d="M653 210 q-11 -17 -3 -29 q5 14 5 29 Z" />
      </g>

      <g fill="#052C33">
        <path d="M38 268 q-4 -40 1 -66 l6 0 q4 28 1 66 Z" />
        <path d="M44 202 q-26 -11 -40 5 q21 -2 39 7 Z" />
        <path d="M44 202 q26 -13 41 4 q-22 -2 -40 8 Z" />
        <path d="M44 202 q-15 -24 -4 -40 q7 19 7 40 Z" />
        <path d="M44 202 q19 -20 36 -16 q-20 6 -34 21 Z" />
        <path d="M44 202 q-24 3 -33 20 q17 -12 33 -13 Z" />
      </g>

      <g opacity="0.9">
        <rect x="292" y="240" width="26" height="11" rx="3.5" fill="#EFE6D4" />
        <path d="M297 240 q5 -8 11 -8 q6 0 8 8 Z" fill="#EFE6D4" />
        <circle cx="299" cy="252" r="2.6" fill="#04272D" />
        <circle cx="313" cy="252" r="2.6" fill="#04272D" />
        <rect x="316" y="243" width="3" height="2.4" rx="1" fill="#F0B15C" />
      </g>
    </svg>
  );
}

export default HeroArt;
