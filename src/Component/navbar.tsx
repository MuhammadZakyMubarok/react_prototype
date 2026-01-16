import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import './navbar.css'

type NavItem = {
  key: string
  label: string
  href: string
}

type AuthUser = {
  id: number
  name: string
  email: string
}

const NAV_ITEMS: NavItem[] = [
  { key: 'beranda', label: 'Beranda', href: '#homepage' },
  { key: 'transaksi', label: 'Transaksi', href: '#transaksi' },
  { key: 'hubungi', label: 'Hubungi Kami', href: '#hubungi-kami' },
]

const AUTH_HASH = new Set(['#signin', '#signup'])
const AUTH_KEY = 'auth_user'

function readAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthUser
    if (!parsed?.name) return null
    return parsed
  } catch {
    return null
  }
}

function getActiveFromLocation(): string {
  const hash = window.location.hash
  return hash && hash.length > 1 ? hash : '#homepage'
}

function scrollToHashTarget(hashHref: string) {
  const id = hashHref.startsWith('#') ? hashHref.slice(1) : hashHref
  if (!id) return

  const el = document.getElementById(id)
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function Navbar() {
  const [activeHref, setActiveHref] = useState<string>(() => {
    if (typeof window === 'undefined') return '#homepage'
    return getActiveFromLocation()
  })

  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return null
    return readAuthUser()
  })

  const [isVisible, setIsVisible] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)

  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  const isAuthPage = AUTH_HASH.has(activeHref)

  // Sync active menu dengan URL
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

  // Sync auth user
  useEffect(() => {
    const syncUser = () => setUser(readAuthUser())

    window.addEventListener('auth:changed', syncUser as EventListener)
    window.addEventListener('storage', syncUser)
    syncUser()

    return () => {
      window.removeEventListener('auth:changed', syncUser as EventListener)
      window.removeEventListener('storage', syncUser)
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
          if (delta > 0 && currentY > 80) setIsVisible(false)
          if (delta < 0) setIsVisible(true)
          lastScrollY.current = currentY
        }

        if (currentY <= 8) setIsVisible(true)
        ticking.current = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick =
    (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()

      if (window.location.hash !== href) {
        window.location.hash = href
      }

      setActiveHref(href)
      scrollToHashTarget(href)
    }

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY)
    setUser(null)
    window.dispatchEvent(new Event('auth:changed'))

    window.location.hash = '#signin'
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
                {(user ? NAV_ITEMS : NAV_ITEMS.filter((i) => i.key !== 'transaksi')).map(
                    (item) => {
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
                    }
                )}
            </nav>


          {/* kanan: hilang di halaman signin/signup */}
          {!isAuthPage && (
            <div className="navbar__actions">
              {user ? (
                <button
                  type="button"
                  className="navbar__signin"
                  onClick={handleLogout}
                  aria-label="Log out"
                >
                  Log out
                </button>
              ) : (
                <a
                  className="navbar__signin"
                  href="#signin"
                  onClick={handleNavClick('#signin')}
                >
                  Sign in
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="navbar__spacer" />
    </>
  )
}

export default Navbar
