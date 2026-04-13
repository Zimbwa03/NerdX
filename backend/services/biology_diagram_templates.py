#!/usr/bin/env python3
"""
Manim scenes for Biology diagrams - O-Level and A-Level
Covers: Cell structure, DNA, Photosynthesis, Respiration, Mitosis, Neurons, Heart, etc.
"""

import os
from manim import *

# Disable LaTeX for cross-platform compatibility
config.tex_template = None


class AnimalCellScene(Scene):
    """Animal cell structure diagram"""

    def construct(self):
        title = Text("Animal Cell Structure", font_size=36, color=GREEN).to_edge(UP)

        # Cell membrane (outer boundary)
        cell_membrane = Circle(radius=2.5, color=YELLOW, stroke_width=4)
        membrane_label = Text("Cell Membrane", font_size=14, color=YELLOW).next_to(
            cell_membrane, DOWN, buff=0.2
        )

        # Nucleus
        nucleus = Circle(radius=0.7, color=BLUE, fill_opacity=0.3, stroke_width=3)
        nucleus.move_to(ORIGIN)
        nucleus_label = Text("Nucleus", font_size=12, color=BLUE).next_to(
            nucleus, DOWN, buff=0.1
        )
        nucleolus = Dot(color=DARK_BLUE, radius=0.15).move_to(nucleus.get_center())

        # Mitochondria (oval shapes)
        mito1 = Ellipse(width=0.6, height=0.3, color=RED, fill_opacity=0.4).move_to(
            RIGHT * 1.5 + UP * 0.5
        )
        mito2 = Ellipse(width=0.5, height=0.25, color=RED, fill_opacity=0.4).move_to(
            LEFT * 1.3 + DOWN * 0.8
        )
        mito_label = Text("Mitochondria", font_size=11, color=RED).next_to(
            mito1, RIGHT, buff=0.1
        )

        # Ribosomes (small dots)
        ribosomes = VGroup(
            *[
                Dot(color=PURPLE, radius=0.05).move_to(
                    np.array([np.cos(a) * 1.8, np.sin(a) * 1.2, 0])
                )
                for a in np.linspace(0, 2 * PI, 20)
            ]
        )
        ribo_label = Text("Ribosomes", font_size=10, color=PURPLE).move_to(
            UP * 2 + RIGHT * 1.5
        )

        # Endoplasmic reticulum (wavy lines near nucleus)
        er_points = [
            nucleus.get_right() + RIGHT * 0.2 + UP * 0.3,
            nucleus.get_right() + RIGHT * 0.5 + DOWN * 0.1,
            nucleus.get_right() + RIGHT * 0.8 + UP * 0.2,
            nucleus.get_right() + RIGHT * 1.1 + DOWN * 0.15,
        ]
        er = VMobject(color=ORANGE, stroke_width=2)
        er.set_points_smoothly(er_points)
        er_label = Text("ER", font_size=10, color=ORANGE).next_to(er, UP, buff=0.05)

        # Golgi apparatus
        golgi = VGroup(
            *[
                Arc(radius=0.3 + i * 0.1, angle=PI, color=TEAL, stroke_width=2).move_to(
                    LEFT * 1.5 + UP * 0.8
                )
                for i in range(3)
            ]
        )
        golgi_label = Text("Golgi", font_size=10, color=TEAL).next_to(
            golgi, LEFT, buff=0.1
        )

        # Cytoplasm label
        cyto_label = Text("Cytoplasm", font_size=12, color=WHITE).move_to(
            DOWN * 1.8 + LEFT * 0.5
        )

        # Animate
        self.play(Write(title))
        self.play(Create(cell_membrane), FadeIn(membrane_label))
        self.play(Create(nucleus), FadeIn(nucleus_label), FadeIn(nucleolus))
        self.play(
            Create(mito1), Create(mito2), FadeIn(mito_label), FadeIn(ribosomes)
        )
        self.play(Create(er), FadeIn(er_label), Create(golgi), FadeIn(golgi_label))
        self.play(FadeIn(ribo_label), FadeIn(cyto_label))
        self.wait(2)


