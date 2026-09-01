import { useEffect } from 'react'

const SITE_NAME = 'Magic Volley Adelfia Associazione Sportiva Dilettantistica'
const SITE_URL = 'https://www.magicvolleyadelfia.it'
const DEFAULT_IMAGE = '/logo.png'

function setMetaTag(attr, key, content) {
  if (!content) return
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function resolveUrl(value) {
  if (!value) return null
  return value.startsWith('http') ? value : `${SITE_URL}${value}`
}

export function useDocumentMeta({ title, description, image, path, type = 'website' }) {
  useEffect(() => {
    const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME
    document.title = fullTitle

    const resolvedImage = resolveUrl(image) || `${SITE_URL}${DEFAULT_IMAGE}`
    const resolvedUrl = path ? `${SITE_URL}${path}` : SITE_URL

    setMetaTag('name', 'description', description)
    setMetaTag('property', 'og:title', fullTitle)
    setMetaTag('property', 'og:description', description)
    setMetaTag('property', 'og:image', resolvedImage)
    setMetaTag('property', 'og:url', resolvedUrl)
    setMetaTag('property', 'og:type', type)
    setMetaTag('name', 'twitter:card', 'summary_large_image')
    setMetaTag('name', 'twitter:title', fullTitle)
    setMetaTag('name', 'twitter:description', description)
    setMetaTag('name', 'twitter:image', resolvedImage)
  }, [title, description, image, path, type])
}
