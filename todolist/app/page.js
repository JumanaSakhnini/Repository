"use client";

import { useState } from "react";

export default function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  function addTask() {
    if (task === "") return;

    setTasks([
      ...tasks,
      {
        text: task,
        done: false,
      },
    ]);

    setTask("");
  }

  function toggleTask(index) {
    const newTasks = [...tasks];

    newTasks[index].done = !newTasks[index].done;

    setTasks(newTasks);
  }

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        textAlign: "center",
        backgroundColor: "#f371a7",
        padding: "20px",
        borderRadius: "12px",
      }}
    >
      <h1>To Do List</h1>

      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        style={{
          padding: "10px",
          width: "250px",
          backgroundColor: "#9fc7b5",
          marginRight: "10px",
        }}
      />

      <button
        onClick={addTask}
        style={{
          padding: "10px 15px",
        }}
      >
        Add
      </button>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          marginTop: "20px",
        }}
      >
        {tasks.map((item, index) => (
          <li
            key={index}
            style={{
              backgroundColor: "#d88aca",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                textDecoration: item.done
                  ? "line-through"
                  : "none",
              }}
            >
              {item.text}
            </span>

            <button
              onClick={() => toggleTask(index)}
            >
              {item.done ? "Undo" : "Done"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}