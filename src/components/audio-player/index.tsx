import { AudioPlayer as ArrecifeAudioPlayer } from "@eduardoalvarez/arrecife";

import { trackEvent } from "../../utils/analytics";

interface AudioPlayerProps {
  src: string;
  title?: string;
  compact?: boolean;
  banner?: boolean;
}

/**
 * The player is the library's now — the 626 lines this file used to hold are
 * gone, along with the three modes, the wave bars and the floating player they
 * implemented by hand.
 *
 * This wrapper survives for two reasons. It keeps the boolean props the three
 * call sites already pass, so `banner` and `compact` do not have to become a
 * `mode` string across the codebase. And it wires the analytics: the library
 * deliberately ships no tracking and exposes `onFirstPlay` for exactly this,
 * fired once per load rather than on every resume.
 */
export default function AudioPlayer({ src, title, compact = false, banner = false }: AudioPlayerProps) {
  const mode = banner ? "banner" : compact ? "compact" : "full";

  return (
    <ArrecifeAudioPlayer
      src={src}
      title={title}
      mode={mode}
      onFirstPlay={(playedTitle) => trackEvent("audio_play", playedTitle ? { episode: playedTitle } : {})}
    />
  );
}
