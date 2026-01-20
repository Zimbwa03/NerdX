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


# ============================================
# MATHEMATICS VIRTUAL LAB SCENES
# ============================================

class DerivativeScene(Scene):
    """
    Demonstrates the derivative as a tangent line that moves along a curve.
    Shows f(x) and its derivative f'(x) with animated tangent.
    
    Environment variables:
    - MANIM_EXPR: Expression for f(x), default "x**2"
    - MANIM_X_POS: X position for tangent point, default 1.0
    """
    def construct(self):
        expr_str = os.environ.get("MANIM_EXPR", "x**2")
        x_pos = _env_float("MANIM_X_POS", 1.0)
        
        # Create axes
        axes = Axes(
            x_range=[-4, 4, 1],
            y_range=[-2, 8, 1],
            axis_config={"color": BLUE},
            tips=False,
        )
        
        # Parse expression and compute derivative
        x = sp.Symbol("x")
        expr = sp.sympify(expr_str)
        derivative = sp.diff(expr, x)
        
        f = sp.lambdify(x, expr, modules=["numpy"])
        f_prime = sp.lambdify(x, derivative, modules=["numpy"])
        
        # Plot main function
        func_graph = axes.plot(lambda t: float(f(t)), color=BLUE, x_range=[-3.5, 3.5])
        
        # Compute tangent at x_pos
        y_val = float(f(x_pos))
        slope = float(f_prime(x_pos))
        
        # Tangent line: y - y_val = slope * (x - x_pos)
        tangent_length = 2
        x1, x2 = x_pos - tangent_length, x_pos + tangent_length
        y1, y2 = y_val - slope * tangent_length, y_val + slope * tangent_length
        
        tangent_line = axes.plot(
            lambda t: y_val + slope * (t - x_pos),
            color=GREEN,
            x_range=[x1, x2]
        )
        
        # Point on curve
        point = Dot(axes.c2p(x_pos, y_val), color=RED, radius=0.1)
        
        # Labels
        func_label = Text(f"f(x) = {expr_str}", font_size=20, color=BLUE).to_corner(UL)
        deriv_label = Text(f"f'(x) = {str(derivative)}", font_size=20, color=GREEN).next_to(func_label, DOWN, aligned_edge=LEFT)
        slope_label = Text(f"Slope at x={_fmt_num(x_pos)}: {_fmt_num(slope)}", font_size=18, color=RED).next_to(deriv_label, DOWN, aligned_edge=LEFT)
        
        # Animation
        self.play(Create(axes))
        self.play(Create(func_graph), Write(func_label))
        self.wait(0.5)
        self.play(Create(point), Write(deriv_label))
        self.play(Create(tangent_line), Write(slope_label))
        self.wait(2)


