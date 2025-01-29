// Main handler function for Cloudflare Worker
async function handleRequest(request) {

    const username = LASTFM_USERNAME;
    const apiKey = LASTFM_API_KEY;
  
    const lastfmUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`;
  
    try {
        // Fetch data from API
        const [lastfmResponse] = await Promise.all([
            fetch(lastfmUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0',
                },
            })
        ]);
  
        // Validate the API response
        if (!lastfmResponse.ok) {
            const errorText = await lastfmResponse.text();
            console.error(`Error fetching events: Status ${lastfmResponse.status}, Message: ${errorText}`);
            return new Response(`Failed to fetch events: ${lastfmResponse.status}`, {
                status: lastfmResponse.status,
            });
        }
  
        // Parse responses
        const events = await lastfmResponse.json();
  
        // Create the response
        const modifiedResponse = new Response(JSON.stringify(events, null, 2), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
  
        return modifiedResponse;
    } catch (error) {
        console.error('Error fetching data:', error);
        return new Response(`Error fetching data: ${error.message}`, {
            status: 500,
        });
    }
  }
  
  // Event listener to handle requests
  addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
  });