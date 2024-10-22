import stripe
from fastapi import APIRouter, HTTPException, Request

from store.settings import settings

stripe_router = APIRouter()

# test secret API key
stripe.api_key = settings.stripe.secret_key


@stripe_router.post("/create-checkout-session")
async def create_checkout_session(request: Request):
    try:
        data = await request.json()
        product_id = data.get("product_id")

        print(request)
        # Create a Checkout Session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            # automatic_tax={"enabled": True},
            line_items=[
                {
                    "price": "price_1QB2CD04NhRw5aBIEV3Bjefz",
                    "quantity": 1,
                },
            ],
            mode="payment",
            success_url=f"{settings.site.homepage}/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{settings.site.homepage}/buy",  # redirect to previous page (/buy) if cancel
        )

        return {"sessionId": checkout_session.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
