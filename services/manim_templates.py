from manim import *
import sys
import os
import shutil
import math
import numpy as np
import sympy as sp

# Basic configuration
config.media_width = "75%"
config.verbosity = "WARNING"

# Check for LaTeX
HAS_LATEX = shutil.which('latex') is not None or shutil.which('pdflatex') is not None

# LaTeX on Windows can be flaky (file locks). Prefer non-LaTeX labels for reliability.
USE_LATEX = HAS_LATEX and sys.platform != "win32" and os.environ.get("MANIM_FORCE_NO_LATEX", "false").lower() != "true"

def _env_float(name: str, default: float) -> float:
    try:
        v = os.environ.get(name)
        if v is None or v == "None" or v == "":
            return default
        return float(v)
    except Exception:
        return default

def _build_axes() -> Axes:
    """
    Build axes based on env vars so the animation matches the Matplotlib image.
    Defaults match the old hardcoded values if env vars are missing.
    """
    x_min = _env_float("MANIM_X_MIN", -10.0)
    x_max = _env_float("MANIM_X_MAX", 10.0)
    x_step = _env_float("MANIM_X_STEP", 1.0)

    y_min = _env_float("MANIM_Y_MIN", -10.0)
    y_max = _env_float("MANIM_Y_MAX", 10.0)
    y_step = _env_float("MANIM_Y_STEP", 1.0)

    # Guard against invalid ranges
    if x_max <= x_min:
        x_min, x_max = -10.0, 10.0
    if y_max <= y_min:
        y_min, y_max = -10.0, 10.0

    return Axes(
        x_range=[x_min, x_max, x_step],
        y_range=[y_min, y_max, y_step],
        axis_config={"color": BLUE},
        tips=False,
    )

def _fmt_num(v: float) -> str:
    # Pretty formatting: 1.0 -> 1, -0.0 -> 0
    if abs(v) < 1e-9:
        v = 0.0
    if float(int(v)) == float(v):
        return str(int(v))
    return f"{v:.3g}"

def _safe_lambdify(expr_str: str):
    """
    Build a numpy-safe function f(x) from a cleaned expression string.
    The expression should already be cleaned by GraphService._clean_expression
    (e.g., '^' -> '**', implicit multiplication expanded, etc.).
    """
    x = sp.Symbol("x")
    expr = sp.sympify(expr_str)
    f = sp.lambdify(x, expr, modules=["numpy"])

    def wrapper(t: float) -> float:
        try:
            y = f(t)
            # Normalize numpy scalars/arrays to float
            if isinstance(y, (np.ndarray,)):
                if y.size == 0:
                    return float("nan")
                y = y.item()
            y = float(y)
            if math.isfinite(y):
                return y
            return float("nan")
        except Exception:
            return float("nan")

    return wrapper

class QuadraticScene(Scene):
    """
    Renders a quadratic function y = ax^2 + bx + c
    """
    def construct(self):
        a = float(os.environ.get('MANIM_A', 1))
        b = float(os.environ.get('MANIM_B', 0))
        c = float(os.environ.get('MANIM_C', 0))

        axes = _build_axes()
        
        # Manually create labels to avoid LaTeX dependency if needed
        x_label = Text("x", font_size=24).next_to(axes.x_axis.get_end(), RIGHT)
        y_label = Text("y", font_size=24).next_to(axes.y_axis.get_end(), UP)
        axes_labels = VGroup(x_label, y_label)
        label_text = Text(f"y = {_fmt_num(a)}x^2 + {_fmt_num(b)}x + {_fmt_num(c)}", font_size=24)

        # Match Matplotlib default styling (blue curve)
        func = axes.plot(lambda x: a*x**2 + b*x + c, color=BLUE)
        label_text.next_to(func, UP)
            
        self.play(Create(axes), Write(axes_labels))
        self.play(Create(func), Write(label_text))
        self.wait(2)

class LinearScene(Scene):
    """
    Renders a linear function y = mx + c
    """
    def construct(self):
        m = float(os.environ.get('MANIM_M', 1))
        c = float(os.environ.get('MANIM_C', 0))

        axes = _build_axes()
        
        x_label = Text("x", font_size=24).next_to(axes.x_axis.get_end(), RIGHT)
        y_label = Text("y", font_size=24).next_to(axes.y_axis.get_end(), UP)
        axes_labels = VGroup(x_label, y_label)
        label_text = Text(f"y = {_fmt_num(m)}x + {_fmt_num(c)}", font_size=24)
        
        # Match Matplotlib default styling (blue curve)
        func = axes.plot(lambda x: m*x + c, color=BLUE)
        label_text.next_to(func, UP)
            
        self.play(Create(axes), Write(axes_labels))
        self.play(Create(func), Write(label_text))
        self.wait(2)

class ExpressionScene(Scene):
    """
    Renders an arbitrary function y = f(x) from MANIM_EXPR using SymPy->lambdify.
    Used for trigonometric/exponential (and other) graphs where coefficients aren't fixed.
    """
    def construct(self):
        expr = os.environ.get("MANIM_EXPR", "sin(x)")
        axes = _build_axes()

        # Labels (avoid LaTeX for reliability)
        x_label = Text("x", font_size=24).next_to(axes.x_axis.get_end(), RIGHT)
        y_label = Text("y", font_size=24).next_to(axes.y_axis.get_end(), UP)
        axes_labels = VGroup(x_label, y_label)
        label_text = Text("y = f(x)", font_size=24)

        f = _safe_lambdify(expr)
        func = axes.plot(lambda t: f(t), color=BLUE)
        label_text.to_corner(UL)

        self.play(Create(axes), Write(axes_labels))
        self.play(Create(func), Write(label_text))
        self.wait(2)
