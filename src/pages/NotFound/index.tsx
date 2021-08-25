import style from './style.module.less'

export default function NotFound() {
  return (
    <div className={style.notFound}>
      <div className={style.title}>哎呀，找不到了</div>
      <div className={style.num}>404</div>
    </div>
  )
}
