const STORE_POLICY_SUMMARY = `
Shipping:
- Standard shipping within the EU takes 3-5 business days.
- Express shipping takes 1-2 business days where available.
- Orders over €100 qualify for free standard shipping.

Returns and exchanges:
- Unworn items with tags can be returned within 30 days.
- Exchanges are available for size or color when stock is available.
- Final sale items cannot be returned unless faulty.

Sizing and payments:
- Customers can ask for size guidance based on fit preferences.
- The store accepts major cards and common digital wallets.
`.trim();

export function getPolicyPrompt(): string {
	return `You are a helpful personal shopping assistant for a clothing store.

Answer the customer's policy question using only the store policies below.
If the policy does not answer the question, say that you do not have that detail yet and offer to help with products.

Store policies:
${STORE_POLICY_SUMMARY}`;
}
