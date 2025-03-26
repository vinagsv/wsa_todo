import moment from "moment-timezone";
import Task from "../models/task.model.js"; // Ensure this path is correct

const newTask = async (req, res) => {
  try {
    // Extract data from request body
    const { title, description, due_date, labels } = req.body;

    // Validate incoming data
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    let istDueDate;
    if (due_date) {
      istDueDate = moment.tz(due_date, "Asia/Kolkata").toDate();
    }

    // Create new task
    const newTask = await Task.create({
      title,
      description,
      due_date: istDueDate,
      labels,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    console.error("Error while creating a task", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTasks = async (req, res) => {
  try {
    console.log(req.query);

    // let query = Task.find(); // Corrected from 'task' to 'Task'
    // //sorting http://localhost:4000/api/v2/tasks?sort=added_on
    // if (req.query.sort) {
    // query = query.sort(req.query.sort); // Apply sorting only if provided
    // }

    // //pagination => 1to10 ,2-11to20,3-21-30
    // //http://localhost:4000/api/v2/tasks?page=2&limit=3

    // let page = req.query.page *1 || 1;
    // let limit = req.query.limit *1 || 10;
    // let skip = (page-1) * limit;
    // query = query.skip(skip).limit(limit); // MongoDB query method used for pagination in Mongoose

    // const tasks = await query;

    const { page, sort_by, sort_type, status, limit = 10, labels } = req.query;
    let query = {};
    let options = {};
    // set sort options
    //GET /api/v2/tasks?sort_by=due_date&sort_type=desc
    if (sort_by && ["added_on", "due_date"].includes(sort_by)) {
      const sortOptions = {};
      sortOptions[sort_by] = sort_type === "desc" ? -1 : 1;
      options.sort = sortOptions;
      // exmaple: sort={"due_date"-1}
    }

    //set filter options
    // GET /application/v2/tasks?status=["open"]

    if (status && status.length > 0) {
      const statusItems = JSON.parse(status);
      query.status = { $in: statusItems }; //$in is comparsion query
    }

    // set lable filter
    // GET /application/v2/tasks?labels=["frontend","React"]

    if (labels && labels.length > 0) {
      const lableItems = JSON.parse(labels);
      query.labels = { $in: lableItems };
    }

    //pageinations options
    if (page) {
      options.limt = parseInt(limit);
      options.skip = (parseInt(page) - 1) * parseInt(limit);
    }

    // let field = "-__v";

    //fetch task
    const tasks = await Task.find(query, null, options);
    // const tasks = await Task.find(query).select(field);

    res.status(200).json({
      success: true,
      results: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message, // Provides better error details
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, due_date } = req.body;

    if (!id) {
      return res
        .status(404)
        .json({ success: false, message: "Task ID is required" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (due_date) task.due_date = due_date;
    if (!due_date) task.due_date = null;

    const updatedTask = await task.save(); // Fixed variable name
    res.status(200).json({
      success: true,
      task: updatedTask,
    });
  } catch (error) {
    console.error(error.message);
    res.status(404).json({
      success: false,
      message: error.message, // Provides better error details
    });
  }
};

const updateLables = async (req, res) => {
  try {
    const { id } = req.params;
    const labels = req.body;
    if (!id || !labels || !Array.isArray(labels)) {
      return res.status(400).json({ message: "invalid input data" });
    }
    const task = await Task.findById(id);
    if (!task) {
      return res.status(400).json({ message: " Task not found" });
    }
    task.labels = labels; //upadte labeles with new array of labels

    const upadteTask = await task.save();
    return res
      .status(200)
      .json({ message: "task lables update", task: updateTask });
  } catch (error) {
    console.error("error while updating task", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getLabels = async (req, res) => {
  try {
    const labels = await Task.distinct("labels");
    if (!labels.length) {
      return res.status(400).json({ message: "No labels found" });
    }
    return res.status(200).json({ labels });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "failed to fetch the labels" });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validation
    if (status && !["Open", "In-Progress", "Completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status data" });
    }
    // Find the task by ID
    const task = await Task.findById(id);

    if (!task) {
      return res.status(400).json({ message: "Task not found" });
    }

    // Update the status
    task.status = status;
    const updatedTask = await task.save();

    return res.status(200).json({
      success: true,
      task: updatedTask,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Task ID is required" });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error while deleting task:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  newTask,
  getTasks,
  updateTask,
  updateLables,
  getLabels,
  updateStatus,
  deleteTask,
};
