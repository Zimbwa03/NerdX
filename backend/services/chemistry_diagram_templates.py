#!/usr/bin/env python3
"""
Manim scenes for Chemistry diagrams - O-Level and A-Level
Covers: Atomic structure, Bonding, Electrolysis, Energy profiles, Periodic trends
"""

import os
from manim import *
import numpy as np

# Disable LaTeX for cross-platform compatibility
config.tex_template = None


class AtomStructureScene(Scene):
    """Atomic structure with electron shells"""

    def construct(self):
        title = Text("Atomic Structure", font_size=36, color=BLUE).to_edge(UP)

        # Nucleus
        nucleus = VGroup(
            Circle(radius=0.5, color=RED, fill_opacity=0.6, stroke_width=3),
            Text("Nucleus", font_size=12, color=WHITE),
        )
        nucleus[1].move_to(nucleus[0].get_center())

        # Protons and neutrons label
        pn_label = Text("Protons (+)\nNeutrons (0)", font_size=10, color=RED).next_to(
            nucleus, DOWN, buff=0.3
        )

        # Electron shells (orbits)
        shell_1 = Circle(radius=1.2, color=BLUE_A, stroke_width=2)
        shell_2 = Circle(radius=2.0, color=BLUE_B, stroke_width=2)
        shell_3 = Circle(radius=2.8, color=BLUE_C, stroke_width=2)

        # Shell labels
        s1_label = Text("1st shell (2e⁻)", font_size=10, color=BLUE_A).move_to(
            RIGHT * 1.2 + UP * 0.3
        )
        s2_label = Text("2nd shell (8e⁻)", font_size=10, color=BLUE_B).move_to(
            RIGHT * 2.0 + UP * 0.3
        )
        s3_label = Text("3rd shell (8e⁻)", font_size=10, color=BLUE_C).move_to(
            RIGHT * 2.8 + UP * 0.3
        )

        # Electrons on shells
        electrons_1 = VGroup(
            *[
                Dot(color=YELLOW, radius=0.1).move_to(
                    np.array([np.cos(a) * 1.2, np.sin(a) * 1.2, 0])
                )
                for a in [0, PI]
            ]
        )

        electrons_2 = VGroup(
            *[
                Dot(color=YELLOW, radius=0.1).move_to(
                    np.array([np.cos(a) * 2.0, np.sin(a) * 2.0, 0])
                )
                for a in np.linspace(0, 2 * PI, 8, endpoint=False)
            ]
        )

        electrons_3 = VGroup(
            *[
                Dot(color=YELLOW, radius=0.1).move_to(
                    np.array([np.cos(a) * 2.8, np.sin(a) * 2.8, 0])
                )
                for a in np.linspace(0, 2 * PI, 8, endpoint=False)
            ]
        )

        electron_label = Text("Electrons (−)", font_size=11, color=YELLOW).to_corner(DR)

        # Key points
        key_points = VGroup(
            Text("• Protons: Positive charge", font_size=10),
            Text("• Neutrons: No charge", font_size=10),
            Text("• Electrons: Negative charge", font_size=10),
            Text("• Electrons orbit in shells", font_size=10),
        ).arrange(DOWN, aligned_edge=LEFT).to_corner(DL)

        # Animate
        self.play(Write(title))
        self.play(Create(nucleus[0]), FadeIn(nucleus[1]), FadeIn(pn_label))
        self.play(Create(shell_1), Create(electrons_1), FadeIn(s1_label))
        self.play(Create(shell_2), Create(electrons_2), FadeIn(s2_label))
        self.play(Create(shell_3), Create(electrons_3), FadeIn(s3_label))
        self.play(FadeIn(electron_label), FadeIn(key_points))
        self.wait(2)


