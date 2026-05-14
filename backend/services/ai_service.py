import random
import math
from datetime import datetime
from typing import Dict, List, Optional, Tuple


def hsl_to_rgb(h: float, s: float, l: float) -> Tuple[int, int, int]:
    c = (1 - abs(2 * l - 1)) * s
    x = c * (1 - abs((h / 60) % 2 - 1))
    m = l - c / 2
    if h < 60: r, g, b = c, x, 0
    elif h < 120: r, g, b = x, c, 0
    elif h < 180: r, g, b = 0, c, x
    elif h < 240: r, g, b = 0, x, c
    elif h < 300: r, g, b = x, 0, c
    else: r, g, b = c, 0, x
    return (int((r + m) * 255), int((g + m) * 255), int((b + m) * 255))


def rgb_to_hex(r: int, g: int, b: int) -> str:
    return f"#{r:02x}{g:02x}{b:02x}"


def generate_color_scheme(seed: Optional[str] = None) -> Dict[str, str]:
    now = datetime.now()
    if seed:
        h = hash(seed) % 360
    else:
        h = (now.hour * 15 + now.minute * 0.25 + now.second * 0.004) % 360

    base = h
    scheme = {
        "primary": rgb_to_hex(*hsl_to_rgb(base, 0.75, 0.45)),
        "primary_hover": rgb_to_hex(*hsl_to_rgb(base, 0.70, 0.50)),
        "primary_active": rgb_to_hex(*hsl_to_rgb(base, 0.80, 0.40)),
        "bg": rgb_to_hex(*hsl_to_rgb(base, 0.08, 0.14)),
        "card_bg": rgb_to_hex(*hsl_to_rgb(base, 0.10, 0.18)),
        "card_border": rgb_to_hex(*hsl_to_rgb(base, 0.12, 0.25)),
        "text": rgb_to_hex(*hsl_to_rgb(base, 0.05, 0.92)),
        "text_secondary": rgb_to_hex(*hsl_to_rgb(base, 0.05, 0.65)),
        "accent_1": rgb_to_hex(*hsl_to_rgb((base + 60) % 360, 0.70, 0.50)),
        "accent_2": rgb_to_hex(*hsl_to_rgb((base + 180) % 360, 0.65, 0.45)),
        "accent_3": rgb_to_hex(*hsl_to_rgb((base + 300) % 360, 0.60, 0.50)),
        "gradient_start": rgb_to_hex(*hsl_to_rgb(base, 0.80, 0.35)),
        "gradient_end": rgb_to_hex(*hsl_to_rgb((base + 45) % 360, 0.75, 0.45)),
        "success": rgb_to_hex(*hsl_to_rgb(145, 0.65, 0.50)),
        "danger": rgb_to_hex(*hsl_to_rgb(0, 0.70, 0.55)),
        "warning": rgb_to_hex(*hsl_to_rgb(35, 0.85, 0.55)),
        "timestamp": now.isoformat(),
    }
    return scheme


def generate_media_svg(media_type: str, accent_color: str, size: int = 300) -> str:
    colors = {
        "video": ("#1a1a2e", accent_color, "#16213e"),
        "audio": ("#2d1b69", accent_color, "#1a1a2e"),
        "podcast": ("#1a2e1a", accent_color, "#0d1f0d"),
        "image": ("#2e1a1a", accent_color, "#1f0d0d"),
        "default": ("#1a1a2e", "#4a4ae0", "#16213e"),
    }
    bg, acc, bg2 = colors.get(media_type, colors["default"])

    icons = {
        "video": (
            '<circle cx="150" cy="150" r="70" fill="none" stroke="' + acc + '" stroke-width="4" opacity="0.3"/>'
            '<polygon points="125,115 125,185 185,150" fill="' + acc + '" opacity="0.9"/>'
            '<circle cx="150" cy="150" r="90" fill="none" stroke="' + acc + '" stroke-width="2" opacity="0.15"/>'
        ),
        "audio": (
            '<rect x="110" y="100" width="6" height="100" rx="3" fill="' + acc + '" opacity="0.9">'
            '<animate attributeName="height" values="100;130;80;110;100" dur="2s" repeatCount="indefinite"/>'
            '<animate attributeName="y" values="100;85;110;95;100" dur="2s" repeatCount="indefinite"/>'
            '</rect>'
            '<rect x="130" y="80" width="6" height="140" rx="3" fill="' + acc + '" opacity="0.7">'
            '<animate attributeName="height" values="140;100;120;150;140" dur="1.5s" repeatCount="indefinite"/>'
            '<animate attributeName="y" values="80;100;90;75;80" dur="1.5s" repeatCount="indefinite"/>'
            '</rect>'
            '<rect x="150" y="90" width="6" height="120" rx="3" fill="' + acc + '" opacity="0.8">'
            '<animate attributeName="height" values="120;150;100;130;120" dur="1.8s" repeatCount="indefinite"/>'
            '<animate attributeName="y" values="90;75;100;85;90" dur="1.8s" repeatCount="indefinite"/>'
            '</rect>'
            '<rect x="170" y="70" width="6" height="160" rx="3" fill="' + acc + '" opacity="0.6">'
            '<animate attributeName="height" values="160;120;140;170;160" dur="2.2s" repeatCount="indefinite"/>'
            '<animate attributeName="y" values="70;90;80;65;70" dur="2.2s" repeatCount="indefinite"/>'
            '</rect>'
            '<rect x="190" y="105" width="6" height="90" rx="3" fill="' + acc + '" opacity="0.5">'
            '<animate attributeName="height" values="90;110;80;95;90" dur="1.6s" repeatCount="indefinite"/>'
            '<animate attributeName="y" values="105;95;110;102;105" dur="1.6s" repeatCount="indefinite"/>'
            '</rect>'
        ),
        "podcast": (
            '<circle cx="150" cy="150" r="75" fill="none" stroke="' + acc + '" stroke-width="3" opacity="0.3"/>'
            '<circle cx="150" cy="135" r="35" fill="none" stroke="' + acc + '" stroke-width="4"/>'
            '<path d="M 150 170 L 150 200" stroke="' + acc + '" stroke-width="4" stroke-linecap="round"/>'
            '<path d="M 125 195 Q 150 210 175 195" fill="none" stroke="' + acc + '" stroke-width="3" opacity="0.7"/>'
            '<path d="M 115 125 A 50 50 0 0 1 185 125" fill="none" stroke="' + acc + '" stroke-width="2" opacity="0.3"/>'
            '<circle cx="150" cy="135" r="12" fill="' + acc + '"/>'
        ),
        "image": (
            '<rect x="90" y="90" width="120" height="120" rx="12" fill="none" stroke="' + acc + '" stroke-width="3"/>'
            '<circle cx="170" cy="120" r="15" fill="' + acc + '" opacity="0.6"/>'
            '<polygon points="90,210 130,160 160,190 210,130 210,210" fill="' + acc + '" opacity="0.3"/>'
        ),
    }

    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="'
        + str(size) + '" height="' + str(size) + '">'
        '<defs>'
        '<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">'
        '<stop offset="0%" style="stop-color:' + bg + ';stop-opacity:1"/>'
        '<stop offset="100%" style="stop-color:' + bg2 + ';stop-opacity:1"/>'
        '</linearGradient>'
        '<filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/>'
        '<feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
        '</defs>'
        '<rect width="300" height="300" rx="20" fill="url(#bgGrad)"/>'
        '<g filter="url(#glow)">'
        + icons.get(media_type, icons["video"]) +
        '</g>'
        '<circle cx="268" cy="32" r="20" fill="' + acc + '" opacity="0.9">'
        '<animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite"/>'
        '<animate attributeName="opacity" values="0.9;0.6;0.9" dur="2s" repeatCount="indefinite"/>'
        '</circle>'
        '</svg>'
    )
    return svg


