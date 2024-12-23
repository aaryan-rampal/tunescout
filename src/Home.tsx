import React from 'react';

interface HomeProps {
  handleLogin: () => void;
}

const Home: React.FC<HomeProps> = ({ handleLogin }) => (
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
      onClick={handleLogin}
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

export default Home;
