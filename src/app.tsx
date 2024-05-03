import { useState } from "react";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import MediaStats from "./media-stats";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

function App() {
  const [src, setSrc] = useState(
    "https://files.vidstack.io/sprite-fight/hls/stream.m3u8"
  );
  const [showStats, setShowStats] = useState(true);

  return (
    <>
      <MediaPlayer
        title="Sprite Fight"
        src={src}
        keyShortcuts={{
          toggleStats: {
            keys: "s",
            onKeyDown: () => setShowStats(!showStats),
          },
        }}
        style={{
          maxWidth: 1280,
        }}
      >
        <MediaProvider />
        <DefaultVideoLayout
          thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt"
          icons={defaultLayoutIcons}
        />
        {showStats && <MediaStats onClose={() => setShowStats(false)} />}
      </MediaPlayer>
      <div>
        <button
          type="button"
          onClick={() =>
            setSrc("https://files.vidstack.io/sprite-fight/720p.mp4")
          }
        >
          MP4
        </button>
        <button
          type="button"
          onClick={() =>
            setSrc("https://files.vidstack.io/sprite-fight/hls/stream.m3u8")
          }
        >
          HLS
        </button>
        <button
          type="button"
          onClick={() =>
            setSrc(
              "https://1.vod.fra.liacdn.com/thegeekfreaks/2024/04/4ywwx1mw59d/master.m3u8"
            )
          }
        >
          HLS 60fps
        </button>
        <button
          type="button"
          onClick={() =>
            setSrc("https://files.vidstack.io/sprite-fight/dash/stream.mpd")
          }
        >
          DASH
        </button>
      </div>
    </>
  );
}

export default App;
