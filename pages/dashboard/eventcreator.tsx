import { useEffect, useState } from "react";

type TaskInfo = {
  type: "file" | "text";
  label: string;
  allowedFiles: "images" | "videos" | "both" | null;
};
export default function EventCreator() {
  const [event, setEvent] = useState();
  const [tasksList, setTasksList] = useState<TaskInfo[]>([]);

  const handleNewTask = () => {
    const newTask: TaskInfo = {
      type: "file",
      label: "",
      allowedFiles: null,
    };

    const tempTasksList = [...tasksList, newTask];
    setTasksList(tempTasksList);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    const tempTasksList = [...tasksList];
    // console.log(e.target.name + "  " + e.target.value);
    if (e.target.name === "type") {
      if (e.target.value === "file") {
        tempTasksList[index].type = "file";
      } else if (e.target.value === "text") {
        tempTasksList[index].allowedFiles = null;
        tempTasksList[index].type = "text";
      } else {
        console.error("Unknown task type");
      }
    } else if (e.target.name === "label") {
      tempTasksList[index].label = e.target.value;
    } else if (e.target.name.includes("radio")) {
      if (e.target.value === "images") {
        tempTasksList[index].allowedFiles = "images";
      } else if (e.target.value === "videos") {
        tempTasksList[index].allowedFiles = "videos";
      } else if (e.target.value === "both") {
        tempTasksList[index].allowedFiles = "both";
      }
    }
    // else {

    // }

    setTasksList(tempTasksList);
  };

  return (
    <div>
      <h1>Event Creator</h1>
      <input type="text" name="eventName" placeholder="Event Name" />
      <label htmlFor="slugName">URL Slug</label>
      <p>taskmanager.show/e/URLSLUG</p>
      <input type="text" name="slugName" placeholder="Url Slug" />
      <button onClick={handleNewTask}>Add Task</button>
      {tasksList?.map((task, index) => {
        return (
          <div key={index}>
            <input
              type="text"
              name="label"
              value={task.label}
              placeholder="Type the task here"
              onChange={(e) => handleChange(e, index)}
            />
            <select
              value={task.type}
              name="type"
              onChange={(e) => handleChange(e, index)}
            >
              <option value="file">File</option>
              <option value="text">Text</option>
            </select>

            {task.type === "file" && (
              <div>
                {" "}
                <input
                  type="radio"
                  id="images"
                  name={`radio${index}`}
                  value="images"
                  onChange={(e) => handleChange(e, index)}
                  checked={task.allowedFiles === "images"}
                />
                <label htmlFor="images">Images</label>
                <br />
                <input
                  type="radio"
                  id="videos"
                  name={`radio${index}`}
                  value="videos"
                  onChange={(e) => handleChange(e, index)}
                  checked={task.allowedFiles === "videos"}
                />
                <label htmlFor="videos">Videos</label>
                <br />
                <input
                  onChange={(e) => handleChange(e, index)}
                  type="radio"
                  id="both"
                  name={`radio${index}`}
                  value="both"
                  checked={task.allowedFiles === "both"}
                />
                <label htmlFor="both">Both</label>{" "}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
