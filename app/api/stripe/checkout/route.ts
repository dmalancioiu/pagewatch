import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
  }

  const supabase = await createServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const plan = body.plan as "starter" | "agency";

  const priceId =
    plan === "agency" ? env.STRIPE_AGENCY_PRICE_ID : env.STRIPE_STARTER_PRICE_ID;

  if (!priceId) {
    return NextResponse.json(
      { error: `STRIPE_${plan.toUpperCase()}_PRICE_ID is not configured.` },
      { status: 503 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/#pricing`,
      metadata: {
        user_id: user.id,
        plan
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session." }, { status: 500 });
  }
}
