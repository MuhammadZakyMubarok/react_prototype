import { useState } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import './sign.css'

type DbUser = {
  id: number
  name: string
  email: string
  password: string
}

type AuthUser = {
  id: number
  name: string
  email: string
}

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:3000'

const AUTH_KEY = 'auth_user'

function saveAuthUser(user: AuthUser) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
  window.dispatchEvent(new Event('auth:changed'))
}

function Signin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (errorMsg) setErrorMsg('')
  }

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (errorMsg) setErrorMsg('')
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    setErrorMsg('')

    try {
      const emailTrim = email.trim().toLowerCase()
      const res = await fetch(
        `${API_BASE}/users?email=${encodeURIComponent(emailTrim)}`
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const users = (await res.json()) as DbUser[]
      const user = users?.[0]

      if (!user || user.password !== password) {
        setErrorMsg('email atau password salah')
        return
      }

      saveAuthUser({ id: user.id, name: user.name, email: user.email })

      // arahkan ke homepage
      window.location.hash = '#homepage'
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      // kalau API error, tetap tampilkan pesan sederhana sesuai permintaan
      setErrorMsg('email atau password salah')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page">
      <section className="auth">
        <div className="auth__media" aria-label="Illustration">
          <img src="welcome.png" alt="illustration" />
        </div>

        <div className="auth__content">
          <div className="form">
            <h1 className="form__title">Sign In</h1>

            <p className="form__subtitle">
              Welcome back! Please enter your details.
            </p>

            <form className="form__fields" onSubmit={onSubmit}>
              <label className="field">
                <span className="field__label">Email</span>
                <input
                  className="field__input"
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={onEmailChange}
                />
              </label>

              <label className="field">
                <span className="field__label">Password</span>
                <input
                  className="field__input"
                  type="password"
                  name="password"
                  required
                  value={password}
                  onChange={onPasswordChange}
                />
              </label>

              {/* checkbox pajangan */}
              <div className="login-row">
                <label className="check login-row__left">
                  <input className="check__box" type="checkbox" name="remember" />
                  <span className="check__text">Remember me</span>
                </label>

                <a className="link login-row__right" href="#">
                  Forgot password?
                </a>
              </div>

              {errorMsg && (
                <p style={{ marginTop: 10, fontSize: 13, color: '#b00020' }}>
                  {errorMsg}
                </p>
              )}

              <button className="primary-btn" type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>

              <p className="form__foot">
                Don't have an account?{' '}
                <a href="#signup" className="link">
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Signin
