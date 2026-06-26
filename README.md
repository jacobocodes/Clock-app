# Clock

A simple, minimalistic clock that displays the current time with seconds in your
local timezone (12-hour format with AM/PM). It also shows the resolved timezone
name below the clock.

## Usage

Open `index.html` in any web browser. No build step or dependencies required.
The clock automatically uses your device's timezone.

## Plain-text time endpoint (`/time`)

The visual clock is rendered with JavaScript, so tools that only fetch raw
HTML (like the iOS Shortcuts "Get contents of URL" action) can't read it.

For those, use the `/time` endpoint, which returns the current time as plain
text (e.g. `2:05:09 PM`). It's a Netlify Edge Function
(`netlify/edge-functions/time.js`) that formats the time using the
requester's timezone (derived from their IP), so it's correct wherever they
are. Override with a query param if needed: `/time?tz=America/New_York`.

Example: `https://<your-site>.netlify.app/time`
