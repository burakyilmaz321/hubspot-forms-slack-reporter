# HubSpot Forms Slack Reporter

A Cloudflare Worker that generates daily reports of HubSpot form submissions and sends them to Slack. The worker runs on a daily schedule and can also be triggered manually via HTTP request.

## Prerequisites

- Node.js and npm installed
- Cloudflare account
- HubSpot account with API access
- Slack workspace with incoming webhook configured

## Environment Variables

The following environment variables are required:

- `HUBSPOT_API_KEY`: Your HubSpot API key
- `FORM_GUID`: The GUID of the HubSpot form you want to monitor
- `SLACK_WEBHOOK_URL`: The webhook URL for your Slack channel

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/hubspot-forms-slack-reporter.git
cd hubspot-forms-slack-reporter
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.dev.vars` file for local development:

```
HUBSPOT_API_KEY=your_hubspot_api_key
FORM_GUID=your_form_guid
SLACK_WEBHOOK_URL=your_slack_webhook_url
```

## Development

Run the worker locally:

```bash
npm run dev
```

## Deployment

1. Configure your environment variables in Cloudflare:

```bash
wrangler secret put HUBSPOT_API_KEY
wrangler secret put FORM_GUID
wrangler secret put SLACK_WEBHOOK_URL
```

2. Deploy to Cloudflare Workers:

```bash
npm run deploy
```

## Configuration

The worker is configured to run daily at 6:00 AM UTC. You can modify the schedule in `wrangler.toml`:

```toml
[triggers]
crons = ["0 6 * * *"]
```
