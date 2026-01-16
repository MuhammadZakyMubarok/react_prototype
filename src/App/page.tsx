import { useEffect, useState } from 'react'
import './page.css'

import Layout from './Layout.tsx'
import Homepage from '../Section/Homepage/home.tsx'
import Transaction from '../Section/Transaction/transaction.tsx'
import Signin from '../Section/Loginpage/signin.tsx'
import Signup from '../Section/Loginpage/signup.tsx'

type Route = 'home' | 'transaction' | 'signin' | 'signup'

function routeFromHash(hash: string): Route {
  if (hash === '#transaksi') return 'transaction'
  if (hash === '#signin') return 'signin'
  if (hash === '#signup') return 'signup'
  return 'home'
}

function Page() {
  const [route, setRoute] = useState<Route>(() => {
    const hash =
      typeof window !== 'undefined' ? window.location.hash : '#homepage'
    return routeFromHash(hash || '#homepage')
  })

  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash || '#homepage'
      setRoute(routeFromHash(hash))
    }

    window.addEventListener('hashchange', sync)
    sync()

    return () => window.removeEventListener('hashchange', sync)
  }, [])

  return (
    <Layout>
      {route === 'transaction' && <Transaction />}
      {route === 'signin' && <Signin />}
      {route === 'signup' && <Signup />}
      {route === 'home' && <Homepage />}
    </Layout>
  )
}

export default Page
