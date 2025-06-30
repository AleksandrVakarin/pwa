'use client'
import { useEffect, useState } from "react"
import PushNotificationManager from "./PushNotificationManager"

// Добавляем тип для BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

// Объявляем глобально для TypeScript
declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [isYandex, setIsYandex] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    setIsYandex(navigator.userAgent.includes('YaBrowser'))
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && 
      !(window as Window & { MSStream?: unknown }).MSStream
    )
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === 'accepted') {
          console.log('User accepted the install prompt')
        }
        setDeferredPrompt(null)
      } catch (error) {
        console.error('Install prompt failed:', error)
      }
    } else if (isIOS) {
      alert('To install, tap share and "Add to Home Screen"')
    } else if (isYandex) {
      alert('Нажмите ⋮ → "Добавить на экран"')
    }
  }

  if (isStandalone) {
    return null
  }

  return (
    <div>
      <button onClick={handleInstallClick}>Add to Home Screen</button>
      <h3>Install App</h3>
      {isYandex && (
        <div className="yandex-install-hint">
          Нажмите ⋮ → &quot;Добавить на экран&quot;
        </div>
      )}
      
      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon"> ⎋ </span>
          and then &quot;Add to Home Screen&quot;
          <span role="img" aria-label="plus icon"> ➕ </span>.
        </p>
      )}
    </div>
  )
}

export default function Page() {
  return (
    <div>
      <PushNotificationManager />
      <InstallPrompt />
    </div>
  )
}