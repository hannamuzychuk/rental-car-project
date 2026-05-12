import styles from "./Container.module.css";

type ContainerProps = {
  children: React.ReactNode;
};

export function Container({ children }: ContainerProps) {
  return <div className={styles.root}>{children}</div>;
}