class IntegralScene(Scene):
    """
    Visualizes the definite integral as area under curve using Riemann rectangles.
    Animates rectangles from few to many to show limit process.
    
    Environment variables:
    - MANIM_EXPR: Expression for f(x), default "x**2"
    - MANIM_A: Lower bound, default 0
    - MANIM_B: Upper bound, default 2
    - MANIM_N: Number of rectangles, default 10
    """
    def construct(self):
        expr_str = os.environ.get("MANIM_EXPR", "x**2")
        a = _env_float("MANIM_A", 0)
        b = _env_float("MANIM_B", 2)
        n = int(_env_float("MANIM_N", 10))
        
        # Create axes
        axes = Axes(
            x_range=[-1, 4, 1],
            y_range=[-1, 8, 1],
            axis_config={"color": BLUE},
            tips=False,
        )
        
        # Parse expression
        x = sp.Symbol("x")
        expr = sp.sympify(expr_str)
        f = sp.lambdify(x, expr, modules=["numpy"])
        
        # Compute exact integral
        exact = float(sp.integrate(expr, (x, a, b)))
        
        # Plot function
        func_graph = axes.plot(lambda t: float(f(t)), color=BLUE, x_range=[-0.5, 3.5])
        
        # Create Riemann rectangles
        dx = (b - a) / n
        rectangles = VGroup()
        riemann_sum = 0
        
        for i in range(n):
            x_left = a + i * dx
            height = float(f(x_left))
            riemann_sum += height * dx
            
            rect = Rectangle(
                width=dx * axes.x_length / (axes.x_range[1] - axes.x_range[0]),
                height=abs(height) * axes.y_length / (axes.y_range[1] - axes.y_range[0]),
                fill_color=BLUE,
                fill_opacity=0.3,
                stroke_color=WHITE,
                stroke_width=1,
            )
            rect.move_to(axes.c2p(x_left + dx/2, height/2))
            rectangles.add(rect)
        
        # Labels
        func_label = Text(f"f(x) = {expr_str}", font_size=20, color=BLUE).to_corner(UL)
        integral_label = Text(f"∫ from {_fmt_num(a)} to {_fmt_num(b)}", font_size=18).next_to(func_label, DOWN, aligned_edge=LEFT)
        approx_label = Text(f"Riemann Sum ≈ {_fmt_num(riemann_sum)}", font_size=18, color=GREEN).next_to(integral_label, DOWN, aligned_edge=LEFT)
        exact_label = Text(f"Exact = {_fmt_num(exact)}", font_size=18, color=YELLOW).next_to(approx_label, DOWN, aligned_edge=LEFT)
        
        # Animation
        self.play(Create(axes))
        self.play(Create(func_graph), Write(func_label))
        self.wait(0.5)
        self.play(Write(integral_label))
        self.play(LaggedStartMap(Create, rectangles, lag_ratio=0.1))
        self.play(Write(approx_label), Write(exact_label))
        self.wait(2)


class ComplexScene(Scene):
    """
    Visualizes complex numbers on the Argand plane.
    Shows a complex number, its modulus, and argument.
    Can animate multiplication by i (90° rotation).
    
    Environment variables:
    - MANIM_REAL: Real part, default 3
    - MANIM_IMAG: Imaginary part, default 2
    - MANIM_ANIMATE_I: If "true", animate multiplication by i
    """
    def construct(self):
        real = _env_float("MANIM_REAL", 3)
        imag = _env_float("MANIM_IMAG", 2)
        animate_i = os.environ.get("MANIM_ANIMATE_I", "false").lower() == "true"
        
        # Create Argand plane
        plane = NumberPlane(
            x_range=[-5, 5, 1],
            y_range=[-5, 5, 1],
            background_line_style={"stroke_opacity": 0.3},
        )
        
        # Calculate modulus and argument
        modulus = math.sqrt(real**2 + imag**2)
        argument = math.atan2(imag, real)
        argument_deg = math.degrees(argument)
        
        # Vector to complex number
        z_point = plane.c2p(real, imag)
        origin = plane.c2p(0, 0)
        
        z_vector = Arrow(origin, z_point, color=RED, buff=0)
        z_dot = Dot(z_point, color=RED, radius=0.1)
        
        # Modulus line (from origin)
        modulus_line = DashedLine(origin, z_point, color=GREEN)
        
        # Labels
        z_label = Text(f"z = {_fmt_num(real)} + {_fmt_num(imag)}i", font_size=20, color=RED).to_corner(UL)
        mod_label = Text(f"|z| = {_fmt_num(modulus)}", font_size=18, color=GREEN).next_to(z_label, DOWN, aligned_edge=LEFT)
        arg_label = Text(f"arg(z) = {_fmt_num(argument_deg)}°", font_size=18, color=YELLOW).next_to(mod_label, DOWN, aligned_edge=LEFT)
        
        # Real axis label
        re_label = Text("Re", font_size=18).move_to(plane.c2p(4.5, -0.5))
        im_label = Text("Im", font_size=18).move_to(plane.c2p(-0.5, 4.5))
        
        # Animation
        self.play(Create(plane), Write(re_label), Write(im_label))
        self.play(Create(z_vector), Create(z_dot))
        self.play(Write(z_label), Write(mod_label), Write(arg_label))
        self.wait(1)
        
        if animate_i:
            # Multiply by i: (a + bi) * i = -b + ai
            # This is a 90° counterclockwise rotation
            new_real, new_imag = -imag, real
            new_point = plane.c2p(new_real, new_imag)
            new_vector = Arrow(origin, new_point, color=BLUE, buff=0)
            new_dot = Dot(new_point, color=BLUE, radius=0.1)
            
            mult_label = Text("× i (rotate 90°)", font_size=20, color=BLUE).next_to(arg_label, DOWN, aligned_edge=LEFT)
            new_z_label = Text(f"z·i = {_fmt_num(new_real)} + {_fmt_num(new_imag)}i", font_size=18, color=BLUE).next_to(mult_label, DOWN, aligned_edge=LEFT)
            
            self.play(Write(mult_label))
            self.play(
                ReplacementTransform(z_vector.copy(), new_vector),
                ReplacementTransform(z_dot.copy(), new_dot),
                Write(new_z_label),
                run_time=1.5
            )
            self.wait(1)
        
        self.wait(2)


