// sections
import { OverviewAppView } from 'src/sections/overview/app/view';

// ----------------------------------------------------------------------

async function getDataFromMultipleEndpoints() {
  try {
    const endpoint1 = 'http://localhost:8000/client/top-rated';
    const endpoint2 = 'http://localhost:8000/client/profiles-month';
    const endpoint3 = 'http://localhost:8000/client/count-profiles';
    // Add more endpoints as needed

    // Make multiple fetch requests concurrently using Promise.all
    const responses = await Promise.all([
      fetch(endpoint1, { next: { revalidate: 30 } }),
      fetch(endpoint2, { next: { revalidate: 30 } }),
      fetch(endpoint3, { next: { revalidate: 30 } }),
      // Add more fetch requests for additional endpoints
    ]);

    // Check if any of the responses are not OK
    for (const response of responses) {
      if (!response.ok) {
        throw new Error(`Failed to fetch data from ${response.url}`);
      }
    }

    // Parse and process the JSON data from each response
    const data = await Promise.all(responses.map((response) => response.json()));

    // Data from endpoint1 is in data[0], data from endpoint2 is in data[1], etc.
    console.log('Data from endpoint1:', data[0]);
    console.log('Data from endpoint2:', data[1]);
    // Process data from other endpoints as needed

    return data;
  } catch (error) {
    // Handle errors here
    console.error('Error:', error.message);
    throw error;
  }
}

export const metadata = {
  title: 'Dashboard: App',
};

export default async function OverviewAppPage() {
  const data = await getDataFromMultipleEndpoints();

  return <OverviewAppView data={data} />;
}
