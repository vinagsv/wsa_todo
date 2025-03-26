async function updateTaskAPI(
  values,
  taskId,
  handleError,
  handleResponse,
  setLoading
) {
  setLoading(true);
  try {
    //Base URL for API end point
    const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;

    //Endpoint for fetching a data
    const endpoint = `/task/${taskId}`;

    // construct the full URL using URL endpoint
    const url = `${baseUrl}${endpoint}`;

    // values => convery values to json format
    const requestBody = JSON.stringify({
      title: values.taskTitle,
      description: values.taskDescription,
      due_date: values.taskDueDate?.toISOString(),
    });

    //Send fetch post request with the values
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: requestBody,
    });

    //handle the data coming from fetch
    const jsonData = await response.json();

    if (!response.ok) {
      const errorMessage = jsonData.message || "Unknown error occured";
      throw new Error(errorMessage);
    }

    //handle Response
    handleResponse(jsonData);

    // handle error
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Unkown Error";

    handleError(new Error(errorMessage));
  } finally {
    setLoading(false);
  }
}

export default updateTaskAPI;
