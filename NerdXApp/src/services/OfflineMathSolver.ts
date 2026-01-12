/**
 * Offline Math Solver Service
 * Pure JavaScript implementation for React Native compatibility
 * Provides step-by-step solutions for basic math problems
 * No external dependencies - works offline!
 */

export interface MathStep {
    step: number;
    description: string;
    latex: string;
    explanation?: string;
}

export interface OfflineMathSolution {
    success: boolean;
    steps: MathStep[];
    latex_solutions: string[];
    explanation: string;
    solvedOffline: boolean;
}

class OfflineMathSolver {
    /**
     * Solve a math problem offline using pure JavaScript
     */
    solve(problem: string): OfflineMathSolution {
        try {
            // Clean and normalize the input
            const cleanProblem = this.cleanInput(problem);

            // Detect problem type and solve accordingly
            if (this.isEquation(cleanProblem)) {
                return this.solveEquation(cleanProblem);
            } else {
                return this.evaluateExpression(cleanProblem);
            }
        } catch (error) {
            console.log('Offline solver error:', error);
            return {
                success: false,
                steps: [],
                latex_solutions: [],
                explanation: 'Could not solve offline. Trying server...',
                solvedOffline: false,
            };
        }
    }

    /**
     * Clean and normalize input
     */
    private cleanInput(input: string): string {
        let cleaned = input.trim();

        // Replace common patterns
        cleaned = cleaned.replace(/×/g, '*');  // Multiplication
        cleaned = cleaned.replace(/÷/g, '/');  // Division
        cleaned = cleaned.replace(/−/g, '-');  // Minus
        cleaned = cleaned.replace(/\s+/g, ' '); // Normalize spaces

        // Handle power notation: x^2 -> Math.pow style tracking
        // Keep ^ for equation detection

        return cleaned;
    }

    /**
     * Check if input is an equation (contains =)
     */
    private isEquation(input: string): boolean {
        return input.includes('=');
    }

    /**
     * Evaluate a numeric expression
     */
    private evaluateExpression(expression: string): OfflineMathSolution {
        const steps: MathStep[] = [];

        steps.push({
            step: 1,
            description: 'Given expression',
            latex: expression,
            explanation: 'Starting with the original expression'
        });

        try {
            // Safe evaluation of mathematical expressions
            const result = this.safeEval(expression);

            if (result === null || isNaN(result)) {
                throw new Error('Invalid expression');
            }

            const resultStr = this.formatNumber(result);

            steps.push({
                step: 2,
                description: 'Calculate result',
                latex: `${expression} = ${resultStr}`,
                explanation: 'Evaluating the expression'
            });

            return {
                success: true,
                steps,
                latex_solutions: [resultStr],
                explanation: `The expression evaluates to ${resultStr}`,
                solvedOffline: true,
            };
        } catch (error) {
            throw new Error('Could not evaluate expression');
        }
    }

