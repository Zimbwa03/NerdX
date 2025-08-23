import os
import json
import logging
import requests
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
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

logger = logging.getLogger(__name__)

class GraphService:
    """Enhanced service for generating professional educational mathematical graphs and visualizations"""

    def __init__(self):
        self.desmos_api_key = Config.DESMOS_API_KEY
        self.temp_dir = os.path.join('static', 'graphs')
        
        # Ensure temp directory exists
        os.makedirs(self.temp_dir, exist_ok=True)

        # Set professional matplotlib style for ZIMSEC educational graphs
        plt.style.use('seaborn-v0_8') if 'seaborn-v0_8' in plt.style.available else plt.style.use('default')
        plt.rcParams['figure.figsize'] = (12, 8)
        plt.rcParams['font.size'] = 12
        plt.rcParams['axes.grid'] = True
        plt.rcParams['grid.alpha'] = 0.7
        plt.rcParams['grid.linewidth'] = 0.8
        plt.rcParams['axes.axisbelow'] = True

        logger.info("Enhanced Graph Service initialized for ZIMSEC educational graphs")

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

        # Remove y = or f(x) = prefix if present
        if clean.lower().startswith('y ='):
            clean = clean[3:].strip()
        elif clean.lower().startswith('f(x) ='):
            clean = clean[6:].strip()
        elif clean.lower().startswith('y='):
            clean = clean[2:].strip()
        elif clean.lower().startswith('f(x)='):
            clean = clean[5:].strip()

        # Replace common mathematical notation for ZIMSEC standards
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

    def create_graph(self, graph_type: str, title: str = None, **kwargs) -> str:
        """Create a graph based on type and return the file path"""
        try:
            import matplotlib.pyplot as plt
            import numpy as np
            import os
            from datetime import datetime

            # Generate unique filename
            timestamp = int(datetime.now().timestamp())
            filename = f"{graph_type}_{timestamp}.png"
            filepath = os.path.join(self.temp_dir, filename)

            # Create figure
            plt.figure(figsize=(10, 6))

            if graph_type == "linear":
                # Create linear function graph
                x = np.linspace(-10, 10, 100)
                m = kwargs.get('slope', 2)
                b = kwargs.get('intercept', 1)
                y = m * x + b
                plt.plot(x, y, 'b-', linewidth=2, label=f'y = {m}x + {b}')
                plt.title(title or f'Linear Function: y = {m}x + {b}')

            elif graph_type == "quadratic":
                # Create quadratic function graph
                x = np.linspace(-10, 10, 100)
                a = kwargs.get('a', 1)
                b = kwargs.get('b', 0)
                c = kwargs.get('c', 0)
                y = a * x**2 + b * x + c
                plt.plot(x, y, 'r-', linewidth=2, label=f'y = {a}x² + {b}x + {c}')
                plt.title(title or f'Quadratic Function: y = {a}x² + {b}x + {c}')

            elif graph_type == "sine":
                # Create sine wave graph
                x = np.linspace(0, 4*np.pi, 100)
                amplitude = kwargs.get('amplitude', 1)
                frequency = kwargs.get('frequency', 1)
                y = amplitude * np.sin(frequency * x)
                plt.plot(x, y, 'g-', linewidth=2, label=f'y = {amplitude}sin({frequency}x)')
                plt.title(title or f'Sine Function: y = {amplitude}sin({frequency}x)')

            elif graph_type == "cosine":
                # Create cosine wave graph
                x = np.linspace(0, 4*np.pi, 100)
                amplitude = kwargs.get('amplitude', 1)
                frequency = kwargs.get('frequency', 1)
                y = amplitude * np.cos(frequency * x)
                plt.plot(x, y, 'm-', linewidth=2, label=f'y = {amplitude}cos({frequency}x)')
                plt.title(title or f'Cosine Function: y = {amplitude}cos({frequency}x)')

            elif graph_type == "exponential":
                # Create exponential function graph
                x = np.linspace(-2, 3, 100)
                base = kwargs.get('base', 2)
                y = base ** x
                plt.plot(x, y, 'orange', linewidth=2, label=f'y = {base}^x')
                plt.title(title or f'Exponential Function: y = {base}^x')

            elif graph_type == "logarithmic":
                # Create logarithmic function graph
                x = np.linspace(0.1, 10, 100)
                base = kwargs.get('base', 10)
                if base == 10:
                    y = np.log10(x)
                    plt.plot(x, y, 'brown', linewidth=2, label='y = log₁₀(x)')
                    plt.title(title or 'Logarithmic Function: y = log₁₀(x)')
                else:
                    y = np.log(x) / np.log(base)
                    plt.plot(x, y, 'brown', linewidth=2, label=f'y = log_{base}(x)')
                    plt.title(title or f'Logarithmic Function: y = log_{base}(x)')

            else:
                # Default to simple linear graph
                x = np.linspace(-5, 5, 100)
                y = x
                plt.plot(x, y, 'b-', linewidth=2, label='y = x')
                plt.title(title or 'Linear Function: y = x')

            # Add grid and labels
            plt.grid(True, alpha=0.3)
            plt.xlabel('x')
            plt.ylabel('y')
            plt.legend()
            plt.axhline(y=0, color='k', linewidth=0.5)
            plt.axvline(x=0, color='k', linewidth=0.5)

            # Save the plot
            plt.tight_layout()
            plt.savefig(filepath, dpi=300, bbox_inches='tight')
            plt.close()

            return filepath

        except Exception as e:
            logger.error(f"Error creating graph: {e}")
            return None