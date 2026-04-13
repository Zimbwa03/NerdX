"""Utilities for credit units (1 credit = 10 units)."""

CREDIT_UNITS_PER_CREDIT = 10


def credits_to_units(credits: float) -> int:
    """Convert credits (can be fractional) to integer units."""
    return int(round(credits * CREDIT_UNITS_PER_CREDIT))


def units_to_credits(units: int) -> float:
    """Convert integer units to credits (can be fractional)."""
    return units / CREDIT_UNITS_PER_CREDIT


def format_credits(units: int) -> str:
    """Format units as a credit string without trailing zeros."""
    credits = units_to_credits(units)
    if credits.is_integer():
        return str(int(credits))
    return f"{credits:.1f}".rstrip("0").rstrip(".")
