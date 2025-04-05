import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const { amount, credits } = req.body;
  const userId = req.userId; // extracted from middleware auth

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${credits} Credits Package`,
          },
          unit_amount: amount * 100, // Amount is in cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/result`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        userId,
        credits,
      },
    });

    // Send sessionId back to client
    res.json({ id: session.id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Stripe session creation failed' });
  }
};

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const credits = parseInt(session.metadata.credits, 10);

    try {
      await userModel.findByIdAndUpdate(userId, {
        $inc: { creditBalance: credits },
      });
      console.log(` User ${userId} credited with ${credits}`);
    } catch (error) {
      console.error('Error updating user credits:', error);
    }
  }

  res.status(200).json({ received: true });
};