const BASEURL = import.meta.env.VITE_APP_API_BASE_URL;

async function fetchTaskAPI(handleResponse, handleError, options = {}) {
  try {
    if (!BASEURL)
      throw new Error("BASEURL is undefined. Check your .env file.");

    const url = new URL(`${BASEURL}/tasks`);

    if (options.sortOption) {
      url.searchParams.append("sort_by", options.sortOption);
      url.searchParams.append("sort_type", "asc");
    }

    const response = await fetch(url);
    const jsonData = await response.json();

    if (!response.ok) {
      throw new Error(jsonData.message || "Unknown error occurred");
    }

    handleResponse(jsonData);
  } catch (error) {
    console.error(error);
    handleError(error);
  }
}

async function createTaskApi(values, handleResponse, handleError, setLoading) {
  const endPoint = `/api/v2/tasks`;
  setLoading(true);
  try {
    const url = new URL(endPoint, BASEURL);
    const requestBody = JSON.stringify({
      title: values.taskTitle,
      description: values.taskDescription,
      due_date: values.taskDueDate?.toISOString(),
    });
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: requestBody,
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) {
      const errorMessage = data.message || "Unknown error occured";
      throw new Error(errorMessage);
    }
    handleResponse(data);
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown Error";
    handleError(new Error(errorMessage));
  } finally {
    setLoading(false);
  }
}

async function updateTaskApi(
  values,
  taskId,
  handleResponse,
  handleError,
  setLoading
) {
  const endPoint = `/api/v2/tasks/${taskId}`;
  setLoading(true);
  try {
    const url = new URL(endPoint, BASEURL);
    const requestBody = JSON.stringify({
      title: values.taskTitle,
      description: values.taskDescription,
      due_date: values.taskDueDate?.toISOString(),
    });
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: requestBody,
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      const errorMessage = data.message || "Unknown error occured";
      throw new Error(errorMessage);
    }
    handleResponse(data);
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown Error";
    handleError(new Error(errorMessage));
  } finally {
    setLoading(false);
  }
}

async function deleteTaskApi(taskId, handleResponse, handleError, setLoading) {
  const endPoint = `/api/v2/tasks/${taskId}`;
  setLoading(true);
  try {
    const url = new URL(endPoint, BASEURL);
    const response = await fetch(url, {
      method: "DELETE",
    });

    const data = await response.json();
    if (!response.ok) {
      const errorMessage = data.message || "Unknown error occured";
      throw new Error(errorMessage);
    }
    handleResponse(data);
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown Error";
    handleError(new Error(errorMessage));
  } finally {
    setLoading(false);
  }
}

async function updateLabelApi(
  labels,
  taskId,
  handleResponse,
  handleError,
  setLoading
) {
  try {
    const endpoint = `/api/v2/tasks/${taskId}/labels`;
    const url = new URL(endpoint, BASEURL);

    const requestBody = JSON.stringify({ labels });
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: requestBody,
    });

    const jsonData = await response.json();

    if (!response.ok) {
      const errorMessage = jsonData.message || "Unknown Error occured";
      throw new Error(errorMessage);
    }
    handleResponse(jsonData);
  } catch (error) {
    handleError(error);
  }
}

async function getLabelsApi(handleResponse, handleError) {
  try {
    const endpoint = `/api/v2/tasks/labels`;
    const url = new URL(endpoint, BASEURL);

    const response = await fetch(url);

    const jsonData = await response.json();

    if (!response.ok) {
      const errorMessage = jsonData.message || "Unknown Error occured";
      throw new Error(errorMessage);
    }
    handleResponse(jsonData);
  } catch (error) {
    handleError(error);
  }
}

async function changeStatusApi(
  status,
  taskId,
  handleResponse,
  handleError,
  setLoading
) {
  setLoading(true);
  try {
    const endPoint = `/api/v2/tasks/${taskId}/status`;
    const url = new URL(endPoint, BASEURL);
    const requestBody = JSON.stringify({ status });
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: requestBody,
    });

    const jsonData = await response.json();
    if (!response.ok) {
      const errorMessage = jsonData.message || "Unknown Error occured";
      throw new Error(errorMessage);
    }
    handleResponse(jsonData);
  } catch (error) {
    handleError(error);
  } finally {
    setLoading(false);
  }
}

export {
  fetchTaskAPI,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
  updateLabelApi,
  getLabelsApi,
  changeStatusApi,
};
