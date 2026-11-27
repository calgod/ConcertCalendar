const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

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

    const username = env.LASTFM_USERNAME;
    const apiKey = env.LASTFM_API_KEY;

    const lastfmUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`;

    try {
      const lastfmResponse = await fetch(lastfmUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0',
        },
      });

      if (!lastfmResponse.ok) {
        const errorText = await lastfmResponse.text();
        console.error(
          JSON.stringify({
            message: 'Error fetching Last.fm data',
            status: lastfmResponse.status,
            body: errorText,
          }),
        );
        return new Response(
          `Failed to fetch events: ${lastfmResponse.status}`,
          {
            status: lastfmResponse.status,
            headers: corsHeaders,
          },
        );
      }

      const events = await lastfmResponse.json();

      return new Response(JSON.stringify(events, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
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
