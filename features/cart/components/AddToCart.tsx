'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useCart } from '../hooks/use-cart';

/**
 * The buy control. Once a kit is in the basket the button stops being an "Add"
 * button - staying one is the commonest way people accidentally order three
 * saliva kits - and becomes a way to open the basket and look at it.
 *
 * It opens the DRAWER rather than navigating. There is no /cart page any more,
 * and opening a panel over the page someone is reading is better than taking
 * them off it to confirm something they just did.
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
  const { add, priced, hydrated, openDrawer } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const inCart = priced?.lines.some((l) => l.slug === slug) ?? false;

  if (hydrated && (inCart || justAdded)) {
    return (
      <button type="button" className={className} onClick={openDrawer}>
        In cart · View cart
      </button>
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
          action: { label: 'View cart', onClick: openDrawer },
        });
      }}
    >
      {children ?? 'Add to cart'}
    </button>
  );
}
