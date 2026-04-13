#!/usr/bin/env python3
"""
Manim scenes for Physics diagrams - O-Level and A-Level
Covers: Ray diagrams, Circuits, Waves, Forces, Magnetic fields, Pendulum
"""

import os
from manim import *
import numpy as np

# Disable LaTeX for cross-platform compatibility
config.tex_template = None


class RayDiagramConvexLensScene(Scene):
    """Ray diagram for convex (converging) lens"""

    def construct(self):
        title = Text("Ray Diagram: Convex Lens", font_size=32, color=BLUE).to_edge(UP)

        # Principal axis
        axis = Line(LEFT * 6, RIGHT * 6, color=WHITE, stroke_width=1)

        # Lens (convex - thicker in middle)
        lens = Ellipse(width=0.4, height=3, color=BLUE, stroke_width=3)

        # Focal points
        f_left = Dot(color=YELLOW, radius=0.08).move_to(LEFT * 2)
        f_right = Dot(color=YELLOW, radius=0.08).move_to(RIGHT * 2)
        f_label_left = Text("F", font_size=12, color=YELLOW).next_to(f_left, DOWN)
        f_label_right = Text("F", font_size=12, color=YELLOW).next_to(f_right, DOWN)

        # 2F points
        f2_left = Dot(color=ORANGE, radius=0.06).move_to(LEFT * 4)
        f2_right = Dot(color=ORANGE, radius=0.06).move_to(RIGHT * 4)
        f2_label_left = Text("2F", font_size=10, color=ORANGE).next_to(f2_left, DOWN)
        f2_label_right = Text("2F", font_size=10, color=ORANGE).next_to(f2_right, DOWN)

        # Object (arrow beyond 2F)
        object_pos = LEFT * 5
        obj = Arrow(object_pos, object_pos + UP * 1.2, color=GREEN, stroke_width=4)
        obj_label = Text("Object", font_size=11, color=GREEN).next_to(obj, UP)

        # Ray 1: Parallel to axis, then through F
        ray1_a = Line(obj.get_top(), lens.get_center() + UP * 1.2, color=RED, stroke_width=2)
        ray1_b = Line(
            lens.get_center() + UP * 1.2,
            RIGHT * 6 + DOWN * 2.5,
            color=RED,
            stroke_width=2,
        )

        # Ray 2: Through optical center (straight through)
        ray2 = Line(obj.get_top(), RIGHT * 6 + DOWN * 0.4, color=PURPLE, stroke_width=2)

        # Ray 3: Through F on left, then parallel
        ray3_a = Line(obj.get_top(), f_left.get_center() + UP * 0.6, color=ORANGE, stroke_width=2)
        ray3_b = Line(
            f_left.get_center() + UP * 0.6,
            lens.get_center() + UP * 0.6,
            color=ORANGE,
            stroke_width=2,
        )
        ray3_c = Line(
            lens.get_center() + UP * 0.6,
            RIGHT * 6 + UP * 0.6,
            color=ORANGE,
            stroke_width=2,
        )

        # Image (inverted, between F and 2F)
        image_pos = RIGHT * 3
        image = Arrow(
            image_pos + DOWN * 0.8, image_pos, color=TEAL, stroke_width=4
        )
        image_label = Text("Image\n(real, inverted)", font_size=10, color=TEAL).next_to(
            image, DOWN
        )

        # Key
        key = VGroup(
            Text("Object beyond 2F → Image between F and 2F", font_size=11),
            Text("Real, inverted, diminished", font_size=11),
        ).arrange(DOWN, aligned_edge=LEFT).to_corner(DL)

        # Animate
        self.play(Write(title))
        self.play(Create(axis), Create(lens))
        self.play(
            FadeIn(f_left),
            FadeIn(f_right),
            FadeIn(f_label_left),
            FadeIn(f_label_right),
        )
        self.play(
            FadeIn(f2_left),
            FadeIn(f2_right),
            FadeIn(f2_label_left),
            FadeIn(f2_label_right),
        )
        self.play(Create(obj), FadeIn(obj_label))
        self.play(Create(ray1_a), Create(ray1_b))
        self.play(Create(ray2))
        self.play(Create(ray3_a), Create(ray3_b), Create(ray3_c))
        self.play(Create(image), FadeIn(image_label))
        self.play(FadeIn(key))
        self.wait(2)


