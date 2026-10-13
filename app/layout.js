import './globals.css'
import { Inter, Inter_Tight, JetBrains_Mono } from 'next/font/google'
import { Providers } from './providers'
import JsonLd from '@/components/site/JsonLd'
import { jsonLd, personSchema, organizationSchema, websiteSchema } from '@/lib/seo'

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--font-sans' })
const interTight = Inter_Tight({ subsets: ['latin'], weight: ['500', '600', '700'], display: 'swap', variable: '--font-display' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], display: 'swap', variable: '--font-mono' })

export const metadata = {
  metadataBase: new URL('https://aarushjoshi.in'),
  title: {
    default: 'Aarush · SEO that reports to revenue, not rankings',
    template: '%s · Aarush',
  },
  description: 'Organic growth advisor with 8+ years across edtech, D2C and fintech. I treat organic as a P&L-accountable revenue channel.',
  openGraph: {
    type: 'website',
    title: 'Aarush · SEO that reports to revenue, not rankings',
    description: 'Organic growth advisor. 8+ years across edtech, D2C and fintech.',
    siteName: 'Aarush',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aarush · SEO that reports to revenue, not rankings',
  },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body>
        <JsonLd data={jsonLd(organizationSchema(), personSchema(), websiteSchema())} />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
