import requests
import json
import os


SILICONFLOW_API_KEY = os.getenv("SILICONFLOW_API_KEY", "")
SILICONFLOW_ENDPOINT = "https://api.siliconflow.cn/v1/chat/completions"
DEFAULT_MODEL = "Qwen/Qwen2-7B-Instruct"


def call_siliconflow(prompt: str, model: str = DEFAULT_MODEL) -> str:
    if not SILICONFLOW_API_KEY:
        return ""

    headers = {
        "Authorization": f"Bearer {SILICONFLOW_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 1024,
        "temperature": 0.7
    }

    try:
        response = requests.post(SILICONFLOW_ENDPOINT, json=payload, headers=headers, timeout=60)
        if response.status_code == 200:
            data = response.json()
            return data.get("choices", [{}])[0].get("message", {}).get("content", "")
    except Exception as e:
        print(f"SiliconFlow API failed: {e}")

    return ""


def generate_ppt_outline(document_text: str) -> list:
    prompt = f"""你是一个PPT设计专家。请根据以下文档内容，生成一个结构清晰的PPT大纲。

要求：
1. 输出JSON数组格式，每个元素是一个幻灯片，包含title(标题)和content(内容要点)两个字段
2. 第一张是标题页
3. 内容要简洁有力，适合演示
4. 最多生成10张幻灯片
5. 内容用中文

文档内容：
{document_text[:2000]}

请直接输出JSON数组，不要其他内容："""

    result = call_siliconflow(prompt)

    try:
        if result:
            for line in result.strip().split('\n'):
                line = line.strip()
                if line.startswith('['):
                    return json.loads(line)
    except:
        pass

    return []


def is_api_available() -> bool:
    return bool(SILICONFLOW_API_KEY)