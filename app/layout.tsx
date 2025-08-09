import '../styles/globals.css';

export const metadata = {
  title: 'Dynamic content using open AI..',
  description: 'AI-powered content editor with Drupal backend',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}