"""Generate bidirectional municipal <-> C-type mapping JSON from transcribed table data."""

from __future__ import annotations

import json
from pathlib import Path

PREFIX = "7-1-277/"


def m(suffix: str) -> str:
    return f"{PREFIX}{suffix}"


def add_municipal_to_ctype(mapping: dict[str, str], municipal_suffix: str, ctype: str) -> None:
    municipal = m(municipal_suffix)
    ctype = ctype.strip()
    existing = mapping.get(municipal)
    if existing and existing != ctype and existing.replace("/C", "") != ctype.replace("/C", ""):
        raise ValueError(f"Municipal conflict {municipal}: {existing} vs {ctype}")
    mapping[municipal] = existing if existing and "/C" in existing else ctype


def add_ctype_to_municipal(mapping: dict[str, str], ctype: str, municipal_suffix: str) -> None:
    municipal = m(municipal_suffix)
    ctype = ctype.strip()
    existing = mapping.get(ctype)
    if existing and existing != municipal:
        raise ValueError(f"C-type conflict {ctype}: {existing} vs {municipal}")
    mapping[ctype] = municipal
    base = ctype.replace("/C", "")
    if base != ctype and base not in mapping:
        mapping[base] = municipal


def add_municipal_range(
    mapping: dict[str, str],
    start: int,
    end: int,
    ctypes: list[str],
) -> None:
    suffixes = list(range(start, end + 1))
    if len(suffixes) != len(ctypes):
        raise ValueError(f"Range {start}-{end} length mismatch")
    for suffix, ctype in zip(suffixes, ctypes):
        add_municipal_to_ctype(mapping, str(suffix), ctype)


