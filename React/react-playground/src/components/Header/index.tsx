import React from 'react'
import logoSvg from '/icons/logo.svg'
import styles from './index.module.scss'

export default function Header() {
  return (
    <div className={styles.header}>
        <div >
            <img src="/logo.svg" alt="" />
            <span>React Playground</span>
        </div>
    </div>
  )
}
