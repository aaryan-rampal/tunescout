/* eslint-disable react/react-in-jsx-scope */
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";

import Callback from "./pages/Callback";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

// const App = () => {
//   const [authUrl, setAuthUrl] = useState("");

//   useEffect(() => {
//     const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
//     const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
//     const SCOPES = [
//       "playlist-read-private",
//       "playlist-read-collaborative",
//       "playlist-modify-private",
//       "playlist-modify-public",
//     ];

//     const authEndpoint =
//       `https://accounts.spotify.com/authorize?` +
//       `client_id=${SPOTIFY_CLIENT_ID}` +
//       `&response_type=token` +
//       `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
//       `&scope=${encodeURIComponent(SCOPES.join(" "))}`;

//     setAuthUrl(authEndpoint);
//   }, []);

//   const handleLogin = () => {
//     if (authUrl) {
//       window.location.href = authUrl;
//     }
//   };

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home handleLogin={handleLogin} />} />
//         <Route path="/callback" element={<Callback />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//       </Routes>
//     </Router>
//   );
// };

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Home/>}>
      <Route path="/callback" element={<Callback />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Route>
  )
)

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

// const Home = ({ handleLogin }: { handleLogin: () => void }) => (
//   <div
//     style={{
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       justifyContent: "center",
//       height: "100vh",
//       width: "100vw", // Ensure full width
//       backgroundColor: "#1DB954", // Spotify green background
//       margin: "0",
//       padding: "0",
//       overflow: "hidden", // Ensure no black areas
//     }}
//   >
//     {/* Updated title color */}
//     <h1 style={{ color: "black", fontSize: "3rem", textAlign: "center" }}>
//       Ready to find your next favorite song?
//     </h1>
//     <button
//       style={{
//         marginTop: "20px",
//         padding: "10px 20px",
//         backgroundColor: "white",
//         border: "none",
//         borderRadius: "20px",
//         cursor: "pointer",
//         fontSize: "16px",
//         color: "#000000",
//       }}
//       onClick={handleLogin}
//     >
//       <img
//         src="spotify-logo.png"
//         alt="Spotify Logo"
//         style={{ height: "20px", marginRight: "10px" }}
//       />
//       Log in with Spotify
//     </button>
//   </div>
// );

export default App;
