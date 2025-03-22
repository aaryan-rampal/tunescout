import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();
  const tokenProcessedRef = useRef(false);

  useEffect(() => {
    const doAuth = async () => {
      const VITE_SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
      const REDIRECT_URI =
        import.meta.env.MODE === "development"
          ? "http://localhost:5173/tunescout/callback"
          : "https://aaryan-rampal.github.io/tunescout/callback";

      // Parse the access token from the URL hash
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const code_verifier = localStorage.getItem("code_verifier");

      tokenProcessedRef.current = true;

      const response = await fetch("http://127.0.0.1:8000/auth/callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: VITE_SPOTIFY_CLIENT_ID,
          code: code,
          code_verifier: code_verifier,
          redirect_uri: REDIRECT_URI,
        }),
      });

      const json_body = await response.json();
      localStorage.setItem("access_token", json_body.access_token);
      navigate("/dashboard");
      return;
    };

    // if token has already been processed, return
    if (!tokenProcessedRef.current) {
      doAuth();
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;
