'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2, AlertCircle, CheckCircle2, Navigation, ChevronDown, Search } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'kyg:location:v1';

type LocationState = {
  pincode: string;
  area: string;
  district: string;
  state: string;
  serviceable: boolean;
} | null;

type Suggestion = {
  placeName: string;
  placeAddress: string;
  pincode: string | null;
  area: string;
  district: string;
  state: string;
  serviceable: boolean;
  type?: string;
};

/**
 * Header chip → opens a dialog with:
 *   1. "Use my current location"  (Mappls reverse-geocode)
 *   2. Smart search input          (Mappls autosuggest) - type "DLF", "Connaught Place"
 *   3. 6-digit pincode entry       (pure DB lookup - always works)
 *
 * Any single path can fail independently without breaking the others.
 */
export default function LocationGate() {
  const [location, setLocation] = useState<LocationState>(null);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLocation(JSON.parse(raw) as LocationState);
    } catch {
      /* corrupted storage - ignore */
    }
  }, []);

  function saveLocation(loc: LocationState) {
    setLocation(loc);
    try {
      if (loc) localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage disabled - session-only */
    }
  }

  const label =
    hydrated && location ? (
      <span className="flex items-center gap-1">
        <span className="font-mono text-xs">{location.pincode}</span>
        <span className="hidden max-w-[120px] truncate text-xs text-muted-foreground lg:inline">
          · {location.area || location.district}
        </span>
      </span>
    ) : (
      <span className="text-xs">Select location</span>
    );

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => setOpen(true)}
        aria-label="Change delivery location"
      >
        <MapPin className="h-3.5 w-3.5 text-primary" />
        {label}
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </Button>

      <LocationDialog
        open={open}
        onOpenChange={setOpen}
        currentPincode={location?.pincode ?? null}
        onLocationSet={(loc) => {
          saveLocation(loc);
          setOpen(false);
          toast.success(
            loc?.serviceable ? `Location set to ${loc.pincode}` : 'Location saved',
            loc?.area ? { description: `${loc.area}${loc.district ? `, ${loc.district}` : ''}` } : undefined
          );
        }}
      />
    </>
  );
}

// ---------------------------------------------------------------------------

