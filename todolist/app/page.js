"use client";
// This tells Next.js this code runs in the browser (not server-side)

import { useState, useEffect } from "react";
// useState = stores changing values
// useEffect = runs code automatically when page loads

import { supabase } from "../lib/supabase";
// This connects your app to Supabase (your database)

export default function Home() {


  const [task, setTask] = useState("");
  // Stores what the user types in the input box

  const [tasks, setTasks] = useState([]);
  // Stores all tasks from Supabase


  
  // ADD TASK TO DATABASE


  async function addTask() {

    if (task === "") return;
    // Prevent empty tasks

    const { error } = await supabase
      .from("tasks")
      // Use the "tasks" table in Supabase

      .insert([
        {
          text: task,
          // Save the task text

          done: false,
          // New tasks always start as not done
        },
      ]);

    if (error) {
      console.log("Error adding task:", error);
      return;
    }

    setTask("");
    // Clear input box after adding

    getTasks();
    // Reload tasks from database so UI updates
  }


  // GET TASKS FROM DATABASE

  async function getTasks() {

    const { data, error } = await supabase
      .from("tasks")
      .select("*");
      // Get ALL columns from ALL rows

    if (error) {
      console.log("Error fetching tasks:", error);
      return;
    }

    setTasks(data);
    // Put database tasks into React state (UI)
  }

``
  // RUN ON PAGE LOAD
  

  useEffect(() => {
    getTasks();
    // When page opens → load tasks from Supabase
  }, []);


  // TOGGLE DONE / UNDO

  async function toggleTask(index) {

    const taskToUpdate = tasks[index];
    // Get the task the user clicked

    const { error } = await supabase
      .from("tasks")
      .update({
        done: !taskToUpdate.done,
        // Flip true ↔ false
      })
      .eq("id", taskToUpdate.id);
      // Only update the row with matching ID

    if (error) {
      console.log("Error updating task:", error);
      return;
    }

    getTasks();
    // Refresh list so UI matches database
  }


  // UI (WHAT YOU SEE ON SCREEN)

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

      {/* INPUT BOX */}
      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        // Every time user types → update "task" state

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
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          marginTop: "20px",
        }}
      >

        {tasks.map((item, index) => (
          // Loop through all tasks

          <li
            key={item.id}
            // Unique ID from Supabase (important for React)

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

            {/* TASK TEXT */}
            <span
              style={{
                textDecoration: item.done ? "line-through" : "none",
                // If done → show line through text
              }}
            >
              {item.text}
            </span>

            {/* DONE / UNDO BUTTON */}
            <button onClick={() => toggleTask(index)}>
              {item.done ? "Undo" : "Done"}
            </button>

          </li>
        ))}

      </ul>
    </div>
  );
}