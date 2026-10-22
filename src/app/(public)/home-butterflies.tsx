import { Butterfly } from "@phosphor-icons/react/dist/ssr/Butterfly";
import { Sparkles } from "lucide-react";
import styles from "./home.module.css";

/** Decorações delicadas com borboletas Phosphor e efeitos acessíveis */
export function HomeButterflies({ variant = "hero" }: { variant?: "hero" | "garden" | "social" }) {
  return (
    <div className={`${styles.decorations} ${styles[`${variant}Decor`]}`} aria-hidden="true">
      <span className={`${styles.butterfly} ${styles.butterflyOne}`}><Butterfly weight="duotone" /></span>
      <span className={`${styles.butterfly} ${styles.butterflyTwo}`}><Butterfly weight="duotone" /></span>
      <span className={`${styles.butterfly} ${styles.butterflyThree}`}><Butterfly weight="duotone" /></span>
      <span className={`${styles.butterfly} ${styles.butterflyFour}`}><Butterfly weight="duotone" /></span>
      <span className={`${styles.twinkle} ${styles.twinkleOne}`}><Sparkles size={22} strokeWidth={1.3} /></span>
      <span className={`${styles.twinkle} ${styles.twinkleTwo}`}><Sparkles size={16} strokeWidth={1.3} /></span>
      <span className={styles.pollen} />
      <span className={styles.pollen} />
      <span className={styles.pollen} />
    </div>
  );
}
