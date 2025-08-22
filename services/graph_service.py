import os
import json
import logging
import requests
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, Polygon, Rectangle
import numpy as np
from typing import Dict, List, Optional
from config import Config

logger = logging.getLogger(__name__)

class GraphService:
    """Service for generating mathematical graphs and visualizations"""
    
    def __init__(self):
        self.desmos_api_key = Config.DESMOS_API_KEY
        
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
                
                # Create the plot
                plt.figure(figsize=(10, 8))
                plt.plot(x, y, 'b-', linewidth=2, label=f'y = {function}')
                plt.grid(True, alpha=0.3)
                plt.axhline(y=0, color='k', linewidth=0.5)
                plt.axvline(x=0, color='k', linewidth=0.5)
                
                plt.xlabel('x', fontsize=12)
                plt.ylabel('y', fontsize=12)
                
                graph_title = title if title else f'Graph of y = {function}'
                plt.title(graph_title, fontsize=14)
                
                plt.legend()
                
                # Save the plot
                filename = f"graph_{hash(function) % 10000}.png"
                filepath = os.path.join('static', 'graphs', filename)
                
                # Ensure directory exists
                os.makedirs(os.path.dirname(filepath), exist_ok=True)
                
                plt.savefig(filepath, dpi=150, bbox_inches='tight')
                plt.close()
                
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
