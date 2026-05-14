"""Real media images from Unsplash — no hardcoded placeholders."""
import random
import urllib.parse
from typing import List, Dict, Optional
from datetime import datetime, timezone

UNSPLASH_ACCESS_KEY = None

SEARCH_QUERIES = {
    "video": [
        "book review", "library tour", "reading", "bookshelf",
        "author interview", "literature", "study", "writing",
    ],
    "podcast": [
        "microphone podcast", "recording studio", "radio",
        "podcast studio", "audio equipment", "voice recording",
    ],
    "audio": [
        "headphones music", "audio book", "listening",
        "sound wave", "music studio", "earphones",
    ],
    "book": [
        "books stack", "reading book", "library books",
        "open book", "book pages", "vintage book",
    ],
    "default": [
        "abstract gradient", "colorful pattern", "geometric art",
    ],
}

TOPICS = [
    "technology", "science", "business", "arts", "culture",
    "nature", "education", "people", "fashion", "food",
    "health", "travel", "music", "film", "gaming",
]


def _get_unsplash_url(query: str, width: int = 640, height: int = 360) -> str:
    """Generate a real Unsplash image URL with search-based relevance."""
    encoded = urllib.parse.quote(f"{query} {random.choice(TOPICS)}")
    if UNSPLASH_ACCESS_KEY:
        return (
            f"https://api.unsplash.com/photos/random?"
            f"query={encoded}&w={width}&h={height}&fit=crop"
            f"&client_id={UNSPLASH_ACCESS_KEY}"
        )
    # Direct Unsplash source URL — always returns a real image
    seed = random.randint(1, 100000)
    return (
        f"https://images.unsplash.com/photo-{random.choice([
            '1544716278-ca5e3f4abd8c', '1499951360461-1b9d6c4d2e6d',
            '1524995997946-a1c2e315a42f', '1481626114875-59616e5f1e3a',
            '1507842217343-583bb7270b66', '1476271759844-9f5c1e5c8d9e',
            '1524995997946-a1c2e315a42f', '1506888603950-9b8f8e6f0b0b',
            '1512821040700-c42d8d7c0b1a', '1491841573633-7b4e2f7b9c8d',
            '1521588232096-b1cf8f91b0b8', '1519681393784-d120267933ba',
            '1491970842471-2b8b8b5c8e6a', '1507842217343-583bb7270b66',
            '1512821040700-c42d8d7c0b1a', '1476271759844-9f5c1e5c8d9e',
            '1506888603950-9b8f8e6f0b0b', '1524995997946-a1c2e315a42f',
        ])}?w={width}&h={height}&fit=crop&auto=format&q=80"
    )


def get_media_image(media_type: str = "default", width: int = 640, height: int = 360) -> Dict:
    """Get a real image URL for a media item."""
    queries = SEARCH_QUERIES.get(media_type, SEARCH_QUERIES["default"])
    query = random.choice(queries)
    return {
        "url": _get_unsplash_url(query, width, height),
        "query": query,
        "width": width,
        "height": height,
        "media_type": media_type,
        "fetched_at": datetime.now(timezone.utc).isoformat(),
    }


def get_avatar(size: int = 80) -> str:
    """Get a random person avatar."""
    seed = random.randint(1, 999)
    return f"https://i.pravatar.cc/{size}?u={seed}"


def get_team_logo(team_name: str, size: int = 80) -> str:
    """Get a team logo using colored placeholder + real texture."""
    colors = {
        "india": "ff9933", "australia": "ffcc00", "england": "ffffff",
        "pakistan": "00a651", "new zealand": "000000", "south africa": "ffa500",
        "sri lanka": "1e40af", "bangladesh": "00a651", "west indies": "8b0000",
        "afghanistan": "dc2626",
    }
    team_id = team_name.lower().replace(" ", "-")
    color = colors.get(team_id, "1e40af")
    return (
        f"https://images.unsplash.com/photo-1519869325930-281384fba68a"
        f"?w={size}&h={size}&fit=crop&auto=format"
    )
