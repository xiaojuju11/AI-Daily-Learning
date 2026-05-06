import { useEffect, useImperativeHandle, useMemo, memo } from 'react'
import { createPortal } from 'react-dom'

function getAttach(attach) {
  if (typeof attach === 'string') {
    return document.querySelector(attach)
  }
  if (typeof attach === 'object' && attach instanceof window.HTMLElement) {
    return attach
  }
  return document.body
}

const Protal = memo((porps) => {
  const { children, attach = document.body } = porps
  
  const container = useMemo(() => {
    const el = document.createElement('div')
    el.className = 'protal-wrapper'
    return el
  }, [])
  

  useEffect(() => {
    const parentElement = getAttach(attach)
    parentElement?.appendChild?.(container)
  }, [children, attach])

  // useImperativeHandle(ref, () => container())
  
  return createPortal(children, container)
})

export default Protal
