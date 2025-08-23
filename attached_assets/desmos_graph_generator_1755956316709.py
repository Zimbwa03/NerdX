#!/usr/bin/env python3
"""
Enhanced Graph Generator for NerdX Bot using matplotlib and plotly for mathematical functions
Since Desmos API is client-side only, we create our own advanced graphing system
"""

import os
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib import cm
import logging
from typing import Dict, Optional, List, Tuple
import sympy as sp
from sympy import symbols, lambdify, sympify
import io
import base64
from math import pi, e, sin, cos, tan, log, sqrt, exp
import time

logger = logging.getLogger(__name__)

class AdvancedGraphGenerator:
    def __init__(self):
        self.api_key = os.getenv('DESMOS_API_KEY')  # Keep for compatibility

        # Set matplotlib style for professional graphs with enhanced gridlines
        plt.style.use('seaborn-v0_8')
        plt.rcParams['figure.figsize'] = (12, 8)
        plt.rcParams['font.size'] = 12
        plt.rcParams['axes.grid'] = True
        plt.rcParams['grid.alpha'] = 0.7  # Increased for better visibility
        plt.rcParams['grid.linewidth'] = 0.8
        plt.rcParams['axes.axisbelow'] = True

        logger.info("Advanced Graph Generator initialized successfully")

    def create_function_graph(self, expression: str, title: str = "NerdX Math Graph", 
                             viewport: Dict = None, save_path: str = None) -> Optional[str]:
        """
        Create a professional mathematical function graph

        Args:
            expression: Mathematical expression to plot (e.g., "x^2", "sin(x)", "log(x)")
            title: Graph title
            viewport: Optional viewport settings {xmin, xmax, ymin, ymax}
            save_path: Optional path to save the graph image

        Returns:
            Path to saved graph image or None if failed
        """
        try:
            # Default viewport if not provided
            if viewport is None:
                viewport = {"xmin": -10, "xmax": 10, "ymin": -10, "ymax": 10}

            # Create figure with high DPI for crisp images
            fig, ax = plt.subplots(figsize=(12, 8), dpi=150)

            # Generate x values
            x_vals = np.linspace(viewport["xmin"], viewport["xmax"], 1000)

            # Convert expression to numpy-compatible format
            clean_expr = self._clean_expression(expression)

            try:
                # Use sympy to safely evaluate the expression
                x = symbols('x')
                logger.info(f"Cleaned expression: '{clean_expr}'")
                expr_sympy = sympify(clean_expr)
                logger.info(f"Sympy expression: {expr_sympy}")
                func = lambdify(x, expr_sympy, 'numpy')

                # Calculate y values
                y_vals = func(x_vals)

                # Handle complex numbers and infinite values
                if np.iscomplexobj(y_vals):
                    y_vals = np.real(y_vals)

                # Remove infinite and NaN values
                mask = np.isfinite(y_vals)
                x_clean = x_vals[mask]
                y_clean = y_vals[mask]

                # Plot the function
                ax.plot(x_clean, y_clean, 'b-', linewidth=3, label=f'f(x) = {expression}', alpha=0.8)

            except Exception as eval_error:
                logger.error(f"Error evaluating expression '{expression}': {eval_error}")
                # Fallback: show error message on graph
                ax.text(0.5, 0.5, f"Error: Cannot plot '{expression}'", 
                       transform=ax.transAxes, fontsize=16, ha='center', va='center',
                       bbox=dict(boxstyle="round,pad=0.3", facecolor="yellow", alpha=0.7))

            # Customize the graph
            ax.set_xlim(viewport["xmin"], viewport["xmax"])
            ax.set_ylim(viewport["ymin"], viewport["ymax"])
            ax.set_xlabel('x', fontsize=14, fontweight='bold')
            ax.set_ylabel('y', fontsize=14, fontweight='bold')
            ax.set_title(title, fontsize=16, fontweight='bold', pad=20)

            # Add enhanced grid with major and minor gridlines - increased minor grid visibility
            ax.grid(True, which='major', alpha=0.7, linestyle='-', linewidth=0.8, color='gray')
            ax.grid(True, which='minor', alpha=0.6, linestyle=':', linewidth=0.7, color='darkgray')
            ax.minorticks_on()

            # Add axes through origin
            ax.axhline(y=0, color='k', linewidth=1.5, alpha=0.7)
            ax.axvline(x=0, color='k', linewidth=1.5, alpha=0.7)

            # Add legend
            ax.legend(fontsize=12, loc='upper right')

            # Add NerdX watermark
            self._add_watermark(ax)

            # Save the graph
            if save_path is None:
                save_path = f"temp_images/graph_{int(time.time())}.png"

            # Ensure directory exists
            os.makedirs(os.path.dirname(save_path), exist_ok=True)

            # Save with high quality
            plt.tight_layout()
            plt.savefig(save_path, dpi=150, bbox_inches='tight', 
                       facecolor='white', edgecolor='none')
            plt.close(fig)

            logger.info(f"✅ Graph created successfully: {save_path}")
            return save_path

        except Exception as e:
            logger.error(f"Error creating function graph: {str(e)}")
            plt.close('all')  # Clean up any open figures
            return None

    def create_comparison_graph(self, functions: List[str], title: str = "Function Comparison", 
                               viewport: Dict = None, save_path: str = None) -> Optional[str]:
        """Create a graph comparing multiple functions"""
        try:
            if viewport is None:
                viewport = {"xmin": -10, "xmax": 10, "ymin": -10, "ymax": 10}

            fig, ax = plt.subplots(figsize=(12, 8), dpi=150)
            x_vals = np.linspace(viewport["xmin"], viewport["xmax"], 1000)

            colors = ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D', '#6A994E', '#7209B7']

            for i, func_expr in enumerate(functions):
                try:
                    clean_expr = self._clean_expression(func_expr)
                    x = symbols('x')
                    expr_sympy = sympify(clean_expr)
                    func = lambdify(x, expr_sympy, 'numpy')

                    y_vals = func(x_vals)
                    if np.iscomplexobj(y_vals):
                        y_vals = np.real(y_vals)

                    mask = np.isfinite(y_vals)
                    x_clean = x_vals[mask]
                    y_clean = y_vals[mask]

                    color = colors[i % len(colors)]
                    ax.plot(x_clean, y_clean, color=color, linewidth=3, 
                           label=f'f{i+1}(x) = {func_expr}', alpha=0.8)

                except Exception as e:
                    logger.warning(f"Could not plot function '{func_expr}': {e}")
                    continue

            # Customize graph
            ax.set_xlim(viewport["xmin"], viewport["xmax"])
            ax.set_ylim(viewport["ymin"], viewport["ymax"])
            ax.set_xlabel('x', fontsize=14, fontweight='bold')
            ax.set_ylabel('y', fontsize=14, fontweight='bold')
            ax.set_title(title, fontsize=16, fontweight='bold', pad=20)

            # Add enhanced grid with major and minor gridlines - increased minor grid visibility
            ax.grid(True, which='major', alpha=0.7, linestyle='-', linewidth=0.8, color='gray')
            ax.grid(True, which='minor', alpha=0.6, linestyle=':', linewidth=0.7, color='darkgray')
            ax.minorticks_on()
            
            ax.axhline(y=0, color='k', linewidth=1.5, alpha=0.7)
            ax.axvline(x=0, color='k', linewidth=1.5, alpha=0.7)
            ax.legend(fontsize=10, loc='best')

            self._add_watermark(ax)

            if save_path is None:
                save_path = f"temp_images/comparison_graph_{int(time.time())}.png"

            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            plt.tight_layout()
            plt.savefig(save_path, dpi=150, bbox_inches='tight', 
                       facecolor='white', edgecolor='none')
            plt.close(fig)

            logger.info(f"✅ Comparison graph created: {save_path}")
            return save_path

        except Exception as e:
            logger.error(f"Error creating comparison graph: {str(e)}")
            plt.close('all')
            return None

    def _clean_expression(self, expr: str) -> str:
        """Clean and standardize mathematical expressions"""
        clean = expr.strip()

        # Remove y = or f(x) = prefix if present
        if clean.lower().startswith('y ='):
            clean = clean[3:].strip()
        elif clean.lower().startswith('f(x) ='):
            clean = clean[6:].strip()
        elif clean.lower().startswith('y='):
            clean = clean[2:].strip()
        elif clean.lower().startswith('f(x)='):
            clean = clean[5:].strip()

        # Replace common mathematical notation
        replacements = {
            '^': '**',          # Power notation
            'ln': 'log',        # Natural log
            'sqrt': 'sqrt',     # Square root
            'abs': 'abs',       # Absolute value
            'pi': 'pi',         # Pi constant
            'e': 'e',           # Euler's number
        }

        for old, new in replacements.items():
            clean = clean.replace(old, new)

        # Handle implicit multiplication (e.g., "3x" -> "3*x")
        import re
        clean = re.sub(r'(\d+)([a-zA-Z])', r'\1*\2', clean)

        return clean
    
    def _add_enhanced_guidelines(self, ax, viewport):
        """Add enhanced grid lines and guidelines to the graph."""
        xmin, xmax = viewport["xmin"], viewport["xmax"]
        ymin, ymax = viewport["ymin"], viewport["ymax"]

        x_range = xmax - xmin
        y_range = ymax - ymin

        # Determine appropriate grid spacing based on the viewport size
        x_ticks = np.linspace(xmin, xmax, num=min(int(x_range) + 1, 21))  # Up to 20 ticks
        y_ticks = np.linspace(ymin, ymax, num=min(int(y_range) + 1, 21))  # Up to 20 ticks

        # Draw minor grid lines
        ax.set_xticks(x_ticks, minor=True)
        ax.set_yticks(y_ticks, minor=True)

        ax.grid(which='minor', alpha=0.2, linestyle=':', linewidth=0.5)

        # Draw major grid lines
        ax.set_xticks(np.arange(xmin, xmax + 1))
        ax.set_yticks(np.arange(ymin, ymax + 1))

        ax.grid(which='major', alpha=0.5, linestyle='-', linewidth=1)


    def _add_watermark(self, ax):
        """Add NerdX watermark to the graph"""
        ax.text(0.02, 0.02, '🚀 NerdX Mathematics', transform=ax.transAxes,
                fontsize=10, alpha=0.7, fontweight='bold',
                bbox=dict(boxstyle="round,pad=0.3", facecolor="lightblue", alpha=0.3))

        # Add subtle corner watermark
        ax.text(0.98, 0.02, 'Generated by NerdX', transform=ax.transAxes,
                fontsize=8, alpha=0.5, fontweight='normal', ha='right',
                style='italic', color='gray')

    def test_graph_generation(self) -> bool:
        """Test if graph generation is working"""
        try:
            # Create a simple test graph
            test_path = self.create_function_graph("x^2", "Test Graph")

            if test_path and os.path.exists(test_path):
                logger.info("✅ Graph generation test successful")
                return True
            else:
                logger.error("❌ Graph generation test failed")
                return False

        except Exception as e:
            logger.error(f"❌ Graph generation test error: {str(e)}")
            return False

