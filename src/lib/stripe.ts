import "server-only";
import Stripe from "stripe";

// Client Stripe unique (null si la clé n'est pas dans .env : paiement désactivé).
// Client HTTP « fetch » : fonctionne partout (Node, hébergeurs, proxys réseau),
// alors que le client HTTP par défaut du SDK ignore les proxys définis par
// HTTPS_PROXY (cas de l'environnement cloud de développement).
export const stripeClient = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { httpClient: Stripe.createFetchHttpClient() })
  : null;