function LocationDialog({
  open,
  onOpenChange,
  currentPincode,
  onLocationSet,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  currentPincode: string | null;
  onLocationSet: (loc: LocationState) => void;
}) {
  const [query, setQuery] = useState('');
  const [pincode, setPincode] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestDown, setSuggestDown] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
  const [autoDetecting, setAutoDetecting] = useState(false);
  const [result, setResult] = useState<LocationState>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset every time the dialog opens.
  useEffect(() => {
    if (open) {
      setQuery('');
      setPincode(currentPincode ?? '');
      setSuggestions([]);
      setSuggestDown(false);
      setResult(null);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [open, currentPincode]);

  // Debounced autosuggest. 6-digit numeric queries skip the Mappls call and
  // route straight to the DB pincode check below.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = query.trim();
    if (q.length < 2 || /^\d{6}$/.test(q)) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSuggestLoading(true);
      try {
        const res = await fetch(`/api/location/autosuggest?q=${encodeURIComponent(q)}`);
        const json = await res.json();
        if (!json.ok) {
          setSuggestDown(true);
          setSuggestions([]);
        } else {
          setSuggestDown(false);
          setSuggestions(json.data.items as Suggestion[]);
        }
      } catch {
        setSuggestDown(true);
        setSuggestions([]);
      } finally {
        setSuggestLoading(false);
      }
    }, 300);
  }, [query]);

  function autoDetect() {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      toast.error("Your browser doesn't support location access. Enter your pincode below.");
      return;
    }
    setAutoDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch('/api/location/resolve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat: latitude, lng: longitude }),
          });
          const json = await res.json();
          if (!json.ok) {
            toast.error('Auto-detect unavailable. Search for your area or enter a pincode.');
            setAutoDetecting(false);
            return;
          }
          setResult(json.data);
          setPincode(json.data.pincode);
          setQuery('');
        } catch {
          toast.error('Auto-detect unavailable. Search for your area or enter a pincode.');
        } finally {
          setAutoDetecting(false);
        }
      },
      (err) => {
        setAutoDetecting(false);
        if (err.code === err.PERMISSION_DENIED) {
          toast.error('Location permission denied. Search for your area or enter a pincode.');
        } else if (err.code === err.TIMEOUT) {
          toast.error('Location request timed out.');
        } else {
          toast.error("Couldn't get your location.");
        }
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  }

  async function checkPincode(pin: string) {
    if (!/^\d{6}$/.test(pin)) return;
    setCheckLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/location/resolve?pincode=${pin}`);
      const json = await res.json();
      if (json.ok) setResult(json.data);
      else toast.error(json.error ?? 'Check failed');
    } catch {
      toast.error('Check failed. Please try again.');
    } finally {
      setCheckLoading(false);
    }
  }

  async function pickSuggestion(s: Suggestion) {
    setQuery(s.placeName);
    setSuggestions([]);
    if (s.pincode) {
      setPincode(s.pincode);
      await checkPincode(s.pincode);
    } else {
      toast.error("Couldn't find a pincode for that place. Try a more specific area.");
    }
  }

  function handleConfirm() {
    if (!result) return;
    onLocationSet(result);
  }

  // The manual-pincode row is shown when:
  //   - User typed exactly 6 digits → offer a direct Check button
  //   - Autosuggest failed (Mappls down) → fall back gracefully
  //   - No typed query yet → user may want to jump straight to a pincode
  const manualRowVisible = /^\d{6}$/.test(query) || suggestDown || (query.length === 0 && !result);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Where should we deliver?</DialogTitle>
          <DialogDescription>Search your area, use your current location, or type your pincode.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Button onClick={autoDetect} disabled={autoDetecting} variant="outline" className="w-full">
            {autoDetecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
            {autoDetecting ? 'Getting your location…' : 'Use my current location'}
          </Button>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            OR
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Smart search */}
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search area, locality, or pincode"
              value={query}
              onChange={(e) => {
                const v = e.target.value;
                setQuery(v);
                if (/^\d{6}$/.test(v.trim())) setPincode(v.trim());
                if (v.trim().length === 0) setResult(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && /^\d{6}$/.test(query.trim())) {
                  checkPincode(query.trim());
                }
              }}
              autoFocus
            />
            {suggestLoading && (
              <Loader2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}

            {suggestions.length > 0 && (
              <div className="absolute top-full right-0 left-0 z-20 mt-1 max-h-60 overflow-y-auto rounded border bg-popover shadow-lg">
                {suggestions.map((s, i) => (
                  <button
                    key={`${s.placeName}-${i}`}
                    type="button"
                    onClick={() => pickSuggestion(s)}
                    className={cn(
                      'flex w-full items-start gap-3 px-3 py-2 text-left text-sm transition hover:bg-muted',
                      i !== suggestions.length - 1 && 'border-b'
                    )}
                  >
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{s.placeName}</div>
                      <div className="truncate text-xs text-muted-foreground">{s.placeAddress}</div>
                    </div>
                    {s.pincode && (
                      <span
                        className={cn(
                          'shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px]',
                          s.serviceable ? 'bg-emerald-100 text-emerald-800' : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {s.pincode}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Manual 6-digit fallback - shown when autosuggest is down or query IS a pincode */}
          {manualRowVisible && (
            <div className="flex gap-2">
              <Input
                className="font-mono"
                placeholder="Or type 6-digit pincode"
                maxLength={6}
                inputMode="numeric"
                value={pincode}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '');
                  setPincode(v);
                  if (v.length !== 6) setResult(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && pincode.length === 6) checkPincode(pincode);
                }}
              />
              <Button onClick={() => checkPincode(pincode)} disabled={checkLoading || pincode.length !== 6}>
                {checkLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Check'}
              </Button>
            </div>
          )}

          {suggestDown && query.trim().length >= 2 && !/^\d{6}$/.test(query.trim()) && (
            <p className="text-xs text-muted-foreground">
              Search is temporarily unavailable. Please enter your 6-digit pincode above.
            </p>
          )}

          {result && result.serviceable && (
            <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <AlertDescription>
                <span className="font-medium">Yes, we deliver here.</span>
                {(result.area || result.district) && (
                  <span className="mt-0.5 block text-xs">
                    {[result.area, result.district, result.state].filter(Boolean).join(', ')}
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {result && !result.serviceable && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <span className="font-medium">Sorry, we don&rsquo;t deliver to {result.pincode} yet.</span>
                <span className="mt-0.5 block text-xs">
                  We&rsquo;re expanding across India - check back in a few weeks. You can still browse our tests.
                </span>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!result}>
            {result?.serviceable ? 'Confirm location' : 'Save anyway'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
