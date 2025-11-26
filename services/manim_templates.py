from manim import *
import sys
import os
import shutil

# Basic configuration
config.media_width = "75%"
config.verbosity = "WARNING"

# Check for LaTeX
HAS_LATEX = shutil.which('latex') is not None or shutil.which('pdflatex') is not None

class QuadraticScene(Scene):
    """
    Renders a quadratic function y = ax^2 + bx + c
    """
    def construct(self):
        a = float(os.environ.get('MANIM_A', 1))
        b = float(os.environ.get('MANIM_B', 0))
        c = float(os.environ.get('MANIM_C', 0))
        
        axes = Axes(
            x_range=[-5, 5, 1],
            y_range=[-5, 15, 5],
            axis_config={"color": BLUE},
        )
        
        # Manually create labels to avoid LaTeX dependency if needed
        if HAS_LATEX:
            axes_labels = axes.get_axis_labels(x_label="x", y_label="y")
            label_text = MathTex(f"y = {a}x^2 + {b}x + {c}")
        else:
            x_label = Text("x", font_size=24).next_to(axes.x_axis.get_end(), RIGHT)
            y_label = Text("y", font_size=24).next_to(axes.y_axis.get_end(), UP)
            axes_labels = VGroup(x_label, y_label)
            label_text = Text(f"y = {a}x^2 + {b}x + {c}", font_size=24)

        func = axes.plot(lambda x: a*x**2 + b*x + c, color=RED)
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
        
        axes = Axes(x_range=[-5, 5], y_range=[-5, 5])
        
        if HAS_LATEX:
            axes_labels = axes.get_axis_labels()
            label_text = MathTex(f"y = {m}x + {c}")
        else:
            x_label = Text("x", font_size=24).next_to(axes.x_axis.get_end(), RIGHT)
            y_label = Text("y", font_size=24).next_to(axes.y_axis.get_end(), UP)
            axes_labels = VGroup(x_label, y_label)
            label_text = Text(f"y = {m}x + {c}", font_size=24)
        
        func = axes.plot(lambda x: m*x + c, color=YELLOW)
        label_text.next_to(func, UP)
            
        self.play(Create(axes), Write(axes_labels))
        self.play(Create(func), Write(label_text))
        self.wait(2)
