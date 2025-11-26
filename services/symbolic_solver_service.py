#!/usr/bin/env python3
"""
SymPy Symbolic Mathematics Service - Free Alternative to Wolfram Alpha
Provides step-by-step solutions for O-Level and A-Level mathematics
Zero API costs, 100% offline capable
"""

import logging
from typing import Dict, List, Optional, Tuple
from sympy import *
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application
from sympy.printing.latex import latex
import json

logger = logging.getLogger(__name__)


class SymbolicSolverService:
    """Free symbolic mathematics solver using SymPy"""
    
    def __init__(self):
        # Configure SymPy for educational output
        init_printing(use_unicode=True, wrap_line=False)
        logger.info("SymPy Symbolic Solver initialized (Free Alternative)")
    
    def solve_equation_with_steps(self, equation_str: str, variable_str: str = 'x') -> Dict:
        """
        Solve equation with detailed step-by-step explanation
        
        Args:
            equation_str: Equation like "2*x + 5 = 13" or "x^2 - 5*x + 6 = 0"
            variable_str: Variable to solve for (default 'x')
        
        Returns:
            Dict with solution, steps, verification, and LaTeX
        """
        try:
            # Parse variable
            var = symbols(variable_str)
            
            # Parse equation (handle = sign)
            if '=' in equation_str:
                left, right = equation_str.split('=')
                left_expr = parse_expr(left.strip(), transformations='all')
                right_expr = parse_expr(right.strip(), transformations='all')
                equation = Eq(left_expr, right_expr)
            else:
                # Assume equation = 0
                equation = Eq(parse_expr(equation_str, transformations='all'), 0)
            
            # Generate step-by-step solution
            steps = self._generate_solution_steps(equation, var)
            
            # Solve equation
            solutions = solve(equation, var)
            
            # Verify solutions
            verification = []
            for sol in solutions:
                check = equation.lhs.subs(var, sol) - equation.rhs
                simplified_check = simplify(check)
                verification.append({
                    "solution": str(sol),
                    "check": str(simplified_check),
                    "is_valid": simplified_check == 0
                })
            
            return {
                "success": True,
                "original_equation": equation_str,
                "parsed_equation": str(equation),
                "latex_equation": latex(equation),
                "solutions": [str(sol) for sol in solutions],
                "latex_solutions": [latex(sol) for sol in solutions],
                "steps": steps,
                "verification": verification,
                "explanation": self._generate_explanation(equation, solutions, var)
            }
            
        except Exception as e:
            logger.error(f"Error solving equation '{equation_str}': {e}")
            return {
                "success": False,
                "error": str(e),
                "fallback": "Unable to parse equation. Please check syntax."
            }
    
    def differentiate_with_steps(self, function_str: str, variable_str: str = 'x') -> Dict:
        """
        Differentiate function with step-by-step explanation
        
        Args:
            function_str: Function like "x^2 + 3*x + 5" or "sin(x)*exp(x)"
            variable_str: Variable to differentiate with respect to
        
        Returns:
            Dict with derivative, steps, rule explanations
        """
        try:
            var = symbols(variable_str)
            function = parse_expr(function_str, transformations='all')
            
            # Compute derivative
            derivative = diff(function, var)
            
            # Generate step-by-step differentiation
            steps = self._generate_derivative_steps(function, var)
            
            return {
                "success": True,
                "original_function": function_str,
                "latex_function": latex(function),
                "derivative": str(derivative),
                "latex_derivative": latex(derivative),
                "steps": steps,
                "rule_used": self._identify_differentiation_rule(function),
                "explanation": f"The derivative of {latex(function)} with respect to {variable_str} is {latex(derivative)}"
            }
            
        except Exception as e:
            logger.error(f"Error differentiating '{function_str}': {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def integrate_with_steps(self, function_str: str, variable_str: str = 'x', 
                            lower_limit: Optional[str] = None, 
                            upper_limit: Optional[str] = None) -> Dict:
        """
        Integrate function with step-by-step explanation
        
        Args:
            function_str: Function to integrate
            variable_str: Integration variable
            lower_limit: For definite integral
            upper_limit: For definite integral
        
        Returns:
            Dict with integral, steps, and evaluation
        """
        try:
            var = symbols(variable_str)
            function = parse_expr(function_str, transformations='all')
            
            # Indefinite or definite integral
            if lower_limit is not None and upper_limit is not None:
                lower = parse_expr(lower_limit, transformations='all')
                upper = parse_expr(upper_limit, transformations='all')
                integral = integrate(function, (var, lower, upper))
                is_definite = True
            else:
                integral = integrate(function, var)
                is_definite = False
            
            # Generate steps
            steps = self._generate_integration_steps(function, var, is_definite, lower_limit, upper_limit)
            
            return {
                "success": True,
                "original_function": function_str,
                "latex_function": latex(function),
                "integral": str(integral),
                "latex_integral": latex(integral),
                "is_definite": is_definite,
                "steps": steps,
                "numerical_value": float(integral) if is_definite and integral.is_number else None
            }
            
        except Exception as e:
            logger.error(f"Error integrating '{function_str}': {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def simplify_expression(self, expression_str: str) -> Dict:
        """Simplify algebraic expression with steps"""
        try:
            expr = parse_expr(expression_str, transformations='all')
            simplified = simplify(expr)
            
            # Expand if it helps show steps
            expanded = expand(expr)
            factored = factor(expr)
            
            steps = [
                {"step": 1, "description": "Original expression", "latex": latex(expr)},
                {"step": 2, "description": "Expanded form", "latex": latex(expanded)},
                {"step": 3, "description": "Factored form", "latex": latex(factored)},
                {"step": 4, "description": "Simplified form", "latex": latex(simplified)}
            ]
            
            return {
                "success": True,
                "original": expression_str,
                "simplified": str(simplified),
                "latex_simplified": latex(simplified),
                "expanded": str(expanded),
                "factored": str(factored),
                "steps": steps
            }
            
        except Exception as e:
            logger.error(f"Error simplifying '{expression_str}': {e}")
            return {"success": False, "error": str(e)}
    
    def _generate_solution_steps(self, equation, variable) -> List[Dict]:
        """Generate pedagogical step-by-step solution"""
        steps = []
        
        # Step 1: State original equation
        steps.append({
            "step": 1,
            "description": "Original equation",
            "latex": latex(equation),
            "explanation": f"We need to solve for {variable}"
        })
        
        # Step 2: Simplify both sides
        lhs_simplified = simplify(equation.lhs)
        rhs_simplified = simplify(equation.rhs)
        simplified_eq = Eq(lhs_simplified, rhs_simplified)
        
        steps.append({
            "step": 2,
            "description": "Simplify both sides",
            "latex": latex(simplified_eq),
            "explanation": "Combine like terms and simplify"
        })
        
        # Step 3: Isolate variable (for linear/quadratic equations)
        try:
            if equation.lhs.is_polynomial(variable):
                poly_degree = Poly(equation.lhs, variable).degree()
                if poly_degree == 1:
                    steps.append({
                        "step": 3,
                        "description": "Linear equation - isolate variable",
                        "explanation": "Move all terms with variable to one side"
                    })
                elif poly_degree == 2:
                    steps.append({
                        "step": 3,
                        "description": "Quadratic equation - use factoring or formula",
                        "explanation": "This is a quadratic equation (ax² + bx + c = 0)"
                    })
        except Exception as e:
            logger.debug(f"Could not determine polynomial degree: {e}")
            pass
        
        # Step 4: Solution
        solutions = solve(equation, variable)
        steps.append({
            "step": len(steps) + 1,
            "description": "Solution",
            "latex": ", ".join([latex(sol) for sol in solutions]),
            "explanation": f"{variable} = {', '.join([str(sol) for sol in solutions])}"
        })
        
        return steps
    
    def _generate_derivative_steps(self, function, variable) -> List[Dict]:
        """Generate step-by-step differentiation"""
        steps = []
        
        steps.append({
            "step": 1,
            "description": "Original function",
            "latex": f"f({variable}) = {latex(function)}"
        })
        
        # Identify function type and apply appropriate rule
        if function.is_polynomial(variable):
            steps.append({
                "step": 2,
                "description": "Apply power rule",
                "explanation": "d/dx(x^n) = n*x^(n-1)"
            })
        elif function.has(sin) or function.has(cos):
            steps.append({
                "step": 2,
                "description": "Apply trigonometric derivative rules",
                "explanation": "d/dx(sin x) = cos x, d/dx(cos x) = -sin x"
            })
        
        derivative = diff(function, variable)
        steps.append({
            "step": len(steps) + 1,
            "description": "Final derivative",
            "latex": f"f'({variable}) = {latex(derivative)}"
        })
        
        return steps
    
    def _generate_integration_steps(self, function, variable, is_definite, lower, upper) -> List[Dict]:
        """Generate step-by-step integration"""
        steps = []
        
        if is_definite:
            steps.append({
                "step": 1,
                "description": "Definite integral",
                "latex": f"\\int_{{{lower}}}^{{{upper}}} {latex(function)} \\, d{variable}"
            })
        else:
            steps.append({
                "step": 1,
                "description": "Indefinite integral",
                "latex": f"\\int {latex(function)} \\, d{variable}"
            })
        
        # Identify integration method
        if function.is_polynomial(variable):
            steps.append({
                "step": 2,
                "description": "Apply power rule for integration",
                "explanation": "∫x^n dx = x^(n+1)/(n+1) + C"
            })
        
        return steps
    
    def _identify_differentiation_rule(self, function) -> str:
        """Identify which differentiation rule to use"""
        if function.is_polynomial():
            return "Power Rule"
        elif function.has(sin) or function.has(cos) or function.has(tan):
            return "Trigonometric Rules"
        elif function.has(exp):
            return "Exponential Rule"
        elif function.has(log):
            return "Logarithmic Rule"
        elif function.is_Mul:
            return "Product Rule"
        elif function.is_Pow:
            return "Chain Rule"
        else:
            return "General Derivative"
    
    def _generate_explanation(self, equation, solutions, variable) -> str:
        """Generate natural language explanation"""
        if len(solutions) == 0:
            return f"This equation has no real solutions for {variable}."
        elif len(solutions) == 1:
            return f"The equation has one solution: {variable} = {solutions[0]}"
        else:
            return f"The equation has {len(solutions)} solutions: " + \
                   ", ".join([f"{variable} = {sol}" for sol in solutions])


# Global instance
symbolic_solver = SymbolicSolverService()
