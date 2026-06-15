'use client';

import { hasFlag } from 'country-flag-icons';
import * as Flags from 'country-flag-icons/react/3x2';
import { getTeamCountryCode, isSubdivisionFlag } from '@/lib/team-flags';

const SIZE_CLASS = {
  sm: 'h-[clamp(0.65rem,1.8vw,1.5rem)] w-[clamp(0.9rem,2.5vw,2.25rem)]',
  md: 'h-[clamp(0.85rem,2.2vw,2rem)] w-[clamp(1.2rem,3vw,3rem)]',
  lg: 'h-[clamp(1.1rem,3vw,3.5rem)] w-[clamp(1.6rem,4.2vw,5rem)]',
  xl: 'h-[clamp(1.4rem,4vw,5rem)] w-[clamp(2rem,5.6vw,7rem)]',
} as const;

type CountryFlagProps = {
  team: string;
  size?: keyof typeof SIZE_CLASS;
  className?: string;
};

export function CountryFlag({ team, size = 'md', className = '' }: CountryFlagProps) {
  const code = getTeamCountryCode(team);
  if (!code) return null;

  const sizeClass = SIZE_CLASS[size];
  const rounded = 'rounded-[3px] shadow-[0_0_8px_rgba(0,0,0,0.35)] object-cover';

  if (isSubdivisionFlag(code)) {
    return (
      <img
        src={`https://flagcdn.com/w80/${code}.png`}
        alt=""
        aria-hidden
        className={`${sizeClass} ${rounded} shrink-0 ${className}`}
      />
    );
  }

  const iso = code.toUpperCase();
  if (!hasFlag(iso)) return null;

  const FlagIcon = (Flags as Record<string, React.ComponentType<{ className?: string; title?: string }>>)[iso];
  if (!FlagIcon) return null;

  return <FlagIcon className={`${sizeClass} ${rounded} shrink-0 ${className}`} title={team} />;
}
