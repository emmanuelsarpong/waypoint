# EMAIL DEBUGGING AND PRODUCTION SETUP GUIDE

## Why No Emails in Test Mode

Stripe's behavior for billing emails:

### Test Mode (Current - using pk*test* keys):

- ❌ Most billing emails are NOT sent to prevent spam
- ✅ Events are fired and logged
- ✅ Webhooks work normally
- ✅ You can see events in Dashboard > Events
- ❌ No actual emails delivered

### Live Mode (Production - pk*live* keys):

- ✅ All billing emails sent normally
- ✅ Professional templates used
- ✅ Emails go to real customers

## How to Test Billing Emails

### Option 1: Check Stripe Dashboard Events

1. Go to Stripe Dashboard > Events
2. Look for recent `customer.subscription.updated` events
3. Click on event to see details
4. Check "Attempted webhooks" section

### Option 2: Enable Test Mode Emails (Limited)

Some Stripe billing emails can be sent in test mode:

1. Go to Settings > Billing > Email notifications
2. Enable "Send emails in test mode" (if available)
3. Note: This only works for certain email types

### Option 3: Go Live (Recommended for final testing)

1. Switch to live Stripe keys
2. Use real (but small) amounts for testing
3. All emails will be sent normally

## Current Webhook Status

✅ Your webhook handler is working correctly
✅ Subscription update events are properly handled
✅ Code is production-ready

## Verification Steps

Run these to verify your setup:

```bash
# Check if webhook received events
curl http://localhost:3000/api/billing/webhook-status

# Trigger test event (webhook works, email suppressed in test mode)
stripe trigger customer.subscription.updated

# Check Stripe events
stripe events list --limit 5
```

## Production Deployment Checklist

When ready to go live:

1. [ ] Switch to live Stripe keys (pk*live*, sk*live*)
2. [ ] Update webhook endpoint in live Stripe Dashboard
3. [ ] Test with real subscription changes
4. [ ] Verify emails are sent to customers
5. [ ] Monitor Stripe Dashboard > Events for issues

## Email Template Customization

Your Stripe email settings are already configured correctly:

- ✅ Customer emails enabled
- ✅ Payment failure notifications enabled
- ✅ Subscription management enabled
- ✅ Customer portal configured

The emails will use Stripe's professional templates automatically.
