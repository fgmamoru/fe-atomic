import clsx from "clsx"
import style from "./Card.module.css"

export const Card = (props: { children?: React.ReactNode, className?: string, dark?: boolean }) => {
  const c = clsx(
    style.Card,
    props.dark ? style.CardDark : style,
    props.className,
  )
  return (
    <div className={c}>
      {props.children}
    </div>
  )
}