import { createContext, ReactNode, useContext, useState } from 'react';


type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void;
    togglePlay: () => void;
    setPlayingState: (state: boolean) => void;
    playList: (list: Episode[], index:number) => void;
    playPrevious: () => void;
    playNext: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    hasNext: boolean;
    hasPreviuous: boolean;
    clearPlayerState: () => void;
};


type PlayerContextProviderProps = {
  children: ReactNode; //Qualquer coisa q o react aceita
}

export const PlayerContext = createContext({ } as PlayerContextData);

export function PlayerContextProvider({ children } : PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const hasPreviuous = currentEpisodeIndex > 0;
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;



  function play(episode : Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }


  function playList(list : Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function playNext() {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex+1);
    }
  }

  function playPrevious() {
    const previousEpisodeIndex = currentEpisodeIndex-1;

    if (!hasPreviuous) {return;}
    setCurrentEpisodeIndex(previousEpisodeIndex);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }
  
  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function clearPlayerState() {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }


  return (
      <PlayerContext.Provider value={
        {
          episodeList, 
          currentEpisodeIndex, 
          play, 
          isPlaying, 
          togglePlay, 
          setPlayingState,
          playList,
          playPrevious,
          playNext,
          hasNext,
          hasPreviuous,
          isLooping,
          toggleLoop,
          isShuffling,
          toggleShuffle,
          clearPlayerState
          }
        }>
          {children}
      </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  return useContext(PlayerContext);
}
