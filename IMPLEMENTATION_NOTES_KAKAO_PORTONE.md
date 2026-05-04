# Kakao Login & PortOne Payment Implementation Notes

## Added APIs

### Kakao Login
- `POST /api/auth/kakao`
- `GET /api/auth/kakao/callback?code=...`

Required environment variables:
- `KAKAO_CLIENT_ID`
- `KAKAO_REDIRECT_URI`
- optional: `KAKAO_CLIENT_SECRET`

The backend receives the Kakao authorization code, requests a Kakao access token, retrieves the Kakao user profile, then logs in an existing user or creates a new `user_member` row.

### PortOne Payment Verification
- `POST /api/payments/portone/verify`

Required environment variable:
- `PORTONE_API_SECRET`

The backend receives `paymentId` and `orderId`, requests the payment detail from PortOne, checks the payment status and amount, then marks the order as paid and saves a `trade_payments` row.

## Existing Demo Flow Preserved
- Existing dummy SQL data was not removed.
- Existing mock payment API remains available: `POST /api/payments/mock`.
- If external API keys are not configured, the server can still start; only the Kakao/PortOne API calls return configuration errors.