class PlantCellScene(Scene):
    """Plant cell structure diagram"""

    def construct(self):
        title = Text("Plant Cell Structure", font_size=36, color=GREEN).to_edge(UP)

        # Cell wall (outer rectangle)
        cell_wall = RoundedRectangle(
            width=5.5, height=4, corner_radius=0.3, color=DARK_GREEN, stroke_width=6
        )
        wall_label = Text("Cell Wall", font_size=14, color=DARK_GREEN).next_to(
            cell_wall, DOWN, buff=0.15
        )

        # Cell membrane (inner rectangle)
        cell_membrane = RoundedRectangle(
            width=5, height=3.5, corner_radius=0.2, color=YELLOW, stroke_width=3
        )

        # Large central vacuole
        vacuole = Ellipse(
            width=2.5, height=1.8, color=LIGHT_BLUE, fill_opacity=0.3, stroke_width=2
        ).move_to(DOWN * 0.3)
        vacuole_label = Text("Vacuole", font_size=12, color=LIGHT_BLUE).move_to(
            vacuole.get_center()
        )

        # Nucleus
        nucleus = Circle(
            radius=0.5, color=BLUE, fill_opacity=0.4, stroke_width=2
        ).move_to(UP * 1 + LEFT * 1.5)
        nuc_label = Text("Nucleus", font_size=10, color=BLUE).next_to(
            nucleus, UP, buff=0.05
        )

        # Chloroplasts (green ovals)
        chloro1 = Ellipse(width=0.5, height=0.3, color=PURE_GREEN, fill_opacity=0.5).move_to(
            RIGHT * 1.8 + UP * 0.8
        )
        chloro2 = Ellipse(width=0.45, height=0.28, color=PURE_GREEN, fill_opacity=0.5).move_to(
            LEFT * 0.5 + UP * 1.2
        )
        chloro3 = Ellipse(width=0.5, height=0.3, color=PURE_GREEN, fill_opacity=0.5).move_to(
            RIGHT * 1.5 + DOWN * 1
        )
        chloro_label = Text("Chloroplasts", font_size=10, color=PURE_GREEN).next_to(
            chloro1, RIGHT, buff=0.1
        )

        # Mitochondria
        mito = Ellipse(width=0.4, height=0.2, color=RED, fill_opacity=0.4).move_to(
            LEFT * 1.8 + DOWN * 0.5
        )
        mito_label = Text("Mitochondria", font_size=9, color=RED).next_to(
            mito, LEFT, buff=0.05
        )

        # Cytoplasm label
        cyto_label = Text("Cytoplasm", font_size=11, color=WHITE).move_to(
            DOWN * 1.5 + RIGHT * 1.5
        )

        # Animate
        self.play(Write(title))
        self.play(Create(cell_wall), FadeIn(wall_label))
        self.play(Create(cell_membrane))
        self.play(Create(vacuole), FadeIn(vacuole_label))
        self.play(Create(nucleus), FadeIn(nuc_label))
        self.play(
            Create(chloro1),
            Create(chloro2),
            Create(chloro3),
            FadeIn(chloro_label),
        )
        self.play(Create(mito), FadeIn(mito_label), FadeIn(cyto_label))
        self.wait(2)


