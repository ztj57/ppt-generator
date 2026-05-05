# 文档转PPT - 智能演示文稿生成器

一个将文档(Word/PDF/TXT)智能转换为精美可编辑PPT的Web应用。

## 功能特性

- 📝 支持多种文档格式：Word(.docx/.doc)、PDF(.pdf)、文本(.txt)
- 🤖 AI智能生成：调用云端AI生成结构化的PPT大纲
- 🎨 精美模板：自动应用专业设计的PPT模板
- ✏️ 完全可编辑：生成标准PPTX格式，可在PowerPoint中编辑

## 技术架构

- **前端**: Next.js 14 + React + TypeScript
- **后端**: FastAPI (Python)
- **PPT生成**: python-pptx
- **AI服务**: SiliconFlow API (免费额度)

## 快速开始

### 1. 获取免费AI API Key (可选)

注册硅基流动获取免费API额度：
1. 访问 https://siliconflow.cn
2. 注册账号
3. 在控制台获取 API Key

### 2. 启动后端

```bash
cd ppt-generator/backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. 启动前端

```bash
cd ppt-generator/frontend
npm install
npm run dev
```

### 4. 访问应用

浏览器打开: http://localhost:3000

## 环境变量 (可选)

在 `backend/` 目录下创建 `.env` 文件：

```env
# SiliconFlow API (免费额度)
SILICONFLOW_API_KEY=你的API密钥
```

**注意**: 如果不配置API Key，系统会使用模板模式生成PPT。

## 项目结构

```
ppt-generator/
├── backend/
│   ├── main.py           # FastAPI入口
│   ├── requirements.txt  # Python依赖
│   └── app/
│       ├── document_parser.py  # 文档解析
│       ├── ppt_generator.py   # PPT生成
│       ├── ai_service.py      # AI模型服务
│       └── image_service.py   # 图片服务
├── frontend/
│   ├── package.json
│   └── src/app/
│       ├── page.tsx      # 主页面
│       ├── layout.tsx
│       └── globals.css
└── README.md
```

## 使用说明

1. 打开 http://localhost:3000
2. 点击上传区域，选择Word/PDF/TXT文件
3. 点击"生成PPT"按钮
4. 等待AI处理完成，自动下载生成的PPT
5. 用PowerPoint打开并编辑

## 故障排查

### 文档解析失败
- 确保文件格式正确(.docx/.pdf/.txt)
- 检查文件编码是否为UTF-8

### PPT生成失败
- 检查python-pptx是否正确安装
- 确认输出目录有写入权限

## 许可证

MIT License