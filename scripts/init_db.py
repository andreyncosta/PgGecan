"""Create gecan.db from db/schema.sql (idempotent)."""

from __future__ import annotations

import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "gecan.db"
SCHEMA = ROOT / "db" / "schema.sql"


def main() -> int:
    if not SCHEMA.is_file():
        print(f"Missing {SCHEMA}", file=sys.stderr)
        return 1
    sql = SCHEMA.read_text(encoding="utf-8")
    conn = sqlite3.connect(DB_PATH)
    try:
        conn.executescript(sql)
        conn.commit()
    finally:
        conn.close()
    print(f"OK: {DB_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
