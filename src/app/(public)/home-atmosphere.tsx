"use client";

import { useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import styles from "./home.module.css";

/** Only the animation control is interactive; page content stays server-rendered. */
export function HomeAtmosphere({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);

  return (
    <div className={styles.home} id="inicio" data-effects-paused={paused}>
      <button
        type="button"
        className={styles.motionControl}
        aria-pressed={paused}
        aria-label="Pausar animações decorativas"
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
        <span>{paused ? "Retomar efeitos" : "Pausar efeitos"}</span>
      </button>
      {children}
    </div>
  );
}
