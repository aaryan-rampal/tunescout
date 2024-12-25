/* eslint-disable react/react-in-jsx-scope */
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

    if (tokenMatch) {
      const token = tokenMatch[1];
      window.location.hash = ""; // Clears the URL fragment
      tokenProcessedRef.current = true;
      localStorage.setItem("access_token", token);
      navigate("/dashboard");
    } else {
      console.log("Access Token: null");
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;