def build_municipal_to_ctype() -> dict[str, str]:
    mapping: dict[str, str] = {}

    page1_left = [
        (38, "362/C"), (39, "363/C"), (40, "364/C"), (41, "365/C"), (42, "366/C"),
        (43, "367/C"), (44, "354/C"), (45, "355/C"), (46, "356/C"), (47, "357/C"),
        (48, "358/C"), (49, "359/C"), (50, "360/C"), (51, "361/C"), (52, "346/C"),
        (53, "347/C"), (54, "348/C"), (55, "349/C"), (56, "350/C"), (57, "351/C"),
        (58, "352/C"), (59, "353/C"), (60, "245/C"), (61, "244/C"), (62, "243/C"),
        (64, "260/C"), (65, "259/C"), (66, "258/C"), (67, "257/C"), (68, "256/C"),
        (69, "255/C"), (70, "254/C"), (71, "253/C"), (72, "252/C"), (73, "251/C"),
        (74, "250/C"), (75, "249/C"), (76, "248/C"),
    ]
    for suffix, ctype in page1_left:
        add_municipal_to_ctype(mapping, str(suffix), ctype)

    page2_left = [
        (77, "247/C"), (78, "246/C"), (79, "275/C"), (80, "274/C"), (81, "273/C"),
        (82, "272/C"), (83, "271/C"), (84, "270/C"), (85, "269/C"), (86, "268/C"),
        (87, "267/C"), (88, "266/C"), (89, "265/C"), (90, "264/C"), (91, "263/C"),
        (92, "262/C"), (93, "261/C"), ("93/1", "368/C"), ("93/2", "369/C"),
        ("93/3", "370/C"), ("93/4", "371/C"), ("93/5A", "372/C"), ("93/5B", "373/C"),
        (94, "223/C"), (95, "224/C"), (96, "225/C"), (97, "226/C"), (98, "227/C"),
        (99, "228/C"), (100, "229/C"), (101, "230/C"), (102, "231/C"), (103, "232/C"),
        (104, "233/C"), (105, "234/C"), (106, "235/C"), (107, "236/C"), (108, "237/C"),
        (109, "238/C"), (110, "239/C"), (111, "240/C"),
    ]
    for suffix, ctype in page2_left:
        add_municipal_to_ctype(mapping, str(suffix), ctype)

    page3_left = [
        "241/C", "242/C", "210/C", "211/C", "212/C", "213/C", "214/C", "215/C",
        "216/C", "217/C", "218/C", "219/C", "220/C", "221/C", "222/C", "291/C",
        "290/C", "289/C", "288/C", "287/C", "286/C", "285/C", "284/C", "283/C",
        "282/C", "281/C", "280/C", "279/C", "278/C", "277/C", "276/C", "307", "306",
        "305", "304", "303", "302", "301", "300", "299", "298",
    ]
    add_municipal_range(mapping, 112, 152, page3_left)

    page4_left = [
        "297", "296", "295", "294", "293", "292", "195", "196", "197", "198", "199",
        "200", "201", "202", "203", "204", "205", "206", "207", "208", "209", "184",
        "185", "186", "187", "188", "189", "190", "191", "192", "193", "194", "171",
        "172", "173", "174", "175", "176", "177", "178", "179",
    ]
    add_municipal_range(mapping, 153, 193, page4_left)

    page5_left = [
        (194, "180"), (195, "181"), (196, "182"), (197, "183"), (198, "170"),
        (199, "169"), (200, "168"), (201, "167"), (202, "166"), (203, "165"),
        (204, "164"), (205, "163"), (206, "162"), (207, "161"), (208, "160"),
        ("208/1", "374"), ("208/2", "375"), ("208/3", "376"), ("208/4", "377"),
        (209, "159"), (210, "158"), (211, "157"), (212, "156"), (213, "155"),
        (214, "154"), (215, "153"), (216, "152"), (217, "151"), (218, "150"),
        (219, "149"), (220, "148"), (221, "147"), (222, "146"), (223, "145/C"),
        (224, "308/C"), (225, "309"), (226, "310"), (227, "311"), (228, "312"),
        (229, "313"), (230, "314"),
    ]
    for suffix, ctype in page5_left:
        add_municipal_to_ctype(mapping, str(suffix), ctype)

    page6_left = (
        [str(n) for n in range(315, 344)]
        + ["344/C", "345/C"]
        + [str(n) for n in range(144, 134, -1)]
    )
    add_municipal_range(mapping, 231, 271, page6_left)

    page7_left = [str(n) for n in range(134, 97, -1)] + ["97/C", "96/C", "95/C", "79"]
    add_municipal_range(mapping, 272, 312, page7_left)

    page8_left = [str(n) for n in range(80, 95)] + ["78/C"] + [str(n) for n in range(77, 52, -1)]
    add_municipal_range(mapping, 313, 353, page8_left)

    page9_left = [
        "52", "51/C", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32",
        "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44",
        "45", "46", "47", "48", "49", "50", "1", "2", "3", "4", "5", "6", "7",
        "8", "9", "10", "11",
    ]
    add_municipal_range(mapping, 354, 394, page9_left)

    page10_left = [
        (395, "12"), (396, "18"), (397, "19"), (398, "20"), (399, "21"), (400, "22"),
        (401, "13"), (402, "14"), (403, "15"), (404, "16"), (405, "17/C"),
    ]
    for suffix, ctype in page10_left:
        add_municipal_to_ctype(mapping, str(suffix), ctype)

    return mapping


