
const App = () => {
  const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
  const REDIRECT_URI = 'http://localhost:5173/home'
  const SCOPES = [
    'user-read-private', 
    'user-read-email',
  ];
  console.log(SPOTIFY_CLIENT_ID)

  const loginWithSpotify = () => {
    const authUrl = `https://accounts.spotify.com/authorize?` +
      `client_id=${SPOTIFY_CLIENT_ID}` +
      `&response_type=token` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      // `&redirect_uri=${REDIRECT_URI}` +
      `&scope=${encodeURIComponent(SCOPES.join(' '))}`;
    window.location.href = authUrl; // Redirect to Spotify authorization
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw', // Ensure full width
        backgroundColor: '#1DB954', // Spotify green background
        margin: '0',
        padding: '0',
        overflow: 'hidden', // Ensure no black areas
      }}
    >
      {/* Updated title color */}
      <h1 style={{ color: 'black', fontSize: '3rem', textAlign: 'center' }}>
        Ready to find your next favorite song?
      </h1>
      <button
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: 'white',
          border: 'none',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '16px',
          color: '#000000', 
        }}
        onClick={loginWithSpotify}
      >
        <img
          src="spotify-logo.png"
          alt="Spotify Logo"
          style={{ height: '20px', marginRight: '10px' }}
        />
        Log in with Spotify
      </button>
    </div>
  );
};

export default App;
