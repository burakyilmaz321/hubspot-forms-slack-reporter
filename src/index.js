const { getFormSubmissions, calculateSubmissions } = require('./hubspot');
const { sendSlackMessage } = require('./slack');

// Shared logic for both handlers
async function generateReport(env) {
	// Validate required environment variables
	const requiredEnvVars = ['HUBSPOT_API_KEY', 'FORM_GUID', 'SLACK_WEBHOOK_URL'];
	for (const envVar of requiredEnvVars) {
		if (!env[envVar]) {
			throw new Error(`Missing required environment variable: ${envVar}`);
		}
	}

	// Fetch form submissions
	const formData = await getFormSubmissions(env.HUBSPOT_API_KEY, env.FORM_GUID);

	// Validate response data
	if (!formData || !Array.isArray(formData)) {
		throw new Error('Invalid response from HubSpot API');
	}

	// Calculate submission stats
	const { totalSubmissions, lastDaySubmissions } = calculateSubmissions(formData);

	// Send stats to Slack
	await sendSlackMessage(env.SLACK_WEBHOOK_URL, totalSubmissions, lastDaySubmissions);

	return {
		totalSubmissions,
		lastDaySubmissions,
		timestamp: new Date().toISOString(),
	};
}

export default {
	// HTTP handler for manual triggers
	async fetch(request, env, ctx) {
		const result = await generateReport(env);
    console.log(result)
		return new Response();
	},

	// Scheduled handler for cron job
	async scheduled(event, env, ctx) {
		ctx.waitUntil(generateReport(env));
	},
};
