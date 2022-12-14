import 'styles/globals.css'
import App from 'next/app'
import { ErrorInfo } from 'react'
import { cookieParse, supabase } from 'services'

interface Props {}
interface State {
  hasError: boolean
}

class MyApp extends App<Props, {}, State> {
  state = {
    hasError: false
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (error) this.setState({ hasError: true })
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    const {} = this.state
    const { Component, pageProps } = this.props
    return <Component {...pageProps} />
  }
}

MyApp.getInitialProps = async ({ ctx: { req } }) => {
  const cookie = cookieParse(req?.headers.cookie)
  const { user } = await supabase.auth.api.getUser(cookie.access_token)
  return { pageProps: { user } }
}

export default MyApp
