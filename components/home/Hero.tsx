import styles from "./Hero.module.css";
import Link from "next/link";

type HeroProps = {
    title?: string;
    subtitle?: string;
    catalogButton?: string;
};

export function Hero({ 
    title = "Find your perfect rental car", 
    subtitle = "Reliable and budget-friendly vehicles for unforgettable journeys.", 
    catalogButton = "View Catalog" 
}: HeroProps) {
    return (
        <section className={styles.section}>
          <div className={styles.overlay} aria-hidden />
          <div className={styles.inner}>
            <div className={styles.textBlock}>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.subtitle}>{subtitle}</p>
            </div>
            <Link href="/catalog" className={styles.catalogButton}>
                {catalogButton}
            </Link>
        </div>
    </section>
 );
}