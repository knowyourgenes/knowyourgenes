'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCart } from '../hooks/use-cart';

/**
 * The buy control. Once a kit is in the basket the button becomes a link to the
 * cart rather than staying an "Add" button that silently stacks quantity - the
 * commonest way people accidentally order three saliva kits.
 */
export function AddToCart({
  slug,
  name,
  quantity = 1,
  className = '',
  children,
}: {
  slug: string;
  name: string;
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const { add, priced, hydrated } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const inCart = priced?.lines.some((l) => l.slug === slug) ?? false;

  if (hydrated && (inCart || justAdded)) {
    return (
      <Link href="/cart" className={className}>
        In cart · View cart
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        add(slug, quantity);
        setJustAdded(true);
        toast.success('Added to cart', {
          description: quantity > 1 ? `${name} × ${quantity}` : name,
          action: { label: 'View cart', onClick: () => (window.location.href = '/cart') },
        });
      }}
    >
      {children ?? 'Add to cart'}
    </button>
  );
}
