// Main handler function for Cloudflare Worker
async function handleRequest(request) {

    const sheetId = GOOGLE_SHEET_ID;
    const sheetName = GOOGLE_SHEET_NAME;
    const calendarId = GOOGLE_CALENDAR_ID;
    const apiKey = GOOGLE_CALENDAR_API_KEY;
    const maxResults = 2500;

    const calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&maxResults=${maxResults}`;
    const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

    try {
        // Fetch data from both APIs in parallel
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

        // Validate the Calendar API response
        if (!calendarResponse.ok) {
            const errorText = await calendarResponse.text();
            console.error(`Error fetching events: Status ${calendarResponse.status}, Message: ${errorText}`);
            return new Response(`Failed to fetch events: ${calendarResponse.status}`, {
                status: calendarResponse.status,
            });
        }

        // Validate the Sheets API response
        if (!sheetsResponse.ok) {
            const errorText = await sheetsResponse.text();
            console.error(`Error fetching sheet data: Status ${sheetsResponse.status}, Message: ${errorText}`);
            return new Response(`Failed to fetch sheet data: ${sheetsResponse.status}`, {
                status: sheetsResponse.status,
            });
        }

        // Parse responses
        const events = await calendarResponse.json();
        const sheetData = await sheetsResponse.json();

        // Combine the data into one response
        const combinedData = {
            calendarEvents: events,
            sheetData: sheetData,
        };

        // Create the response
        const modifiedResponse = new Response(JSON.stringify(combinedData, null, 2), {
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