class UnitCircleScene(Scene):
    """
    Visualizes the unit circle with sine and cosine.
    Animates a point moving around the circle showing sin/cos values.
    
    Environment variables:
    - MANIM_ANGLE: Starting angle in radians, default PI/4
    - MANIM_ANIMATE: If "true", animate the point around the circle
    """
    def construct(self):
        angle = _env_float("MANIM_ANGLE", math.pi / 4)
        animate = os.environ.get("MANIM_ANIMATE", "false").lower() == "true"
        
        # Create coordinate system
        plane = NumberPlane(
            x_range=[-2, 2, 0.5],
            y_range=[-2, 2, 0.5],
            background_line_style={"stroke_opacity": 0.2},
        )
        
        # Unit circle
        circle = Circle(radius=1, color=BLUE)
        circle.move_to(plane.c2p(0, 0))
        
        # Point on circle
        def get_point(theta):
            return plane.c2p(math.cos(theta), math.sin(theta))
        
        point = Dot(get_point(angle), color=RED, radius=0.1)
        
        # Sine and cosine lines
        cos_line = DashedLine(
            plane.c2p(0, 0),
            plane.c2p(math.cos(angle), 0),
            color=GREEN
        )
        sin_line = DashedLine(
            plane.c2p(math.cos(angle), 0),
            get_point(angle),
            color=ORANGE
        )
        
        # Radius line
        radius = Line(plane.c2p(0, 0), get_point(angle), color=WHITE)
        
        # Labels
        cos_val = math.cos(angle)
        sin_val = math.sin(angle)
        angle_deg = math.degrees(angle)
        
        title = Text("Unit Circle", font_size=24).to_corner(UL)
        angle_label = Text(f"θ = {_fmt_num(angle_deg)}°", font_size=18).next_to(title, DOWN, aligned_edge=LEFT)
        cos_label = Text(f"cos(θ) = {_fmt_num(cos_val)}", font_size=16, color=GREEN).next_to(angle_label, DOWN, aligned_edge=LEFT)
        sin_label = Text(f"sin(θ) = {_fmt_num(sin_val)}", font_size=16, color=ORANGE).next_to(cos_label, DOWN, aligned_edge=LEFT)
        
        # Animation
        self.play(Create(plane))
        self.play(Create(circle))
        self.play(Create(radius), Create(point))
        self.play(Create(cos_line), Create(sin_line))
        self.play(Write(title), Write(angle_label), Write(cos_label), Write(sin_label))
        
        if animate:
            # Animate point around circle
            tracker = ValueTracker(angle)
            
            point.add_updater(
                lambda m: m.move_to(get_point(tracker.get_value()))
            )
            radius.add_updater(
                lambda m: m.put_start_and_end_on(
                    plane.c2p(0, 0),
                    get_point(tracker.get_value())
                )
            )
            
            self.play(tracker.animate.set_value(angle + 2 * math.pi), run_time=4, rate_func=linear)
            point.clear_updaters()
            radius.clear_updaters()
        
        self.wait(2)
