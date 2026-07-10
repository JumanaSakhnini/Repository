"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Login() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signUp() {

    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      alert(error.message);
    }
    else {
      alert("Check your email to confirm account");
    }
  }


  async function login() {

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/");
  }


  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffd6e7",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >

      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          width: "350px",
          textAlign: "center",
        }}
      >

        <h1>Login</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={login}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            backgroundColor: "#ff69a6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Login
        </button>

        <button
          onClick={signUp}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            backgroundColor: "#f3a6c8",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Sign Up
        </button>

      </div>

    </div>
  );
}
