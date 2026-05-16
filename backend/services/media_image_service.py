"""Media image service with multiple fallback providers."""
import random
import urllib.request
from typing import Dict
from datetime import datetime, timezone

PHOTO_IDS = [
    1015, 1016, 1018, 1020, 1024, 1025, 1035, 1039, 1040, 1041,
    1043, 1044, 1047, 1048, 1049, 1050, 1051, 1052, 1053, 1055,
    1056, 1057, 1058, 1059, 1060, 1061, 1062, 1063, 1064, 1065,
]

COVER_COLORS = ["1e40af","059669","d97706","dc2626","7c3aed","db2777","0891b2","4f46e5"]

IMAGE_PROVIDERS = []


def _picsum_url(width: int, height: int) -> str:
    id = random.choice(PHOTO_IDS)
    return f"https://picsum.photos/id/{id}/{width}/{height}"


def _placehold_url(width: int, height: int, text: str = "") -> str:
    color = random.choice(COVER_COLORS)
    safe_text = text.replace(" ", "%20") if text else "Image"
    return f"https://placehold.co/{width}x{height}/{color}/ffffff?text={safe_text}"


def get_media_image(media_type: str = "default", width: int = 640, height: int = 360) -> Dict:
    picsum_url = _picsum_url(width, height)
    fallback_url = _placehold_url(width, height, media_type.capitalize())
    return {
        "url": picsum_url,
        "fallback_url": fallback_url,
        "media_type": media_type,
        "width": width,
        "height": height,
        "fetched_at": datetime.now(timezone.utc).isoformat(),
    }


def get_avatar(size: int = 80) -> str:
    seed = random.randint(1, 999)
    return f"https://i.pravatar.cc/{size}?u={seed}"


def get_team_logo(team_name: str, size: int = 80) -> str:
    seed = abs(hash(team_name)) % 1000
    return f"https://picsum.photos/seed/team{seed}/{size}/{size}"