class IonicBondScene(Scene):
    """Ionic bonding - electron transfer"""

    def construct(self):
        title = Text("Ionic Bonding", font_size=36, color=ORANGE).to_edge(UP)
        subtitle = Text("Example: Sodium Chloride (NaCl)", font_size=18, color=WHITE).next_to(
            title, DOWN
        )

        # Sodium atom (before)
        na_nucleus = Circle(radius=0.4, color=RED, fill_opacity=0.5).move_to(LEFT * 4)
        na_label = Text("Na", font_size=16, color=WHITE).move_to(na_nucleus.get_center())
        na_shells = VGroup(
            Circle(radius=0.7, color=BLUE_A, stroke_width=1).move_to(LEFT * 4),
            Circle(radius=1.0, color=BLUE_B, stroke_width=1).move_to(LEFT * 4),
            Circle(radius=1.3, color=BLUE_C, stroke_width=1).move_to(LEFT * 4),
        )
        # 2, 8, 1 electrons
        na_electrons = VGroup(
            Dot(color=YELLOW, radius=0.08).move_to(LEFT * 4 + RIGHT * 0.7),
            Dot(color=YELLOW, radius=0.08).move_to(LEFT * 4 + LEFT * 0.7),
        )
        na_outer_electron = Dot(color=GREEN, radius=0.1).move_to(LEFT * 4 + RIGHT * 1.3)

        # Chlorine atom (before)
        cl_nucleus = Circle(radius=0.4, color=RED, fill_opacity=0.5).move_to(RIGHT * 4)
        cl_label = Text("Cl", font_size=16, color=WHITE).move_to(cl_nucleus.get_center())
        cl_shells = VGroup(
            Circle(radius=0.7, color=BLUE_A, stroke_width=1).move_to(RIGHT * 4),
            Circle(radius=1.0, color=BLUE_B, stroke_width=1).move_to(RIGHT * 4),
            Circle(radius=1.3, color=BLUE_C, stroke_width=1).move_to(RIGHT * 4),
        )
        # 2, 8, 7 electrons (needs 1 more)
        cl_electrons = VGroup(
            *[
                Dot(color=YELLOW, radius=0.08).move_to(
                    RIGHT * 4 + np.array([np.cos(a) * 1.3, np.sin(a) * 1.3, 0])
                )
                for a in np.linspace(0, 2 * PI, 7, endpoint=False)
            ]
        )

        # Arrow showing electron transfer
        transfer_arrow = Arrow(
            LEFT * 2.5, RIGHT * 2.5, color=GREEN, stroke_width=4
        ).shift(DOWN * 0.5)
        transfer_label = Text("Electron transfer", font_size=14, color=GREEN).next_to(
            transfer_arrow, DOWN
        )

        # After ionic bond
        na_ion = VGroup(
            Circle(radius=0.5, color=RED, fill_opacity=0.3, stroke_width=3).move_to(
                LEFT * 1.5 + DOWN * 2
            ),
            Text("Na⁺", font_size=18, color=RED),
        )
        na_ion[1].move_to(na_ion[0].get_center())

        cl_ion = VGroup(
            Circle(radius=0.6, color=BLUE, fill_opacity=0.3, stroke_width=3).move_to(
                RIGHT * 1.5 + DOWN * 2
            ),
            Text("Cl⁻", font_size=18, color=BLUE),
        )
        cl_ion[1].move_to(cl_ion[0].get_center())

        # Electrostatic attraction
        attraction_line = DashedLine(
            na_ion[0].get_right(), cl_ion[0].get_left(), color=PURPLE, stroke_width=2
        )
        attraction_label = Text(
            "Electrostatic attraction", font_size=12, color=PURPLE
        ).next_to(attraction_line, DOWN)

        result = Text(
            "Result: Ionic compound NaCl", font_size=16, color=ORANGE
        ).to_edge(DOWN)

        # Animate
        self.play(Write(title), FadeIn(subtitle))
        self.play(
            Create(na_nucleus),
            FadeIn(na_label),
            Create(na_shells),
            Create(na_electrons),
            Create(na_outer_electron),
        )
        self.play(
            Create(cl_nucleus),
            FadeIn(cl_label),
            Create(cl_shells),
            Create(cl_electrons),
        )
        self.play(Create(transfer_arrow), FadeIn(transfer_label))
        self.play(
            na_outer_electron.animate.move_to(RIGHT * 4 + UP * 1.3),
            run_time=1.5,
        )
        self.play(
            FadeIn(na_ion),
            FadeIn(cl_ion),
            Create(attraction_line),
            FadeIn(attraction_label),
        )
        self.play(Write(result))
        self.wait(2)


