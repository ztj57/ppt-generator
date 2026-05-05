'use client'

import { useState, useEffect } from 'react'

interface Status {
  ai_available: boolean
  message: string
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [result, setResult] = useState<{ success: boolean; url?: string } | null>(null)
  const [status, setStatus] = useState<Status | null>(null)

  useEffect(() => {
    fetch('http://localhost:8000/api/status')
      .then(res => res.json())
      .then(data => setStatus(data))
      .catch(() => setStatus({ ai_available: false, message: "服务未就绪" }))
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      const validTypes = ['.docx', '.doc', '.pdf', '.txt']
      const suffix = selected.name.substring(selected.name.lastIndexOf('.')).toLowerCase()
      if (validTypes.includes(suffix)) {
        setFile(selected)
        setMessage('')
      } else {
        setMessage('请上传 Word 文档或 PDF 文件')
      }
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      setMessage('请选择文件')
      return
    }

    setLoading(true)
    setMessage(status?.ai_available ? 'AI智能生成中，请稍候...' : '正在生成PPT，请稍候...')
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('use_ai', 'true')

      const response = await fetch('http://localhost:8000/api/generate-ppt', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || '生成失败')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `演示文稿_${Date.now()}.pptx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setResult({ success: true })
      setMessage('PPT生成成功！已自动下载')
    } catch (err) {
      setResult({ success: false })
      setMessage(err instanceof Error ? err.message : '生成失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>📄 文档转PPT</h1>
          <p style={styles.subtitle}>上传文档，智能生成精美演示文稿</p>
        </header>

        {status && (
          <div style={styles.statusBar}>
            <span style={{
              ...styles.statusDot,
              background: status.ai_available ? '#10b981' : '#f59e0b'
            }}></span>
            <span style={styles.statusText}>{status.message}</span>
          </div>
        )}

        <div style={styles.uploadSection}>
          <div style={styles.uploadBox}>
            <input
              type="file"
              accept=".docx,.doc,.pdf,.txt"
              onChange={handleFileChange}
              style={styles.fileInput}
              id="file-input"
            />
            <label htmlFor="file-input" style={styles.fileLabel}>
              {file ? (
                <span style={styles.fileName}>{file.name}</span>
              ) : (
                <>
                  <span style={styles.uploadIcon}>📁</span>
                  <span>点击选择文件或拖拽到此处</span>
                </>
              )}
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !file}
            style={{
              ...styles.button,
              ...(loading || !file ? styles.buttonDisabled : {}),
            }}
          >
            {loading ? '生成中...' : '生成PPT'}
          </button>

          {message && (
            <p style={{
              ...styles.message,
              ...(result?.success ? styles.success : styles.error),
            }}>
              {message}
            </p>
          )}

          {loading && (
            <div style={styles.progressContainer}>
              <div style={styles.progressBar}></div>
            </div>
          )}
        </div>

        <div style={styles.features}>
          <div style={styles.featureItem}>
            <span style={styles.featureIcon}>📝</span>
            <span>支持 Word/PDF/TXT</span>
          </div>
          <div style={styles.featureItem}>
            <span style={styles.featureIcon}>🤖</span>
            <span>AI智能生成</span>
          </div>
          <div style={styles.featureItem}>
            <span style={styles.featureIcon}>✏️</span>
            <span>可编辑 PPT</span>
          </div>
        </div>
      </div>
    </main>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  main: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  container: {
    background: '#fff',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
  },
  statusBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px',
    background: '#f3f4f6',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  statusText: {
    fontSize: '14px',
    color: '#666',
  },
  uploadSection: {
    marginBottom: '30px',
  },
  uploadBox: {
    border: '2px dashed #ddd',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    marginBottom: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  fileInput: {
    display: 'none',
  },
  fileLabel: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  uploadIcon: {
    fontSize: '40px',
  },
  fileName: {
    color: '#667eea',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '16px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fff',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  message: {
    textAlign: 'center',
    marginTop: '15px',
    fontSize: '14px',
    padding: '10px',
    borderRadius: '8px',
  },
  success: {
    color: '#28a745',
    background: '#d4edda',
  },
  error: {
    color: '#dc3545',
    background: '#f8d7da',
  },
  progressContainer: {
    marginTop: '20px',
    height: '4px',
    background: '#f0f0f0',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    animation: 'progress 1.5s ease-in-out infinite',
  },
  features: {
    display: 'flex',
    justifyContent: 'space-around',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#666',
    fontSize: '14px',
  },
  featureIcon: {
    fontSize: '20px',
  },
}