class CircuitDiagramScene(Scene):
    """Basic electric circuit diagram"""

    def construct(self):
        title = Text("Electric Circuit", font_size=32, color=YELLOW).to_edge(UP)

        # Battery (cell symbol)
        battery_pos = LEFT * 4
        battery = VGroup(
            Line(battery_pos + UP * 0.5, battery_pos + DOWN * 0.5, color=RED, stroke_width=4),
            Line(
                battery_pos + RIGHT * 0.15 + UP * 0.3,
                battery_pos + RIGHT * 0.15 + DOWN * 0.3,
                color=RED,
                stroke_width=2,
            ),
        )
        battery_plus = Text("+", font_size=12, color=RED).next_to(battery, UP)
        battery_minus = Text("−", font_size=12, color=BLUE).next_to(battery, DOWN)

        # Resistor (zigzag)
        resistor_pos = RIGHT * 2
        resistor_points = [
            resistor_pos + LEFT * 0.6,
            resistor_pos + LEFT * 0.4 + UP * 0.2,
            resistor_pos + LEFT * 0.2 + DOWN * 0.2,
            resistor_pos + UP * 0.2,
            resistor_pos + RIGHT * 0.2 + DOWN * 0.2,
            resistor_pos + RIGHT * 0.4 + UP * 0.2,
            resistor_pos + RIGHT * 0.6,
        ]
        resistor = VMobject(color=ORANGE, stroke_width=3)
        resistor.set_points_as_corners(resistor_points)
        resistor_label = Text("R", font_size=14, color=ORANGE).next_to(resistor, UP)

        # Bulb (circle with X)
        bulb_pos = RIGHT * 2 + DOWN * 2
        bulb = VGroup(
            Circle(radius=0.3, color=YELLOW, stroke_width=2).move_to(bulb_pos),
            Line(
                bulb_pos + LEFT * 0.2 + UP * 0.2,
                bulb_pos + RIGHT * 0.2 + DOWN * 0.2,
                color=YELLOW,
                stroke_width=2,
            ),
            Line(
                bulb_pos + RIGHT * 0.2 + UP * 0.2,
                bulb_pos + LEFT * 0.2 + DOWN * 0.2,
                color=YELLOW,
                stroke_width=2,
            ),
        )
        bulb_label = Text("Bulb", font_size=11, color=YELLOW).next_to(bulb, DOWN)

        # Switch (open)
        switch_pos = LEFT * 2 + DOWN * 2
        switch = VGroup(
            Dot(color=WHITE, radius=0.08).move_to(switch_pos + LEFT * 0.3),
            Dot(color=WHITE, radius=0.08).move_to(switch_pos + RIGHT * 0.3),
            Line(
                switch_pos + LEFT * 0.3,
                switch_pos + RIGHT * 0.2 + UP * 0.3,
                color=WHITE,
                stroke_width=2,
            ),
        )
        switch_label = Text("Switch", font_size=11, color=WHITE).next_to(switch, DOWN)

        # Wires connecting components
        wire1 = Line(battery.get_right(), UP * 0.5 + LEFT * 2, color=GREEN, stroke_width=2)
        wire2 = Line(UP * 0.5 + LEFT * 2, resistor.get_left() + UP * 0.5, color=GREEN, stroke_width=2)
        wire3 = Line(resistor.get_left() + UP * 0.5, resistor.get_left(), color=GREEN, stroke_width=2)
        wire4 = Line(resistor.get_right(), bulb_pos + UP * 0.3, color=GREEN, stroke_width=2)
        wire5 = Line(bulb_pos + DOWN * 0.3, switch_pos + RIGHT * 0.3, color=GREEN, stroke_width=2)
        wire6 = Line(switch_pos + LEFT * 0.3, battery_pos + DOWN * 0.5, color=GREEN, stroke_width=2)

        wires = VGroup(wire1, wire2, wire3, wire4, wire5, wire6)

        # Current arrow
        current_arrow = Arrow(
            UP * 0.5 + LEFT * 1, UP * 0.5 + RIGHT * 0.5, color=BLUE, stroke_width=2
        )
        current_label = Text("Current (I)", font_size=11, color=BLUE).next_to(
            current_arrow, UP
        )

        # Key
        key = VGroup(
            Text("V = IR (Ohm's Law)", font_size=12, color=WHITE),
            Text("Current flows from + to − (conventional)", font_size=11),
        ).arrange(DOWN, aligned_edge=LEFT).to_corner(DL)

        # Animate
        self.play(Write(title))
        self.play(Create(battery), FadeIn(battery_plus), FadeIn(battery_minus))
        self.play(Create(resistor), FadeIn(resistor_label))
        self.play(Create(bulb), FadeIn(bulb_label))
        self.play(Create(switch), FadeIn(switch_label))
        self.play(Create(wires))
        self.play(Create(current_arrow), FadeIn(current_label))
        self.play(FadeIn(key))
        self.wait(2)


