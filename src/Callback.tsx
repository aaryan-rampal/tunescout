import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
//   const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const tokenProcessedRef = useRef(false);

  useEffect(() => {
    // Parse the access token from the URL hash
    if (tokenProcessedRef.current) {
        return;
    }

    const hash = window.location.hash;
    const tokenMatch = hash.match(/access_token=([^&]*)/);

    if (tokenMatch) {
      const token = tokenMatch[1];
    //   console.log("Access Token:", token);
      localStorage.setItem("access_token", token); // Save the token to localStorage
      window.location.hash = ''; // Clears the URL fragment
      tokenProcessedRef.current = true;
        // Send the token to the backend via a POST request
        fetch('http://localhost:3001/api/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ access_token: token }), // Sending token in the request body
            })
            .then(response => response.json())
            .then(data => {
                // console.log("Backend response:", data);
                navigate("/dashboard");
            })
            .catch(error => {
                console.error('Error sending token to backend:', error);
            });
    } else {
      console.log("Access Token: null");
    }

  }, [navigate]);

    return <div>Loading...</div>;

//   useEffect(() => {
//     // Function to extract the access token from the URL fragment
//     const getTokenFromFragment = () => {
//       const hash = window.location.hash.substring(1); // Remove the leading '#'
//       const params = new URLSearchParams(hash); // Parse the fragment into key-value pairs
//       return params.get('access_token'); // Extract the access_token
//     };

//     // Get the token
//     const token = getTokenFromFragment();
//     setToken(token)
//     // console.log('Access Token:', token);

//     if (token) {
//         // Send the token to the backend for authentication
//         fetch('http://localhost:3001/api/authenticate', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ access_token: token }), // Send the token in the body
//         })
//           .then((response) => response.json())
//           .then((data) => {
//             console.log('Authentication successful:', data);
//           })
//           .catch((error) => console.error('Error sending token to backend:', error));

//         navigate('/dashboard');
//     } else {
//       console.error('No token found in the URL fragment');
//     }
//   }, []);

  return (
    <div>
      <h1>Processing Login...</h1>
    </div>
  );
};

export default Callback;