class DNAStructureScene(Scene):
    """DNA double helix structure"""

    def construct(self):
        title = Text("DNA Double Helix", font_size=36, color=BLUE).to_edge(UP)

        # Create simplified double helix representation
        helix_group = VGroup()

        # Parameters
        num_pairs = 10
        helix_height = 5
        helix_width = 1.5

        for i in range(num_pairs):
            y = (i - num_pairs / 2) * (helix_height / num_pairs)
            phase = i * PI / 5

            # Left strand backbone
            x_left = -helix_width * np.cos(phase)
            left_point = Dot(color=BLUE, radius=0.1).move_to(
                np.array([x_left - 0.5, y, 0])
            )

            # Right strand backbone
            x_right = helix_width * np.cos(phase + PI)
            right_point = Dot(color=RED, radius=0.1).move_to(
                np.array([x_right + 0.5, y, 0])
            )

            # Base pair connection
            base_colors = [GREEN, YELLOW, ORANGE, PURPLE]
            bp_color = base_colors[i % 4]
            base_pair = Line(
                left_point.get_center(),
                right_point.get_center(),
                color=bp_color,
                stroke_width=3,
            )

            helix_group.add(left_point, right_point, base_pair)

        # Labels
        legend = VGroup(
            Text("A-T base pair", font_size=14, color=GREEN),
            Text("G-C base pair", font_size=14, color=YELLOW),
            Text("Sugar-phosphate backbone", font_size=14, color=BLUE),
        ).arrange(DOWN, aligned_edge=LEFT).to_corner(DR)

        # Animate
        self.play(Write(title))
        self.play(Create(helix_group), run_time=3)
        self.play(FadeIn(legend))
        self.wait(2)


class PhotosynthesisScene(Scene):
    """Photosynthesis process diagram"""

    def construct(self):
        title = Text("Photosynthesis", font_size=36, color=GREEN).to_edge(UP)

        # Chloroplast representation
        chloroplast = Ellipse(
            width=4, height=2.5, color=DARK_GREEN, fill_opacity=0.2, stroke_width=3
        )
        chloro_label = Text("Chloroplast", font_size=14, color=DARK_GREEN).next_to(
            chloroplast, DOWN
        )

        # Inputs (left side)
        sun = VGroup(
            Circle(radius=0.4, color=YELLOW, fill_opacity=0.8),
            *[
                Line(ORIGIN, RIGHT * 0.3, color=YELLOW, stroke_width=2).rotate(
                    i * PI / 4, about_point=ORIGIN
                ).shift(LEFT * 4 + UP * 1)
                for i in range(8)
            ],
        )
        sun[0].move_to(LEFT * 4 + UP * 1)
        sun_label = Text("Sunlight", font_size=12, color=YELLOW).next_to(sun, DOWN)

        water = Text("H₂O", font_size=18, color=BLUE).move_to(LEFT * 4 + DOWN * 0.5)
        water_label = Text("Water", font_size=11, color=BLUE).next_to(water, DOWN)

        co2 = Text("CO₂", font_size=18, color=GRAY).move_to(LEFT * 4 + DOWN * 1.5)
        co2_label = Text("Carbon Dioxide", font_size=10, color=GRAY).next_to(co2, DOWN)

        # Arrows into chloroplast
        arrow_sun = Arrow(sun.get_right(), chloroplast.get_left() + UP * 0.5, color=YELLOW)
        arrow_water = Arrow(water.get_right(), chloroplast.get_left(), color=BLUE)
        arrow_co2 = Arrow(co2.get_right(), chloroplast.get_left() + DOWN * 0.5, color=GRAY)

        # Outputs (right side)
        glucose = Text("C₆H₁₂O₆", font_size=18, color=ORANGE).move_to(RIGHT * 4)
        glucose_label = Text("Glucose", font_size=12, color=ORANGE).next_to(glucose, DOWN)

        oxygen = Text("O₂", font_size=18, color=LIGHT_BLUE).move_to(RIGHT * 4 + UP * 1)
        oxygen_label = Text("Oxygen", font_size=12, color=LIGHT_BLUE).next_to(oxygen, DOWN)

        # Arrows out of chloroplast
        arrow_glucose = Arrow(chloroplast.get_right(), glucose.get_left(), color=ORANGE)
        arrow_oxygen = Arrow(chloroplast.get_right() + UP * 0.5, oxygen.get_left(), color=LIGHT_BLUE)

        # Equation at bottom
        equation = Text(
            "6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂",
            font_size=16,
            color=WHITE,
        ).to_edge(DOWN)

        # Animate
        self.play(Write(title))
        self.play(Create(chloroplast), FadeIn(chloro_label))
        self.play(
            FadeIn(sun), FadeIn(sun_label),
            FadeIn(water), FadeIn(water_label),
            FadeIn(co2), FadeIn(co2_label),
        )
        self.play(Create(arrow_sun), Create(arrow_water), Create(arrow_co2))
        self.play(
            FadeIn(glucose), FadeIn(glucose_label),
            FadeIn(oxygen), FadeIn(oxygen_label),
        )
        self.play(Create(arrow_glucose), Create(arrow_oxygen))
        self.play(Write(equation))
        self.wait(2)