def generate_content_blurb(content_type: str, category: str = None) -> Dict:
    templates = {
        "book": [
            "A journey through {topic} that challenges everything you thought you knew",
            "The definitive guide to mastering {topic} in the modern age",
            "Unlock the secrets of {topic} with this groundbreaking exploration",
        ],
        "video": [
            "Watch our latest deep dive into {topic} with expert analysis",
            "Experience {topic} like never before in stunning 4K quality",
            "An immersive visual journey through the world of {topic}",
        ],
        "podcast": [
            "Listen to industry leaders discuss the future of {topic}",
            "An in-depth conversation about {topic} you can't afford to miss",
            "Your weekly dose of {topic} insights from top practitioners",
        ],
        "event": [
            "Join thousands at the premier {topic} event of the year",
            "An unforgettable evening celebrating the best in {topic}",
            "Network with leaders and innovators in the {topic} space",
        ],
        "default": [
            "Discover the latest in {topic} curated just for you",
            "Stay ahead with cutting-edge insights on {topic}",
            "Everything you need to know about {topic} in one place",
        ],
    }

    topics = {
        "viking": "Viking Mindset",
        "norse": "Norse Mythology",
        "growth": "Growth Mindset",
        "warrior": "Warrior Spirit",
        "discipline": "Discipline & Honor",
        "strength": "Inner Strength",
        "resilience": "Resilience",
        "wisdom": "Ancient Wisdom",
        "meditation": "Viking Meditation",
        "leadership": "Norse Leadership",
    }

    topic_name = topics.get(category, "Trending Topics")
    blurb_templates = templates.get(content_type, templates["default"])
    blurb = random.choice(blurb_templates).format(topic=topic_name)

    return {
        "title": f"{topic_name} {content_type.title()}",
        "blurb": blurb,
        "category": category or "general",
        "generated_at": datetime.now().isoformat(),
        "engagement_score": random.randint(70, 99),
    }


def generate_dynamic_media_placeholder(media_type: str, index: int = 0) -> Dict:
    types = {
        "video": {"icon": "🎬", "label": "Video", "gradient": ["#1a1a2e", "#16213e"]},
        "audio": {"icon": "🎵", "label": "Audio", "gradient": ["#2d1b69", "#1a1a2e"]},
        "podcast": {"icon": "🎙️", "label": "Podcast", "gradient": ["#1a2e1a", "#0d1f0d"]},
        "image": {"icon": "🖼️", "label": "Image", "gradient": ["#2e1a1a", "#1f0d0d"]},
    }
    info = types.get(media_type, types["video"])
    hue = (index * 47 + 180) % 360
    scheme = generate_color_scheme(f"{media_type}_{index}")
    return {
        "type": media_type,
        "icon": info["icon"],
        "label": info["label"],
        "gradient": info["gradient"],
        "accent": scheme["primary"],
        "svg_data_uri": _svg_to_data_uri(generate_media_svg(media_type, scheme["primary"])),
    }


def _svg_to_data_uri(svg: str) -> str:
    import urllib.parse
    encoded = urllib.parse.quote(svg)
    return f"data:image/svg+xml;charset=utf-8,{encoded}"
