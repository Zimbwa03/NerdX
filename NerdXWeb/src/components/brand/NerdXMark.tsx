import { useId, useState } from 'react';

type NerdXMarkProps = {
  /** Outer box size (tw h-/w- class scale). Default 36px (h-9). */
  sizeClass?: string;
  className?: string;
};

/**
 * App-bar logo: loads /logo.png when available; otherwise a crisp inline mascot mark.
 * Container is dark-themed (no stark white tile) so PNGs with transparency look correct.
 */
export function NerdXMark({ sizeClass = 'h-9 w-9', className = '' }: NerdXMarkProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const gid = useId().replace(/:/g, '');

  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-gradient-to-b from-[var(--bg-elevated)] to-[#12161c] ring-1 ring-[var(--border-accent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ${sizeClass} ${className}`}
      aria-hidden
    >
      {!imgFailed ? (
        <img
          src="/logo.png"
          alt=""
          width={28}
          height={28}
          decoding="async"
          className="h-[26px] w-[26px] object-contain object-center"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <svg
          viewBox="0 0 32 32"
          className="h-[26px] w-[26px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <linearGradient id={`nxg-${gid}`} x1="6" y1="5" x2="26" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#047857" />
              <stop offset="1" stopColor="#064e3b" />
            </linearGradient>
          </defs>
          <circle cx="16" cy="17" r="12" fill={`url(#nxg-${gid})`} />
          <ellipse cx="16" cy="17" rx="10" ry="9" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <rect x="7.5" y="13" width="6.5" height="5" rx="1.25" stroke="#ecfdf5" strokeWidth="1.15" fill="rgba(16,185,129,0.12)" />
          <rect x="18" y="13" width="6.5" height="5" rx="1.25" stroke="#ecfdf5" strokeWidth="1.15" fill="rgba(16,185,129,0.12)" />
          <path d="M14 15.5h4" stroke="#ecfdf5" strokeWidth="1.15" strokeLinecap="round" />
          <path
            d="M11 20.25c1.6 1.35 3.8 2.1 5 2.1s3.4-.75 5-2.1"
            stroke="#34d399"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="24" cy="9" r="2.25" fill="#10b981" opacity="0.95" />
        </svg>
      )}
    </span>
  );
}
