async function fetchTaskAPI(handleResponse, handleError) {
  try {
    //Base URL for API end point
    const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;

    //Endpoint for fetching a data
    const endpoint = "/tasks";

    // construct the full URL using URL endpoint
    const url = `${baseUrl}${endpoint}`;

    // send a GET request to the constructed URL
    const respnse = await fetch(url);

    //extract jsonData from the response
    const jsonData = await respnse.json();

    // Check if the response is not succesfull
    if (!respnse.ok) {
      const errorMessage = jsonData.message || "Unknown error ocured";
      //Throw this error in catch block
      throw new Error(errorMessage);
    }

    //Pass the fetched data to the handle Response function for further processing
    handleResponse(jsonData);
  } catch (error) {
    handleError(error);
  }
}

export default fetchTaskAPI;
