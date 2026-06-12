'use client'

import Script from 'next/script'
import { useRef, useCallback, useId } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string
          callback: (token: string) => void
          'expired-callback'?: () => void
          'error-callback'?: () => void
          theme?: 'light' | 'dark' | 'auto'
          size?: 'normal' | 'compact'
        }
      ) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

interface TurnstileWidgetProps {
  onVerify:  (token: string) => void
  onExpire?: () => void
  theme?:    'light' | 'dark' | 'auto'
}

export function TurnstileWidget({
  onVerify,
  onExpire,
  theme = 'auto',
}: TurnstileWidgetProps) {
  const siteKey   = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef  = useRef<string | null>(null)
  const id = useId()

  const handleLoad = useCallback(() => {
    if (!containerRef.current || !window.turnstile || !siteKey) return

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey:           siteKey,
      callback:          onVerify,
      'expired-callback': () => {
        onVerify('')
        onExpire?.()
      },
      'error-callback': () => onVerify(''),
      theme,
    })
  }, [onVerify, onExpire, siteKey, theme])

  if (!siteKey) return null

  return (
    <>
      <Script
        id={`turnstile-script-${id}`}
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onLoad={handleLoad}
      />
      <div ref={containerRef} className="my-2" />
    </>
  )
}