class CovalentBondScene(Scene):
    """Covalent bonding - electron sharing"""

    def construct(self):
        title = Text("Covalent Bonding", font_size=36, color=GREEN).to_edge(UP)
        subtitle = Text("Example: Water (H₂O)", font_size=18, color=WHITE).next_to(
            title, DOWN
        )

        # Oxygen atom (center)
        o_nucleus = Circle(radius=0.4, color=RED, fill_opacity=0.5)
        o_label = Text("O", font_size=16, color=WHITE).move_to(o_nucleus.get_center())
        o_shell = Circle(radius=1.0, color=BLUE, stroke_width=2)

        # Oxygen's 6 valence electrons (needs 2 more)
        o_electrons = VGroup(
            *[
                Dot(color=YELLOW, radius=0.08).move_to(
                    np.array([np.cos(a) * 1.0, np.sin(a) * 1.0, 0])
                )
                for a in np.linspace(PI / 4, 2 * PI + PI / 4, 6, endpoint=False)
            ]
        )

        # Hydrogen atoms
        h1_pos = LEFT * 2 + UP * 0.5
        h2_pos = RIGHT * 2 + UP * 0.5

        h1_nucleus = Circle(radius=0.25, color=LIGHT_GRAY, fill_opacity=0.5).move_to(
            h1_pos
        )
        h1_label = Text("H", font_size=14, color=WHITE).move_to(h1_pos)
        h1_electron = Dot(color=GREEN, radius=0.1).move_to(h1_pos + RIGHT * 0.5)

        h2_nucleus = Circle(radius=0.25, color=LIGHT_GRAY, fill_opacity=0.5).move_to(
            h2_pos
        )
        h2_label = Text("H", font_size=14, color=WHITE).move_to(h2_pos)
        h2_electron = Dot(color=GREEN, radius=0.1).move_to(h2_pos + LEFT * 0.5)

        # Shared electron pairs (bonds)
        bond1 = VGroup(
            Dot(color=PURPLE, radius=0.1).move_to(LEFT * 0.8 + UP * 0.3),
            Dot(color=PURPLE, radius=0.1).move_to(LEFT * 0.6 + UP * 0.5),
        )
        bond2 = VGroup(
            Dot(color=PURPLE, radius=0.1).move_to(RIGHT * 0.8 + UP * 0.3),
            Dot(color=PURPLE, radius=0.1).move_to(RIGHT * 0.6 + UP * 0.5),
        )

        # Bond lines
        bond_line1 = Line(o_nucleus.get_left(), h1_nucleus.get_right(), color=WHITE, stroke_width=3)
        bond_line2 = Line(o_nucleus.get_right(), h2_nucleus.get_left(), color=WHITE, stroke_width=3)

        # Key concept
        key_text = VGroup(
            Text("• Electrons are SHARED", font_size=12, color=GREEN),
            Text("• Both atoms achieve stable configuration", font_size=12),
            Text("• Shared pairs = covalent bonds", font_size=12),
        ).arrange(DOWN, aligned_edge=LEFT).to_edge(DOWN)

        # Animate
        self.play(Write(title), FadeIn(subtitle))
        self.play(
            Create(o_nucleus), FadeIn(o_label), Create(o_shell), Create(o_electrons)
        )
        self.play(
            Create(h1_nucleus),
            FadeIn(h1_label),
            Create(h1_electron),
            Create(h2_nucleus),
            FadeIn(h2_label),
            Create(h2_electron),
        )
        self.play(
            h1_nucleus.animate.move_to(LEFT * 1.2),
            h1_label.animate.move_to(LEFT * 1.2),
            h1_electron.animate.move_to(LEFT * 0.7),
            h2_nucleus.animate.move_to(RIGHT * 1.2),
            h2_label.animate.move_to(RIGHT * 1.2),
            h2_electron.animate.move_to(RIGHT * 0.7),
            run_time=1.5,
        )
        self.play(Create(bond_line1), Create(bond_line2), FadeIn(bond1), FadeIn(bond2))
        self.play(FadeIn(key_text))
        self.wait(2)


