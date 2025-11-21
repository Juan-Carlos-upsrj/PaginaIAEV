import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface VideoPlayerProps {
  videoId: string;
  onLessonComplete: () => void;
}

const WarningIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
);


const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, onLessonComplete }) => {
  const playerRef = useRef<any>(null);
  const previousTimeRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [playerError, setPlayerError] = useState<{code: number | null, message: string}>({code: null, message: ''});


  const displayWarning = (message: string) => {
    setWarningMessage(message);
    setTimeout(() => setWarningMessage(null), 3000);
  };

  useEffect(() => {
    setPlayerError({code: null, message: ''}); // Reset error state on video change
    const setupPlayer = () => {
      if (document.getElementById('youtube-player') && window.YT) {
        playerRef.current = new window.YT.Player('youtube-player', {
          videoId,
          playerVars: {
            'autoplay': 1,
            'controls': 1,
            'rel': 0,
            'showinfo': 0,
            'iv_load_policy': 3,
            'modestbranding': 1,
            'disablekb': 1,
            'fs': 0,
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
            onError: onPlayerError,
          },
        });
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      window.onYouTubeIframeAPIReady = setupPlayer;
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode!.insertBefore(tag, firstScriptTag);
    } else {
      setupPlayer();
    }
    
    return () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        playerRef.current?.destroy();
    };
  }, [videoId]);

  const onPlayerReady = (event: any) => {
    const player = event.target;
    player.playVideo();
    previousTimeRef.current = 0;
    
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = window.setInterval(() => {
      if (player && typeof player.getCurrentTime === 'function' && player.getPlayerState() === window.YT.PlayerState.PLAYING) {
        const currentTime = player.getCurrentTime();

        if (player.getPlaybackRate() !== 1) {
          player.setPlaybackRate(1);
          displayWarning("La velocidad de reproducción debe ser 1x.");
        }

        if (currentTime > previousTimeRef.current + 1.5) { 
          player.seekTo(previousTimeRef.current, true);
          displayWarning("No puedes adelantar el video.");
        } else {
          previousTimeRef.current = currentTime;
        }

        if (player.isMuted() || player.getVolume() < 25) {
            player.pauseVideo();
            displayWarning("El video se pausó. El volumen debe ser superior al 25%.");
        }
      }
    }, 1000);
  };
  
  const onPlayerStateChange = (event: any) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      onLessonComplete();
    }
  };

  const onPlayerError = (event: any) => {
    console.error("YouTube Player Error:", event.data);
    let message = "Error de configuración del reproductor de vídeo.";
    if (event.data === 150) {
        message = "El propietario del video no permite su reproducción en esta página.";
    }
    setPlayerError({code: event.data, message});
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  return (
    <div className="w-full h-full relative bg-black">
        <div id="youtube-player" className={`w-full h-full ${playerError.code ? 'hidden' : ''}`}></div>
        {playerError.code && (
          <div className="w-full h-full flex flex-col items-center justify-center text-center text-gray-300 p-4 bg-gray-900">
              <ion-icon name="alert-circle-outline" class="text-5xl text-red-500 mb-4"></ion-icon>
              <a 
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-400 hover:text-blue-300 hover:underline"
              >
                  Ver vídeo en YouTube
              </a>
              <p className="text-sm mt-2">Error {playerError.code}</p>
              <p className="text-sm">{playerError.message}</p>
          </div>
        )}
        {warningMessage && (
            <div className="absolute top-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 p-3 rounded-lg text-center font-medium z-20 shadow-md">
                <span>{warningMessage}</span>
            </div>
        )}
    </div>
  );
};

export default VideoPlayer;