class RespirationScene(Scene):
    """Aerobic respiration process"""

    def construct(self):
        title = Text("Aerobic Respiration", font_size=36, color=RED).to_edge(UP)

        # Mitochondria representation
        mito = Ellipse(
            width=4, height=2, color=RED, fill_opacity=0.2, stroke_width=3
        )
        # Inner membrane folds
        folds = VGroup(
            *[
                Line(
                    mito.get_left() + RIGHT * (0.5 + i * 0.6),
                    mito.get_left() + RIGHT * (0.5 + i * 0.6) + UP * 0.6,
                    color=DARK_RED,
                    stroke_width=2,
                )
                for i in range(5)
            ]
        )
        mito_label = Text("Mitochondria", font_size=14, color=RED).next_to(mito, DOWN)

        # Inputs
        glucose = Text("C₆H₁₂O₆", font_size=18, color=ORANGE).move_to(LEFT * 4 + UP * 0.5)
        glucose_label = Text("Glucose", font_size=11, color=ORANGE).next_to(glucose, DOWN)

        oxygen = Text("O₂", font_size=18, color=LIGHT_BLUE).move_to(LEFT * 4 + DOWN * 0.5)
        oxygen_label = Text("Oxygen", font_size=11, color=LIGHT_BLUE).next_to(oxygen, DOWN)

        # Arrows in
        arrow_glu = Arrow(glucose.get_right(), mito.get_left() + UP * 0.3, color=ORANGE)
        arrow_oxy = Arrow(oxygen.get_right(), mito.get_left() + DOWN * 0.3, color=LIGHT_BLUE)

        # Outputs
        atp = Text("ATP", font_size=20, color=YELLOW).move_to(RIGHT * 4 + UP * 0.8)
        atp_label = Text("Energy", font_size=12, color=YELLOW).next_to(atp, UP)

        co2_out = Text("CO₂", font_size=18, color=GRAY).move_to(RIGHT * 4)
        water_out = Text("H₂O", font_size=18, color=BLUE).move_to(RIGHT * 4 + DOWN * 0.8)

        # Arrows out
        arrow_atp = Arrow(mito.get_right() + UP * 0.3, atp.get_left(), color=YELLOW)
        arrow_co2 = Arrow(mito.get_right(), co2_out.get_left(), color=GRAY)
        arrow_h2o = Arrow(mito.get_right() + DOWN * 0.3, water_out.get_left(), color=BLUE)

        # Equation
        equation = Text(
            "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP (Energy)",
            font_size=16,
            color=WHITE,
        ).to_edge(DOWN)

        # Animate
        self.play(Write(title))
        self.play(Create(mito), Create(folds), FadeIn(mito_label))
        self.play(
            FadeIn(glucose), FadeIn(glucose_label),
            FadeIn(oxygen), FadeIn(oxygen_label),
        )
        self.play(Create(arrow_glu), Create(arrow_oxy))
        self.play(
            FadeIn(atp), FadeIn(atp_label),
            FadeIn(co2_out), FadeIn(water_out),
        )
        self.play(Create(arrow_atp), Create(arrow_co2), Create(arrow_h2o))
        self.play(Write(equation))
        self.wait(2)


