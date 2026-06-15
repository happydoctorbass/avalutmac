'use client';

import { hasFlag } from 'country-flag-icons';
import * as Flags from 'country-flag-icons/react/3x2';
import { getTeamCountryCode, isSubdivisionFlag } from '@/lib/team-flags';

const SIZE_CLASS = {
  sm: 'h-5 w-7 md:h-6 md:w-9',
  md: 'h-7 w-10 md:h-8 md:w-12',
  lg: 'h-10 w-14 md:h-14 md:w-20',
  xl: 'h-14 w-20 md:h-20 md:w-28',
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
