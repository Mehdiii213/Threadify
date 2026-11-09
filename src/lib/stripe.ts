import "server-only";
import Stripe from "stripe";

// Client Stripe unique (null si la clé n'est pas dans .env : paiement désactivé).
export const stripeClient = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
