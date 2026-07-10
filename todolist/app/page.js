"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [user, setUser] = useState(null);
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  // CHECK IF USER IS LOGGED IN
  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setUser(user);
    getTasks(user.id);
  }

  useEffect(() => {
    checkUser();
  }, []);

  // GET TASKS
  async function getTasks(userId) {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.log("Error fetching tasks:", error);
      return;
    }

    setTasks(data);
  }

  // ADD TASK
  async function addTask() {
    if (task === "") return;

    const { error } = await supabase.from("tasks").insert([
      {
        text: task,
        done: false,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.log("Error adding task:", error);
      return;
    }

    setTask("");
    getTasks(user.id);
  }

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

    getTasks(user.id);
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

    getTasks(user.id);
  }

  // LOG OUT
  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (!user) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffd6e7",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >

      {/* White To Do Card */}
      <div
        style={{
          width: "400px",
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h1>To Do List</h1>

        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a task..."
          style={{
            padding: "10px",
            width: "65%",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={addTask}
          style={{
            padding: "10px 15px",
            marginLeft: "10px",
            backgroundColor: "#ff69a6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Add
        </button>


        <ul
          style={{
            listStyle: "none",
            padding: 0,
            marginTop: "25px",
          }}
        >
          {tasks.map((item) => (
            <li
              key={item.id}
              style={{
                backgroundColor: "#f3a6c8",
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
                  textDecoration: item.done ? "line-through" : "none",
                }}
              >
                {item.text}
              </span>


              <div style={{ display: "flex", gap: "8px" }}>

                <button
                  onClick={() => toggleTask(item.id, item.done)}
                  style={{
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 8px",
                    cursor: "pointer",
                  }}
                >
                  {item.done ? "Undo" : "Done"}
                </button>


                <button
                  onClick={() => deleteTask(item.id)}
                  style={{
                    backgroundColor: "#ff0066",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>

              </div>

            </li>
          ))}
        </ul>

      </div>


      {/* Logout directly underneath */}
      <button
        onClick={logout}
        style={{
          marginTop: "20px",
          width: "400px",
          padding: "10px",
          backgroundColor: "#ff62a6",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>


    </div>
  );
}
