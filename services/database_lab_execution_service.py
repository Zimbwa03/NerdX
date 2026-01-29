"""
Database Lab - SQL Execution Service

Runs user SQL in an isolated in-memory SQLite database per request.
Supports: CREATE TABLE, DROP TABLE, INSERT, UPDATE, DELETE, SELECT.
Returns columns + rows for SELECT; row count / message for other statements.
"""

import sqlite3
import re
import logging
from typing import List, Optional, Tuple, Any

logger = logging.getLogger(__name__)

# Allowed statement types (case-insensitive). Block ATTACH, system tables, etc.
ALLOWED_KEYWORDS = {
    "select", "insert", "update", "delete",
    "create", "drop", "table", "index", "view",
    "into", "values", "set", "from", "where", "order", "by",
    "group", "having", "join", "left", "right", "inner", "outer",
    "primary", "key", "foreign", "references", "unique", "not", "null",
    "integer", "text", "real", "blob", "numeric", "boolean", "date", "datetime",
    "and", "or", "as", "on", "limit", "offset", "asc", "desc",
    "count", "sum", "avg", "min", "max",
}
BLOCKED_PATTERNS = [
    r"\battach\s+database\b",
    r"\bdetach\s+database\b",
    r"\bpragma\b",
    r"\bsqlite_\w+\b",
    r"\.(read|output|dump)\s",
    r"\bexec\s*\(\s*[\'\"]",
    r";\s*\.\s*",
]
MAX_STATEMENTS = 20
DEFAULT_TIMEOUT_SECONDS = 5


class DatabaseLabExecutionService:
    """Execute SQL in an in-memory SQLite sandbox for the Database Lab."""

    def __init__(self, timeout_seconds: int = DEFAULT_TIMEOUT_SECONDS) -> None:
        self.timeout_seconds = timeout_seconds

    def execute(self, sql: str) -> dict:
        """
        Run SQL in a fresh in-memory SQLite DB. Returns:
        - For SELECT: { columns: string[], rows: any[][] }
        - For other statements: { message: string, rowsAffected?: number }
        - On error: { error: string }
        """
        sql = (sql or "").strip()
        if not sql:
            return {"error": "No SQL provided."}

        self._validate_sql_safety(sql)

        try:
            conn = sqlite3.connect(":memory:", timeout=float(self.timeout_seconds))
            conn.row_factory = sqlite3.Row
            conn.execute("PRAGMA busy_timeout = {}".format(int(self.timeout_seconds * 1000)))

            # Split on semicolon but keep statements that are not empty
            statements = [
                s.strip() for s in re.split(r";\s*(?=(?:[^'\"]|'[^']*'|\"[^\"]*\")*$)", sql)
                if s.strip()
            ]
            if len(statements) > MAX_STATEMENTS:
                conn.close()
                return {"error": f"Too many statements (max {MAX_STATEMENTS})."}

            last_columns: Optional[List[str]] = None
            last_rows: Optional[List[List[Any]]] = None
            last_rowcount = 0

            for stmt in statements:
                stmt = stmt.strip()
                if not stmt or stmt.startswith("--") or stmt.startswith("/*"):
                    continue
                stmt_upper = stmt.upper()
                if stmt_upper.startswith("SELECT"):
                    cur = conn.execute(stmt)
                    rows_raw = cur.fetchall()
                    last_columns = [d[0] for d in cur.description] if cur.description else []
                    last_rows = [[r[c] for c in range(len(last_columns))] for r in rows_raw]
                    last_rowcount = len(rows_raw)
                else:
                    cur = conn.execute(stmt)
                    last_rowcount = cur.rowcount
                    last_columns = None
                    last_rows = None

            conn.close()

            if last_columns is not None and last_rows is not None:
                return {"columns": last_columns, "rows": last_rows}
            return {"message": _message_for_rowcount(last_rowcount), "rowsAffected": last_rowcount}

        except sqlite3.OperationalError as e:
            logger.warning("Database Lab SQL operational error: %s", e)
            return {"error": str(e)}
        except sqlite3.IntegrityError as e:
            logger.warning("Database Lab SQL integrity error: %s", e)
            return {"error": str(e)}
        except Exception as e:
            logger.exception("Database Lab SQL execution error: %s", e)
            return {"error": str(e)}

    def _validate_sql_safety(self, sql: str) -> None:
        """Raise ValueError if SQL contains disallowed constructs."""
        normalized = " " + sql.upper().replace("\n", " ").replace("\r", " ") + " "
        for pattern in BLOCKED_PATTERNS:
            if re.search(pattern, normalized, re.IGNORECASE):
                raise ValueError("This SQL statement is not allowed in the Database Lab.")
        # Optional: allow only known keywords to reduce injection surface
        # For now we only block dangerous patterns above.


def _message_for_rowcount(n: int) -> str:
    if n < 0:
        return "Done."
    if n == 0:
        return "0 rows affected."
    if n == 1:
        return "1 row affected."
    return f"{n} rows affected."


database_lab_execution_service = DatabaseLabExecutionService()
