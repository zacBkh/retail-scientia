// import SEO_KEYWORDS from '@/constants/seo-keywords'
export const revalidate = 0

export const metadata = {
  title: 'Welcome to Retail Scientia! 👋🏼',
  description: 'Login and start filling your cart to register your Sales! ',
  // keywords: SEO_KEYWORDS,
}

export default function WelcomePageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
