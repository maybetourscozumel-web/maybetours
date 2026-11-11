import Stripe from "stripe";

export const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);

let _stripe: Stripe | null = null;

/** Returns null if Stripe keys aren't configured yet, instead of throwing. */
export function getStripe(): Stripe | null {
  if (!stripeEnabled) return null;
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }
  return _stripe;
}