class ElectrolysisScene(Scene):
    """Electrolysis setup and ion movement"""

    def construct(self):
        title = Text("Electrolysis", font_size=36, color=BLUE).to_edge(UP)

        # Container (beaker)
        beaker = VGroup(
            Line(LEFT * 2 + DOWN * 1.5, LEFT * 2 + UP * 1, color=WHITE, stroke_width=3),
            Line(LEFT * 2 + DOWN * 1.5, RIGHT * 2 + DOWN * 1.5, color=WHITE, stroke_width=3),
            Line(RIGHT * 2 + DOWN * 1.5, RIGHT * 2 + UP * 1, color=WHITE, stroke_width=3),
        )

        # Electrolyte solution
        solution = Rectangle(
            width=4, height=2, color=BLUE, fill_opacity=0.2, stroke_width=0
        ).move_to(DOWN * 0.5)
        solution_label = Text("Electrolyte solution", font_size=12, color=BLUE).move_to(
            DOWN * 0.5
        )

        # Electrodes
        cathode = Rectangle(
            width=0.3, height=1.5, color=GRAY, fill_opacity=0.8, stroke_width=2
        ).move_to(LEFT * 1.2)
        cathode_label = Text("Cathode (−)", font_size=11, color=YELLOW).next_to(
            cathode, DOWN
        )

        anode = Rectangle(
            width=0.3, height=1.5, color=GRAY, fill_opacity=0.8, stroke_width=2
        ).move_to(RIGHT * 1.2)
        anode_label = Text("Anode (+)", font_size=11, color=RED).next_to(anode, DOWN)

        # Power source (battery)
        battery = VGroup(
            Rectangle(width=1, height=0.5, color=ORANGE, fill_opacity=0.5).move_to(
                UP * 2.5
            ),
            Text("DC", font_size=12, color=WHITE).move_to(UP * 2.5),
        )

        # Wires
        wire_left = VGroup(
            Line(cathode.get_top(), LEFT * 1.2 + UP * 2, color=YELLOW, stroke_width=2),
            Line(LEFT * 1.2 + UP * 2, LEFT * 0.5 + UP * 2.5, color=YELLOW, stroke_width=2),
        )
        wire_right = VGroup(
            Line(anode.get_top(), RIGHT * 1.2 + UP * 2, color=RED, stroke_width=2),
            Line(RIGHT * 1.2 + UP * 2, RIGHT * 0.5 + UP * 2.5, color=RED, stroke_width=2),
        )

        # Ions
        cation = VGroup(
            Circle(radius=0.15, color=GREEN, fill_opacity=0.8),
            Text("+", font_size=10, color=WHITE),
        ).move_to(RIGHT * 0.5 + UP * 0.2)
        cation[1].move_to(cation[0].get_center())

        anion = VGroup(
            Circle(radius=0.15, color=PURPLE, fill_opacity=0.8),
            Text("−", font_size=10, color=WHITE),
        ).move_to(LEFT * 0.5 + DOWN * 0.2)
        anion[1].move_to(anion[0].get_center())

        # Ion movement arrows
        cation_arrow = Arrow(cation.get_center(), cathode.get_center() + RIGHT * 0.5, color=GREEN, stroke_width=2)
        anion_arrow = Arrow(anion.get_center(), anode.get_center() + LEFT * 0.5, color=PURPLE, stroke_width=2)

        # Key points
        key_points = VGroup(
            Text("• Cations (+) → Cathode (−)", font_size=11, color=GREEN),
            Text("• Anions (−) → Anode (+)", font_size=11, color=PURPLE),
            Text("• DC current drives the process", font_size=11),
        ).arrange(DOWN, aligned_edge=LEFT).to_corner(DL)

        # Animate
        self.play(Write(title))
        self.play(Create(beaker), FadeIn(solution), FadeIn(solution_label))
        self.play(Create(cathode), FadeIn(cathode_label), Create(anode), FadeIn(anode_label))
        self.play(FadeIn(battery), Create(wire_left), Create(wire_right))
        self.play(FadeIn(cation), FadeIn(anion))
        self.play(Create(cation_arrow), Create(anion_arrow))
        self.play(
            cation.animate.move_to(cathode.get_center() + RIGHT * 0.5),
            anion.animate.move_to(anode.get_center() + LEFT * 0.5),
            run_time=2,
        )
        self.play(FadeIn(key_points))
        self.wait(2)


