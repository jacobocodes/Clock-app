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

  const format = (zone) => {
    const now = new Date();
    const date = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      month: "numeric",
      day: "numeric",
      year: "numeric",
    }).format(now);
    const time = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(now);
    return `${date} - ${time}`;
  };

  let output;
  try {
    output = format(tz);
  } catch (e) {
    // Invalid timezone string — fall back to UTC.
    output = format("UTC");
  }

  return new Response(output, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
};

export const config = { path: "/time" };