class WavePropertiesScene(Scene):
    """Wave properties: amplitude, wavelength, frequency"""

    def construct(self):
        title = Text("Wave Properties", font_size=32, color=PURPLE).to_edge(UP)

        # Create axes
        axes = Axes(
            x_range=[0, 4 * PI, PI],
            y_range=[-2, 2, 1],
            x_length=10,
            y_length=4,
            axis_config={"include_tip": True, "color": WHITE},
        )

        # Wave function
        wave = axes.plot(lambda x: np.sin(x), color=BLUE, stroke_width=3)

        # Wavelength marking
        wavelength_start = axes.c2p(PI / 2, 1)
        wavelength_end = axes.c2p(5 * PI / 2, 1)
        wavelength_line = DoubleArrow(
            wavelength_start, wavelength_end, color=GREEN, stroke_width=3
        )
        wavelength_label = Text("Wavelength (λ)", font_size=14, color=GREEN).next_to(
            wavelength_line, UP
        )

        # Amplitude marking
        amplitude_start = axes.c2p(PI / 2, 0)
        amplitude_end = axes.c2p(PI / 2, 1)
        amplitude_line = DoubleArrow(
            amplitude_start, amplitude_end, color=RED, stroke_width=3
        )
        amplitude_label = Text("Amplitude (A)", font_size=12, color=RED).next_to(
            amplitude_line, RIGHT
        )

        # Crest and trough labels
        crest = Text("Crest", font_size=11, color=YELLOW).move_to(axes.c2p(PI / 2, 1.3))
        trough = Text("Trough", font_size=11, color=ORANGE).move_to(
            axes.c2p(3 * PI / 2, -1.3)
        )

        # Equilibrium line
        equilibrium = DashedLine(
            axes.c2p(0, 0), axes.c2p(4 * PI, 0), color=GRAY, stroke_width=1
        )
        eq_label = Text("Equilibrium", font_size=10, color=GRAY).next_to(
            equilibrium, RIGHT
        )

        # Wave equation
        equation = Text(
            "v = f × λ  (wave speed = frequency × wavelength)",
            font_size=14,
            color=WHITE,
        ).to_edge(DOWN)

        # Key properties
        properties = VGroup(
            Text("• Amplitude: Maximum displacement", font_size=11),
            Text("• Wavelength: Distance of one complete wave", font_size=11),
            Text("• Frequency: Number of waves per second (Hz)", font_size=11),
        ).arrange(DOWN, aligned_edge=LEFT).to_corner(DL)

        # Animate
        self.play(Write(title))
        self.play(Create(axes), Create(equilibrium), FadeIn(eq_label))
        self.play(Create(wave))
        self.play(Create(wavelength_line), FadeIn(wavelength_label))
        self.play(Create(amplitude_line), FadeIn(amplitude_label))
        self.play(FadeIn(crest), FadeIn(trough))
        self.play(FadeIn(properties))
        self.play(Write(equation))
        self.wait(2)