class EnergyProfileScene(Scene):
    """Reaction energy profile (exothermic and endothermic)"""

    def construct(self):
        title = Text("Energy Profiles", font_size=36, color=ORANGE).to_edge(UP)

        # Create axes
        axes = Axes(
            x_range=[0, 10, 2],
            y_range=[0, 100, 20],
            x_length=5,
            y_length=4,
            axis_config={"include_tip": True, "color": WHITE},
        ).shift(LEFT * 3)

        x_label = Text("Reaction Progress", font_size=12).next_to(axes.x_axis, DOWN)
        y_label = Text("Energy", font_size=12).next_to(axes.y_axis, UP)

        # Exothermic curve (energy decreases)
        exo_curve = axes.plot(
            lambda x: 30 + 40 * np.exp(-((x - 4) ** 2) / 2) - 20 * (x / 10),
            x_range=[0, 10],
            color=RED,
        )
        exo_label = Text("Exothermic", font_size=14, color=RED).next_to(axes, DOWN, buff=0.5)

        # Energy levels
        reactants_level = DashedLine(
            axes.c2p(0, 40), axes.c2p(2, 40), color=BLUE, stroke_width=2
        )
        products_level_exo = DashedLine(
            axes.c2p(8, 20), axes.c2p(10, 20), color=GREEN, stroke_width=2
        )

        reactants_label = Text("Reactants", font_size=10, color=BLUE).next_to(
            reactants_level, LEFT
        )
        products_label_exo = Text("Products", font_size=10, color=GREEN).next_to(
            products_level_exo, RIGHT
        )

        # Activation energy arrow
        ea_arrow = DoubleArrow(
            axes.c2p(4, 40), axes.c2p(4, 70), color=YELLOW, stroke_width=2
        )
        ea_label = Text("Eₐ", font_size=12, color=YELLOW).next_to(ea_arrow, RIGHT)

        # Delta H arrow (for exothermic)
        delta_h_arrow = Arrow(
            axes.c2p(9, 40), axes.c2p(9, 20), color=PURPLE, stroke_width=3
        )
        delta_h_label = Text("ΔH < 0\n(heat released)", font_size=10, color=PURPLE).next_to(
            delta_h_arrow, RIGHT
        )

        # Endothermic diagram (right side)
        axes2 = Axes(
            x_range=[0, 10, 2],
            y_range=[0, 100, 20],
            x_length=5,
            y_length=4,
            axis_config={"include_tip": True, "color": WHITE},
        ).shift(RIGHT * 3)

        endo_curve = axes2.plot(
            lambda x: 20 + 50 * np.exp(-((x - 4) ** 2) / 2) + 20 * (x / 10),
            x_range=[0, 10],
            color=BLUE,
        )
        endo_label = Text("Endothermic", font_size=14, color=BLUE).next_to(axes2, DOWN, buff=0.5)

        # Products higher for endothermic
        products_level_endo = DashedLine(
            axes2.c2p(8, 50), axes2.c2p(10, 50), color=GREEN, stroke_width=2
        )
        delta_h_arrow2 = Arrow(
            axes2.c2p(9, 20), axes2.c2p(9, 50), color=ORANGE, stroke_width=3
        )
        delta_h_label2 = Text("ΔH > 0\n(heat absorbed)", font_size=10, color=ORANGE).next_to(
            delta_h_arrow2, RIGHT
        )

        # Animate
        self.play(Write(title))
        self.play(Create(axes), FadeIn(x_label), FadeIn(y_label))
        self.play(Create(exo_curve), FadeIn(exo_label))
        self.play(
            Create(reactants_level),
            Create(products_level_exo),
            FadeIn(reactants_label),
            FadeIn(products_label_exo),
        )
        self.play(Create(ea_arrow), FadeIn(ea_label))
        self.play(Create(delta_h_arrow), FadeIn(delta_h_label))
        self.wait(1)
        self.play(Create(axes2), Create(endo_curve), FadeIn(endo_label))
        self.play(Create(products_level_endo), Create(delta_h_arrow2), FadeIn(delta_h_label2))
        self.wait(2)


