export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="flex items-center justify-center">{children}</div>
}