class ForceDiagramScene(Scene):
    """Force diagram with vectors"""

    def construct(self):
        title = Text("Force Diagram", font_size=32, color=RED).to_edge(UP)

        # Object (box)
        box = Square(side_length=1.5, color=BLUE, fill_opacity=0.3, stroke_width=3)
        box_label = Text("Object", font_size=12, color=WHITE).move_to(box.get_center())

        # Weight (down)
        weight = Arrow(
            box.get_bottom(),
            box.get_bottom() + DOWN * 2,
            color=GREEN,
            stroke_width=4,
        )
        weight_label = Text("Weight (W)", font_size=12, color=GREEN).next_to(
            weight, RIGHT
        )

        # Normal force (up)
        normal = Arrow(
            box.get_bottom() + LEFT * 0.1,
            box.get_bottom() + LEFT * 0.1 + UP * 2,
            color=PURPLE,
            stroke_width=4,
        )
        normal_label = Text("Normal (N)", font_size=12, color=PURPLE).next_to(
            normal, LEFT
        )

        # Applied force (right)
        applied = Arrow(
            box.get_left(),
            box.get_left() + LEFT * 2,
            color=RED,
            stroke_width=4,
        )
        applied.rotate(PI, about_point=box.get_left())
        applied = Arrow(
            box.get_left(), box.get_left() + RIGHT * 2, color=RED, stroke_width=4
        )
        applied_label = Text("Applied (F)", font_size=12, color=RED).next_to(
            applied, UP
        )

        # Friction (left)
        friction = Arrow(
            box.get_right(), box.get_right() + LEFT * 1.5, color=ORANGE, stroke_width=4
        )
        friction_label = Text("Friction (f)", font_size=12, color=ORANGE).next_to(
            friction, DOWN
        )

        # Ground
        ground = Line(LEFT * 4 + DOWN * 0.75, RIGHT * 4 + DOWN * 0.75, color=GRAY, stroke_width=2)
        ground_pattern = VGroup(
            *[
                Line(
                    LEFT * 4 + i * 0.5 + DOWN * 0.75,
                    LEFT * 4 + i * 0.5 + LEFT * 0.2 + DOWN * 1,
                    color=GRAY,
                    stroke_width=1,
                )
                for i in range(17)
            ]
        )

        # Key
        key = VGroup(
            Text("Newton's Laws:", font_size=12, color=WHITE, weight=BOLD),
            Text("• F = ma (Net force = mass × acceleration)", font_size=11),
            Text("• If ΣF = 0, object is in equilibrium", font_size=11),
        ).arrange(DOWN, aligned_edge=LEFT).to_corner(DL)

        # Animate
        self.play(Write(title))
        self.play(Create(ground), Create(ground_pattern))
        self.play(Create(box), FadeIn(box_label))
        self.play(Create(weight), FadeIn(weight_label))
        self.play(Create(normal), FadeIn(normal_label))
        self.play(Create(applied), FadeIn(applied_label))
        self.play(Create(friction), FadeIn(friction_label))
        self.play(FadeIn(key))
        self.wait(2)


class MagneticFieldScene(Scene):
    """Magnetic field lines around a bar magnet"""

    def construct(self):
        title = Text("Magnetic Field Lines", font_size=32, color=RED).to_edge(UP)

        # Bar magnet
        magnet = VGroup(
            Rectangle(width=2, height=0.8, color=RED, fill_opacity=0.6).move_to(
                LEFT * 0.5
            ),
            Rectangle(width=2, height=0.8, color=BLUE, fill_opacity=0.6).move_to(
                RIGHT * 0.5
            ),
        )
        magnet[0].shift(LEFT * 0.5)
        magnet[1].shift(RIGHT * 0.5)

        n_label = Text("N", font_size=18, color=WHITE).move_to(LEFT * 1)
        s_label = Text("S", font_size=18, color=WHITE).move_to(RIGHT * 1)

        # Field lines (curved arrows from N to S outside, S to N inside)
        field_lines = VGroup()

        # Outer field lines
        for i, offset in enumerate([0.8, 1.3, 1.8]):
            # Top field line
            arc_top = ArcBetweenPoints(
                LEFT * 2, RIGHT * 2, angle=-PI * 0.7, color=YELLOW, stroke_width=2
            ).shift(UP * offset * 0.7)
            # Bottom field line
            arc_bottom = ArcBetweenPoints(
                LEFT * 2, RIGHT * 2, angle=PI * 0.7, color=YELLOW, stroke_width=2
            ).shift(DOWN * offset * 0.7)

            field_lines.add(arc_top, arc_bottom)

        # Field direction arrows
        arrow1 = Arrow(
            LEFT * 0.5 + UP * 1.2, RIGHT * 0.5 + UP * 1.2, color=YELLOW, stroke_width=2
        )
        arrow2 = Arrow(
            RIGHT * 0.5 + DOWN * 1.2, LEFT * 0.5 + DOWN * 1.2, color=YELLOW, stroke_width=2
        )

        # Key properties
        properties = VGroup(
            Text("• Field lines go from N to S (outside magnet)", font_size=11, color=YELLOW),
            Text("• Field lines never cross", font_size=11),
            Text("• Closer lines = Stronger field", font_size=11),
            Text("• Field is strongest at the poles", font_size=11),
        ).arrange(DOWN, aligned_edge=LEFT).to_edge(DOWN)

        # Compass needles showing field direction
        compass1 = VGroup(
            Circle(radius=0.15, color=WHITE, stroke_width=1).move_to(LEFT * 3 + UP * 0.5),
            Arrow(
                LEFT * 3 + UP * 0.5 + LEFT * 0.1,
                LEFT * 3 + UP * 0.5 + RIGHT * 0.15,
                color=RED,
                stroke_width=2,
            ),
        )
        compass2 = VGroup(
            Circle(radius=0.15, color=WHITE, stroke_width=1).move_to(RIGHT * 3 + UP * 0.5),
            Arrow(
                RIGHT * 3 + UP * 0.5 + RIGHT * 0.1,
                RIGHT * 3 + UP * 0.5 + LEFT * 0.15,
                color=RED,
                stroke_width=2,
            ),
        )

        # Animate
        self.play(Write(title))
        self.play(Create(magnet[0]), Create(magnet[1]), FadeIn(n_label), FadeIn(s_label))
        self.play(Create(field_lines), run_time=2)
        self.play(Create(arrow1), Create(arrow2))
        self.play(FadeIn(compass1), FadeIn(compass2))
        self.play(FadeIn(properties))
        self.wait(2)


