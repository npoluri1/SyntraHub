from fastapi import APIRouter, Query
from typing import Optional

from backend.services.ai_service import (
    generate_color_scheme,
    generate_media_svg,
    generate_content_blurb,
    generate_dynamic_media_placeholder,
)

router = APIRouter(prefix="/api/ai", tags=["AI Engine"])


@router.get("/colors")
def get_color_scheme(seed: Optional[str] = None):
    return generate_color_scheme(seed)


@router.get("/media-placeholder")
def get_media_placeholder(media_type: str = "video", index: int = 0):
    return generate_dynamic_media_placeholder(media_type, index)


@router.get("/media-svg")
def get_media_svg(media_type: str = "video", accent: str = "#4a4ae0", size: int = 300):
    svg = generate_media_svg(media_type, accent, size)
    from backend.services.ai_service import _svg_to_data_uri
    return {"svg": svg, "data_uri": _svg_to_data_uri(svg)}


@router.get("/content-blurb")
def get_content_blurb(content_type: str = "default", category: Optional[str] = None):
    return generate_content_blurb(content_type, category)


@router.get("/trending-topics")
def get_trending_topics():
    topics = [
        {"id": 1, "name": "Viking Mindset", "icon": "⚔️", "color": "#b8860b", "heat": 98},
        {"id": 2, "name": "Norse Wisdom", "icon": "📜", "color": "#8b6914", "heat": 92},
        {"id": 3, "name": "Warrior Discipline", "icon": "🛡️", "color": "#a07000", "heat": 88},
        {"id": 4, "name": "Growth & Honor", "icon": "🌄", "color": "#d4a017", "heat": 85},
        {"id": 5, "name": "Rune Meditation", "icon": "🔮", "color": "#7a6b3a", "heat": 80},
        {"id": 6, "name": "Inner Strength", "icon": "💪", "color": "#b8860b", "heat": 76},
        {"id": 7, "name": "Resilience Path", "icon": "🔥", "color": "#8b6914", "heat": 72},
        {"id": 8, "name": "Ancient Leadership", "icon": "👑", "color": "#d4a017", "heat": 70},
    ]
    return topics
