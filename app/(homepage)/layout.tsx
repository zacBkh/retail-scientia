// import SEO_KEYWORDS from '@/constants/seo-keywords'

export const metadata = {
  title: 'Welcome',
  description: 'Bla bla',
  // keywords: SEO_KEYWORDS,
}

export default function WelcomePageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
