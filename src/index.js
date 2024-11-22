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
	if (!formData || !Array.isArray(formData.results)) {
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
		try {
			const result = await generateReport(env);

			return new Response(
				JSON.stringify({
					message: 'Report generated and sent successfully',
					...result,
				}),
				{
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		} catch (error) {
			console.error('Error in worker:', error);

			return new Response(
				JSON.stringify({
					error: error.message || 'Internal server error',
					timestamp: new Date().toISOString(),
				}),
				{
					status: error.status || 500,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}
	},

	// Scheduled handler for cron job
	async scheduled(event, env, ctx) {
		try {
			// Direct call to generateReport instead of using fetch()
			await generateReport(env);
		} catch (error) {
			console.error('Error in scheduled job:', error);
		}
	},
};