# Global instance
graph_generator = AdvancedGraphGenerator()

def generate_function_graph(expression: str, title: str = "Mathematics Graph", 
                           viewport: Dict = None) -> Optional[str]:
    """
    Generate a mathematical function graph

    Args:
        expression: Mathematical expression to plot
        title: Graph title
        viewport: Optional viewport settings

    Returns:
        Path to saved graph image or None if failed
    """
    return graph_generator.create_function_graph(expression, title, viewport)

def generate_multi_function_graph(functions: List[str], title: str = "Function Comparison",
                                 viewport: Dict = None) -> Optional[str]:
    """Generate graph with multiple functions"""
    return graph_generator.create_comparison_graph(functions, title, viewport)

if __name__ == "__main__":
    # Test the graph generator
    logging.basicConfig(level=logging.INFO)

    print("Testing Advanced Graph Generator...")
    generator = AdvancedGraphGenerator()

    if generator.test_graph_generation():
        print("✅ Graph generation is working!")

        # Test various graph types
        test_cases = [
            ("x^2", "Quadratic Function"),
            ("sin(x)", "Sine Function"),
            ("exp(x)", "Exponential Function"),
            ("log(x)", "Logarithmic Function")
        ]

        for expr, title in test_cases:
            path = generator.create_function_graph(expr, title)
            if path:
                print(f"✅ {title}: {path}")
            else:
                print(f"❌ Failed to create {title}")

        # Test comparison graph
        comparison_path = generator.create_comparison_graph(
            ["x^2", "x^3", "sin(x)"], 
            "Polynomial vs Trigonometric"
        )
        if comparison_path:
            print(f"✅ Comparison graph: {comparison_path}")
        else:
            print("❌ Failed to create comparison graph")
    else:
        print("❌ Graph generation test failed")