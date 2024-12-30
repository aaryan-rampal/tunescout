/* eslint-disable react/react-in-jsx-scope */
import exp from "constants";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();
  const tokenProcessedRef = useRef(false);

  useEffect(() => {
    // if token has already been processed, return
    if (tokenProcessedRef.current) {
      return;
    }

    // Parse the access token from the URL hash
    const hash = window.location.hash;
    const tokenMatch = hash.match(/access_token=([^&]*)/);
    const expiresMatch = hash.match(/expires_in=([^&]*)/);

    if (tokenMatch && expiresMatch) {
      const token = tokenMatch[1];
      const expires_in = expiresMatch[1];

      window.location.hash = ""; // Clears the URL fragment
      tokenProcessedRef.current = true;
      // console.log(token)
      fetch("http://localhost:3001/spotify/save_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ access_token: token, expires_in: expires_in }),
      });
      // localStorage.setItem("access_token", token);
      navigate("/dashboard");
    } else {
      console.log("Invalid response from Spotify");
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;
