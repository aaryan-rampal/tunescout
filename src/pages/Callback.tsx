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
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const code_verifier = localStorage.getItem("code_verifier");

    console.log("got here with code verifier " + code_verifier);

    if (code && code_verifier) {
      const response = await fetch("/api/auth/callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          code_verifier: codeVerifier,
        }),
      });

      window.location.hash = ""; // Clears the URL fragment
      tokenProcessedRef.current = true;
      navigate("/dashboard");
    } else {
      // TODO: Handle error better
      console.log("Invalid response from Spotify");
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;
