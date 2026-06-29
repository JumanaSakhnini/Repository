"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  // ADD TASK
  async function addTask() {
    if (task === "") return;

    const { error } = await supabase.from("tasks").insert([
      {
        text: task,
        done: false,
      },
    ]);

    if (error) {
      console.log("Error adding task:", error);
      return;
    }

    setTask("");
    getTasks();
  }

  // GET TASKS
  async function getTasks() {
    const { data, error } = await supabase.from("tasks").select("*");

    if (error) {
      console.log("Error fetching tasks:", error);
      return;
    }

    setTasks(data);
  }

  // RUN ON PAGE LOAD
  useEffect(() => {
    getTasks();
  }, []);

  // TOGGLE DONE / UNDO
  async function toggleTask(id, currentDone) {
    const { error } = await supabase
      .from("tasks")
      .update({
        done: !currentDone,
      })
      .eq("id", id);

    if (error) {
      console.log("Error updating task:", error);
      return;
    }

    getTasks();
  }

  // DELETE TASK
  async function deleteTask(id) {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.log("Error deleting task:", error);
      return;
    }

    getTasks();
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

      {/* INPUT */}
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

      {/* ADD BUTTON */}
      <button onClick={addTask} style={{ padding: "10px 15px" }}>
        Add
      </button>

      {/* TASK LIST */}
      <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
        {tasks.map((item) => (
          <li
            key={item.id}
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
            {/* TEXT */}
            <span
              style={{
                textDecoration: item.done ? "line-through" : "none",
              }}
            >
              {item.text}
            </span>

            {/* BUTTONS */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => toggleTask(item.id, item.done)}>
                {item.done ? "Undo" : "Done"}
              </button>

              <button
                onClick={() => deleteTask(item.id)}
                style={{
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "5px",
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}