def build_ctype_to_municipal() -> dict[str, str]:
    mapping: dict[str, str] = {}

    page1_right = [
        ("1/C", "384"), ("2", "385"), ("3", "386"), ("4", "387"), ("5", "388"),
        ("6", "389"), ("7", "390"), ("8", "391"), ("9", "392"), ("10", "393"),
        ("11", "394"), ("12", "395"), ("13", "401"), ("14", "402"), ("15", "403"),
        ("16", "404"), ("17/C", "405"), ("18", "396"), ("19", "397"), ("20", "398"),
        ("21", "399"), ("22", "400"), ("23", "356"), ("24", "357"), ("25", "358"),
        ("26", "359"), ("27", "360"), ("28", "361"), ("29", "362"), ("30", "363"),
        ("31", "364"), ("32", "365"), ("33", "366"), ("34", "367"), ("35", "368"),
        ("36", "369"), ("37", "370"), ("38", "371"),
    ]
    for ctype, suffix in page1_right:
        add_ctype_to_municipal(mapping, ctype, suffix)

    page2_right = [
        "372", "373", "374", "375", "376", "377", "378", "379", "380", "381", "382",
        "383", "355", "354", "353", "352", "351", "350", "349", "348", "347", "346",
        "345", "344", "343", "342", "341", "340", "339", "338", "337", "336", "335",
        "334", "333", "332", "331", "330", "329", "328", "312",
    ]
    for i, suffix in enumerate(page2_right, start=39):
        add_ctype_to_municipal(mapping, str(i), suffix)

    page3_right = (
        [str(n) for n in range(313, 328)]
        + [str(n) for n in range(311, 285, -1)]
    )
    for i, suffix in enumerate(page3_right, start=80):
        add_ctype_to_municipal(mapping, str(i), suffix)

    page4_right = (
        [str(n) for n in range(285, 261, -1)]
        + [str(n) for n in range(223, 206, -1)]
    )
    for i, suffix in enumerate(page4_right, start=121):
        add_ctype_to_municipal(mapping, str(i), suffix)

    page5_right = (
        [str(n) for n in range(206, 197, -1)]
        + [str(n) for n in range(185, 194)]
        + [str(n) for n in range(194, 198)]
        + ["174"]
        + [str(n) for n in range(175, 180)]
        + [str(n) for n in range(180, 184)]
        + ["184", "159", "160", "161", "162", "163", "164", "165", "166"]
    )
    for i, suffix in enumerate(page5_right, start=162):
        add_ctype_to_municipal(mapping, str(i), suffix)

    page6_right = (
        [str(n) for n in range(167, 174)]
        + [str(n) for n in range(114, 127)]
        + [str(n) for n in range(94, 114)]
        + ["62"]
    )
    for i, suffix in enumerate(page6_right, start=203):
        add_ctype_to_municipal(mapping, str(i), suffix)

    page7_right = (
        ["61", "60", "78"]
        + [str(n) for n in range(77, 63, -1)]
        + ["93"]
        + [str(n) for n in range(92, 78, -1)]
        + ["142"]
        + [str(n) for n in range(141, 134, -1)]
    )
    for i, suffix in enumerate(page7_right, start=244):
        add_ctype_to_municipal(mapping, str(i), suffix)

    page8_right = (
        [str(n) for n in range(133, 126, -1)]
        + [str(n) for n in range(158, 142, -1)]
        + ["224"]
        + [str(n) for n in range(225, 242)]
    )
    for i, suffix in enumerate(page8_right, start=285):
        add_ctype_to_municipal(mapping, str(i), suffix)

    page9_right = (
        [str(n) for n in range(242, 262)]
        + [str(n) for n in range(52, 41, -1)]
    )
    for i, suffix in enumerate(page9_right, start=326):
        add_ctype_to_municipal(mapping, str(i), suffix)

    page10_right = [
        (367, "43"), (368, "93/1"), (369, "93/2"), (370, "93/3"), (371, "93/4"),
        (372, "93/5A"), (373, "93/5B"), (374, "208/1"), (375, "208/2"),
        (376, "208/3"), (377, "208/4"),
    ]
    for ctype, suffix in page10_right:
        add_ctype_to_municipal(mapping, str(ctype), suffix)

    return mapping


def main() -> None:
    municipal_to_ctype = build_municipal_to_ctype()
    ctype_to_municipal = build_ctype_to_municipal()

    out_dir = Path(__file__).resolve().parents[1] / "src" / "data"
    out_dir.mkdir(parents=True, exist_ok=True)

    payload = {
        "meta": {
            "title": "APHB C-Type Colony House Number Converter",
            "location": "Sanjeeva Reddy Nagar Colony",
            "prefix": PREFIX,
            "municipalCount": len(municipal_to_ctype),
            "ctypeCount": len(ctype_to_municipal),
        },
        "municipalToCtype": dict(sorted(municipal_to_ctype.items())),
        "ctypeToMunicipal": dict(sorted(ctype_to_municipal.items(), key=lambda item: (
            int(item[0].split("/")[0]) if item[0].split("/")[0].isdigit() else 9999,
            item[0],
        ))),
    }

    out_file = out_dir / "mappings.json"
    out_file.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(
        f"Wrote {payload['meta']['municipalCount']} municipal mappings and "
        f"{payload['meta']['ctypeCount']} C-type mappings to {out_file}"
    )


if __name__ == "__main__":
    main()