class PeriodicTableTrendsScene(Scene):
    """Periodic table trends visualization"""

    def construct(self):
        title = Text("Periodic Table Trends", font_size=32, color=PURPLE).to_edge(UP)

        # Simplified periodic table grid (first 3 periods)
        table = VGroup()
        groups = ["1", "2", "", "", "", "", "", "", "", "", "", "", "3", "4", "5", "6", "7", "0"]
        periods = ["1", "2", "3"]

        # Create a simplified 3x8 grid
        cell_size = 0.6
        for p_idx, period in enumerate(periods[:3]):
            for g_idx in range(8):
                if p_idx == 0 and g_idx not in [0, 7]:
                    continue  # Skip middle cells for period 1
                cell = Square(side_length=cell_size, color=BLUE, stroke_width=1).move_to(
                    np.array([g_idx * cell_size - 2, -p_idx * cell_size + 1, 0])
                )
                table.add(cell)

        table.center().shift(UP * 0.5)

        # Trend arrows
        # Atomic radius decreases across period (left to right)
        ar_arrow = Arrow(LEFT * 3, RIGHT * 3, color=RED, stroke_width=3).shift(DOWN * 1)
        ar_label = Text("Atomic Radius Decreases →", font_size=12, color=RED).next_to(
            ar_arrow, DOWN
        )

        # Ionization energy increases across period
        ie_arrow = Arrow(LEFT * 3, RIGHT * 3, color=GREEN, stroke_width=3).shift(DOWN * 2)
        ie_label = Text("Ionization Energy Increases →", font_size=12, color=GREEN).next_to(
            ie_arrow, DOWN
        )

        # Down the group arrows
        group_arrow = Arrow(UP * 1.5, DOWN * 0.5, color=ORANGE, stroke_width=3).shift(LEFT * 4)
        group_label = Text("↓ Atomic Radius\n   Increases", font_size=10, color=ORANGE).next_to(
            group_arrow, LEFT
        )

        # Key concepts
        key_concepts = VGroup(
            Text("Across a period:", font_size=12, color=WHITE, weight=BOLD),
            Text("• More protons → Stronger nuclear attraction", font_size=10),
            Text("• Smaller atomic radius", font_size=10),
            Text("• Higher ionization energy", font_size=10),
        ).arrange(DOWN, aligned_edge=LEFT).to_corner(DR)

        # Animate
        self.play(Write(title))
        self.play(Create(table))
        self.play(Create(ar_arrow), FadeIn(ar_label))
        self.play(Create(ie_arrow), FadeIn(ie_label))
        self.play(Create(group_arrow), FadeIn(group_label))
        self.play(FadeIn(key_concepts))
        self.wait(2)


# Scene mapping for easy lookup
CHEMISTRY_SCENES = {
    "atom_structure": AtomStructureScene,
    "atomic_structure": AtomStructureScene,
    "ionic_bond": IonicBondScene,
    "ionic_bonding": IonicBondScene,
    "covalent_bond": CovalentBondScene,
    "covalent_bonding": CovalentBondScene,
    "electrolysis": ElectrolysisScene,
    "energy_profile": EnergyProfileScene,
    "reaction_profile": EnergyProfileScene,
    "periodic_table": PeriodicTableTrendsScene,
    "periodic_trends": PeriodicTableTrendsScene,
}

