import type { DASHProvider, HLSProvider, VideoProvider } from "@vidstack/react";

import { useEffect, useRef, useState } from "react";
import {
  isDASHProvider,
  isHLSProvider,
  isVideoProvider,
  useMediaProvider,
  useMediaState,
  useMediaStore,
} from "@vidstack/react";

import "./media-stats.css";

function HlsStats({ provider }: { provider: HLSProvider }) {
  return (
    <>
      <div className="vds-stats-hls-version">
        <div>hls.js version</div>
        <span>{provider.ctor?.version || "unknown"}</span>
      </div>
    </>
  );
}

function DashStats({ provider }: { provider: DASHProvider }) {
  return (
    <>
      <div className="vds-stats-dash-version">
        <div>dashjs version</div>
        <span>{provider.instance?.getVersion() || "unknown"}</span>
      </div>
    </>
  );
}

function FramesStats({ provider }: { provider: VideoProvider }) {
  const paused = useMediaState("paused");

  const totalFramesRef = useRef(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [droppedFrames, setDroppedFrames] = useState(0);
  const [fps, setFps] = useState(0);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setDroppedFrames(
        provider.video.getVideoPlaybackQuality().droppedVideoFrames
      );

      const total = provider.video.getVideoPlaybackQuality().totalVideoFrames;
      setFps(total - totalFramesRef.current);
      totalFramesRef.current = total;
      setTotalFrames(total);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [provider, paused]);

  return (
    <div className="vds-stats-frames">
      <div>Frames</div>
      <span>
        {droppedFrames} dropped / {totalFrames} total / {fps} fps
      </span>
    </div>
  );
}

function Clock() {
  const [date, setDate] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setDate(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <span>{date.toString()}</span>;
}

export default function MediaStats({ onClose }: { onClose?: () => void }) {
  const provider = useMediaProvider();
  const store = useMediaStore();

  return (
    <div className="vds-stats">
      <button
        type="button"
        className="vds-stats-close"
        title="Close"
        onClick={onClose}
      >
        X
      </button>
      <div className="vds-stats-content">
        <div className="vds-stats-viewport">
          <div>Viewport Size</div>
          <span>
            {store.width}x{store.height}
          </span>
        </div>

        <div className="vds-stats-resolution">
          <div>Resolution</div>
          <span>
            {store.quality
              ? `${store.quality.width}x${store.quality.height}`
              : "unknown"}{" "}
            {store.autoQuality && "(auto)"}
          </span>
        </div>

        <div className="vds-stats-bitrate">
          <div>Bitrate</div>
          <span>
            {store.quality?.bitrate
              ? `${store.quality.bitrate / 1_000_000} Mbps`
              : "unknown"}
          </span>
        </div>

        <div className="vds-stats-codecs">
          <div>Codecs</div>
          <span>{store.quality?.codec || "unknown"}</span>
        </div>

        <div className="vds-stats-volume">
          <div>Volume</div>
          <span>
            {store.volume * 100}% {store.muted && " (muted)"}
          </span>
        </div>

        {(isVideoProvider(provider) ||
          isHLSProvider(provider) ||
          isDASHProvider(provider)) && <FramesStats provider={provider} />}

        {isHLSProvider(provider) && <HlsStats provider={provider} />}

        {isDASHProvider(provider) && <DashStats provider={provider} />}

        <div className="vds-stats-date">
          <div>Date</div>
          <Clock />
        </div>
      </div>
    </div>
  );
}
