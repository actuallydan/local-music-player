import { useState, useEffect, useRef, useCallback } from "react";
import "tachyons/css/tachyons.min.css";
import files from "./files";

function App() {
  const [song, setSong] = useState(files[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [playbackTimeMap, setPlaybackTimeMap] = useState({});
  const [search, setSearch] = useState("");

  const audioRef = useRef(new Audio("./audio/" + song));
  const intervalRef = useRef();

  // useEffect(() => {
  //   window.addEventListener("keypress", (e) => {
  //     if (e.key === " ") {
  //       console.log("space");
  //       e.preventDefault();
  //       togglePlay();
  //     }
  //   });
  // }, []);

  const updateCurrentTime = useCallback(() => {
    setPlaybackTimeMap((map) => ({
      ...map,
      [song]: audioRef.current.currentTime,
    }));
  }, [setPlaybackTimeMap, song]);

  useEffect(() => {
    if (audioRef.current instanceof Audio && isPlaying) {
      intervalRef.current = setInterval(updateCurrentTime, 1000);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isPlaying, updateCurrentTime]);

  const togglePlay = async () => {
    if (isPlaying) {
      await audioRef.current.pause();
    } else {
      await audioRef.current.play();
    }
    setIsPlaying((bool) => !bool);
  };

  const handleVolumeChange = (e) => {
    setVolume((vol) => e.target.value);
  };

  // useEffect(() => {
  //   if (audioRef.current instanceof Audio) {
  //     audioRef.current.volume = volume;
  //   }
  // }, [volume]);

  const changeSong = async (e) => {
    const newSong = e.target.innerText;
    setSong(newSong);

    if (audioRef.current instanceof Audio) {
      await audioRef.current.pause();
    }
    audioRef.current = new Audio("./audio/" + newSong);
    // keep audio level the same between song changes
    audioRef.current.volume = volume;
    // start song from where it left off if we've already started it before
    audioRef.current.currentTime = playbackTimeMap[newSong] || 0;

    if (isPlaying) {
      audioRef.current.play();
    }
  };

  const secondsToTimeString = (seconds) => {
    return new Date(seconds * 1000).toJSON().substring(11, 19);
  };

  const updateCurrentPosition = (e) => {
    audioRef.current.currentTime = e.target.value;
    setPlaybackTimeMap((map) => ({
      ...map,
      [song]: e.target.value,
    }));
  };

  const updateSearch = (e) => {
    setSearch(e.target.value);
  };

  const currentPosition = playbackTimeMap[song] || 0;

  const filteredFiles = files.filter((f) =>
    f.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="App pa2">
      <button onClick={togglePlay}>{isPlaying ? "Stop" : "Play"}</button>
      <div className="flex flex-row-ns flex-column justify-between">
        <div className="flex items-center justify-center">
          <div>{Math.round(volume * 100)}%</div>
          <input
            value={volume}
            type="range"
            max={1}
            min={0}
            step={0.01}
            onChange={handleVolumeChange}
            className="mh2"
          />
        </div>
        <div className="flex items-center justify-center">
          {audioRef.current && (
            <div>{secondsToTimeString(audioRef.current.currentTime)}</div>
          )}
          {audioRef.current.duration ? (
            <input
              value={currentPosition}
              max={audioRef.current.duration}
              min={0}
              step={1}
              type={"range"}
              onChange={updateCurrentPosition}
              className="mh2"
            />
          ) : null}
          {audioRef.current.duration ? (
            <div>{secondsToTimeString(audioRef.current.duration)}</div>
          ) : null}
        </div>
      </div>
      <div className="ma2 tc">{song}</div>
      <div>
        <input
          value={search}
          onChange={updateSearch}
          className="input-reset ba b--black-20 pa2 mb2 db w-100"
          placeholder="search"
        />
      </div>
      <div className="flex flex-wrap">
        {filteredFiles.map((f) => {
          return (
            <div
              key={f}
              className="w-100 w-50-ns flex justify-stretch align-stretch"
            >
              <button key={f} onClick={changeSong} className="w-100 pa2 ma2">
                {f}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
