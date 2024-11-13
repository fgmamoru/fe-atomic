import clsx from "clsx";
import styles from "./index.module.css";

/**
 * Renders a grid component with 2 column with the provided children.
 * Collapses to a single column on mobile.
 * @param props - The component props.
 * @param props.children - The children to render within the grid.
 */
export function Grid2(props: { children: React.ReactNode }) {
  return <div className={styles.grid2}>{props.children}</div>;
}

/**
 * Renders a grid component of 1 column with the provided children.
 * @param props - The component props.
 * @param props.children - The child elements to render within the grid.
 */
export function Grid1(props: { children: React.ReactNode }) {
  return <div className={styles.grid1}>{props.children}</div>;
}

/**
 * Renders a grid with 3 columns.
 * @param props - The component props.
 */
export function Grid3(props: {
  children: React.ReactNode;
  className?: string;
}) {
  const className = clsx(styles.grid3, props.className);
  return <div className={className}>{props.children}</div>;
}


export function Grid4(props: { children: React.ReactNode }) {
  return <div className={styles.grid4}>{props.children}</div>;
}

export function Grid12(props: { children: React.ReactNode }) {
  return <div className={styles.grid12}>{props.children}</div>;
}

export function FlexGrid(props: { children: React.ReactNode }) {
  return <div className={styles.flexGrid}>{props.children}</div>;
}

/**
 * Renders a side bar grid component.
 *
 * @param props - The component props.
 * @returns The rendered side bar grid component.
 */
export function SideBarGrid(props: {
  children: React.ReactNode;
  sideBar: React.ReactNode;
  classNameContent?: string;
}) {
  const classNameContent = clsx(styles.sidebarContent, props.classNameContent);
  return (
    <div className={styles.sidebarGrid}>
      <div className={styles.sideBar}>{props.sideBar}</div>
      <div className={classNameContent}>{props.children}</div>
    </div>
  );
}

export function FormActionGrid(props: {
  saveAction: React.ReactNode;
  cancelAction: React.ReactNode;
  resetAction?: React.ReactNode;
  className?: string;
}) {
  const className = clsx(styles.formActionGrid, props.className);
  return (
    <div className={className}>
      {
        props.resetAction &&
        <div className={styles.formActionGridLeft}>
          {props.resetAction}
        </div>
      }
      <div className={styles.formActionGridRight}>
        {props.cancelAction}
        {props.saveAction}
      </div>
    </div>
  );
}