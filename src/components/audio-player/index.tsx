import { useCallback, useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  src: string;
  title?: string;
  compact?: boolean;
  banner?: boolean;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

const WAVEFORM_HEIGHTS = [35, 65, 100, 65, 35];
const WAVEFORM_DELAYS = [0, 0.15, 0.3, 0.15, 0];

export default function AudioPlayer({ src, title, compact = false, banner = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const staticRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isStaticVisible, setIsStaticVisible] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      setHasError(false);
    };
    const handleEnded = () => setIsPlaying(false);
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      setIsPlaying(false);
    };
    const handlePlaying = () => {
      setIsLoading(false);
      setHasError(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);
    audio.addEventListener("playing", handlePlaying);

    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
      setDuration(audio.duration);
    }

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("playing", handlePlaying);
    };
  }, []);

  // Detecta cuando el player estático sale de vista (banner y compact)
  useEffect(() => {
    if ((!banner && !compact) || !staticRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setIsStaticVisible(entry.isIntersecting), {
      threshold: 0.1,
    });
    observer.observe(staticRef.current);
    return () => observer.disconnect();
  }, [banner, compact]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      setHasError(false);
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setHasError(true);
        setIsPlaying(false);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isPlaying]);

  const seekTo = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const audio = audioRef.current;
      if (!audio) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const position = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.currentTime = position * duration;
    },
    [duration],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      isDragging.current = true;
      seekTo(e);
    },
    [seekTo],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current) return;
      seekTo(e);
    },
    [seekTo],
  );

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    isDragging.current = false;
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audio.volume = newVolume;
    setIsMuted(newVolume === 0);
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.volume = volume || 1;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const handlePlaybackRateChange = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const rates = [1, 1.25, 1.5, 1.75, 2];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    audio.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  }, [playbackRate]);

  const skip = useCallback(
    (seconds: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, duration));
    },
    [duration],
  );

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const SkipBackIcon = () => (
    <span className="flex flex-col items-center gap-0">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6a8 8 0 1 0 7.94 7" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4l-4-2-1 4" />
      </svg>
      <span className="text-[9px] font-bold leading-none mt-1">15s</span>
    </span>
  );

  const SkipForwardIcon = () => (
    <span className="flex flex-col items-center gap-0">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6a8 8 0 1 1-7.94 7" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4l4-2 1 4" />
      </svg>
      <span className="text-[9px] font-bold leading-none mt-1">15s</span>
    </span>
  );

  const PlayPauseIconSm = () => {
    if (isLoading)
      return (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      );
    if (hasError)
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      );
    if (isPlaying)
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
        </svg>
      );
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z" />
      </svg>
    );
  };

  // ─── Floating player (shared by banner + compact modes) ───────────────────
  const FloatingPlayer = () => (
    <div
      aria-hidden={isStaticVisible}
      className={`fixed bottom-0 inset-x-0 xl:hidden z-40 transition-transform duration-300 ease-in-out ${
        isStaticVisible ? "translate-y-full" : "translate-y-0"
      }`}
    >
      {/* Barra de progreso interactiva — encima del card */}
      <div
        className="relative h-1 bg-surface-raised cursor-pointer group"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        role="slider"
        aria-label="Progreso del audio"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        tabIndex={-1}
      >
        <div className="absolute h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-text-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${progress}% - 5px)` }}
        />
      </div>

      {/* Card — misma estética que el banner */}
      <div className="bg-surface/95 backdrop-blur-md border-t border-accent/25 bg-gradient-to-r from-accent/[0.07] via-accent/[0.03] to-transparent">
        <div className="flex items-center gap-3 px-4 py-5">
          {/* Waveform + label */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-end gap-[2px] h-4" aria-hidden>
              {WAVEFORM_HEIGHTS.map((h, i) => (
                <span
                  key={i}
                  className={`w-[2px] bg-accent rounded-full transition-opacity duration-500 ${isPlaying ? "wave-bar" : ""}`}
                  style={{
                    height: `${h}%`,
                    opacity: isPlaying ? 1 : 0.3 + (h / 100) * 0.35,
                    animationDelay: `${WAVEFORM_DELAYS[i]}s`,
                  }}
                />
              ))}
            </div>
            <span className="text-[10px] font-semibold tracking-widest uppercase text-accent hidden sm:block">
              Narración
            </span>
          </div>

          {/* Título + tiempo */}
          <div className="flex-1 min-w-0">
            {title && <p className="text-xs text-text-secondary truncate leading-tight">{title}</p>}
            <p className="text-[11px] text-text-muted tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </p>
          </div>

          {/* Controles */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => skip(-15)}
              className="p-1.5 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              aria-label="Retroceder 15 segundos"
            >
              <SkipBackIcon />
            </button>

            {/* Botón play — mismo estilo pill que el banner */}
            <button
              onClick={togglePlay}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-background transition-colors cursor-pointer ${
                hasError ? "bg-error hover:bg-error/80" : "bg-accent hover:bg-accent-hover"
              }`}
              aria-label={hasError ? "Reintentar" : isPlaying ? "Pausar" : "Reproducir"}
            >
              <PlayPauseIconSm />
              <span className="hidden sm:inline">{hasError ? "Reintentar" : isPlaying ? "Pausar" : "Play"}</span>
            </button>

            <button
              onClick={() => skip(15)}
              className="p-1.5 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              aria-label="Adelantar 15 segundos"
            >
              <SkipForwardIcon />
            </button>

            <button
              onClick={handlePlaybackRateChange}
              className="px-1.5 py-0.5 text-xs text-text-muted hover:text-text-primary bg-surface-raised rounded transition-colors cursor-pointer ml-0.5"
              aria-label="Cambiar velocidad"
            >
              {playbackRate}x
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── Banner mode (artículos con narración) ────────────────────────────────
  if (banner) {
    return (
      <>
        <audio ref={audioRef} src={src} preload="metadata" />

        <div ref={staticRef}>
          {/* Header: waveform + label + tiempo */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-end gap-[3px] h-5 shrink-0" aria-hidden>
              {WAVEFORM_HEIGHTS.map((h, i) => (
                <span
                  key={i}
                  className={`w-[3px] bg-accent rounded-full transition-opacity duration-500 ${isPlaying ? "wave-bar" : ""}`}
                  style={{
                    height: `${h}%`,
                    opacity: isPlaying ? 1 : 0.3 + (h / 100) * 0.4,
                    animationDelay: `${WAVEFORM_DELAYS[i]}s`,
                  }}
                />
              ))}
            </div>
            <span className="text-xs font-semibold tracking-widest uppercase text-accent">Narración de audio</span>
            <span className="ml-auto text-xs text-text-muted tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Barra de progreso */}
          <div
            className="relative h-1.5 bg-surface-raised rounded-full cursor-pointer mb-4 group"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            role="slider"
            aria-label="Progreso del audio"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            tabIndex={0}
          >
            <div className="absolute h-full bg-accent rounded-full transition-all" style={{ width: `${progress}%` }} />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-text-primary rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ left: `calc(${progress}% - 7px)` }}
            />
          </div>

          {/* Controles */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => skip(-15)}
              className="p-2 text-text-muted hover:text-text-primary transition-colors duration-200 cursor-pointer"
              aria-label="Retroceder 15 segundos"
              title="Retroceder 15s"
            >
              <SkipBackIcon />
            </button>

            {/* Botón play — protagonista */}
            <button
              onClick={togglePlay}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-background transition-colors duration-200 cursor-pointer ${
                hasError ? "bg-error hover:bg-error/80" : "bg-accent hover:bg-accent-hover"
              }`}
              aria-label={hasError ? "Reintentar" : isPlaying ? "Pausar" : "Reproducir"}
              title={hasError ? "Error al cargar. Click para reintentar" : undefined}
            >
              {isLoading ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : hasError ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              ) : isPlaying ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
              <span>{hasError ? "Reintentar" : isPlaying ? "Pausar" : "Reproducir"}</span>
            </button>

            <button
              onClick={() => skip(15)}
              className="p-2 text-text-muted hover:text-text-primary transition-colors duration-200 cursor-pointer"
              aria-label="Adelantar 15 segundos"
              title="Adelantar 15s"
            >
              <SkipForwardIcon />
            </button>

            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={handlePlaybackRateChange}
                className="px-2 py-1 text-xs text-text-muted hover:text-text-primary bg-surface-raised rounded transition-colors duration-200 cursor-pointer"
                aria-label="Cambiar velocidad de reproducción"
                title="Velocidad de reproducción"
              >
                {playbackRate}x
              </button>

              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-1 text-text-muted hover:text-text-primary transition-colors duration-200 cursor-pointer"
                  aria-label={isMuted ? "Activar sonido" : "Silenciar"}
                >
                  {isMuted || volume === 0 ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-surface-raised rounded-lg appearance-none cursor-pointer accent-[#06b6d4]"
                  aria-label="Volumen"
                />
              </div>
            </div>
          </div>
        </div>

        <FloatingPlayer />
      </>
    );
  }

  // ─── Compact mode (sidebar / inline usos varios) ──────────────────────────
  if (compact) {
    return (
      <>
        <audio ref={audioRef} src={src} preload="metadata" />

        <div ref={staticRef} className="w-full">
          <div
            className="relative h-1.5 bg-surface-raised rounded-full cursor-pointer mb-2 group"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            role="slider"
            aria-label="Progreso del audio"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            tabIndex={0}
          >
            <div className="absolute h-full bg-accent rounded-full transition-all" style={{ width: `${progress}%` }} />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-text-primary rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ left: `calc(${progress}% - 6px)` }}
            />
          </div>

          <div className="flex justify-between text-xs text-text-muted mb-2.5">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => skip(-15)}
                className="p-1.5 text-text-muted hover:text-text-primary transition-colors duration-200 cursor-pointer"
                aria-label="Retroceder 15 segundos"
              >
                <SkipBackIcon />
              </button>

              <button
                onClick={togglePlay}
                className={`p-2 rounded-full text-background transition-colors duration-200 cursor-pointer ${
                  hasError ? "bg-error hover:bg-error/80" : "bg-accent hover:bg-accent-hover"
                }`}
                aria-label={hasError ? "Reintentar" : isPlaying ? "Pausar" : "Reproducir"}
              >
                {isLoading ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : hasError ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                ) : isPlaying ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <button
                onClick={() => skip(15)}
                className="p-1.5 text-text-muted hover:text-text-primary transition-colors duration-200 cursor-pointer"
                aria-label="Adelantar 15 segundos"
              >
                <SkipForwardIcon />
              </button>
            </div>

            <button
              onClick={handlePlaybackRateChange}
              className="px-1.5 py-0.5 text-xs text-text-muted hover:text-text-primary bg-surface-raised rounded transition-colors duration-200 cursor-pointer"
              aria-label="Cambiar velocidad de reproducción"
            >
              {playbackRate}x
            </button>
          </div>
        </div>

        <FloatingPlayer />
      </>
    );
  }

  // ─── Full mode (podcasts, standalone) ────────────────────────────────────
  return (
    <div className="w-full bg-surface rounded-lg p-4 border border-surface-border">
      <audio ref={audioRef} src={src} preload="metadata" />

      {title && <p className="text-sm text-text-secondary mb-3 truncate">{title}</p>}

      <div
        className="relative h-2 bg-surface-raised rounded-full cursor-pointer mb-3 group"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        role="slider"
        aria-label="Progreso del audio"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        tabIndex={0}
      >
        <div className="absolute h-full bg-accent rounded-full transition-all" style={{ width: `${progress}%` }} />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-text-primary rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ left: `calc(${progress}% - 8px)` }}
        />
      </div>

      <div className="flex justify-between text-xs text-text-muted mb-3">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => skip(-15)}
            className="p-2 text-text-muted hover:text-text-primary transition-colors duration-200 cursor-pointer"
            aria-label="Retroceder 15 segundos"
            title="Retroceder 15s"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"
              />
            </svg>
          </button>

          <button
            onClick={togglePlay}
            className={`p-3 rounded-full text-background transition-colors duration-200 cursor-pointer ${
              hasError ? "bg-error hover:bg-error/80" : "bg-accent hover:bg-accent-hover"
            }`}
            aria-label={hasError ? "Reintentar" : isPlaying ? "Pausar" : "Reproducir"}
            title={hasError ? "Error al cargar. Click para reintentar" : undefined}
          >
            {isLoading ? (
              <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : hasError ? (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            ) : isPlaying ? (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={() => skip(15)}
            className="p-2 text-text-muted hover:text-text-primary transition-colors duration-200 cursor-pointer"
            aria-label="Adelantar 15 segundos"
            title="Adelantar 15s"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePlaybackRateChange}
            className="px-2 py-1 text-xs text-text-muted hover:text-text-primary bg-surface-raised rounded transition-colors duration-200 cursor-pointer"
            aria-label="Cambiar velocidad de reproducción"
            title="Velocidad de reproducción"
          >
            {playbackRate}x
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-1 text-text-muted hover:text-text-primary transition-colors duration-200 cursor-pointer"
              aria-label={isMuted ? "Activar sonido" : "Silenciar"}
            >
              {isMuted || volume === 0 ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-surface-raised rounded-lg appearance-none cursor-pointer accent-[#06b6d4]"
              aria-label="Volumen"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
