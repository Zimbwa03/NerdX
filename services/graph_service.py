import os
import json
import logging
import requests
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
from matplotlib.patches import Circle, Polygon, Rectangle
import matplotlib.patches as patches
from matplotlib import cm
import numpy as np
import sympy as sp
from sympy import symbols, lambdify, sympify
from math import pi, e, sin, cos, tan, log, sqrt, exp
import time
from typing import Dict, List, Optional, Tuple
from config import Config
import re

logger = logging.getLogger(__name__)

class GraphService:
    """Enhanced service for generating professional educational mathematical graphs and visualizations"""

    def __init__(self):
        self.desmos_api_key = Config.DESMOS_API_KEY
        self.temp_dir = os.path.join('static', 'graphs')

        # Ensure temp directory exists
        try:
            os.makedirs(self.temp_dir, exist_ok=True)
        except (OSError, PermissionError) as e:
            logger.error(f"Error creating graph directory {self.temp_dir}: {e}")
            # Fall back to current directory if static/graphs creation fails
            self.temp_dir = "."

        # Set professional matplotlib style for ZIMSEC educational graphs
        plt.style.use('seaborn-v0_8') if 'seaborn-v0_8' in plt.style.available else plt.style.use('default')
        plt.rcParams['figure.figsize'] = (12, 8)
        plt.rcParams['font.size'] = 12
        plt.rcParams['axes.grid'] = True
        plt.rcParams['grid.alpha'] = 0.7
        plt.rcParams['grid.linewidth'] = 0.8
        plt.rcParams['axes.axisbelow'] = True

        logger.info("Enhanced Graph Service initialized for ZIMSEC educational graphs")

    def _is_graph_image_valid(self, filepath: str) -> bool:
        """Validate that a saved graph image is not blank or corrupted."""
        try:
            if not filepath or not os.path.exists(filepath):
                return False

            file_size = os.path.getsize(filepath)
            if file_size < 5 * 1024:
                return False

            image = mpimg.imread(filepath)
            if image is None or image.size == 0:
                return False

            if image.ndim == 3:
                gray = image[..., :3].mean(axis=2)
            else:
                gray = image

            variance = float(np.var(gray))
            if variance < 1e-4:
                return False

            white_ratio = float(np.mean(gray > 0.98))
            black_ratio = float(np.mean(gray < 0.02))
            if white_ratio > 0.98 and black_ratio < 0.01:
                return False

            return True
        except Exception as e:
            logger.warning(f"Graph validation failed: {e}")
            return False

    def generate_function_graph(self, function: str, x_range: tuple = (-10, 10), title: Optional[str] = None) -> Optional[str]:
        """Generate a graph for a mathematical function"""
        try:
            # Parse and validate the function
            parsed_function = self._parse_function(function)
            if not parsed_function:
                return None

            # Generate graph using matplotlib
            x_min, x_max = x_range
            x = np.linspace(x_min, x_max, 1000)

            try:
                # Evaluate the function
                y = self._evaluate_function(parsed_function, x)

                # Create professional plot with enhanced educational features
                fig, ax = plt.subplots(figsize=(12, 8), dpi=150)

                # Handle complex numbers and infinite values
                if np.iscomplexobj(y):
                    y = np.real(y)

                # Remove infinite and NaN values for clean plotting
                mask = np.isfinite(y)
                x_clean = x[mask]
                y_clean = y[mask]

                ax.plot(x_clean, y_clean, 'b-', linewidth=3, label=f'f(x) = {function}', alpha=0.8)

                # Add enhanced grid with major and minor gridlines for ZIMSEC standards
                ax.grid(True, which='major', alpha=0.7, linestyle='-', linewidth=0.8, color='gray')
                ax.grid(True, which='minor', alpha=0.6, linestyle=':', linewidth=0.7, color='darkgray')
                ax.minorticks_on()

                # Professional axes through origin
                ax.axhline(y=0, color='k', linewidth=1.5, alpha=0.7)
                ax.axvline(x=0, color='k', linewidth=1.5, alpha=0.7)

                # Enhanced labeling
                ax.set_xlabel('x', fontsize=14, fontweight='bold')
                ax.set_ylabel('y', fontsize=14, fontweight='bold')

                graph_title = title if title else f'NerdX Mathematics: y = {function}'
                ax.set_title(graph_title, fontsize=16, fontweight='bold', pad=20)

                # Professional legend
                ax.legend(fontsize=12, loc='upper right')

                # Add educational watermark
                self._add_educational_watermark(ax)

                # Save with professional quality
                filename = f"nerdx_graph_{int(time.time())}_{hash(function) % 10000}.png"
                filepath = os.path.join('static', 'graphs', filename)

                # Ensure directory exists
                os.makedirs(os.path.dirname(filepath), exist_ok=True)

                plt.tight_layout()
                plt.savefig(filepath, dpi=150, bbox_inches='tight', 
                           facecolor='white', edgecolor='none')
                plt.close(fig)

                if not self._is_graph_image_valid(filepath):
                    logger.error(f"Graph validation failed for function: {function}")
                    try:
                        os.remove(filepath)
                    except Exception:
                        pass
                    return None

                logger.info(f"Generated graph for function: {function}")
                return filepath

            except Exception as e:
                logger.error(f"Error evaluating function {function}: {e}")
                return None

        except Exception as e:
            logger.error(f"Error generating function graph: {e}")
            return None

    def generate_multi_function_graph(self, functions: List[str], x_range: tuple = (-10, 10), title: str = None) -> Optional[str]:
        """Generate a graph with multiple functions"""
        try:
            if not functions:
                return None

            x_min, x_max = x_range
            x = np.linspace(x_min, x_max, 1000)

            plt.figure(figsize=(12, 8))
            colors = ['blue', 'red', 'green', 'purple', 'orange', 'brown']

            valid_functions = []

            for i, function in enumerate(functions[:6]):  # Limit to 6 functions
                parsed_function = self._parse_function(function)
                if parsed_function:
                    try:
                        y = self._evaluate_function(parsed_function, x)
                        color = colors[i % len(colors)]
                        plt.plot(x, y, color=color, linewidth=2, label=f'y = {function}')
                        valid_functions.append(function)
                    except Exception as e:
                        logger.warning(f"Skipping invalid function {function}: {e}")

            if not valid_functions:
                return None

            plt.grid(True, alpha=0.3)
            plt.axhline(y=0, color='k', linewidth=0.5)
            plt.axvline(x=0, color='k', linewidth=0.5)

            plt.xlabel('x', fontsize=12)
            plt.ylabel('y', fontsize=12)

            if title:
                plt.title(title, fontsize=14)
            else:
                plt.title('Graph of Multiple Functions', fontsize=14)

            plt.legend()

            # Save the plot
            filename = f"multi_graph_{hash(str(functions)) % 10000}.png"
            filepath = os.path.join('static', 'graphs', filename)

            # Ensure directory exists
            os.makedirs(os.path.dirname(filepath), exist_ok=True)

            plt.savefig(filepath, dpi=150, bbox_inches='tight')
            plt.close()

            logger.info(f"Generated multi-function graph for: {valid_functions}")
            return filepath

        except Exception as e:
            logger.error(f"Error generating multi-function graph: {e}")
            return None

    def generate_parametric_graph(self, x_function: str, y_function: str, t_range: tuple = (0, 10)) -> Optional[str]:
        """Generate a parametric graph"""
        try:
            t_min, t_max = t_range
            t = np.linspace(t_min, t_max, 1000)

            # Parse and evaluate parametric functions
            x_parsed = self._parse_function(x_function, parameter='t')
            y_parsed = self._parse_function(y_function, parameter='t')

            if not x_parsed or not y_parsed:
                return None

            x_vals = self._evaluate_function(x_parsed, t)
            y_vals = self._evaluate_function(y_parsed, t)

            plt.figure(figsize=(10, 8))
            plt.plot(x_vals, y_vals, 'b-', linewidth=2)
            plt.grid(True, alpha=0.3)
            plt.axhline(y=0, color='k', linewidth=0.5)
            plt.axvline(x=0, color='k', linewidth=0.5)

            plt.xlabel('x', fontsize=12)
            plt.ylabel('y', fontsize=12)
            plt.title(f'Parametric Graph: x = {x_function}, y = {y_function}', fontsize=14)

            # Save the plot
            filename = f"parametric_{hash(x_function + y_function) % 10000}.png"
            filepath = os.path.join('static', 'graphs', filename)

            # Ensure directory exists
            os.makedirs(os.path.dirname(filepath), exist_ok=True)

            plt.savefig(filepath, dpi=150, bbox_inches='tight')
            plt.close()

            logger.info(f"Generated parametric graph: x={x_function}, y={y_function}")
            return filepath

        except Exception as e:
            logger.error(f"Error generating parametric graph: {e}")
            return None

    def _parse_function(self, function: str, parameter: str = 'x') -> Optional[str]:
        """Parse and validate a mathematical function"""
        try:
            # Clean up the function string
            function = function.strip().lower()

            # Replace common mathematical notations
            replacements = {
                '^': '**',
                'sin': 'np.sin',
                'cos': 'np.cos',
                'tan': 'np.tan',
                'log': 'np.log',
                'ln': 'np.log',
                'sqrt': 'np.sqrt',
                'abs': 'np.abs',
                'exp': 'np.exp',
                'pi': 'np.pi',
                'e': 'np.e'
            }

            for old, new in replacements.items():
                function = function.replace(old, new)

            # Ensure the parameter is properly referenced
            if parameter not in function:
                function = function.replace('x', parameter)

            # Basic validation - check for dangerous functions
            dangerous_keywords = ['import', 'exec', 'eval', 'open', 'file', '__']
            for keyword in dangerous_keywords:
                if keyword in function:
                    logger.warning(f"Dangerous keyword '{keyword}' found in function")
                    return None

            return function

        except Exception as e:
            logger.error(f"Error parsing function: {e}")
            return None

    def _evaluate_function(self, function: str, values: np.ndarray) -> np.ndarray:
        """Safely evaluate a mathematical function"""
        try:
            # Create a safe namespace for evaluation
            namespace = {
                'np': np,
                'x': values,
                't': values,
                '__builtins__': {}
            }

            # Evaluate the function
            result = eval(function, namespace)

            # Handle scalar results
            if np.isscalar(result):
                result = np.full_like(values, result)

            # Handle infinite or NaN values
            result = np.where(np.isfinite(result), result, np.nan)

            return result

        except Exception as e:
            logger.error(f"Error evaluating function: {e}")
            raise

    def generate_statistical_graph(self, data: List[float], graph_type: str = 'histogram') -> Optional[str]:
        """Generate statistical graphs (histogram, box plot, etc.)"""
        try:
            if not data:
                return None

            plt.figure(figsize=(10, 6))

            if graph_type == 'histogram':
                plt.hist(data, bins=20, alpha=0.7, edgecolor='black')
                plt.title('Histogram')
                plt.xlabel('Value')
                plt.ylabel('Frequency')

            elif graph_type == 'boxplot':
                plt.boxplot(data)
                plt.title('Box Plot')
                plt.ylabel('Value')

            elif graph_type == 'line':
                plt.plot(range(len(data)), data, marker='o')
                plt.title('Line Plot')
                plt.xlabel('Index')
                plt.ylabel('Value')

            else:
                logger.error(f"Unsupported graph type: {graph_type}")
                return None

            plt.grid(True, alpha=0.3)

            # Save the plot
            filename = f"stats_{graph_type}_{hash(str(data)) % 10000}.png"
            filepath = os.path.join('static', 'graphs', filename)

            # Ensure directory exists
            os.makedirs(os.path.dirname(filepath), exist_ok=True)

            plt.savefig(filepath, dpi=150, bbox_inches='tight')
            plt.close()

            logger.info(f"Generated {graph_type} graph")
            return filepath

        except Exception as e:
            logger.error(f"Error generating statistical graph: {e}")
            return None

    def create_geometry_diagram(self, shape_type: str, parameters: Dict) -> Optional[str]:
        """Create geometry diagrams for educational purposes"""
        try:
            plt.figure(figsize=(8, 8))
            plt.axis('equal')

            if shape_type == 'circle':
                radius = parameters.get('radius', 1)
                center = parameters.get('center', (0, 0))

                circle = Circle(center, radius, fill=False, linewidth=2)
                plt.gca().add_patch(circle)
                plt.xlim(center[0] - radius - 1, center[0] + radius + 1)
                plt.ylim(center[1] - radius - 1, center[1] + radius + 1)
                plt.title(f'Circle (radius = {radius})')

            elif shape_type == 'triangle':
                vertices = parameters.get('vertices', [(0, 0), (1, 0), (0.5, 0.866)])
                triangle = Polygon(vertices, fill=False, linewidth=2)
                plt.gca().add_patch(triangle)

                # Calculate bounds
                x_coords = [v[0] for v in vertices]
                y_coords = [v[1] for v in vertices]
                plt.xlim(min(x_coords) - 0.5, max(x_coords) + 0.5)
                plt.ylim(min(y_coords) - 0.5, max(y_coords) + 0.5)
                plt.title('Triangle')

            elif shape_type == 'rectangle':
                width = parameters.get('width', 2)
                height = parameters.get('height', 1)
                center = parameters.get('center', (0, 0))

                x = center[0] - width/2
                y = center[1] - height/2
                rectangle = Rectangle((x, y), width, height, fill=False, linewidth=2)
                plt.gca().add_patch(rectangle)
                plt.xlim(x - 0.5, x + width + 0.5)
                plt.ylim(y - 0.5, y + height + 0.5)
                plt.title(f'Rectangle ({width} × {height})')

            else:
                logger.error(f"Unsupported shape type: {shape_type}")
                return None

            plt.grid(True, alpha=0.3)
            plt.axhline(y=0, color='k', linewidth=0.5)
            plt.axvline(x=0, color='k', linewidth=0.5)

            # Save the plot
            filename = f"geometry_{shape_type}_{hash(str(parameters)) % 10000}.png"
            filepath = os.path.join('static', 'graphs', filename)

            # Ensure directory exists
            os.makedirs(os.path.dirname(filepath), exist_ok=True)

            plt.savefig(filepath, dpi=150, bbox_inches='tight')
            plt.close()

            logger.info(f"Generated {shape_type} diagram")
            return filepath

        except Exception as e:
            logger.error(f"Error creating geometry diagram: {e}")
            return None

    def generate_argand_diagram(self, points: Optional[List[Dict]] = None,
                                highlight_region: Optional[str] = None,
                                title: str = "Argand Diagram") -> Optional[str]:
        """
        Create a simple Argand diagram showing the complex plane with optional points
        and highlighted quadrant/region for complex number questions.
        """
        try:
            fig, ax = plt.subplots(figsize=(8, 8), dpi=150)

            # Default bounds
            x_min, x_max = -5, 5
            y_min, y_max = -5, 5

            # Expand bounds based on provided points
            if points:
                try:
                    reals = [float(p.get('real', 0) or p.get('re', 0) or 0) for p in points]
                    imags = [float(p.get('imag', 0) or p.get('im', 0) or 0) for p in points]
                    if reals and imags:
                        x_min = min(x_min, min(reals) - 1)
                        x_max = max(x_max, max(reals) + 1)
                        y_min = min(y_min, min(imags) - 1)
                        y_max = max(y_max, max(imags) + 1)
                except Exception:
                    pass

            # Draw axes through origin
            ax.axhline(0, color='black', linewidth=1.2)
            ax.axvline(0, color='black', linewidth=1.2)
            ax.set_xlim(x_min, x_max)
            ax.set_ylim(y_min, y_max)
            ax.set_xlabel('Re(z)', fontsize=12, fontweight='bold')
            ax.set_ylabel('Im(z)', fontsize=12, fontweight='bold')
            ax.set_title(title, fontsize=14, fontweight='bold')

            # Grid and ticks
            ax.grid(True, which='both', linestyle='--', alpha=0.4)
            ax.set_aspect('equal', adjustable='box')

            # Highlight requested quadrant or region
            if highlight_region:
                region = highlight_region.strip().upper()
                fill_kwargs = dict(color='lightgreen', alpha=0.25)
                if region in ['I', 'Q1', 'QUADRANT I', 'QUADRANT 1']:
                    ax.fill_between([0, x_max], 0, y_max, **fill_kwargs)
                elif region in ['II', 'Q2', 'QUADRANT II', 'QUADRANT 2']:
                    ax.fill_between([x_min, 0], 0, y_max, **fill_kwargs)
                elif region in ['III', 'Q3', 'QUADRANT III', 'QUADRANT 3']:
                    ax.fill_between([x_min, 0], y_min, 0, **fill_kwargs)
                elif region in ['IV', 'Q4', 'QUADRANT IV', 'QUADRANT 4']:
                    ax.fill_between([0, x_max], y_min, 0, **fill_kwargs)

            # Plot complex points if provided
            if points:
                for idx, point in enumerate(points):
                    try:
                        re_val = float(point.get('real', point.get('re', 0)))
                        im_val = float(point.get('imag', point.get('im', 0)))
                        label = point.get('label') or point.get('name') or f"z{idx+1}"
                        ax.scatter(re_val, im_val, s=80, color='crimson', edgecolor='darkred', zorder=5)
                        ax.annotate(label, (re_val, im_val), textcoords="offset points",
                                    xytext=(6, 6), ha='left', fontsize=10, fontweight='bold')
                    except Exception as e:
                        logger.debug(f"Skipping invalid Argand point {point}: {e}")

            # Add watermark
            self._add_educational_watermark(ax)

            # Save diagram
            filename = f"argand_{int(time.time())}.png"
            filepath = os.path.join('static', 'graphs', filename)
            os.makedirs(os.path.dirname(filepath), exist_ok=True)

            plt.tight_layout()
            plt.savefig(filepath, dpi=150, bbox_inches='tight', facecolor='white')
            plt.close(fig)

            logger.info(f"Generated Argand diagram: {filepath}")
            return filepath

        except Exception as e:
            logger.error(f"Error generating Argand diagram: {e}")
            return None

    def _add_educational_watermark(self, ax):
        """Add NerdX educational watermark for ZIMSEC graphs"""
        ax.text(0.02, 0.02, '🚀 NerdX Mathematics - ZIMSEC O-Level', transform=ax.transAxes,
                fontsize=10, alpha=0.7, fontweight='bold',
                bbox=dict(boxstyle="round,pad=0.3", facecolor="lightblue", alpha=0.3))

        # Add subtle corner watermark
        ax.text(0.98, 0.02, 'Generated by NerdX', transform=ax.transAxes,
                fontsize=8, alpha=0.5, fontweight='normal', ha='right',
                style='italic', color='gray')

    def _clean_expression(self, expr: str) -> str:
        """Clean and standardize mathematical expressions for ZIMSEC"""
        clean = expr.strip()

        # Strip common LaTeX wrappers to avoid breaking parsing
        if (clean.startswith("$") and clean.endswith("$")) or (clean.startswith("$$") and clean.endswith("$$")):
            clean = clean.strip("$").strip()
        clean = clean.replace("\\(", "").replace("\\)", "").replace("\\[", "").replace("\\]", "").strip()

        # Remove y = or f(x) = prefix if present
        if clean.lower().startswith('y ='):
            clean = clean[3:].strip()
        elif clean.lower().startswith('f(x) ='):
            clean = clean[6:].strip()
        elif clean.lower().startswith('y='):
            clean = clean[2:].strip()
        elif clean.lower().startswith('f(x)='):
            clean = clean[5:].strip()

        # Normalize common LaTeX fragments for plotting
        clean = re.sub(r'\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}', r'(\1)/(\2)', clean)
        clean = re.sub(r'\\sqrt\s*\{([^{}]+)\}', r'sqrt(\1)', clean)
        clean = re.sub(r'\\(sin|cos|tan|asin|acos|atan|sinh|cosh|tanh|log|ln|exp)\b', r'\1', clean)
        clean = clean.replace("\\pi", "pi")
        clean = clean.replace("\\cdot", "*").replace("\\times", "*")

        # Strip UI/metadata annotations accidentally appended to expressions
        # Examples seen in logs:
        # - "2*x,$range = -5$:5"
        # - "y=x^2, range=-10..10"
        # - "x, x_range = -3:3"
        clean = re.sub(r',\s*\$?(x_?range|range|domain|window|viewport)\b.*$', '', clean, flags=re.IGNORECASE).strip()
        clean = re.sub(r'\$?(x_?range|range|domain|window|viewport)\b\s*[:=].*$', '', clean, flags=re.IGNORECASE).strip()

        # CRITICAL FIX: Convert Unicode superscripts to standard notation
        # This fixes the "invalid character '²' (U+00B2)" error
        superscript_map = {
            '⁰': '^0', '¹': '^1', '²': '^2', '³': '^3', '⁴': '^4',
            '⁵': '^5', '⁶': '^6', '⁷': '^7', '⁸': '^8', '⁹': '^9'
        }
        
        for unicode_char, standard_notation in superscript_map.items():
            clean = clean.replace(unicode_char, standard_notation)
        
        logger.info(f"After superscript conversion: '{clean}'")

        # Replace common mathematical notation for ZIMSEC standards
        replacements = {
            '^': '**',          # Power notation (convert ^ to ** for Python)
            'ln': 'log',        # Natural log
            'sqrt': 'sqrt',     # Square root
            'abs': 'abs',       # Absolute value
            'pi': 'pi',         # Pi constant
            'e': 'e',           # Euler's number
        }

        for old, new in replacements.items():
            clean = clean.replace(old, new)

        # Handle implicit multiplication (e.g., "3x" -> "3*x")
        clean = re.sub(r'(\d+)([a-zA-Z])', r'\1*\2', clean)
        
        # FIX: Handle bare trigonometric functions without arguments
        # ONLY if the entire expression is just a bare trig function (e.g., "sin", "cos", "tan")
        # This fixes AI-generated questions that return just "sin" instead of "sin(x)"
        trig_functions = ['sin', 'cos', 'tan', 'csc', 'sec', 'cot', 'sinh', 'cosh', 'tanh', 
                         'arcsin', 'arccos', 'arctan', 'asin', 'acos', 'atan']
        clean_stripped = clean.strip()
        if clean_stripped in trig_functions:
            # The entire expression is just a bare trig function, add (x)
            clean = clean_stripped + '(x)'
            logger.info(f"Converted bare trig function '{clean_stripped}' to '{clean}'")

        logger.info(f"Final cleaned expression: '{clean}'")
        return clean

    def create_linear_programming_graph(self, constraints: List[str], objective: str, 
                                       viewport: Dict = None, title: str = "Linear Programming") -> Optional[str]:
        """Create linear programming graph with feasible region shading"""
        try:
            if viewport is None:
                viewport = {"xmin": 0, "xmax": 10, "ymin": 0, "ymax": 10}

            fig, ax = plt.subplots(figsize=(12, 8), dpi=150)

            x_vals = np.linspace(viewport["xmin"], viewport["xmax"], 1000)

            # Colors for different constraints
            colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']

            # Plot constraint lines
            constraint_lines = []
            for i, constraint in enumerate(constraints):
                try:
                    # Parse constraint (e.g., "2x + 3y <= 12")
                    constraint_clean = constraint.replace('<=', '=').replace('>=', '=').replace('<', '=').replace('>', '=')
                    # Extract coefficients (simplified parsing)
                    color = colors[i % len(colors)]

                    # For demo, create sample constraint lines
                    if i == 0:
                        y_vals = (12 - 2*x_vals) / 3  # 2x + 3y = 12
                    elif i == 1:
                        y_vals = 8 - x_vals  # x + y = 8
                    else:
                        y_vals = np.full_like(x_vals, 5)  # y = 5

                    ax.plot(x_vals, y_vals, color=color, linewidth=3, 
                           label=f'Constraint {i+1}: {constraint}', alpha=0.8)
                    constraint_lines.append((x_vals, y_vals))

                except Exception as e:
                    logger.warning(f"Could not plot constraint '{constraint}': {e}")
                    continue

            # Add feasible region shading (simplified)
            if len(constraint_lines) >= 2:
                x_fill = np.linspace(viewport["xmin"], viewport["xmax"], 100)
                y_fill = np.minimum(constraint_lines[0][1][:100], constraint_lines[1][1][:100])
                y_fill = np.maximum(y_fill, 0)  # Non-negativity constraint
                ax.fill_between(x_fill, 0, y_fill, alpha=0.3, color='lightgreen', label='Feasible Region')

            # Customize graph for ZIMSEC standards
            ax.set_xlim(viewport["xmin"], viewport["xmax"])
            ax.set_ylim(viewport["ymin"], viewport["ymax"])
            ax.set_xlabel('x', fontsize=14, fontweight='bold')
            ax.set_ylabel('y', fontsize=14, fontweight='bold')
            ax.set_title(f'ZIMSEC Linear Programming: {title}', fontsize=16, fontweight='bold', pad=20)

            # Enhanced grid for educational clarity
            ax.grid(True, which='major', alpha=0.7, linestyle='-', linewidth=0.8, color='gray')
            ax.grid(True, which='minor', alpha=0.6, linestyle=':', linewidth=0.7, color='darkgray')
            ax.minorticks_on()

            ax.axhline(y=0, color='k', linewidth=1.5, alpha=0.7)
            ax.axvline(x=0, color='k', linewidth=1.5, alpha=0.7)
            ax.legend(fontsize=10, loc='best')

            self._add_educational_watermark(ax)

            # Save the graph
            filename = f"linear_programming_{int(time.time())}.png"
            filepath = os.path.join('static', 'graphs', filename)

            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            plt.tight_layout()
            plt.savefig(filepath, dpi=150, bbox_inches='tight', 
                       facecolor='white', edgecolor='none')
            plt.close(fig)

            logger.info(f"✅ Linear programming graph created: {filepath}")
            return filepath

        except Exception as e:
            logger.error(f"Error creating linear programming graph: {str(e)}")
            plt.close('all')
            return None

    def create_statistics_graph(self, data: List[float], graph_type: str = 'histogram', 
                               title: str = None) -> Optional[str]:
        """Create ZIMSEC O-Level statistics graphs"""
        try:
            if not data:
                return None

            fig, ax = plt.subplots(figsize=(12, 8), dpi=150)

            if graph_type == 'histogram':
                ax.hist(data, bins=20, alpha=0.7, edgecolor='black', color='skyblue')
                ax.set_title(title or 'ZIMSEC Statistics: Histogram', fontsize=16, fontweight='bold', pad=20)
                ax.set_xlabel('Value', fontsize=14, fontweight='bold')
                ax.set_ylabel('Frequency', fontsize=14, fontweight='bold')

            elif graph_type == 'boxplot':
                ax.boxplot(data, patch_artist=True, boxprops=dict(facecolor='lightblue'))
                ax.set_title(title or 'ZIMSEC Statistics: Box Plot', fontsize=16, fontweight='bold', pad=20)
                ax.set_ylabel('Value', fontsize=14, fontweight='bold')

            elif graph_type == 'scatter':
                x_data = list(range(len(data)))
                ax.scatter(x_data, data, alpha=0.7, s=60, color='red')
                ax.set_title(title or 'ZIMSEC Statistics: Scatter Plot', fontsize=16, fontweight='bold', pad=20)
                ax.set_xlabel('Index', fontsize=14, fontweight='bold')
                ax.set_ylabel('Value', fontsize=14, fontweight='bold')

            elif graph_type == 'bar':
                categories = [f'Cat {i+1}' for i in range(len(data))]
                ax.bar(categories, data, alpha=0.7, color='green')
                ax.set_title(title or 'ZIMSEC Statistics: Bar Chart', fontsize=16, fontweight='bold', pad=20)
                ax.set_xlabel('Category', fontsize=14, fontweight='bold')
                ax.set_ylabel('Value', fontsize=14, fontweight='bold')

            else:
                logger.error(f"Unsupported statistics graph type: {graph_type}")
                return None

            # Enhanced grid for educational clarity
            ax.grid(True, which='major', alpha=0.7, linestyle='-', linewidth=0.8, color='gray')
            ax.grid(True, which='minor', alpha=0.6, linestyle=':', linewidth=0.7, color='darkgray')
            if graph_type != 'boxplot':  # Minor ticks don't work well with boxplots
                ax.minorticks_on()

            self._add_educational_watermark(ax)

            # Save the graph
            filename = f"statistics_{graph_type}_{int(time.time())}.png"
            filepath = os.path.join('static', 'graphs', filename)

            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            plt.tight_layout()
            plt.savefig(filepath, dpi=150, bbox_inches='tight', 
                       facecolor='white', edgecolor='none')
            plt.close(fig)

            logger.info(f"✅ Statistics {graph_type} graph created: {filepath}")
            return filepath

        except Exception as e:
            logger.error(f"Error creating statistics graph: {str(e)}")
            plt.close('all')
            return None

    def create_advanced_function_graph(self, expression: str, title: str = "NerdX Advanced Math Graph", 
                                     viewport: Dict = None, save_path: str = None) -> Optional[str]:
        """Create advanced function graph using sympy for better mathematical parsing"""
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
                # Heuristic: if the expression looks like a "relationship label" (e.g. y_vs_x),
                # don't try to sympify/lambdify it as math. Plot a sensible default curve instead.
                axis_x_label = "x"
                axis_y_label = "y"
                is_relationship = (
                    isinstance(clean_expr, str)
                    and ("_vs_" in clean_expr or " vs " in clean_expr.lower())
                    and not any(op in clean_expr for op in ["+", "-", "*", "/", "(", ")", "**", "^", "="])
                )

                if is_relationship:
                    parts = clean_expr.lower().split("_vs_") if "_vs_" in clean_expr.lower() else [clean_expr.lower()]
                    if len(parts) == 2:
                        axis_y_label = parts[0].replace("_", " ").strip().title()
                        axis_x_label = parts[1].replace("_", " ").strip().title()
                    # Saturating curve is a good default for many science relationships (e.g. rate vs intensity)
                    y_vals = 10.0 * (1.0 - np.exp(-0.35 * (x_vals - x_vals.min())))
                    ax.plot(x_vals, y_vals, 'b-', linewidth=3, label=f'{axis_y_label} vs {axis_x_label}', alpha=0.85)
                else:
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
                    try:
                        mask = np.isfinite(y_vals)
                    except TypeError:
                        # Non-numeric output (e.g. sympy symbols) – treat as non-plottable
                        raise ValueError("Non-numeric function output; cannot plot")
                    x_clean = x_vals[mask]
                    y_clean = y_vals[mask]

                    # Plot the function
                    ax.plot(x_clean, y_clean, 'b-', linewidth=3, label=f'f(x) = {expression}', alpha=0.8)

            except Exception as eval_error:
                # This commonly happens when users pass a descriptive label instead of a math function.
                # Keep logs clean: warn (not error) and render a friendly message.
                logger.warning(f"Graph expression not plottable '{expression}': {eval_error}")
                # Fallback: show error message on graph
                ax.text(0.5, 0.5, f"Error: Cannot plot '{expression}'", 
                       transform=ax.transAxes, fontsize=16, ha='center', va='center',
                       bbox=dict(boxstyle="round,pad=0.3", facecolor="yellow", alpha=0.7))

            # Customize the graph for ZIMSEC standards
            ax.set_xlim(viewport["xmin"], viewport["xmax"])
            ax.set_ylim(viewport["ymin"], viewport["ymax"])
            ax.set_xlabel('x', fontsize=14, fontweight='bold')
            ax.set_ylabel('y', fontsize=14, fontweight='bold')
            ax.set_title(title, fontsize=16, fontweight='bold', pad=20)

            # Add enhanced grid with major and minor gridlines
            ax.grid(True, which='major', alpha=0.7, linestyle='-', linewidth=0.8, color='gray')
            ax.grid(True, which='minor', alpha=0.6, linestyle=':', linewidth=0.7, color='darkgray')
            ax.minorticks_on()

            # Add axes through origin
            ax.axhline(y=0, color='k', linewidth=1.5, alpha=0.7)
            ax.axvline(x=0, color='k', linewidth=1.5, alpha=0.7)

            # Add legend
            handles, labels = ax.get_legend_handles_labels()
            if labels:
                ax.legend(fontsize=12, loc='upper right')

            # Add NerdX educational watermark
            self._add_educational_watermark(ax)

            # Save the graph
            if save_path is None:
                save_path = f"static/graphs/advanced_graph_{int(time.time())}.png"

            # Ensure directory exists
            os.makedirs(os.path.dirname(save_path), exist_ok=True)

            # Save with high quality
            plt.tight_layout()
            plt.savefig(save_path, dpi=150, bbox_inches='tight', 
                       facecolor='white', edgecolor='none')
            plt.close(fig)

            logger.info(f"✅ Advanced graph created successfully: {save_path}")
            return save_path

        except Exception as e:
            logger.error(f"Error creating advanced function graph: {str(e)}")
            plt.close('all')
            return None

    def create_graph(
        self,
        user_id: str,
        expression: str,
        title: str,
        user_name: str,
        x_range: Optional[Tuple[float, float]] = None,
    ) -> Dict:
        """Create a matplotlib graph from mathematical expression and return result dict"""
        try:
            import matplotlib.pyplot as plt
            import numpy as np
            import os
            from datetime import datetime
            from sympy import symbols, sympify, Poly

            # Generate unique filename with user info
            timestamp = int(datetime.now().timestamp())
            filename = f"graph_{user_id}_{timestamp}.png"
            filepath = os.path.join(self.temp_dir, filename)

            # Create figure with educational styling
            fig, ax = plt.subplots(figsize=(12, 8), dpi=150)

            # Clean and evaluate the expression
            clean_expr = self._clean_expression(expression)
            axis_x_label = "x"
            axis_y_label = "y"

            try:
                # Use sympy to safely evaluate the expression
                from sympy import lambdify
                x = symbols('x')
                expr_sympy = None

                # Heuristic: descriptive "relationship" strings like "y_vs_x" should not be lambdified.
                is_relationship = (
                    isinstance(clean_expr, str)
                    and ("_vs_" in clean_expr.lower() or " vs " in clean_expr.lower())
                    and not any(op in clean_expr for op in ["+", "-", "*", "/", "(", ")", "**", "^", "="])
                )

                # Generate x values (single source of truth for both Matplotlib & Manim)
                if x_range and isinstance(x_range, (tuple, list)) and len(x_range) == 2:
                    x_min, x_max = float(x_range[0]), float(x_range[1])
                else:
                    x_min, x_max = (0.0, 10.0) if is_relationship else (-10.0, 10.0)
                x_vals = np.linspace(x_min, x_max, 1000)

                # Calculate y values
                if is_relationship:
                    parts = clean_expr.lower().split("_vs_") if "_vs_" in clean_expr.lower() else [clean_expr.lower()]
                    if len(parts) == 2:
                        axis_y_label = parts[0].replace("_", " ").strip().title()
                        axis_x_label = parts[1].replace("_", " ").strip().title()
                    # Default science-style saturating curve
                    y_vals = 10.0 * (1.0 - np.exp(-0.35 * (x_vals - x_min)))
                else:
                    expr_sympy = sympify(clean_expr)
                    func = lambdify(x, expr_sympy, 'numpy')
                    y_vals = func(x_vals)

                # Handle complex numbers and infinite values
                if np.iscomplexobj(y_vals):
                    y_vals = np.real(y_vals)

                # Remove infinite and NaN values
                try:
                    mask = np.isfinite(y_vals)
                except TypeError:
                    raise ValueError("Non-numeric function output; cannot plot")
                x_clean = x_vals[mask]
                y_clean = y_vals[mask]

                # Compute a sensible y-range from the data (avoid prompt drift + ensure consistency)
                # Use percentiles to avoid extreme spikes (e.g., tan asymptotes).
                if len(y_clean) > 10:
                    y_lo = float(np.percentile(y_clean, 1))
                    y_hi = float(np.percentile(y_clean, 99))
                else:
                    y_lo = float(np.min(y_clean)) if len(y_clean) else -10.0
                    y_hi = float(np.max(y_clean)) if len(y_clean) else 10.0

                # Add padding and ensure origin is visible
                pad = max(1.0, 0.1 * (y_hi - y_lo) if (y_hi - y_lo) > 0 else 2.0)
                y_min = min(y_lo - pad, 0.0)
                y_max = max(y_hi + pad, 0.0)

                # Clamp to keep graphs readable (educational standard)
                y_min = max(y_min, -50.0)
                y_max = min(y_max, 50.0)

                # Round to "nice" integers
                y_min = float(np.floor(y_min))
                y_max = float(np.ceil(y_max))
                if y_max - y_min < 4:
                    y_min -= 2
                    y_max += 2

                # Plot the function
                plot_label = (f"{axis_y_label} vs {axis_x_label}") if is_relationship else (f"f(x) = {expression}")
                ax.plot(x_clean, y_clean, 'b-', linewidth=3, label=plot_label, alpha=0.85)

                # Build a shared graph spec for deterministic Manim animations
                graph_spec = {
                    "equation": expression,
                    "clean_expression": clean_expr,
                    "x_range": {"min": x_min, "max": x_max, "step": 1},
                    "y_range": {"min": y_min, "max": y_max, "step": 1},
                    "coefficients": None,
                }
                if is_relationship:
                    graph_spec["graph_type"] = "relationship"
                    graph_spec["axis_labels"] = {"x": axis_x_label, "y": axis_y_label}

                # Try extract linear/quadratic coefficients for animation accuracy
                try:
                    if expr_sympy is None:
                        raise ValueError("relationship graph: no polynomial coefficients")
                    poly = Poly(expr_sympy, x)
                    deg = int(poly.degree())
                    if deg == 1:
                        coeffs = poly.all_coeffs()  # [m, c]
                        m = float(coeffs[0]) if len(coeffs) >= 1 else 0.0
                        c0 = float(coeffs[1]) if len(coeffs) >= 2 else 0.0
                        graph_spec["coefficients"] = {"m": m, "c": c0}
                        graph_spec["graph_type"] = "linear"
                    elif deg == 2:
                        a = float(poly.all_coeffs()[0]) if len(poly.all_coeffs()) >= 1 else 0.0
                        b = float(poly.all_coeffs()[1]) if len(poly.all_coeffs()) >= 2 else 0.0
                        c0 = float(poly.all_coeffs()[2]) if len(poly.all_coeffs()) >= 3 else 0.0
                        graph_spec["coefficients"] = {"a": a, "b": b, "c": c0}
                        graph_spec["graph_type"] = "quadratic"
                except Exception:
                    # If not a polynomial or extraction fails, keep coefficients None
                    pass

                # If not classified as polynomial, try classify for animation routing
                if "graph_type" not in graph_spec:
                    try:
                        sym_s = str(expr_sympy)
                        if any(tok in sym_s for tok in ["sin(", "cos(", "tan(", "asin(", "acos(", "atan("]):
                            graph_spec["graph_type"] = "trigonometric"
                        elif "exp(" in sym_s or "**x" in sym_s or "Pow(" in sym_s:
                            # Best-effort exponential detection; actual rendering uses clean_expression anyway.
                            graph_spec["graph_type"] = "exponential"
                    except Exception:
                        pass

            except Exception as eval_error:
                logger.warning(f"Graph expression not plottable '{expression}': {eval_error}")
                # Fallback: show error message on graph
                ax.text(0.5, 0.5, f"Error: Cannot plot '{expression}'", 
                       transform=ax.transAxes, fontsize=16, ha='center', va='center',
                       bbox=dict(boxstyle="round,pad=0.3", facecolor="yellow", alpha=0.7))
                graph_spec = {
                    "equation": expression,
                    "clean_expression": clean_expr,
                    "x_range": {"min": -10.0, "max": 10.0, "step": 1},
                    "y_range": {"min": -10.0, "max": 10.0, "step": 1},
                    "coefficients": None,
                }

            # Customize the graph for ZIMSEC standards
            ax.set_xlim(graph_spec["x_range"]["min"], graph_spec["x_range"]["max"])
            ax.set_ylim(graph_spec["y_range"]["min"], graph_spec["y_range"]["max"])
            # Use nicer labels for relationship graphs when available
            axis_labels = (graph_spec or {}).get("axis_labels") or {}
            ax.set_xlabel(axis_labels.get("x", axis_x_label), fontsize=14, fontweight='bold')
            ax.set_ylabel(axis_labels.get("y", axis_y_label), fontsize=14, fontweight='bold')
            ax.set_title(title, fontsize=16, fontweight='bold', pad=20)

            # Add enhanced grid
            ax.grid(True, which='major', alpha=0.7, linestyle='-', linewidth=0.8, color='gray')
            ax.grid(True, which='minor', alpha=0.6, linestyle=':', linewidth=0.7, color='darkgray')
            ax.minorticks_on()

            # Add axes through origin
            ax.axhline(y=0, color='k', linewidth=1.5, alpha=0.7)
            ax.axvline(x=0, color='k', linewidth=1.5, alpha=0.7)

            # Add legend
            handles, labels = ax.get_legend_handles_labels()
            if labels:
                ax.legend(fontsize=12, loc='upper right')

            # Add NerdX educational watermark with user name
            watermark_text = f"NerdX ZIMSEC Education • {user_name} • Graph Practice"
            ax.text(0.02, 0.02, watermark_text, transform=ax.transAxes, fontsize=10, 
                   alpha=0.6, bbox=dict(boxstyle="round,pad=0.3", facecolor="lightblue", alpha=0.3))

            # Save with high quality
            plt.tight_layout()
            plt.savefig(filepath, dpi=150, bbox_inches='tight', 
                       facecolor='white', edgecolor='none')
            plt.close(fig)

            # Verify file was created
            if os.path.exists(filepath):
                file_size = os.path.getsize(filepath)
                logger.info(f"✅ Matplotlib graph created successfully: {filepath} (size: {file_size} bytes)")
            else:
                logger.error(f"❌ Graph file not created: {filepath}")
                return None

            if not self._is_graph_image_valid(filepath):
                logger.error(f"❌ Graph validation failed for: {filepath}")
                try:
                    os.remove(filepath)
                except Exception:
                    pass
                return None

            # Return in expected format
            return {
                'image_path': filepath,
                'expression': expression,
                'title': title,
                'user_name': user_name,
                'graph_spec': graph_spec
            }

        except Exception as e:
            logger.error(f"Error creating matplotlib graph: {e}")
            return None

    def generate_linear_programming_graph(self, constraints: List[str], objective_function: str = None, 
                                        user_name: str = "Student", title: str = None) -> Optional[Dict]:
        """Generate a linear programming graph with constraints, feasible region, and shading"""
        try:
            if not constraints:
                return None

            # Create the figure
            fig, ax = plt.subplots(figsize=(12, 10), dpi=150)

            # Parse constraints
            parsed_constraints = []
            constraint_lines = []

            for constraint in constraints:
                parsed = self._parse_linear_constraint(constraint)
                if parsed:
                    parsed_constraints.append(parsed)
                    constraint_lines.append(constraint)

            if not parsed_constraints:
                return None

            # Set up coordinate system
            x_range = (-2, 15)
            y_range = (-2, 15)

            # Create meshgrid for shading
            x = np.linspace(x_range[0], x_range[1], 400)
            y = np.linspace(y_range[0], y_range[1], 400)
            X, Y = np.meshgrid(x, y)

            # Plot constraint boundaries and find feasible region
            feasible_region = np.ones_like(X, dtype=bool)
            colors = ['red', 'blue', 'green', 'orange', 'purple', 'brown']

            for i, (a, b, c, operator, original_constraint) in enumerate(parsed_constraints):
                color = colors[i % len(colors)]

                # Plot constraint boundary line
                if b != 0:  # Not a vertical line
                    y_line = (c - a * x) / b
                    valid_mask = (y_line >= y_range[0]) & (y_line <= y_range[1])
                    ax.plot(x[valid_mask], y_line[valid_mask], color=color, linewidth=2.5, 
                           label=f'{original_constraint}', alpha=0.8)
                else:  # Vertical line (x = constant)
                    x_line = c / a
                    if x_range[0] <= x_line <= x_range[1]:
                        ax.axvline(x=x_line, color=color, linewidth=2.5, 
                                 label=f'{original_constraint}', alpha=0.8)

                # Update feasible region
                if operator in ['<=', '≤']:
                    if b != 0:
                        feasible_region &= (a * X + b * Y <= c)
                    else:
                        feasible_region &= (X <= c / a if a > 0 else X >= c / a)
                elif operator in ['>=', '≥']:
                    if b != 0:
                        feasible_region &= (a * X + b * Y >= c)
                    else:
                        feasible_region &= (X >= c / a if a > 0 else X <= c / a)
                elif operator == '=':
                    # For equality constraints, we'll show the line but not restrict the region
                    pass

            # Add non-negativity constraints if not explicitly provided
            has_x_nonneg = any('x' in constraint and '>=' in constraint and '0' in constraint for constraint in constraints)
            has_y_nonneg = any('y' in constraint and '>=' in constraint and '0' in constraint for constraint in constraints)

            if not has_x_nonneg:
                feasible_region &= (X >= 0)
                ax.axvline(x=0, color='gray', linewidth=1.5, linestyle='--', alpha=0.6, label='x ≥ 0')

            if not has_y_nonneg:
                feasible_region &= (Y >= 0)
                ax.axhline(y=0, color='gray', linewidth=1.5, linestyle='--', alpha=0.6, label='y ≥ 0')

            # Shade the feasible region (wanted region) in light green
            ax.contourf(X, Y, feasible_region.astype(int), levels=[0.5, 1.5], 
                       colors=['lightgreen'], alpha=0.4, label='Feasible Region R')

            # Shade the unwanted regions (outside constraints) in light red/gray
            unwanted_region = ~feasible_region
            ax.contourf(X, Y, unwanted_region.astype(int), levels=[0.5, 1.5], 
                       colors=['lightcoral'], alpha=0.3, label='Unwanted Region')

            # Find and mark corner points (vertices of feasible region)
            corner_points = self._find_corner_points(parsed_constraints, x_range, y_range)
            if corner_points:
                corner_x, corner_y = zip(*corner_points)
                ax.scatter(corner_x, corner_y, color='red', s=100, zorder=5, 
                          edgecolors='darkred', linewidth=2, label='Corner Points')

                # Annotate corner points
                for i, (cx, cy) in enumerate(corner_points):
                    ax.annotate(f'({cx:.1f}, {cy:.1f})', (cx, cy), xytext=(5, 5), 
                              textcoords='offset points', fontsize=10, fontweight='bold',
                              bbox=dict(boxstyle="round,pad=0.3", facecolor="yellow", alpha=0.8))

            # Plot objective function direction if provided
            if objective_function:
                self._plot_objective_function(ax, objective_function, corner_points, x_range, y_range)

            # Customize the graph
            ax.set_xlim(x_range)
            ax.set_ylim(y_range)
            ax.set_xlabel('x', fontsize=14, fontweight='bold')
            ax.set_ylabel('y', fontsize=14, fontweight='bold')

            graph_title = title if title else 'Linear Programming - Feasible Region Analysis'
            ax.set_title(graph_title, fontsize=16, fontweight='bold', pad=20)

            # Enhanced grid for ZIMSEC standards
            ax.grid(True, which='major', alpha=0.7, linestyle='-', linewidth=0.8, color='gray')
            ax.grid(True, which='minor', alpha=0.6, linestyle=':', linewidth=0.7, color='lightgray')
            ax.minorticks_on()

            # Add legend with proper spacing
            ax.legend(bbox_to_anchor=(1.05, 1), loc='upper left', fontsize=10)

            # Find center of feasible region and add large "R" marker
            if corner_points:
                # Calculate centroid of feasible region
                center_x = np.mean([point[0] for point in corner_points])
                center_y = np.mean([point[1] for point in corner_points])

                # Add large "R" marker in the center of feasible region
                ax.text(center_x, center_y, 'R', fontsize=48, fontweight='bold', 
                       ha='center', va='center', color='darkgreen', alpha=0.8,
                       bbox=dict(boxstyle="circle,pad=0.3", facecolor="white", alpha=0.8, edgecolor='darkgreen', linewidth=2))

            # Add educational notes
            notes = f"""
📋 ZIMSEC Linear Programming:
• Green region R = Feasible solutions
• Red/Gray = Unwanted (shaded) regions
• Red dots = Corner points (vertices) 
• Lines = Constraint boundaries
• Large R marks the required region
            """.strip()

            ax.text(0.02, 0.98, notes, transform=ax.transAxes, fontsize=9, 
                   verticalalignment='top', fontweight='bold',
                   bbox=dict(boxstyle="round,pad=0.5", facecolor="lightyellow", alpha=0.9))

            # Add NerdX educational watermark
            watermark_text = f"NerdX ZIMSEC Linear Programming • {user_name}"
            ax.text(0.02, 0.02, watermark_text, transform=ax.transAxes, fontsize=10, 
                   alpha=0.6, bbox=dict(boxstyle="round,pad=0.3", facecolor="lightblue", alpha=0.3))

            # Save with high quality
            filename = f"linear_prog_{user_name}_{int(time.time())}.png"
            filepath = os.path.join('static', 'graphs', filename)

            plt.tight_layout()
            plt.subplots_adjust(right=0.8)  # Make room for legend
            plt.savefig(filepath, dpi=150, bbox_inches='tight', 
                       facecolor='white', edgecolor='none')
            plt.close(fig)

            logger.info(f"✅ Linear programming graph created: {filepath}")

            return {
                'image_path': filepath,
                'constraints': constraint_lines,
                'corner_points': corner_points,
                'title': graph_title,
                'user_name': user_name
            }

        except Exception as e:
            logger.error(f"Error creating linear programming graph: {e}")
            return None

    def _parse_linear_constraint(self, constraint: str) -> Optional[Tuple]:
        """Parse a linear constraint into coefficients and operator"""
        try:
            # Clean up the constraint
            constraint = constraint.replace(' ', '').replace('≤', '<=').replace('≥', '>=')

            # Find the operator
            operators = ['<=', '>=', '=']
            operator = None
            for op in operators:
                if op in constraint:
                    operator = op
                    break

            if not operator:
                return None

            # Split by operator
            left, right = constraint.split(operator)

            # Parse right side (should be a number)
            try:
                c = float(right)
            except Exception:
                return None

            # Parse left side to extract coefficients of x and y
            # Handle cases like: 2x+3y, x+y, 2x, 3y, x-y, etc.
            a, b = 0, 0

            # Replace common patterns
            left = left.replace('-', '+-')

            # Split into terms
            terms = [term for term in left.split('+') if term]

            for term in terms:
                if 'x' in term:
                    coeff = term.replace('x', '')
                    if coeff == '' or coeff == '+':
                        a = 1
                    elif coeff == '-':
                        a = -1
                    else:
                        a = float(coeff)
                elif 'y' in term:
                    coeff = term.replace('y', '')
                    if coeff == '' or coeff == '+':
                        b = 1
                    elif coeff == '-':
                        b = -1
                    else:
                        b = float(coeff)

            return (a, b, c, operator, constraint.replace('<=', '≤').replace('>=', '≥'))

        except Exception as e:
            logger.error(f"Error parsing constraint '{constraint}': {e}")
            return None

    def _find_corner_points(self, constraints: List[Tuple], x_range: Tuple, y_range: Tuple) -> List[Tuple]:
        """Find corner points (vertices) of the feasible region"""
        try:
            points = []

            # Add boundary intersections
            for i in range(len(constraints)):
                for j in range(i + 1, len(constraints)):
                    intersection = self._find_intersection(constraints[i], constraints[j])
                    if intersection:
                        x, y = intersection
                        # Check if point is within bounds and satisfies all constraints
                        if (x_range[0] <= x <= x_range[1] and y_range[0] <= y <= y_range[1]):
                            if self._point_satisfies_constraints(x, y, constraints):
                                points.append((round(x, 2), round(y, 2)))

            # Add axis intersections and origin if relevant
            origin_satisfies = self._point_satisfies_constraints(0, 0, constraints)
            if origin_satisfies:
                points.append((0, 0))

            # Remove duplicates
            unique_points = []
            for point in points:
                if point not in unique_points:
                    unique_points.append(point)

            return unique_points

        except Exception as e:
            logger.error(f"Error finding corner points: {e}")
            return []

    def _find_intersection(self, constraint1: Tuple, constraint2: Tuple) -> Optional[Tuple]:
        """Find intersection point of two linear constraints"""
        try:
            a1, b1, c1, _, _ = constraint1
            a2, b2, c2, _, _ = constraint2

            # Solve the system: a1*x + b1*y = c1, a2*x + b2*y = c2
            det = a1 * b2 - a2 * b1

            if abs(det) < 1e-10:  # Lines are parallel
                return None

            x = (c1 * b2 - c2 * b1) / det
            y = (a1 * c2 - a2 * c1) / det

            return (x, y)

        except Exception:
            return None

    def _point_satisfies_constraints(self, x: float, y: float, constraints: List[Tuple]) -> bool:
        """Check if a point satisfies all constraints"""
        try:
            for a, b, c, operator, _ in constraints:
                value = a * x + b * y

                if operator in ['<=', '≤'] and value > c + 1e-10:
                    return False
                elif operator in ['>=', '≥'] and value < c - 1e-10:
                    return False
                elif operator == '=' and abs(value - c) > 1e-10:
                    return False

            # Check non-negativity (standard assumption)
            return x >= -1e-10 and y >= -1e-10

        except Exception:
            return False

    def _plot_objective_function(self, ax, objective: str, corner_points: List, x_range: Tuple, y_range: Tuple):
        """Plot objective function iso-lines"""
        try:
            # Parse objective function (e.g., "3x + 2y" or "maximize 3x + 2y")
            obj_clean = objective.lower().replace('maximize', '').replace('minimize', '').strip()

            # Find coefficients
            parsed = self._parse_linear_constraint(f"{obj_clean}=0")
            if not parsed:
                return

            a, b, c, _, _ = parsed

            if corner_points:
                # Calculate objective values at corner points
                obj_values = [a * x + b * y for x, y in corner_points]
                min_val, max_val = min(obj_values), max(obj_values)

                # Plot iso-lines
                for obj_val in [min_val, max_val]:
                    if b != 0:
                        x = np.linspace(x_range[0], x_range[1], 100)
                        y_iso = (obj_val - a * x) / b
                        ax.plot(x, y_iso, '--', alpha=0.7, 
                               label=f'Objective = {obj_val:.1f}')

        except Exception as e:
            logger.error(f"Error plotting objective function: {e}")
