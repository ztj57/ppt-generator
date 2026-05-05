import requests
import os
import random


PEXELS_API_KEY = os.getenv("PEXELS_API_KEY", "")
PEXELS_API_URL = "https://api.pexels.com/v1/search"

UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY", "")
UNSPLASH_API_URL = "https://api.unsplash.com/search/photos"


def search_pexels(query: str, per_page: int = 5):
    if not PEXELS_API_KEY:
        return []

    headers = {"Authorization": PEXELS_API_KEY}
    params = {"query": query, "per_page": per_page, "orientation": "landscape"}

    try:
        response = requests.get(PEXELS_API_URL, headers=headers, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            return [photo["src"]["large"] for photo in data.get("photos", [])]
    except Exception:
        pass

    return []


def search_unsplash(query: str, per_page: int = 5):
    if not UNSPLASH_ACCESS_KEY:
        return []

    headers = {"Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"}
    params = {"query": query, "per_page": per_page, "orientation": "landscape"}

    try:
        response = requests.get(UNSPLASH_API_URL, headers=headers, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            return [photo["urls"]["regular"] for photo in data.get("results", [])]
    except Exception:
        pass

    return []


def search_images(query: str, per_page: int = 5):
    images = search_pexels(query, per_page)
    if not images:
        images = search_unsplash(query, per_page)
    return images


CATEGORIES = {
    "business": ["business meeting", "office", "corporate", "professional"],
    "technology": ["technology", "computer", "digital", "innovation"],
    "education": ["education", "learning", "students", "classroom"],
    "medical": ["medical", "healthcare", "doctor", "hospital"],
    "finance": ["finance", "money", "chart", "investment"],
    "marketing": ["marketing", "advertising", "social media"],
    "nature": ["nature", "landscape", "outdoor", " scenery"],
    "abstract": ["abstract", "pattern", "design", "art"],
}


def get_category_images(category: str, per_page: int = 5):
    keywords = CATEGORIES.get(category, CATEGORIES["abstract"])
    keyword = random.choice(keywords) if keywords else "business"
    return search_images(keyword, per_page)


def get_fallback_images():
    return [
        "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260",
        "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1260",
        "https://images.pexels.com/photos/1181242/pexels-photo-1181242.jpeg?auto=compress&cs=tinysrgb&w=1260",
        "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1260",
        "https://images.pexels.com/photos/669619/pexels-photo-669619.jpeg?auto=compress&cs=tinysrgb&w=1260",
    ]