import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import './navbar.css'

type NavItem = {
  key: string
  label: string
  href: string // sementara pakai hash agar tetap di homepage
}

const NAV_ITEMS: NavItem[] = [
  { key: 'beranda', label: 'Beranda', href: '#homepage' },
  { key: 'transaksi', label: 'Transaksi', href: '#transaksi' },
  { key: 'hubungi', label: 'Hubungi Kami', href: '#hubungi-kami' },
] 

function getActiveFromLocation(): string {
  const hash = window.location.hash
  return hash && hash.length > 1 ? hash : '#homepage'
}

function scrollToHashTarget(hashHref: string) {
  const id = hashHref.startsWith('#') ? hashHref.slice(1) : hashHref
  if (!id) return

  const el = document.getElementById(id)
  if (el) {
    // offset supaya tidak ketutup navbar
    const y = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
  }
}

function Navbar() {
  const [activeHref, setActiveHref] = useState<string>(() => {
    if (typeof window === 'undefined') return '#homepage'
    return getActiveFromLocation()
  })

  const [isVisible, setIsVisible] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)

  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  // Sync active menu dengan URL (hash / back-forward)
  useEffect(() => {
    const syncActive = () => setActiveHref(getActiveFromLocation())
    window.addEventListener('hashchange', syncActive)
    window.addEventListener('popstate', syncActive)
    syncActive()
    return () => {
      window.removeEventListener('hashchange', syncActive)
      window.removeEventListener('popstate', syncActive)
    }
  }, [])

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    lastScrollY.current = window.scrollY

    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true

      window.requestAnimationFrame(() => {
        const currentY = window.scrollY
        setIsScrolled(currentY > 8)

        const delta = currentY - lastScrollY.current
        const threshold = 6

        if (Math.abs(delta) >= threshold) {
          if (delta > 0 && currentY > 80) setIsVisible(false) // scroll down
          if (delta < 0) setIsVisible(true) // scroll up
          lastScrollY.current = currentY
        }

        // selalu tampilkan ketika di paling atas
        if (currentY <= 8) setIsVisible(true)

        ticking.current = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

//   const handleNavClick =
//     (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
//       e.preventDefault()

//       // update URL tanpa reload
//       if (window.location.hash !== href) {
//         window.history.pushState(null, '', href)
//         window.dispatchEvent(new Event('hashchange'))
//       }

//       setActiveHref(href)
//       scrollToHashTarget(href)
//     }
    const handleNavClick =
    (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()

        if (window.location.hash !== href) {
        window.location.hash = href
        } else {
        // kalau klik menu yang sama, tetap bisa scroll (kalau section id ada)
        scrollToHashTarget(href)
        }

        setActiveHref(href)
    }


  return (
    <>
      <header
        className={[
          'navbar',
          isScrolled ? 'navbar--scrolled' : '',
          isVisible ? 'navbar--visible' : 'navbar--hidden',
        ].join(' ')}
      >
        <div className="navbar__inner">
          <nav className="navbar__menu" aria-label="Menu utama">
            {NAV_ITEMS.map((item) => {
              const isActive = activeHref === item.href
              return (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={handleNavClick(item.href)}
                  className={[
                    'navbar__link',
                    isActive ? 'navbar__link--active' : '',
                  ].join(' ')}
                >
                  {item.label}
                </a>
              )
            })}
          </nav>

          <div className="navbar__actions">
            <a className="navbar__signin" href="#signin" onClick={handleNavClick('#signin')}>Sign in</a>
          </div>
        </div>
      </header>

      {/* spacer supaya konten tidak ketutup navbar yang fixed */}
      <div className="navbar__spacer" />
    </>
  )
}

export default Navbar
