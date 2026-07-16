import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import stripe from "../services/stripe.service.js";

export const createOrder = async (req, res) => {
    try {
        const { planId, amount, credits } = req.body;
        if (!amount || !credits) {
            return res.status(400).json({ message: "Invalid plan data" });
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: `${planId === 'basic' ? 'Starter Pack' : 'Professional Pack'} - ${credits} AI Credits`,
                        },
                        unit_amount: amount * 100, // convert to paise
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/pricing`,
            metadata: {
                userId: req.userId,
                planId,
                credits,
                amount,
            }
        });

        // Save payment order to MongoDB
        await Payment.create({
            userId: req.userId,
            planId,
            amount,
            credits,
            stripeSessionId: session.id,
            status: "created",
        });

        return res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error("Stripe createSession error:", error);
        return res.status(500).json({ message: `failed to create Stripe checkout session: ${error.message}` });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { session_id } = req.body;
        if (!session_id) {
            return res.status(400).json({ message: "Missing session_id" });
        }

        // Retrieve session status from Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status !== "paid") {
            return res.status(400).json({ message: "Payment is not complete" });
        }

        // Check if payment was already verified
        const payment = await Payment.findOne({ stripeSessionId: session_id });
        if (!payment) {
            return res.status(404).json({ message: "Payment record not found" });
        }

        if (payment.status === "paid") {
            const user = await User.findById(payment.userId);
            return res.json({ success: true, message: "Payment already verified", user });
        }

        // Update payment record
        payment.status = "paid";
        payment.stripePaymentIntentId = session.payment_intent;
        await payment.save();

        // Increment user's credits
        const updatedUser = await User.findByIdAndUpdate(
            payment.userId,
            { $inc: { credits: payment.credits } },
            { new: true }
        );

        return res.json({
            success: true,
            message: "Stripe payment verified and credits added successfully!",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Stripe verifyPayment error:", error);
        return res.status(500).json({ message: `failed to verify Stripe payment: ${error.message}` });
    }
};