    /**
     * Safe mathematical expression evaluator
     */
    private safeEval(expr: string): number | null {
        try {
            // Clean expression for evaluation
            let evalExpr = expr
                .replace(/\^/g, '**')  // Power
                .replace(/sqrt\(/gi, 'Math.sqrt(')
                .replace(/sin\(/gi, 'Math.sin(')
                .replace(/cos\(/gi, 'Math.cos(')
                .replace(/tan\(/gi, 'Math.tan(')
                .replace(/log\(/gi, 'Math.log10(')
                .replace(/ln\(/gi, 'Math.log(')
                .replace(/abs\(/gi, 'Math.abs(')
                .replace(/pi/gi, 'Math.PI')
                .replace(/e(?![a-z])/gi, 'Math.E');

            // Only allow safe characters
            if (!/^[\d\s+\-*/().Math,sqrtincoablgE\s]+$/.test(evalExpr.replace(/Math\.\w+/g, ''))) {
                // Contains variables - not a pure numeric expression
                return null;
            }

            // Use Function constructor for safer eval
            const result = new Function(`return ${evalExpr}`)();
            return typeof result === 'number' ? result : null;
        } catch {
            return null;
        }
    }

    /**
     * Solve an equation for x
     */
    private solveEquation(equation: string): OfflineMathSolution {
        const steps: MathStep[] = [];
        const [leftSide, rightSide] = equation.split('=').map(s => s.trim());

        steps.push({
            step: 1,
            description: 'Given equation',
            latex: equation,
            explanation: 'Starting with the original equation'
        });

        // Try quadratic first (x^2 term)
        if (leftSide.includes('^2') || leftSide.includes('²')) {
            const quadraticResult = this.solveQuadratic(leftSide, rightSide, steps);
            if (quadraticResult) {
                return quadraticResult;
            }
        }

        // Try linear equation: ax + b = c
        const linearResult = this.solveLinear(leftSide, rightSide, steps);
        if (linearResult) {
            return linearResult;
        }

        throw new Error('Could not solve equation');
    }

    /**
     * Solve linear equation ax + b = c
     */
    private solveLinear(left: string, right: string, steps: MathStep[]): OfflineMathSolution | null {
        try {
            // Parse the equation to extract coefficients
            // Handle forms like: 2x + 5 = 13, 3x - 7 = 8, x = 5, 5 = 2x + 3

            let aCoeff = 0;  // coefficient of x
            let bConst = 0;  // constant on left side
            let cConst = 0;  // right side value

            // Try to evaluate right side as a number
            const rightVal = this.safeEval(right);
            if (rightVal !== null) {
                cConst = rightVal;
            } else {
                // Right side has x - swap sides
                return this.solveLinear(right, left, steps);
            }

            // Parse left side for coefficient of x and constant
            // Remove spaces and split by + and -
            const leftNormalized = left.replace(/\s/g, '').replace(/-/g, '+-');
            const terms = leftNormalized.split('+').filter(t => t);

            for (const term of terms) {
                if (term.includes('x')) {
                    // This is the x term
                    const coeffMatch = term.match(/^([+-]?\d*\.?\d*)x$/i);
                    if (coeffMatch) {
                        const coeffStr = coeffMatch[1];
                        aCoeff = coeffStr === '' || coeffStr === '+' ? 1 :
                            coeffStr === '-' ? -1 : parseFloat(coeffStr);
                    } else {
                        return null; // Can't parse x term
                    }
                } else {
                    // This is a constant term
                    const val = parseFloat(term);
                    if (!isNaN(val)) {
                        bConst += val;
                    }
                }
            }

            if (aCoeff === 0) {
                return null; // No x term found
            }

            // Solve: ax + b = c  =>  x = (c - b) / a
            const solution = (cConst - bConst) / aCoeff;
            const solutionStr = this.formatNumber(solution);

            steps.push({
                step: 2,
                description: 'Isolate variable terms',
                latex: `${aCoeff}x = ${cConst} - ${bConst > 0 ? bConst : `(${bConst})`}`,
                explanation: 'Move constant terms to the right side'
            });

            steps.push({
                step: 3,
                description: 'Simplify',
                latex: `${aCoeff}x = ${this.formatNumber(cConst - bConst)}`,
                explanation: 'Calculate the right side'
            });

            steps.push({
                step: 4,
                description: 'Divide both sides',
                latex: `x = ${this.formatNumber(cConst - bConst)} ÷ ${aCoeff}`,
                explanation: `Divide both sides by ${aCoeff}`
            });

            steps.push({
                step: 5,
                description: 'Solution',
                latex: `x = ${solutionStr}`,
                explanation: 'The solution to the equation'
            });

            return {
                success: true,
                steps,
                latex_solutions: [`x = ${solutionStr}`],
                explanation: `The solution is x = ${solutionStr}`,
                solvedOffline: true,
            };
        } catch (error) {
            return null;
        }
    }

    /**
     * Solve quadratic equation ax^2 + bx + c = 0
     */
    private solveQuadratic(left: string, right: string, steps: MathStep[]): OfflineMathSolution | null {
        try {
            // Move everything to left side
            let rightVal = this.safeEval(right);
            if (rightVal === null) rightVal = 0;

            // Parse coefficients from left side
            // Normalize: x^2 -> x²
            let expr = left.replace(/\s/g, '').replace(/x\^2/gi, 'x²').replace(/-/g, '+-');
            const terms = expr.split('+').filter(t => t);

            let a = 0, b = 0, c = -rightVal;

            for (const term of terms) {
                if (term.includes('x²')) {
                    // x² coefficient
                    const match = term.match(/^([+-]?\d*\.?\d*)x²$/i);
                    if (match) {
                        const coeffStr = match[1];
                        a = coeffStr === '' || coeffStr === '+' ? 1 :
                            coeffStr === '-' ? -1 : parseFloat(coeffStr);
                    }
                } else if (term.includes('x')) {
                    // x coefficient
                    const match = term.match(/^([+-]?\d*\.?\d*)x$/i);
                    if (match) {
                        const coeffStr = match[1];
                        b = coeffStr === '' || coeffStr === '+' ? 1 :
                            coeffStr === '-' ? -1 : parseFloat(coeffStr);
                    }
                } else {
                    // constant
                    const val = parseFloat(term);
                    if (!isNaN(val)) {
                        c += val;
                    }
                }
            }

            if (a === 0) {
                return null; // Not a quadratic
            }

            steps.push({
                step: 2,
                description: 'Identify coefficients',
                latex: `a = ${a}, b = ${b}, c = ${c}`,
                explanation: 'Standard form: ax² + bx + c = 0'
            });

            // Calculate discriminant
            const discriminant = b * b - 4 * a * c;

            steps.push({
                step: 3,
                description: 'Calculate discriminant',
                latex: `Δ = b² - 4ac = ${b}² - 4(${a})(${c}) = ${this.formatNumber(discriminant)}`,
                explanation: 'The discriminant determines the number of solutions'
            });

            steps.push({
                step: 4,
                description: 'Apply quadratic formula',
                latex: `x = (-b ± √Δ) / 2a`,
                explanation: 'Using the quadratic formula'
            });

            let solutions: string[];

            if (discriminant < 0) {
                solutions = ['No real solutions'];
                steps.push({
                    step: 5,
                    description: 'Result',
                    latex: 'Δ < 0 → No real solutions',
                    explanation: 'Negative discriminant means no real roots'
                });
            } else if (discriminant === 0) {
                const x = -b / (2 * a);
                solutions = [`x = ${this.formatNumber(x)}`];
                steps.push({
                    step: 5,
                    description: 'Single solution (repeated root)',
                    latex: `x = ${this.formatNumber(x)}`,
                    explanation: 'Discriminant is zero - one repeated root'
                });
            } else {
                const sqrtD = Math.sqrt(discriminant);
                const x1 = (-b + sqrtD) / (2 * a);
                const x2 = (-b - sqrtD) / (2 * a);
                solutions = [`x = ${this.formatNumber(x1)}`, `x = ${this.formatNumber(x2)}`];
                steps.push({
                    step: 5,
                    description: 'Two solutions',
                    latex: `x₁ = ${this.formatNumber(x1)}, x₂ = ${this.formatNumber(x2)}`,
                    explanation: 'Positive discriminant - two distinct real roots'
                });
            }

            return {
                success: true,
                steps,
                latex_solutions: solutions,
                explanation: `Solutions: ${solutions.join(' and ')}`,
                solvedOffline: true,
            };
        } catch (error) {
            return null;
        }
    }

    /**
     * Format number for display
     */
    private formatNumber(num: number): string {
        if (Number.isInteger(num)) {
            return String(num);
        }
        // Round to 4 decimal places and remove trailing zeros
        return parseFloat(num.toFixed(4)).toString();
    }
}

// Export singleton instance
export const offlineMathSolver = new OfflineMathSolver();
export default offlineMathSolver;
