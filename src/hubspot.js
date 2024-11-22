const axios = require('axios');

async function getFormSubmissions(apiKey, formGuid) {
	const url = `https://api.hubapi.com/form-integrations/v1/submissions/forms/${formGuid}`;
	try {
		const response = await axios.get(url, {
			headers: { Authorization: `Bearer ${apiKey}` },
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching HubSpot form submissions:', error.message);
		throw error;
	}
}

function calculateSubmissions(data) {
	const totalSubmissions = data.results ? data.results.length : 0;
	const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
	let lastDaySubmissions = 0;

	if (data.results) {
		lastDaySubmissions = data.results.filter((submission) => {
			const submittedTime = submission.submittedAt;
			const submittedDate = new Date(submittedTime);
			return submittedDate >= oneDayAgo;
		}).length;
	}

	return { totalSubmissions, lastDaySubmissions };
}

module.exports = { getFormSubmissions, calculateSubmissions };
