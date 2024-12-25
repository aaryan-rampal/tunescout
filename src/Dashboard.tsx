import React, { useState, useEffect } from 'react';

const Dashboard: React.FC = () => {
    const [songs, setSongs] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0); // Track current song index
    const [interactions, setInteractions] = useState<number>(0); // Count interactions
    const [currentSong, setCurrentSong] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Track loading state
    const [songInteractions, setSongInteractions] = useState<Record<string, string>>({}); // Track like/dislike per song

    const fetchRecentlyPlayed = async () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            console.error('No access token found');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/recently-played', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ access_token: accessToken }),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Error fetching recently played tracks:', error.message);
                setIsLoading(false); // Stop loading on error
                return;
            }

            const data = await response.json();
            setSongs(data)
            setCurrentSong(data[0])

        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecentlyPlayed();
    }, []);

const handleLikeDislike = (action: string) => {
    console.log(`You ${action}d: ${currentSong?.name}`);

    setSongInteractions((prevState) => ({
        ...prevState,
        [currentSong.id]: action, // Add or update the like/dislike for the current song ID
    }));
    const nextIndex = currentIndex + 1;
    sendInteractionToBackend(currentSong.id, action);

    if (nextIndex < songs.length) {
        setCurrentIndex(nextIndex); // Move to the next song
        setCurrentSong(songs[nextIndex]); // Update current song
    } else {
        setCurrentSong(null); // No more songs to display
    }

    setInteractions(interactions + 1); // Increment interactions
}

const sendInteractionToBackend = async (songId: string, action: string) => {
    try {
        const response = await fetch('http://localhost:3001/api/song-interaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ songId, action }),
        });

        if (response.ok) {
            console.log('Interaction sent successfully:', { songId, action });
        } else {
            console.error('Failed to send interaction:', { songId, action });
        }
    } catch (error) {
        console.error('Error sending interaction:', error);
    }
};



    if (isLoading) {
        return <div>Loading...</div>; // Show loading message
    }

    if (!currentSong) {
        return <div>No more songs to display. Thanks for your feedback!</div>; // Handle case when no songs are left
    }
    return (
        <div>
            <h1>Recently Played</h1>
            <div>
                <img src={currentSong.image} alt={currentSong.name} style={{ width: '300px', height: '300px' }} />
                <h2>{currentSong.name}</h2>
                <p>By {currentSong.artists}</p>
            </div>
            <div>
                <button onClick={() => handleLikeDislike('like')}>Like</button>
                <button onClick={() => handleLikeDislike('dislike')}>Dislike</button>
            </div>
        </div>
    );
    };

export default Dashboard;