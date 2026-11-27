const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'GET') {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: corsHeaders,
      });
    }

    const sheetId = env.GOOGLE_SHEET_ID;
    const sheetName = env.GOOGLE_SHEET_NAME;
    const calendarId = env.GOOGLE_CALENDAR_ID;
    const apiKey = env.GOOGLE_CALENDAR_API_KEY;
    const maxResults = 2500;

    const calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&maxResults=${maxResults}`;
    const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

    try {
      const [calendarResponse, sheetsResponse] = await Promise.all([
        fetch(calendarUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0',
          },
        }),
        fetch(sheetsUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0',
          },
        }),
      ]);

      if (!calendarResponse.ok) {
        const errorText = await calendarResponse.text();
        console.error(
          JSON.stringify({
            message: 'Error fetching calendar events',
            status: calendarResponse.status,
            body: errorText,
          }),
        );
        return new Response(
          `Failed to fetch events: ${calendarResponse.status}`,
          {
            status: calendarResponse.status,
            headers: corsHeaders,
          },
        );
      }

      if (!sheetsResponse.ok) {
        const errorText = await sheetsResponse.text();
        console.error(
          JSON.stringify({
            message: 'Error fetching sheet data',
            status: sheetsResponse.status,
            body: errorText,
          }),
        );
        return new Response(
          `Failed to fetch sheet data: ${sheetsResponse.status}`,
          {
            status: sheetsResponse.status,
            headers: corsHeaders,
          },
        );
      }

      const events = await calendarResponse.json();
      const sheetData = await sheetsResponse.json();

      return jsonResponse({
        calendarEvents: events,
        sheetData: sheetData,
      });
    } catch (error) {
      console.error(
        JSON.stringify({
          message: 'Error fetching data',
          error: error.message,
        }),
      );
      return new Response(`Error fetching data: ${error.message}`, {
        status: 500,
        headers: corsHeaders,
      });
    }
  },
};
