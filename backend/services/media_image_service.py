"""Real media images from Lorem Picsum — always works, no API key needed."""
import random
from typing import Dict
from datetime import datetime, timezone

PHOTO_IDS = [
    1015, 1016, 1018, 1020, 1024, 1025, 1035, 1039, 1040, 1041,
    1043, 1044, 1047, 1048, 1049, 1050, 1051, 1052, 1053, 1055,
    1056, 1057, 1058, 1059, 1060, 1061, 1062, 1063, 1064, 1065,
    1066, 1067, 1068, 1069, 1070, 1071, 1072, 1073, 1074, 1075,
    1076, 1077, 1078, 1079, 1080, 1081, 1082, 1083, 1084, 1085,
    1086, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095,
    1096, 1097, 1098, 1099, 1100, 1101, 1102, 1103, 1104, 1105,
    1106, 1107, 1108, 1109, 1110, 1111, 1112, 1113, 1114, 1115,
    1116, 1117, 1118, 1119, 1120, 1121, 1122, 1123, 1124, 1125,
    1126, 1127, 1128, 1129, 1130, 1131, 1132, 1133, 1134, 1135,
]


def _picsum_url(width: int, height: int) -> str:
    id = random.choice(PHOTO_IDS)
    return f"https://picsum.photos/id/{id}/{width}/{height}"


def get_media_image(media_type: str = "default", width: int = 640, height: int = 360) -> Dict:
    return {
        "url": _picsum_url(width, height),
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
