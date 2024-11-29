const axios = require('axios');

/**
 * Fetches all form submissions from HubSpot API, handling pagination
 * @param {string} apiKey - HubSpot API key
 * @param {string} formGuid - Form GUID to fetch submissions for
 * @param {number} [limit=20] - Number of records per page
 * @returns {Promise<Array>} Array of all form submissions
 */
async function getFormSubmissions(apiKey, formGuid, limit = 20) {
	const baseUrl = `https://api.hubapi.com/form-integrations/v1/submissions/forms/${formGuid}`;
	let allResults = [];
	let hasMore = true;
	let after = null;

	try {
		while (hasMore) {
			// Construct URL with pagination parameters
			const url = after ? `${baseUrl}?after=${after}&limit=${limit}` : `${baseUrl}?limit=${limit}`;

			const response = await axios.get(url, {
				headers: { Authorization: `Bearer ${apiKey}` },
			});

			// Add results from current page
			allResults = allResults.concat(response.data.results);

			// Check if there are more pages
			if (response.data.paging?.next?.after) {
				after = response.data.paging.next.after;
			} else {
				hasMore = false;
			}
		}

		return allResults;
	} catch (error) {
		console.error('Error fetching HubSpot form submissions:', error.message);
		throw error;
	}
}

function calculateSubmissions(data) {
	const totalSubmissions = data ? data.length : 0;
	const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
	let lastDaySubmissions = 0;

	if (data) {
		lastDaySubmissions = data.filter((submission) => {
			const submittedTime = submission.submittedAt;
			const submittedDate = new Date(submittedTime);
			return submittedDate >= oneDayAgo;
		}).length;
	}

	return { totalSubmissions, lastDaySubmissions };
}

module.exports = { getFormSubmissions, calculateSubmissions };
