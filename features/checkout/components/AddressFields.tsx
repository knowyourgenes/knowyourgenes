'use client';

import { useState } from 'react';

export interface AddressDraft {
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  area: string;
  city: string;
  pincode: string;
  landmark: string;
}

export const EMPTY_ADDRESS: AddressDraft = {
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  area: '',
  city: '',
  pincode: '',
  landmark: '',
};

const FIELD =
  'h-11 w-full rounded-xl border border-zeus/[0.12] bg-white px-3.5 text-[14.5px] text-mine outline-none transition placeholder:text-cord/60 focus:border-eden/40';
const LABEL = 'text-[12px] font-bold uppercase tracking-[0.07em] text-cord';

/**
 * The new-address form. Serviceability is checked on the PIN code but only ever
 * WARNS - the courier API is the same one that can be mocked or briefly down,
 * and refusing a real customer's money because a third party said "no" is worse
 * than shipping a kit ops has to reroute.
 */
export function AddressFields({
  value,
  onChange,
  disabled,
}: {
  value: AddressDraft;
  onChange: (next: AddressDraft) => void;
  disabled?: boolean;
}) {
  const [serviceWarning, setServiceWarning] = useState<string | null>(null);

  const set = (key: keyof AddressDraft) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [key]: e.target.value });

  async function checkPincode(pincode: string) {
    if (!/^\d{6}$/.test(pincode)) return setServiceWarning(null);
    try {
      const res = await fetch(`/api/location/serviceability?pincode=${pincode}&type=forward`);
      const json = (await res.json()) as { ok: boolean; data?: { serviceable: boolean; local?: { area?: string } } };
      if (json.ok && json.data && !json.data.serviceable) {
        setServiceWarning('We may not deliver to this PIN code yet - our team will call you to confirm.');
      } else {
        setServiceWarning(null);
      }
    } catch {
      setServiceWarning(null); // never block on a failed check
    }
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <label className={LABEL} htmlFor="ad-name">
          Full name
        </label>
        <input id="ad-name" className={FIELD} value={value.fullName} onChange={set('fullName')} disabled={disabled} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={LABEL} htmlFor="ad-phone">
          Phone
        </label>
        <input
          id="ad-phone"
          className={FIELD}
          inputMode="tel"
          autoComplete="tel"
          placeholder="10-digit mobile"
          value={value.phone}
          onChange={set('phone')}
          disabled={disabled}
        />
      </div>
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label className={LABEL} htmlFor="ad-line1">
          Flat / house / building
        </label>
        <input id="ad-line1" className={FIELD} value={value.line1} onChange={set('line1')} disabled={disabled} />
      </div>
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label className={LABEL} htmlFor="ad-line2">
          Street / locality <span className="font-medium normal-case tracking-normal">(optional)</span>
        </label>
        <input id="ad-line2" className={FIELD} value={value.line2} onChange={set('line2')} disabled={disabled} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={LABEL} htmlFor="ad-area">
          Area
        </label>
        <input id="ad-area" className={FIELD} value={value.area} onChange={set('area')} disabled={disabled} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={LABEL} htmlFor="ad-city">
          City
        </label>
        <input id="ad-city" className={FIELD} value={value.city} onChange={set('city')} disabled={disabled} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={LABEL} htmlFor="ad-pin">
          PIN code
        </label>
        <input
          id="ad-pin"
          className={FIELD}
          inputMode="numeric"
          maxLength={6}
          value={value.pincode}
          onChange={(e) => onChange({ ...value, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
          onBlur={(e) => checkPincode(e.target.value)}
          disabled={disabled}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={LABEL} htmlFor="ad-landmark">
          Landmark <span className="font-medium normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="ad-landmark"
          className={FIELD}
          value={value.landmark}
          onChange={set('landmark')}
          disabled={disabled}
        />
      </div>
      {serviceWarning && (
        <p className="rounded-xl border border-amber-500/40 bg-amber-500/[0.07] px-3.5 py-2.5 text-[13px] leading-[1.5] text-cape sm:col-span-2">
          {serviceWarning}
        </p>
      )}
    </div>
  );
}