class NeuronScene(Scene):
    """Neuron structure diagram"""

    def construct(self):
        title = Text("Neuron Structure", font_size=36, color=PURPLE).to_edge(UP)

        # Cell body (soma)
        soma = Circle(radius=0.6, color=PURPLE, fill_opacity=0.3, stroke_width=3).move_to(
            LEFT * 3
        )
        soma_label = Text("Cell Body", font_size=11, color=PURPLE).next_to(soma, DOWN)
        nucleus = Circle(radius=0.2, color=DARK_BLUE, fill_opacity=0.5).move_to(
            soma.get_center()
        )

        # Dendrites (branching lines from soma)
        dendrites = VGroup()
        for angle in [-PI / 3, -PI / 2, -2 * PI / 3, -PI / 4, -3 * PI / 4]:
            start = soma.get_center() + np.array([np.cos(angle), np.sin(angle), 0]) * 0.6
            end = start + np.array([np.cos(angle), np.sin(angle), 0]) * 0.8
            branch = Line(start, end, color=LIGHT_PINK, stroke_width=2)
            dendrites.add(branch)
            # Small branches
            for sub_angle in [angle - 0.3, angle + 0.3]:
                sub_end = end + np.array([np.cos(sub_angle), np.sin(sub_angle), 0]) * 0.3
                dendrites.add(Line(end, sub_end, color=LIGHT_PINK, stroke_width=1))

        dend_label = Text("Dendrites", font_size=10, color=LIGHT_PINK).move_to(
            LEFT * 4 + UP * 1.5
        )

        # Axon (long line)
        axon = Line(soma.get_right(), RIGHT * 3, color=BLUE, stroke_width=4)
        axon_label = Text("Axon", font_size=12, color=BLUE).next_to(axon, UP)

        # Myelin sheath (segmented)
        myelin = VGroup()
        for i in range(4):
            x_start = -2 + i * 1.2
            segment = Rectangle(
                width=0.8, height=0.4, color=YELLOW, fill_opacity=0.3, stroke_width=2
            ).move_to(np.array([x_start, 0, 0]))
            myelin.add(segment)
        myelin_label = Text("Myelin Sheath", font_size=10, color=YELLOW).next_to(
            myelin, DOWN
        )

        # Axon terminals
        terminals = VGroup()
        for y_off in [-0.3, 0, 0.3]:
            term = Circle(radius=0.15, color=GREEN, fill_opacity=0.5).move_to(
                RIGHT * 3.3 + UP * y_off
            )
            terminals.add(term)
        term_label = Text("Axon Terminals", font_size=10, color=GREEN).next_to(
            terminals, RIGHT
        )

        # Signal direction arrow
        signal_arrow = Arrow(LEFT * 4, RIGHT * 2.5, color=RED, stroke_width=2).shift(
            DOWN * 1.5
        )
        signal_label = Text("Signal Direction →", font_size=12, color=RED).next_to(
            signal_arrow, DOWN
        )

        # Animate
        self.play(Write(title))
        self.play(Create(soma), FadeIn(nucleus), FadeIn(soma_label))
        self.play(Create(dendrites), FadeIn(dend_label))
        self.play(Create(axon), FadeIn(axon_label))
        self.play(Create(myelin), FadeIn(myelin_label))
        self.play(Create(terminals), FadeIn(term_label))
        self.play(Create(signal_arrow), FadeIn(signal_label))
        self.wait(2)


