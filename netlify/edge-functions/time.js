// Netlify Edge Function: returns the current time as plain text.
//
// Why this exists: the homepage clock is rendered by JavaScript in the
// browser, so tools that only download raw HTML (e.g. the iOS Shortcuts
// "Get contents of URL" action) just see the "--:--:--" placeholder.
// This endpoint computes the time on the server and returns plain text,
// so those tools get a real value like "2:05:09 PM".
//
// Timezone: by default it uses the requester's timezone, which Netlify
// derives from their IP (context.geo.timezone) — so it's correct wherever
// the person is. You can override it with ?tz=America/New_York.

export default (request, context) => {
  const url = new URL(request.url);
  const tz =
    url.searchParams.get("tz") || context.geo?.timezone || "UTC";

  let timeString;
  try {
    timeString = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(new Date());
  } catch (e) {
    // Invalid timezone string — fall back to UTC.
    timeString = new Intl.DateTimeFormat("en-US", {
      timeZone: "UTC",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(new Date());
  }

  return new Response(timeString, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
};

export const config = { path: "/time" };
