import './globals.css'

export const metadata = {
  title: '文档转PPT - 智能生成演示文稿',
  description: '上传文档，智能生成精美演示文稿',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}