class HeartStructureScene(Scene):
    """Heart structure and blood flow"""

    def construct(self):
        title = Text("Heart Structure", font_size=36, color=RED).to_edge(UP)

        # Simplified heart shape using bezier curves
        # We'll use rectangles for chambers for clarity
        # Left side (viewer's right) - oxygenated blood (red)
        left_atrium = Rectangle(
            width=1.2, height=1, color=RED, fill_opacity=0.4, stroke_width=2
        ).move_to(RIGHT * 0.8 + UP * 0.8)
        la_label = Text("LA", font_size=14, color=RED).move_to(left_atrium.get_center())

        left_ventricle = Rectangle(
            width=1.5, height=1.5, color=RED, fill_opacity=0.6, stroke_width=3
        ).move_to(RIGHT * 0.8 + DOWN * 0.8)
        lv_label = Text("LV", font_size=14, color=RED).move_to(left_ventricle.get_center())

        # Right side (viewer's left) - deoxygenated blood (blue)
        right_atrium = Rectangle(
            width=1.2, height=1, color=BLUE, fill_opacity=0.4, stroke_width=2
        ).move_to(LEFT * 0.8 + UP * 0.8)
        ra_label = Text("RA", font_size=14, color=BLUE).move_to(right_atrium.get_center())

        right_ventricle = Rectangle(
            width=1.3, height=1.3, color=BLUE, fill_opacity=0.6, stroke_width=3
        ).move_to(LEFT * 0.8 + DOWN * 0.7)
        rv_label = Text("RV", font_size=14, color=BLUE).move_to(
            right_ventricle.get_center()
        )

        # Septum (dividing wall)
        septum = Line(UP * 1.5, DOWN * 1.5, color=WHITE, stroke_width=4)

        # Major vessels
        # Pulmonary artery (to lungs - blue)
        pulm_art = Arrow(
            right_ventricle.get_top(), UP * 2.5 + LEFT * 1.5, color=BLUE, stroke_width=3
        )
        pa_label = Text("Pulmonary\nArtery", font_size=9, color=BLUE).next_to(
            pulm_art, LEFT
        )

        # Pulmonary vein (from lungs - red)
        pulm_vein = Arrow(
            UP * 2.5 + RIGHT * 1.5, left_atrium.get_top(), color=RED, stroke_width=3
        )
        pv_label = Text("Pulmonary\nVein", font_size=9, color=RED).next_to(
            pulm_vein, RIGHT
        )

        # Aorta (to body - red)
        aorta = Arrow(
            left_ventricle.get_left() + UP * 0.3,
            LEFT * 3 + DOWN * 0.5,
            color=MAROON,
            stroke_width=4,
        )
        aorta_label = Text("Aorta", font_size=11, color=MAROON).next_to(aorta, DOWN)

        # Vena cava (from body - blue)
        vena_cava = Arrow(
            LEFT * 3 + UP * 1.5, right_atrium.get_left(), color=DARK_BLUE, stroke_width=3
        )
        vc_label = Text("Vena Cava", font_size=10, color=DARK_BLUE).next_to(
            vena_cava, UP
        )

        # Legend
        legend = VGroup(
            VGroup(
                Rectangle(width=0.3, height=0.3, color=RED, fill_opacity=0.5),
                Text("Oxygenated", font_size=10, color=RED),
            ).arrange(RIGHT, buff=0.1),
            VGroup(
                Rectangle(width=0.3, height=0.3, color=BLUE, fill_opacity=0.5),
                Text("Deoxygenated", font_size=10, color=BLUE),
            ).arrange(RIGHT, buff=0.1),
        ).arrange(DOWN, aligned_edge=LEFT).to_corner(DR)

        # Chamber labels legend
        chamber_legend = VGroup(
            Text("RA = Right Atrium", font_size=10),
            Text("RV = Right Ventricle", font_size=10),
            Text("LA = Left Atrium", font_size=10),
            Text("LV = Left Ventricle", font_size=10),
        ).arrange(DOWN, aligned_edge=LEFT).to_corner(DL)

        # Animate
        self.play(Write(title))
        self.play(
            Create(right_atrium), Create(right_ventricle),
            Create(left_atrium), Create(left_ventricle),
        )
        self.play(
            FadeIn(ra_label), FadeIn(rv_label),
            FadeIn(la_label), FadeIn(lv_label),
        )
        self.play(Create(septum))
        self.play(
            Create(pulm_art), FadeIn(pa_label),
            Create(pulm_vein), FadeIn(pv_label),
        )
        self.play(
            Create(aorta), FadeIn(aorta_label),
            Create(vena_cava), FadeIn(vc_label),
        )
        self.play(FadeIn(legend), FadeIn(chamber_legend))
        self.wait(2)