class PendulumScene(Scene):
    """Simple pendulum oscillation"""

    def construct(self):
        title = Text("Simple Pendulum", font_size=32, color=PURPLE).to_edge(UP)

        # Pivot point
        pivot = Dot(color=WHITE, radius=0.1).move_to(UP * 2.5)
        pivot_label = Text("Pivot", font_size=11, color=WHITE).next_to(pivot, UP)

        # Support
        support = Line(LEFT * 1 + UP * 2.7, RIGHT * 1 + UP * 2.7, color=GRAY, stroke_width=4)

        # Pendulum string
        string_length = 3
        bob_pos = pivot.get_center() + DOWN * string_length
        string = Line(pivot.get_center(), bob_pos, color=WHITE, stroke_width=2)

        # Bob
        bob = Circle(radius=0.3, color=BLUE, fill_opacity=0.8).move_to(bob_pos)
        bob_label = Text("Bob (mass m)", font_size=10, color=BLUE).next_to(bob, DOWN)

        # Equilibrium position (dashed vertical)
        equilibrium = DashedLine(
            pivot.get_center(), pivot.get_center() + DOWN * 3.5, color=GRAY, stroke_width=1
        )

        # Amplitude arc
        amplitude_arc = Arc(
            radius=3,
            start_angle=-PI / 2 - PI / 6,
            angle=PI / 3,
            color=GREEN,
            stroke_width=2,
        ).move_arc_center_to(pivot.get_center())
        amplitude_label = Text("Amplitude", font_size=11, color=GREEN).move_to(
            RIGHT * 1.5 + DOWN * 1.5
        )

        # Angle theta
        angle_arc = Arc(
            radius=0.8,
            start_angle=-PI / 2,
            angle=PI / 6,
            color=YELLOW,
            stroke_width=2,
        ).move_arc_center_to(pivot.get_center())
        theta_label = Text("θ", font_size=14, color=YELLOW).next_to(angle_arc, RIGHT)

        # Period formula
        formula = Text(
            "Period: T = 2π√(L/g)",
            font_size=16,
            color=WHITE,
        ).to_edge(DOWN)

        # Key properties
        properties = VGroup(
            Text("• Period depends only on length and gravity", font_size=11),
            Text("• Independent of mass and amplitude (small angles)", font_size=11),
            Text("• SHM for small oscillations", font_size=11),
        ).arrange(DOWN, aligned_edge=LEFT).to_corner(DL)

        # Animate
        self.play(Write(title))
        self.play(Create(support), FadeIn(pivot), FadeIn(pivot_label))
        self.play(Create(equilibrium))
        self.play(Create(string), Create(bob), FadeIn(bob_label))
        self.play(Create(amplitude_arc), FadeIn(amplitude_label))
        self.play(Create(angle_arc), FadeIn(theta_label))
        self.play(FadeIn(properties))
        self.play(Write(formula))
        self.wait(2)


# Scene mapping for easy lookup
PHYSICS_SCENES = {
    "ray_diagram": RayDiagramConvexLensScene,
    "lens": RayDiagramConvexLensScene,
    "convex_lens": RayDiagramConvexLensScene,
    "circuit": CircuitDiagramScene,
    "electric_circuit": CircuitDiagramScene,
    "wave": WavePropertiesScene,
    "wave_properties": WavePropertiesScene,
    "force_diagram": ForceDiagramScene,
    "forces": ForceDiagramScene,
    "magnetic_field": MagneticFieldScene,
    "magnet": MagneticFieldScene,
    "pendulum": PendulumScene,
    "oscillation": PendulumScene,
}

