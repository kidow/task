import type { FC } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

interface Props {
  title?: string
  description?: string
  image?: string
  ldJson?: any
  noSEO?: boolean
  keyword?: string
}

const SEO: FC<Props> = ({
  title,
  description = '그날그날 태스크들을 관리하는 사이트입니다.',
  image = '',
  ldJson,
  noSEO = false
}) => {
  const { asPath } = useRouter()
  const TITLE = title ? `${title} - kidow` : 'kidow'
  const URL = 'https://task.kidow.me' + decodeURI(asPath)
  if (ldJson) ldJson['@context'] = 'https://schema.org'
  if (noSEO)
    return (
      <Head>
        <title>{TITLE}</title>
      </Head>
    )
  return (
    <Head>
      <title>{TITLE}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="keywords" />
      <meta property="og:title" content={TITLE} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={URL} />
      <meta property="og:image" content={image} />
      <meta property="twitter:title" content={TITLE} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:domain" content={URL} />
      {ldJson && (
        <script type="application/ld+json">{JSON.stringify(ldJson)}</script>
      )}
    </Head>
  )
}

export default SEO