class MitosisScene(Scene):
    """Mitosis cell division stages"""

    def construct(self):
        title = Text("Mitosis - Cell Division", font_size=32, color=PURPLE).to_edge(UP)

        stages = ["Interphase", "Prophase", "Metaphase", "Anaphase", "Telophase"]
        stage_groups = VGroup()

        x_positions = np.linspace(-5.5, 5.5, 5)

        for i, (stage, x) in enumerate(zip(stages, x_positions)):
            # Cell outline
            cell = Circle(radius=0.6, color=YELLOW, stroke_width=2).move_to(
                np.array([x, 0, 0])
            )

            # Stage-specific content
            if stage == "Interphase":
                # Single nucleus with chromatin
                nucleus = Circle(
                    radius=0.3, color=BLUE, fill_opacity=0.3, stroke_width=2
                ).move_to(cell.get_center())
                content = VGroup(nucleus)
            elif stage == "Prophase":
                # Chromosomes condensing
                chromo1 = Line(UP * 0.2, DOWN * 0.2, color=RED, stroke_width=3).move_to(
                    cell.get_center() + LEFT * 0.1
                )
                chromo2 = Line(UP * 0.2, DOWN * 0.2, color=BLUE, stroke_width=3).move_to(
                    cell.get_center() + RIGHT * 0.1
                )
                content = VGroup(chromo1, chromo2)
            elif stage == "Metaphase":
                # Chromosomes aligned at center
                chromosomes = VGroup(
                    *[
                        Line(LEFT * 0.1, RIGHT * 0.1, color=PURPLE, stroke_width=3).move_to(
                            cell.get_center() + UP * (0.15 * (j - 1))
                        )
                        for j in range(3)
                    ]
                )
                content = chromosomes
            elif stage == "Anaphase":
                # Chromosomes separating
                left_chromos = VGroup(
                    *[
                        Dot(color=RED, radius=0.05).move_to(
                            cell.get_center() + LEFT * 0.3 + UP * (0.1 * (j - 1))
                        )
                        for j in range(3)
                    ]
                )
                right_chromos = VGroup(
                    *[
                        Dot(color=BLUE, radius=0.05).move_to(
                            cell.get_center() + RIGHT * 0.3 + UP * (0.1 * (j - 1))
                        )
                        for j in range(3)
                    ]
                )
                content = VGroup(left_chromos, right_chromos)
            else:  # Telophase
                # Two nuclei forming
                left_nuc = Circle(
                    radius=0.2, color=BLUE, fill_opacity=0.3, stroke_width=2
                ).move_to(cell.get_center() + LEFT * 0.25)
                right_nuc = Circle(
                    radius=0.2, color=BLUE, fill_opacity=0.3, stroke_width=2
                ).move_to(cell.get_center() + RIGHT * 0.25)
                # Cleavage furrow
                furrow = DashedLine(
                    cell.get_top(), cell.get_bottom(), color=WHITE, stroke_width=1
                )
                content = VGroup(left_nuc, right_nuc, furrow)

            stage_label = Text(stage, font_size=11, color=WHITE).next_to(cell, DOWN)

            stage_group = VGroup(cell, content, stage_label)
            stage_groups.add(stage_group)

        # Arrows between stages
        arrows = VGroup(
            *[
                Arrow(
                    x_positions[i] + 0.7,
                    x_positions[i + 1] - 0.7,
                    color=GREEN,
                    stroke_width=2,
                    buff=0,
                ).shift(DOWN * 1.2)
                for i in range(4)
            ]
        )

        # Result label
        result = Text(
            "Result: 2 identical daughter cells (diploid)",
            font_size=14,
            color=GREEN,
        ).to_edge(DOWN)

        # Animate
        self.play(Write(title))
        for stage_group in stage_groups:
            self.play(FadeIn(stage_group), run_time=0.6)
        self.play(Create(arrows))
        self.play(Write(result))
        self.wait(2)


# Scene mapping for easy lookup
BIOLOGY_SCENES = {
    "animal_cell": AnimalCellScene,
    "plant_cell": PlantCellScene,
    "dna": DNAStructureScene,
    "photosynthesis": PhotosynthesisScene,
    "respiration": RespirationScene,
    "neuron": NeuronScene,
    "heart": HeartStructureScene,
    "mitosis": MitosisScene,
}

