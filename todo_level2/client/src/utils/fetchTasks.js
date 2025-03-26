async function fetchTaskAPI(handleResponse, handleError, options = {}) {
  try {
    // Base URL for the API endpoint
    const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;

    // Endpoint for fetching data
    const endpoint = "/task";

    // Construct the full URL using the endpoint
    const url = new URL(endpoint, baseUrl);

    // Append sort option as a query parameter if provided
    if (options.sortOption) {
      url.searchParams.append("sort_by", options.sortOption);
      url.searchParams.append("sort_type", "asc");
    }

    // Append selected status as query parameters if provided
    if (options.selectedStatus?.length) {
      // Convert to a comma-separated string
      url.searchParams.append("status", options.selectedStatus.join(","));
    }

    // Append selected labels as query parameters if provided
    if (options.selectedLabels?.length) {
      // Convert to a comma-separated string
      url.searchParams.append("labels", options.selectedLabels.join(","));
    }

    // Send a GET request to the constructed URL
    const response = await fetch(url);

    // Extract JSON data from the response
    const jsonData = await response.json();

    // Check if the response is not successful
    if (!response.ok) {
      const errorMessage = jsonData.message || "Unknown error occurred";
      // Throw this error to be caught in the catch block
      throw new Error(errorMessage);
    }

    // Pass the fetched data to the handleResponse function for further processing
    handleResponse(jsonData);
  } catch (error) {
    handleError(error);
  }
}

export default fetchTaskAPI;
