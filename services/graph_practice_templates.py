# Graph Practice question templates by level and type (ZIMSEC/Cambridge style).
# Use {equation} placeholder for the actual equation (display form, e.g. x^2 - 4x + 3).

# Quadratic - O-Level (10 template variations)
QUADRATIC_O_LEVEL_TEMPLATES = [
    {
        "question": r"The equation of a curve is \(y = {equation}\). "
        r"Complete the table of values for \(x = -1, 0, 1, 2, 3, 4, 5\). "
        r"Draw the graph of \(y = {equation}\) for \(-1 \leq x \leq 5\) using a scale of 2 cm to 1 unit on the x-axis and 1 cm to 1 unit on the y-axis. "
        r"Use your graph to find the roots of the equation. State the coordinates of the minimum point and the equation of the line of symmetry.",
        "solution": "Complete the table, plot points, join with a smooth curve. Roots are where the curve cuts the x-axis. Minimum point is at the vertex. Line of symmetry is the vertical through the vertex.",
    },
    {
        "question": r"A curve has equation \(y = {equation}\). "
        r"Copy and complete the table below for the given values of \(x\). "
        r"Draw the graph for the given domain. "
        r"State the maximum value of \(y\) and the value of \(x\) at which it occurs. "
        r"On the same axes, draw a suitable straight line and use your graphs to solve a related equation. "
        r"Write down the range of values of \(x\) for which the curve is above the line.",
        "solution": "Complete table, plot the parabola. Maximum is at the vertex. Use intersection with the line to solve the equation. Inequality: where the curve is above the line.",
    },
    {
        "question": r"Consider the quadratic function \(y = {equation}\). "
        r"Construct a table of values for integer values of \(x\) in a suitable range. "
        r"Plot the graph. From your graph, find the minimum value of \(y\). "
        r"Find the roots of the equation. By drawing a suitable straight line, solve a related equation. "
        r"State the values of \(x\) for which \(y < 0\).",
        "solution": "Table, plot, identify minimum and roots. Draw horizontal or oblique line to solve the related equation. \(y < 0\) between the roots.",
    },
    {
        "question": r"The curve \(y = {equation}\) is to be drawn for a suitable range of \(x\). "
        r"Make a table of values. Draw the graph. "
        r"Use your graph to solve the equation. State the coordinates of the turning point. "
        r"Draw a line on the same axes and find the coordinates of the points of intersection. "
        r"Hence solve a related quadratic equation.",
        "solution": "Table, smooth curve. Roots from x-intercepts. Turning point at vertex. Intersections with the line give solutions to the related equation.",
    },
    {
        "question": r"A parabola has the equation \(y = {equation}\). "
        r"Complete a table of values for a suitable range of \(x\). "
        r"Draw the graph. Find the coordinates of the turning point from your graph. "
        r"Use your graph to find the solutions to the equation. "
        r"Draw a suitable line and use it to solve a related equation.",
        "solution": "Table, plot, identify turning point and roots. Use line intersection for the related equation.",
    },
    {
        "question": r"The curve \(y = {equation}\) is to be plotted. "
        r"Calculate values of \(y\) for given values of \(x\). Draw the graph on a suitable grid. "
        r"Write down the roots. Find the minimum point. "
        r"By drawing the line \(y = k\) on your graph, solve \(y = k\). "
        r"State the equation of the axis of symmetry.",
        "solution": "Table, plot. Roots at x-intercepts. Minimum at vertex. Axis of symmetry is the vertical through the vertex.",
    },
    {
        "question": r"Draw the graph of \(y = {equation}\) for a suitable domain. "
        r"Prepare a table of values with at least 7 points. Plot the graph accurately. "
        r"From your graph, write down the solutions. State the coordinates of the vertex. "
        r"On the same axes, draw a horizontal line and determine the number of solutions. "
        r"Find the gradient of the curve at a given point by drawing a tangent.",
        "solution": "Table, smooth curve. Roots and vertex from graph. Gradient = slope of tangent at the point.",
    },
    {
        "question": r"The height \(h\) metres of a ball above the ground \(t\) seconds after being thrown is given by \(h = {equation}\). "
        r"Complete a table showing the height at given times. Draw the graph of \(h\) against \(t\). "
        r"From your graph, find the maximum height and when it occurs. "
        r"Use your graph to find when the ball hits the ground. "
        r"At what times is the ball at a given height? For how long is the ball above a given height?",
        "solution": "Table, plot h vs t. Maximum at vertex. Ground when h = 0. Use horizontal line for given height; time above height from graph.",
    },
    {
        "question": r"The quadratic curve \(y = {equation}\) is given. "
        r"Draw up a table of values for a suitable range. Sketch the curve on graph paper. "
        r"Find the roots from your graph. Determine the minimum value. "
        r"By drawing a suitable line, solve a related equation. "
        r"State the range of values of \(x\) for which \(y \leq 0\).",
        "solution": "Table, plot. Roots and minimum from graph. Use line to solve related equation. \(y \leq 0\) between (and at) the roots.",
    },
    {
        "question": r"Consider the function \(y = {equation}\) for a suitable domain. "
        r"Construct a table of values using integer values of \(x\). Draw the graph. "
        r"Use your graph to write down the maximum point. Solve the equation graphically. "
        r"Draw a straight line and find the \(x\)-coordinates of the intersection points. "
        r"Hence solve a related equation. For what values of \(x\) is the curve above the line?",
        "solution": "Table, plot. Maximum at vertex. Roots from x-intercepts. Intersections with line give solutions. Inequality: where curve is above line.",
    },
]


# Quadratic - A-Level (10 template variations: discriminant, parameters, inequalities, transformations)
QUADRATIC_A_LEVEL_TEMPLATES = [
    {
        "question": r"The curve \(C\) has equation \(y = {equation}\). "
        r"Express \(y\) in the form \(a(x - h)^2 + k\), stating \(a\), \(h\), and \(k\). "
        r"Hence write down the coordinates of the vertex of \(C\) and state whether it is a maximum or a minimum. "
        r"Find the discriminant of the quadratic equation and deduce the number of real roots. "
        r"Solve the equation, giving your answers in exact form. "
        r"Sketch the graph of \(C\), showing clearly the intercepts with the axes and the vertex.",
        "solution": "Complete the square to get \(a(x-h)^2 + k\). Vertex at \((h, k)\); max if \(a < 0\), min if \(a > 0\). Discriminant \(\Delta = b^2 - 4ac\); two / one / no real roots according to \(\Delta > 0\), \(= 0\), \(< 0\). Solve using the quadratic formula for exact form.",
    },
    {
        "question": r"The quadratic equation \(kx^2 - 4x + 1 = 0\) has roots depending on the parameter \(k\). "
        r"Write down the discriminant of the quadratic in terms of \(k\). "
        r"Find the range of values of \(k\) for which the equation has: (a) two distinct real roots, (b) equal real roots, (c) no real roots. "
        r"For the case of equal real roots, find the corresponding value of \(x\). "
        r"Sketch, on a single diagram, typical graphs of \(y = kx^2 - 4x + 1\) for one value of \(k\) in each of the three cases.",
        "solution": "Discriminant \(\Delta = 16 - 4k\). Two distinct roots: \(\Delta > 0 \Rightarrow k < 4\); equal roots: \(\Delta = 0 \Rightarrow k = 4\), then \(x = 1/(2k)\); no real roots: \(\Delta < 0 \Rightarrow k > 4\). Sketch parabolas for \(k < 4\), \(k = 4\), \(k > 4\).",
    },
    {
        "question": r"The curve \(C\) has equation \(y = {equation}\) and the line \(L\) has equation \(y = mx + 1\), where \(m\) is a constant. "
        r"Show that the \(x\)-coordinates of points of intersection satisfy a quadratic in \(x\). "
        r"Find, in terms of \(m\), the discriminant of this quadratic. "
        r"Find the range of values of \(m\) for which \(C\) and \(L\) intersect at: (a) two distinct points, (b) exactly one point, (c) no points. "
        r"For the case where \(C\) and \(L\) intersect at exactly one point, find the coordinates of this point.",
        "solution": "Substitute \(y = mx + 1\) into the curve to get a quadratic in \(x\). Discriminant determines number of intersections. Two points: \(\Delta > 0\); one point (tangent): \(\Delta = 0\); no points: \(\Delta < 0\). For equal roots, solve to find \(m\) then the point.",
    },
    {
        "question": r"The function \(f\) is defined by \(f(x) = {equation}\). "
        r"Factorise \(f(x)\) and hence find the roots of the equation \(f(x) = 0\). "
        r"Sketch the graph of \(y = f(x)\), clearly indicating the intercepts and the vertex. "
        r"Solve the inequality \(f(x) > 0\). "
        r"Solve the inequality \(f(x) \leq c\) for a given constant \(c\). "
        r"Express the solutions of both inequalities using interval notation.",
        "solution": "Factorise (e.g. by inspection or formula). Roots from factors. Parabola: vertex from completing the square; \(f(x) > 0\) outside the roots (if \(a > 0\)) or between (if \(a < 0\)). Use graph or algebra for the second inequality; write as intervals.",
    },
    {
        "question": r"A projectile's height \(h\) metres after \(t\) seconds is modelled by \(h = {equation}\). "
        r"Find the height when \(t = 0\) and interpret this value. "
        r"Express \(h\) in the form \(a(t - p)^2 + q\) and hence find the maximum height and the time at which it occurs. "
        r"Find the time when the projectile hits the ground. "
        r"Sketch the graph of \(h\) against \(t\), labelling key points. "
        r"Use your graph or algebra to find the time interval during which the height is at least 25 m.",
        "solution": "\(t = 0\) gives initial height. Complete the square in \(t\); maximum at vertex \((p, q)\). Ground when \(h = 0\); solve quadratic for \(t\). Sketch parabola; solve \(h \geq 25\) for the time interval.",
    },
    {
        "question": r"The function \(f\) is defined for all real \(x\) by \(f(x) = {equation}\). "
        r"Complete the square to express \(f(x)\) in the form \(a(x + p)^2 + q\). "
        r"Hence determine the minimum value of \(f(x)\) and the value of \(x\) at which it occurs. "
        r"Solve the equation \(f(x) = 0\), giving your answers in exact form. "
        r"Hence or otherwise, solve the inequality \(f(x) \geq 2\). "
        r"Sketch the graph of \(y = f(x)\), clearly showing the vertex and the intersections with the axes (if any).",
        "solution": "Complete the square. Minimum = \(q\) at \(x = -p\) (if \(a > 0\)). Solve \(f(x) = 0\) with the quadratic formula. \(f(x) \geq 2\) gives a quadratic inequality; solve and express as intervals. Sketch using vertex and roots.",
    },
    {
        "question": r"The function \(g\) is defined by \(g(x) = \frac{1}{{equation}}\) (where the denominator is a quadratic). "
        r"Show that the denominator can be written in the form \((x - a)^2 + b\) with \(b > 0\). "
        r"Hence explain why the denominator is never zero for any real \(x\) and state the domain of \(g\). "
        r"Find the minimum value of the denominator. "
        r"Hence determine the maximum value of \(g(x)\). "
        r"Sketch the graph of \(y = g(x)\), indicating any asymptotes and the maximum value.",
        "solution": "Complete the square on the denominator; \((x-a)^2 + b > 0\) for all \(x\) if \(b > 0\), so domain is \(\mathbb{R}\). Minimum of denominator gives maximum of \(g\). Horizontal asymptote \(y = 0\); no vertical asymptotes.",
    },
    {
        "question": r"The curve \(C_1\) has equation \(y = x^2\). The curve \(C_2\) has equation \(y = {equation}\). "
        r"Describe, in terms of transformations, how the graph of \(y = {equation}\) can be obtained from \(C_1\). "
        r"Express \(y = {equation}\) in the form \(a(x - p)^2 + q\), stating the coordinates of the vertex. "
        r"Sketch both \(C_1\) and the graph of \(y = {equation}\) on the same axes, clearly labelling key points. "
        r"Write down the equation of the axis of symmetry of each quadratic graph drawn.",
        "solution": "Complete the square: \(y = a(x-p)^2 + q\) represents stretch scale factor \(|a|\), reflection in \(x\)-axis if \(a < 0\), then translation by \((p, q)\). Vertex at \((p, q)\). Axes of symmetry: \(x = 0\) for \(C_1\); \(x = p\) for \(C_2\).",
    },
    {
        "question": r"The function \(f\) is defined by \(f(x) = {equation}\), for all real \(x\). "
        r"Show that \(f(x)\) can be written in the form \((x - a)^2 + b\). "
        r"Hence state the minimum value of \(f(x)\) and its corresponding value of \(x\). "
        r"The function \(g\) is defined by \(g(x) = x - 4\). Find an expression for \(f(g(x))\) in simplified form. "
        r"Solve the equation \(f(g(x)) = 0\), giving your answers in exact form. "
        r"Sketch, on the same diagram, the graphs of \(y = f(x)\) and \(y = f(g(x))\), indicating how one is obtained from the other.",
        "solution": "Complete the square. Minimum = \(b\) at \(x = a\). \(f(g(x)) = f(x-4)\): substitute and expand/simplify. Solve \(f(g(x)) = 0\) for exact roots. Graph of \(f(g(x))\) is translation of \(y = f(x)\) by 4 units in the positive \(x\)-direction.",
    },
    {
        "question": r"The curve \(C\) has equation \(y = {equation}\). "
        r"Rewrite the equation in the form \(-(x^2 + ax + b)\) and hence factorise. "
        r"Find the \(x\)-coordinates of the points where \(C\) meets the \(x\)-axis. "
        r"Sketch the graph of \(C\), indicating the intercepts and the vertex. "
        r"The region bounded by the curve and the \(x\)-axis between its intercepts is denoted by \(R\). State, using inequalities, the range of \(x\) corresponding to \(R\). "
        r"Explain, using your sketch, whether \(y\) is positive or negative in \(R\), and hence describe the sign of the area if evaluated using integration.",
        "solution": "Factorise (e.g. \(6 - x - x^2 = (3-x)(2+x)\)). Roots from factors. Parabola: vertex between roots; \(R\) is between the two roots. In \(R\), curve is above or below axis depending on sign of \(a\); area integral gives positive or negative accordingly.",
    },
]


def get_quadratic_o_level_question(equation_display: str):
    """Pick a random quadratic O-Level template and substitute the equation."""
    import random
    t = random.choice(QUADRATIC_O_LEVEL_TEMPLATES)
    eq = equation_display or "x^2"
    return {
        "question": t["question"].format(equation=eq),
        "solution": t["solution"],
    }


def get_quadratic_a_level_question(equation_display: str):
    """Pick a random quadratic A-Level template and substitute the equation."""
    import random
    t = random.choice(QUADRATIC_A_LEVEL_TEMPLATES)
    eq = equation_display or "x^2"
    # Some A-Level templates use {equation} multiple times
    question = t["question"].replace("{equation}", eq)
    return {
        "question": question,
        "solution": t["solution"],
    }


# -------- Linear (O-Level) - 10 templates --------
LINEAR_O_LEVEL_TEMPLATES = [
    {
        "question": r"A straight line passes through the points A(2, 5) and B(6, 13). "
        r"Calculate the gradient of the line. Determine the equation of the line in the form \(y = mx + c\). "
        r"Find the coordinates of the point where the line crosses the y-axis. Find the x-intercept of the line. "
        r"State whether the line has positive or negative gradient.",
        "solution": "Gradient \(m = (13-5)/(6-2) = 2\). Equation: \(y - 5 = 2(x - 2)\) so \(y = 2x + 1\). y-intercept: \((0, 1)\). x-intercept: set \(y = 0\) to get \(x = -1/2\). Positive gradient.",
    },
    {
        "question": r"Draw the graph of \(y = {equation}\) for \(-2 \leq x \leq 4\). "
        r"Complete a table of values for \(x = -2, -1, 0, 1, 2, 3, 4\). "
        r"Draw the graph using a scale of 2 cm to 1 unit on both axes. "
        r"From your graph, find the value of \(y\) when \(x = 2.5\). Use your graph to solve the equation (set \(y\) equal to a given value). "
        r"State the gradient and y-intercept of the line.",
        "solution": "Complete table, plot points, join with a straight line. Read off \(y\) at \(x = 2.5\). Gradient = coefficient of \(x\); y-intercept = constant term.",
    },
    {
        "question": r"The line \(L_1\) has equation \(y = 2x + 3\). Draw the graph of \(L_1\) for \(-3 \leq x \leq 3\). "
        r"Write down the gradient of \(L_1\). Find the equation of the line \(L_2\) which is parallel to \(L_1\) and passes through \((0, -2)\). "
        r"Find the equation of the line \(L_3\) which is perpendicular to \(L_1\) and passes through \((1, 5)\). Draw \(L_2\) and \(L_3\) on the same axes.",
        "solution": "Gradient of \(L_1\) is 2. Parallel: same gradient, so \(L_2: y = 2x - 2\). Perpendicular: gradient \(= -1/2\), so \(L_3: y - 5 = -\\frac{1}{2}(x - 1)\).",
    },
    {
        "question": r"Consider the lines \(y = 2x + 1\) and \(y = -x + 7\). Draw both lines on the same axes for \(0 \leq x \leq 6\). "
        r"Find the coordinates of the point of intersection graphically. Verify your answer algebraically by solving the simultaneous equations. "
        r"State the range of values of \(x\) for which \(2x + 1 > -x + 7\). Calculate the area of the triangle formed by the two lines and the y-axis.",
        "solution": "Solve \(2x + 1 = -x + 7\) gives \(x = 2\), \(y = 5\). Inequality: \(3x > 6 \Rightarrow x > 2\). Area: use intercepts to find base and height.",
    },
    {
        "question": r"A cyclist travels from town A to town B. The distance-time graph shows the journey. "
        r"Calculate the speed during the first 2 hours if the cyclist covered 30 km. The cyclist rests for 30 minutes; show this on the graph. "
        r"After the rest, the cyclist travels at 20 km/h for 1.5 hours. Complete the graph. What is the total distance covered? "
        r"Calculate the average speed for the entire journey.",
        "solution": "Speed = distance/time. Rest: horizontal line. After rest: straight line with gradient 20. Total distance = sum of segments. Average speed = total distance / total time.",
    },
    {
        "question": r"The line with equation \(3x + 4y = 12\) is given. Rearrange the equation to the form \(y = mx + c\). "
        r"State the gradient and y-intercept. Find the x-intercept and y-intercept. "
        r"Draw the graph using the intercept method. Find the equation of a line parallel to this line passing through \((2, 5)\).",
        "solution": "\(y = -\\frac{3}{4}x + 3\). Gradient \(-3/4\), y-intercept 3. x-intercept: \(x = 4\). Parallel line: same gradient, \(y - 5 = -\\frac{3}{4}(x - 2)\).",
    },
    {
        "question": r"Use graph paper (2 cm to 1 unit on both axes). Plot the points P(-2, 1), Q(1, 4), and R(4, 7). "
        r"Draw the line passing through these points. Calculate the gradient of the line PQR. Determine the equation of the line. "
        r"Find the length of PR using the distance formula.",
        "solution": "Gradient \(m = (7-1)/(4-(-2)) = 1\). Equation: \(y = x + 3\). Length \(PR = \\sqrt{(4-(-2))^2 + (7-1)^2} = 6\\sqrt{2}\).",
    },
    {
        "question": r"A car accelerates uniformly from rest to 20 m/s in 10 seconds, travels at constant speed for 15 seconds, then decelerates uniformly to rest in 5 seconds. "
        r"Draw the speed-time graph for the journey. Calculate the acceleration during the first 10 seconds. "
        r"Calculate the deceleration during the last 5 seconds. Find the total distance travelled (area under the graph). "
        r"What was the average speed for the entire journey?",
        "solution": "Trapezium/rectangle shapes. Acceleration = 20/10 = 2 m/s². Deceleration = 20/5 = 4 m/s². Distance = area under graph. Average speed = total distance / 30 s.",
    },
    {
        "question": r"The cost \(C\) dollars of hiring a car is given by \(C = 50 + 0.2d\), where \(d\) is the distance in kilometres. "
        r"Complete a table showing \(C\) for \(d = 0, 100, 200, 300, 400\). Draw the graph of \(C\) against \(d\). "
        r"From your graph, find the cost of hiring a car for a journey of 250 km. What is the fixed charge (cost when \(d = 0\))? "
        r"If you have $90, what is the maximum distance you can travel?",
        "solution": "Table: C = 50, 70, 90, 110, 130. Fixed charge = $50. At 250 km read off C. For $90: \(90 = 50 + 0.2d \Rightarrow d = 200\) km.",
    },
    {
        "question": r"A line segment AB has endpoints A(-3, 2) and B(5, 8). Find the coordinates of the midpoint M of AB. "
        r"Calculate the gradient of AB. Find the equation of the line AB. "
        r"Find the equation of the perpendicular bisector of AB (line through M perpendicular to AB). "
        r"Find where the perpendicular bisector crosses the x-axis.",
        "solution": "Midpoint M = \(((-3+5)/2, (2+8)/2) = (1, 5)\). Gradient of AB = \((8-2)/(5-(-3)) = 3/4\). Perpendicular bisector: gradient \(-4/3\), through (1,5). Set \(y=0\) to find x-intercept.",
    },
]

# -------- Linear (A-Level) - 10 templates --------
LINEAR_A_LEVEL_TEMPLATES = [
    {
        "question": r"The line \(L_1\) has equation \(3x + 4y = 12\). Express the equation in the form \(y = mx + c\) and state the gradient. "
        r"Find the equation of the line \(L_2\) which is perpendicular to \(L_1\) and passes through \((2, -1)\). "
        r"Determine the coordinates of the point of intersection of \(L_1\) and \(L_2\). "
        r"Calculate the area of the triangle formed by \(L_1\), \(L_2\), and the x-axis. Find the distance from the origin to the point of intersection.",
        "solution": "\(y = -\\frac{3}{4}x + 3\); gradient \(-3/4\). Perpendicular gradient \(4/3\); \(L_2: y + 1 = \\frac{4}{3}(x - 2)\). Solve simultaneously for intersection. Area = half × base × height. Distance = \(\\sqrt{x^2 + y^2}\).",
    },
    {
        "question": r"A line is given in parametric form: \(x = 2 + 3t\), \(y = 1 - 2t\). Eliminate the parameter \(t\) to find the Cartesian equation. "
        r"Find the gradient of the line. Determine the coordinates of the point where \(t = 0\). "
        r"Find the value of \(t\) when the line crosses the x-axis. Find the perpendicular distance from the point \((5, 3)\) to the line.",
        "solution": "From \(t = (x-2)/3\) and \(t = (1-y)/2\), get \(2(x-2) + 3(1-y) = 0\). Gradient from direction vector. Perpendicular distance formula: \(d = |ax_0 + by_0 + c|/\\sqrt{a^2+b^2}\).",
    },
    {
        "question": r"Consider the family of lines \(y = 2x + k\), where \(k\) is a parameter. Sketch three members for \(k = -2, 0, 3\). "
        r"What do all these lines have in common? Find the value of \(k\) for which the line passes through \((3, 10)\). "
        r"Find the value of \(k\) for which the line is tangent to the circle \(x^2 + y^2 = 5\). "
        r"Determine the range of values of \(k\) for which the line intersects the positive x and y axes.",
        "solution": "All have gradient 2. For (3,10): \(10 = 6 + k \Rightarrow k = 4\). Tangent: substitute into circle, set discriminant = 0. Positive axes: intercepts \(> 0\) give conditions on \(k\).",
    },
    {
        "question": r"The line \(y = mx + 1\) intersects the circle \(x^2 + y^2 = 25\). Substitute the line equation into the circle to obtain a quadratic in \(x\). "
        r"Find the discriminant in terms of \(m\). Determine the range of values of \(m\) for which the line: (a) intersects at two points, (b) is tangent, (c) does not intersect. "
        r"For the tangent case, find the coordinates of the point of contact. Find the gradient of the diameter through this point.",
        "solution": "Substitute \(y = mx + 1\) into circle; discriminant \((2m)^2 - 4(1+m^2)(-24)\). Two points: \(\Delta > 0\); tangent: \(\Delta = 0\); no points: \(\Delta < 0\). Tangent point from double root. Diameter through centre (0,0).",
    },
    {
        "question": r"A line passes through P(2, 3) with gradient \(m\). Write the equation of the line in terms of \(m\). "
        r"Find \(m\) such that the line passes through \((5, 9)\). Find \(m\) such that the line is perpendicular to \(y = 3x - 1\). "
        r"The line intersects the x-axis at A and y-axis at B. Express the area of triangle OAB in terms of \(m\). Find the value of \(m > 0\) that minimizes this area.",
        "solution": "\(y - 3 = m(x - 2)\). For (5,9): \(m = 2\). Perpendicular: \(m = -1/3\). Intercepts: A = \((2 - 3/m, 0)\), B = \((0, 3 - 2m)\). Area = \(|OA \\cdot OB|/2\); differentiate w.r.t. \(m\) to minimize.",
    },
    {
        "question": r"Points A(1, 2) and B(4, 8) define a line. Find the vector \(\overrightarrow{AB}\). Write the vector equation of the line in the form \(\mathbf{r} = \mathbf{a} + \lambda \mathbf{b}\). "
        r"Convert to Cartesian form. Find the position vector of the point that divides AB in the ratio 2:1. "
        r"Determine whether the point \((7, 14)\) lies on the line.",
        "solution": "\(\overrightarrow{AB} = (3, 6)\). \(\mathbf{r} = (1,2) + \lambda(3,6)\). Cartesian: \((x-1)/3 = (y-2)/6\). Division: \(\mathbf{r} = (2\\mathbf{b} + \\mathbf{a})/3\). Substitute (7,14) to check.",
    },
    {
        "question": r"Find the equation of the locus of point P(x, y) which moves such that its distance from A(2, 3) is always equal to its distance from the line \(x = -2\). "
        r"Use the distance formula to set up the equation. Simplify to obtain the Cartesian equation. Identify the type of curve. Sketch the locus. Find where this locus intersects the y-axis.",
        "solution": "\(\\sqrt{(x-2)^2 + (y-3)^2} = |x + 2|\). Square and simplify: parabola. y-axis: set \(x = 0\) and solve for \(y\).",
    },
    {
        "question": r"Lines \(L_1\) and \(L_2\) have equations \(y = 2x + 1\) and \(y = -\\frac{1}{2}x + 4\) respectively. Find the gradients \(m_1\) and \(m_2\). "
        r"Use \(\tan\\theta = |(m_2 - m_1)/(1 + m_1 m_2)|\) to find the acute angle between the lines. Find the equations of the two angle bisectors. "
        r"Verify that the angle bisectors are perpendicular. Find where the angle bisectors intersect.",
        "solution": "\(m_1 = 2\), \(m_2 = -1/2\). \(\tan\\theta = |(-1/2 - 2)/(1 - 1)|\) (undefined) so \(\\theta = 90°\). Angle bisectors: locus of points equidistant from both lines.",
    },
    {
        "question": r"The following data shows hours studied \((x)\) and exam score \((y)\): \((2,45), (4,60), (5,65), (7,80), (8,85)\). "
        r"Plot the scatter diagram. Calculate the mean values \(\bar{x}\) and \(\bar{y}\). Find the equation of the regression line \(y = a + bx\) using \(b = S_{xy}/S_{xx}\). "
        r"Draw the regression line on your scatter diagram. Use the regression line to predict the score for 6 hours. Calculate the correlation coefficient and comment on the strength.",
        "solution": "\(\bar{x} = 5.2\), \(\bar{y} = 67\). \(S_{xx} = \\sum(x - \\bar{x})^2\), \(S_{xy} = \\sum(x-\\bar{x})(y-\\bar{y})\). \(b = S_{xy}/S_{xx}\), \(a = \\bar{y} - b\\bar{x}\). Predict: \(y = a + 6b\). \(r = S_{xy}/\\sqrt{S_{xx} S_{yy}}\).",
    },
    {
        "question": r"Points A(1, 2, 3) and B(4, 6, 7) are given in 3D. Find the vector \(\overrightarrow{AB}\). Calculate the distance \(|\overrightarrow{AB}|\). "
        r"Find the coordinates of the midpoint M. Find the equation of the line AB in vector form. "
        r"Determine the coordinates of the point that divides AB in the ratio 1:2 from A.",
        "solution": "\(\overrightarrow{AB} = (3, 4, 4)\). Distance = \(\\sqrt{9+16+16} = \\sqrt{41}\). Midpoint = \((2.5, 4, 5)\). \(\mathbf{r} = (1,2,3) + \lambda(3,4,4)\). Division: \(\mathbf{r} = (\\mathbf{a} + 2\\mathbf{b})/3\).",
    },
]

# -------- Exponential (O-Level) - 10 templates --------
EXPONENTIAL_O_LEVEL_TEMPLATES = [
    {
        "question": r"The population of bacteria is given by \(P = 500 \\times 2^t\), where \(t\) is the time in hours. "
        r"Calculate the initial population when \(t = 0\). Complete a table showing population for \(t = 0, 1, 2, 3, 4\). "
        r"Draw the graph of \(P\) against \(t\) for \(0 \\leq t \\leq 4\). Use your graph to estimate the population after 2.5 hours. "
        r"Find the time taken for the population to reach 4000 bacteria.",
        "solution": "Initial: P = 500. Table: 500, 1000, 2000, 4000, 8000. Plot and read off. For P = 4000, \(2^t = 8\) so \(t = 3\) hours.",
    },
    {
        "question": r"The value \(V\) dollars of a car \(t\) years after purchase is given by \(V = 20000 \\times (0.8)^t\). "
        r"Find the initial value. Complete a table for \(t = 0, 1, 2, 3, 4, 5\). Draw the graph of \(V\) against \(t\). "
        r"From your graph, estimate the value after 2.5 years. After how many years will the car be worth $10000? What percentage of its value does the car lose each year?",
        "solution": "Initial: $20000. Table and plot. \(10000 = 20000(0.8)^t \Rightarrow t = \\log(0.5)/\\log(0.8)\). Percentage loss = 20% per year.",
    },
    {
        "question": r"An investment grows according to \(A = 5000 \\times (1.06)^n\), where \(n\) is the number of years. "
        r"Calculate the amount after 0, 1, 2, 3, 4, 5 years. Draw the graph of \(A\) against \(n\). Use your graph to find the amount after 3.5 years. "
        r"How many years does it take for the investment to double? What is the annual interest rate?",
        "solution": "Table and plot. Double: \((1.06)^n = 2 \Rightarrow n = \\log 2 / \\log 1.06\). Interest rate 6%.",
    },
    {
        "question": r"The mass \(M\) grams of a radioactive substance after \(t\) days is given by \(M = 80 \\times (0.5)^{t/10}\). "
        r"Find the initial mass. Complete a table for \(t = 0, 10, 20, 30, 40, 50\). Sketch the graph of \(M\) against \(t\). "
        r"What is the half-life of the substance? Use your graph to find when the mass is 20 g. Estimate the mass after 25 days.",
        "solution": "Initial: 80 g. Half-life: time for M to halve, so 10 days. For M = 20: \((0.5)^{t/10} = 1/4\) so \(t/10 = 2\), \(t = 20\) days.",
    },
    {
        "question": r"Two investments: A: \(P = 1000 \\times 2^t\), B: \(P = 800 \\times (2.5)^t\), \(t\) in years. "
        r"Complete tables for both for \(t = 0, 1, 2, 3, 4\). Draw both graphs on the same axes. Which has higher initial value? Which grows faster? "
        r"After how many years does B overtake A? If you can invest for 3 years, which is better?",
        "solution": "A initial 1000, B initial 800. B grows faster (base 2.5 > 2). Solve \(1000(2^t) = 800(2.5^t)\) for \(t\). Compare values at \(t = 3\).",
    },
    {
        "question": r"The temperature \(T°C\) of coffee after \(t\) minutes is given by \(T = 20 + 60 \\times (0.9)^t\). "
        r"Find the initial temperature. Complete a table for \(t = 0, 5, 10, 15, 20, 25\). Draw the graph of \(T\) against \(t\). "
        r"What is the room temperature (as \(t \\to \\infty\))? Use your graph to find when \(T = 50°C\). Estimate the rate of cooling at \(t = 10\) by drawing a tangent.",
        "solution": "Initial: 80°C. Room temperature: 20°C. Solve \(20 + 60(0.9)^t = 50\) for \(t\). Rate = gradient of tangent at t = 10.",
    },
    {
        "question": r"A table shows growth following \(y = ab^x\). Given \(x = 0, 1, 2, 3, 4\) with \(y = 200, 240, \ldots\). "
        r"If the growth follows \(y = 200 \\times (1.2)^x\), complete the table. Draw the graph of \(y\) against \(x\). Use your graph to find \(y\) when \(x = 2.5\). "
        r"Find \(x\) when \(y = 400\). What is the percentage increase per unit of \(x\)?",
        "solution": "Table: 200, 240, 288, 345.6, 414.72. Plot. Percentage increase = 20%.",
    },
    {
        "question": r"The concentration \(C\) mg/L of medicine after \(t\) hours is given by \(C = 100 \\times (0.75)^t\). "
        r"Find the initial concentration. Complete a table for \(t = 0, 1, 2, 3, 4, 5, 6\). Draw the graph of \(C\) against \(t\). "
        r"When does the concentration fall below 25 mg/L? A second dose is needed when concentration reaches 20 mg/L. When should this be? What percentage is eliminated each hour?",
        "solution": "Initial: 100 mg/L. \(25 = 100(0.75)^t \Rightarrow t = \\log(0.25)/\\log(0.75)\). Solve for 20 mg/L. Elimination rate 25% per hour.",
    },
    {
        "question": r"An exponential curve passes through \((0, 5)\) and \((2, 20)\) with equation \(y = ab^x\). Find \(a\) and \(b\). "
        r"Complete a table for \(x = 0, 1, 2, 3, 4\). Draw the graph. Use your graph to find \(y\) when \(x = 1.5\). Find \(x\) when \(y = 40\). Describe what happens to \(y\) as \(x\) increases.",
        "solution": "\(a = 5\) (from (0,5)). \(20 = 5b^2 \Rightarrow b = 2\). Table and plot. \(y \to \\infty\) as \(x\) increases.",
    },
    {
        "question": r"A colony starts with 50 individuals and doubles every week: \(P = 50 \\times 2^w\). "
        r"Complete a table for \(w = 0, 1, 2, 3, 4, 5, 6\). Draw the graph of \(P\) against \(w\). Use your graph to estimate the population after 3.5 weeks. "
        r"After how many weeks will the population exceed 1000? If food supports 2000 insects, in which week is this limit reached? Calculate the average rate of growth between week 2 and week 4.",
        "solution": "Table: 50, 100, 200, 400, 800, 1600, 3200. \(1000 < 50(2^w) \Rightarrow w > \\log_2(20)\). For 2000: \(w = \\log_2(40)\). Average rate = (P(4)-P(2))/2.",
    },
]

# -------- Exponential (A-Level) - 10 templates --------
EXPONENTIAL_A_LEVEL_TEMPLATES = [
    {
        "question": r"A radioactive substance decays according to \(N = N_0 e^{-0.05t}\), with \(N_0 = 200\) grams. "
        r"State the initial amount. Calculate the amount remaining after 10 years (3 s.f.). Sketch the graph of \(N\) against \(t\). "
        r"Find the half-life of the substance. Determine after how many years the amount remaining will be 50 g.",
        "solution": "Initial: 200 g. \(N(10) = 200e^{-0.5}\). Half-life: \(e^{-0.05t} = 0.5 \Rightarrow t = \\ln 2 / 0.05\). For 50 g: \(200e^{-0.05t} = 50 \Rightarrow t = \\ln 4 / 0.05\).",
    },
    {
        "question": r"On the same axes, sketch \(y = 2^x\), \(y = 3^x\), and \(y = (1/2)^x\) for \(-2 \\leq x \\leq 3\). "
        r"Complete tables of values. State which represent growth and which decay. Find where each graph crosses the y-axis. For what \(x\) does \(2^x = 8\)? Solve graphically: \(3^x = 2^x\).",
        "solution": "All pass through (0,1). \(2^x\), \(3^x\) growth; \((1/2)^x\) decay. \(2^x = 8 \Rightarrow x = 3\). \(3^x = 2^x \Rightarrow x = 0\) only.",
    },
    {
        "question": r"Solve: (a) \(2^x = 16\), (b) \(5^x = 100\), (c) \(e^{2x} = 20\), (d) \(3^{x+1} = 27\), (e) \(2^{2x} - 5(2^x) + 4 = 0\) (let \(y = 2^x\)). "
        r"Sketch \(y = 2^x\) and use it to verify (a). Give answers to 3 decimal places where appropriate.",
        "solution": "(a) \(x = 4\). (b) \(x = \\log 100 / \\log 5\). (c) \(x = \\ln 20 / 2\). (d) \(x = 2\). (e) \(y^2 - 5y + 4 = 0 \Rightarrow y = 1\) or \(4\), so \(x = 0\) or \(2\).",
    },
    {
        "question": r"The curve \(C_1\) has equation \(y = e^x\). Describe the transformations to obtain: \(C_2: y = e^{x+2}\), \(C_3: y = e^x - 3\), \(C_4: y = 2e^x\), \(C_5: y = -e^x\). "
        r"Sketch all five on the same axes. State the equations of any asymptotes.",
        "solution": "C2: translation (-2,0). C3: translation (0,-3). C4: stretch 2 in y. C5: reflection in x-axis. All have horizontal asymptote (or y=0 for C3).",
    },
    {
        "question": r"Sketch \(y = \\ln x\) and \(y = e^x\) on the same axes for \(x > 0\). Complete tables. What is the relationship between these graphs? "
        r"Solve graphically: \(\ln x = 2\) (verify algebraically). Find the gradient of \(y = \\ln x\) at \(x = 1\). State the domain and range of each.",
        "solution": "Reflections in \(y = x\). \(\ln x = 2 \Rightarrow x = e^2\). Gradient of \(\ln x\) at 1 is 1. Domain of \(\ln x\): \(x > 0\); of \(e^x\): \(\mathbb{R}\).",
    },
    {
        "question": r"An investment grows as \(A = P(1 + r/n)^{nt}\), with \(P = 5000\), \(r = 0.06\), \(n = 4\), \(t\) in years. "
        r"Calculate \(A\) for \(t = 0, 1, 2, 3, 4, 5\). Sketch the graph. How long to double? (use logarithms). Compare with continuous compounding \(A = Pe^{rt}\). Find the effective annual rate for quarterly compounding.",
        "solution": "Table. Double: \((1.015)^{4t} = 2 \Rightarrow t = \\ln 2 / (4 \\ln 1.015)\). Effective rate = \((1 + 0.06/4)^4 - 1\).",
    },
    {
        "question": r"A population grows according to \(P = 1000/(1 + 9e^{-0.5t})\). Calculate \(P\) for \(t = 0, 2, 4, 6, 8, 10\). Sketch the graph. "
        r"What is the initial population? What happens to \(P\) as \(t \\to \\infty\)? Find when the population reaches 800. Describe how this differs from simple exponential growth.",
        "solution": "Initial: P = 100. As \(t \\to \\infty\), \(P \\to 1000\) (carrying capacity). Logistic curve. Solve \(1000/(1+9e^{-0.5t}) = 800\) for \(t\).",
    },
    {
        "question": r"Newton's Law of Cooling: \(T = T_a + (T_0 - T_a)e^{-kt}\), with \(T_a = 20\), \(T_0 = 100\), \(k = 0.05\). "
        r"Calculate \(T\) for \(t = 0, 10, 20, 30, 40, 50\) minutes. Sketch the graph. Find the time when \(T = 50°C\) (use logarithms). "
        r"What is the rate of cooling at \(t = 0\)? (find \(dT/dt\)). Interpret the horizontal asymptote.",
        "solution": "\(dT/dt = -k(T_0 - T_a)e^{-kt}\); at t=0 rate = \(-k(T_0 - T_a)\). Asymptote \(T = T_a\) (room temperature).",
    },
    {
        "question": r"Sketch \(y = (0.5)^x\), \(y = 2^x\), \(y = 3^x\), \(y = e^x\) on the same axes. Which represent growth and which decay? All pass through which point? "
        r"For \(a > 1\), what happens as \(a\) increases? Solve graphically: \(2^x = 3^{x-1}\). Find \(a\) such that \(a^2 = e\).",
        "solution": "All pass through (0,1). Growth: base > 1; decay: base < 1. \(a = \\sqrt{e}\).",
    },
    {
        "question": r"The function \(f(x) = e^{2x+1}\) for \(x \\in \\mathbb{R}\). Find the inverse \(f^{-1}(x)\) in terms of natural logarithms. State the domain and range of \(f\) and \(f^{-1}\). "
        r"Sketch \(y = f(x)\) and \(y = f^{-1}(x)\) on the same axes with \(y = x\). Find the point of intersection of \(y = f(x)\) and \(y = f^{-1}(x)\). Verify \(f(f^{-1}(x)) = x\).",
        "solution": "\(y = e^{2x+1} \Rightarrow 2x+1 = \\ln y \Rightarrow x = (\\ln y - 1)/2\), so \(f^{-1}(x) = (\\ln x - 1)/2\). Domain of \(f\): \(\mathbb{R}\); range \((0,\\infty)\). Intersection on \(y = x\).",
    },
]

# -------- Trigonometric (O-Level) - 10 templates --------
TRIGONOMETRIC_O_LEVEL_TEMPLATES = [
    {
        "question": r"Consider \(y = \\sin(x)\) for \(0° \\leq x \\leq 360°\). Complete a table of values at 30° intervals. "
        r"Draw the graph of \(y = \\sin(x)\). State the maximum and minimum values of \(y\). Use your graph to solve \(\sin(x) = 0.5\). State the period of the function.",
        "solution": "Max 1, min -1. Period 360°. Solutions to sin(x)=0.5: 30°, 150°.",
    },
    {
        "question": r"Draw the graph of \(y = \\cos(x)\) for \(0° \\leq x \\leq 360°\). Make a table at 30° intervals. Plot using 2 cm to 90° on x-axis and 2 cm to 1 unit on y-axis. "
        r"Write down the coordinates of the maximum and minimum points. Solve \(\cos(x) = -0.5\). State the period and amplitude. How does this compare to \(y = \\sin(x)\)?",
        "solution": "Max at (0,1), (360,1); min at (180,-1). Period 360°, amplitude 1. cos(x)=-0.5: 120°, 240°. Cos is sin shifted 90°.",
    },
    {
        "question": r"Sketch \(y = \\tan(x)\) for \(0° \\leq x \\leq 360°\). Complete a table for 0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°, 360°. "
        r"Identify where the function is undefined. Draw the graph showing vertical asymptotes. Solve \(\tan(x) = 1\). State the period of the tangent function.",
        "solution": "Undefined at 90°, 270°. Asymptotes at those values. tan(x)=1: 45°, 225°. Period 180°.",
    },
    {
        "question": r"Draw \(y = \\sin(x)\) and \(y = 3\\sin(x)\) on the same axes for \(0° \\leq x \\leq 360°\). Complete tables for both. State the amplitude of each. "
        r"What is the effect of the coefficient 3? Use your graphs to solve \(3\\sin(x) = 2\). For what values of \(x\) is \(3\\sin(x) > \\sin(x)\)?",
        "solution": "Amplitudes 1 and 3. Effect: vertical stretch scale factor 3. Solve 3sin(x)=2 for x. 3sin(x) > sin(x) when sin(x) > 0, i.e. 0° < x < 180°.",
    },
    {
        "question": r"Consider \(y = \\sin(2x)\) for \(0° \\leq x \\leq 360°\). Complete a table at 30° intervals. Draw the graph. How many complete cycles in 0° to 360°? "
        r"State the period of \(y = \\sin(2x)\). Compare with \(y = \\sin(x)\): effect of the coefficient 2? Solve \(\sin(2x) = 0.5\).",
        "solution": "Two complete cycles. Period 180°. Coefficient 2 halves the period. sin(2x)=0.5: 2x = 30°, 150° so x = 15°, 75°, 195°, 255°.",
    },
    {
        "question": r"Draw \(y = \\sin(x)\) and \(y = \\sin(x) + 2\) for \(0° \\leq x \\leq 360°\). Complete tables. Describe the transformation from \(\sin(x)\) to \(\sin(x) + 2\). "
        r"State the maximum and minimum of \(y = \\sin(x) + 2\). Solve \(\sin(x) + 2 = 2.5\). What is the range of \(y = \\sin(x) + 2\)?",
        "solution": "Translation (0, 2) upwards. Max 3, min 1. sin(x)+2=2.5 ⇒ sin(x)=0.5: 30°, 150°. Range [1, 3].",
    },
    {
        "question": r"The function \(y = 2\\sin(x) + 1\) for \(0° \\leq x \\leq 360°\). Complete a table at 45° intervals. Draw the graph. State the amplitude. "
        r"Write down the maximum and minimum values. Solve \(2\\sin(x) + 1 = 2\). Describe the transformations applied to \(y = \\sin(x)\) to obtain this graph.",
        "solution": "Amplitude 2. Max 3, min -1. 2sin(x)+1=2 ⇒ sin(x)=0.5: 30°, 150°. Stretch factor 2 in y, then translation (0,1).",
    },
    {
        "question": r"Draw the graph of \(y = -\\cos(x)\) for \(0° \\leq x \\leq 360°\). Complete a table. How does this differ from \(y = \\cos(x)\)? "
        r"State the maximum and minimum values. Solve \(-\\cos(x) = 0.5\). Describe the transformation.",
        "solution": "Reflection in x-axis. Max 1 (at 180°), min -1 (at 0°, 360°). -cos(x)=0.5 ⇒ cos(x)=-0.5: 120°, 240°.",
    },
    {
        "question": r"On the same axes, draw \(y = \\sin(x)\) and \(y = \\cos(x)\) for \(0° \\leq x \\leq 360°\). Use your graphs to solve \(\sin(x) = \\cos(x)\). "
        r"For what values of \(x\) is \(\sin(x) > \\cos(x)\)? State the points where the graphs intersect. Verify one solution algebraically.",
        "solution": "sin(x)=cos(x) ⇒ tan(x)=1, so 45°, 225°. sin > cos when 45° < x < 225° (first cycle). Intersections at (45°, √2/2), (225°, -√2/2).",
    },
    {
        "question": r"The height \(h\) metres of water at a harbour is modelled by \(h = 5 + 3\\sin(30t)°\), where \(t\) is the time in hours after midnight. "
        r"Complete a table for \(t = 0, 2, 4, 6, 8, 10, 12\). Draw the graph of \(h\) against \(t\). What is the maximum and minimum height? "
        r"At what times is the water at a height of 6 m? When is high tide and when is low tide?",
        "solution": "Max 8 m, min 2 m. 5+3sin(30t)=6 ⇒ sin(30t)=1/3; solve for t. High tide when sin maximum; low tide when sin minimum.",
    },
]

# -------- Trigonometric (A-Level) - 10 templates --------
TRIGONOMETRIC_A_LEVEL_TEMPLATES = [
    {
        "question": r"The function \(f(x) = 3\\sin(2x) + 1\) for \(0° \\leq x \\leq 360°\). State the amplitude and period. Write down the maximum and minimum values of \(f(x)\). "
        r"Sketch the graph showing two complete cycles. Solve \(3\\sin(2x) + 1 = 2.5\) for \(0° \\leq x \\leq 360°\) (1 d.p.).",
        "solution": "Amplitude 3, period 180°. Max 4, min -2. 3sin(2x)+1=2.5 ⇒ sin(2x)=0.5 ⇒ 2x = 30°, 150°, 390°, 510° so x = 15°, 75°, 195°, 255°.",
    },
    {
        "question": r"Consider \(f(x) = \\sin(x)\) and \(g(x) = \\sin(x - 60°)\) for \(0° \\leq x \\leq 360°\). Sketch both on the same axes. Describe the transformation from \(f\) to \(g\). "
        r"State where each graph crosses the x-axis. Solve \(\sin(x - 60°) = 0.5\). Find the phase shift in degrees. How would \(y = \\sin(x + 30°)\) compare?",
        "solution": "Translation 60° to the right. Phase shift 60°. sin(x-60°)=0.5 ⇒ x-60° = 30°, 150° so x = 90°, 210°. sin(x+30°) shifts left 30°.",
    },
    {
        "question": r"The function \(h(x) = 2\\cos(x) - \\sin(2x)\) for \(0 \\leq x \\leq 2\\pi\) radians. Complete a table at intervals of \(\pi/6\). Sketch the graph. "
        r"Find the maximum and minimum values. Solve \(h(x) = 0\). Describe the symmetry. State the period of \(h(x)\).",
        "solution": "Use calculus or graph for max/min. h(x)=0: solve numerically or algebraically. Period: 2π for cos(x), π for sin(2x); LCM gives period 2π.",
    },
    {
        "question": r"Sketch \(y = \\cosec(x) = 1/\\sin(x)\) for \(-2\\pi \\leq x \\leq 2\\pi\). First sketch \(y = \\sin(x)\) lightly. Identify where \(\sin(x) = 0\) (vertical asymptotes). "
        r"Complete a table. Draw the graph showing asymptotes. State the range of \(\\cosec(x)\). Compare with \(y = \\sec(x) = 1/\\cos(x)\).",
        "solution": "Asymptotes at \(x = 0, \\pm\\pi, \\pm 2\\pi\). Range \(|\\cosec(x)| \\geq 1\).",
    },
    {
        "question": r"On the same axes, sketch \(y = \\tan(x)\) and \(y = 2\\cos(x)\) for \(0 \\leq x \\leq 2\\pi\). Find graphically the approximate solutions to \(\tan(x) = 2\\cos(x)\). "
        r"Verify one solution. How many solutions in the interval? Rearrange to \(\sin(x) = 2\\cos^2(x)\) and solve algebraically.",
        "solution": "tan(x)=2cos(x) ⇒ sin(x)/cos(x)=2cos(x) ⇒ sin(x)=2cos²(x). Solve for x in [0, 2π].",
    },
    {
        "question": r"Sketch \(y = \\sin(x)\) for \(-\\pi/2 \\leq x \\leq \\pi/2\) and \(y = \\arcsin(x)\) for \(-1 \\leq x \\leq 1\). Show the line \(y = x\). "
        r"What is the relationship? State the domain and range of each. Verify \(\sin(\\arcsin(0.5)) = 0.5\).",
        "solution": "Reflections in y=x. arcsin domain [-1,1], range [-π/2, π/2]. sin(arcsin(0.5)) = 0.5.",
    },
    {
        "question": r"Express \(f(x) = 3\\sin(x) + 4\\cos(x)\) in the form \(R\\sin(x + \\alpha)\), with \(R > 0\) and \(0 < \\alpha < 90°\). Find \(R\) and \(\\alpha\) (\(R = \\sqrt{3^2+4^2}\), \(\\tan\\alpha = 4/3\)). "
        r"Sketch the graph for \(0° \\leq x \\leq 360°\). State the maximum and minimum. Solve \(3\\sin(x) + 4\\cos(x) = 2\). Find the values of \(x\) for which \(f(x)\) is maximum.",
        "solution": "R = 5, α ≈ 53.1°. Max 5, min -5. Solve Rsin(x+α)=2 for x. Maximum when x+α = 90°.",
    },
    {
        "question": r"A mass on a spring oscillates with \(y = 5\\cos(2\\pi t/3)\) cm, \(t\) in seconds. Sketch \(y\) against \(t\) for \(0 \\leq t \\leq 6\). "
        r"What is the amplitude and period? Find the times when \(y = 2.5\) cm in the first period. What is the frequency? Find \(v = dy/dt\) and sketch it.",
        "solution": "Amplitude 5 cm, period 3 s. 5cos(2πt/3)=2.5 ⇒ cos(2πt/3)=0.5 ⇒ 2πt/3 = π/3, 5π/3 ⇒ t = 0.5, 2.5 s. Frequency = 1/3 Hz. v = -5(2π/3)sin(2πt/3).",
    },
    {
        "question": r"On the same axes, sketch \(y = \\sin(x)\), \(y = \\sin(2x)\), \(y = \\sin(3x)\) for \(0° \\leq x \\leq 360°\). How does the coefficient affect the number of cycles? "
        r"Solve graphically: \(\sin(2x) = \\sin(x)\). Verify algebraically. State the period of each function.",
        "solution": "sin(x) period 360°, sin(2x) 180°, sin(3x) 120°. sin(2x)=sin(x) ⇒ 2x = x + 360k or 2x = 180-x + 360k; solve for x in [0,360].",
    },
    {
        "question": r"The function \(g(x) = 2\\tan(x/2) - 1\) for \(-2\\pi < x < 2\\pi\). Identify the vertical asymptotes. State the period of \(g(x)\). "
        r"Sketch the graph showing at least two complete cycles. Find \(g(\\pi/2)\). Solve \(g(x) = 1\). Describe the transformations applied to \(y = \\tan(x)\) to obtain \(g(x)\).",
        "solution": "Asymptotes where x/2 = π/2 + kπ, so x = π + 2kπ. Period 2π. g(π/2)=2tan(π/4)-1=1. Stretch 2 in y, period doubled, translation (0,-1).",
    },
]

# -------- Linear Programming (O-Level) - 10 templates --------
LINEAR_PROGRAMMING_O_LEVEL_TEMPLATES = [
    {
        "question": r"A farmer has 20 hectares for maize (\(x\)) and beans (\(y\)). Constraints: \(x + y \\leq 20\), \(x \\geq 5\), \(y \\geq 3\), \(x, y \\geq 0\). Profit: \(P = 300x + 400y\) dollars. "
        r"Draw the inequalities and shade the feasible region. Identify the vertices. Calculate the profit at each vertex. Determine the optimal strategy. State the maximum profit.",
        "solution": "Plot lines, shade feasible region. Vertices: (5,3), (5,15), (17,3), etc. Evaluate P at each. Maximum at vertex giving highest P.",
    },
    {
        "question": r"A company makes tables (\(x\)) and chairs (\(y\)). Each table needs 5 hours, each chair 3 hours. Maximum 45 hours. \(x \\geq 2\), \(y \\geq 4\). "
        r"Write the time constraint: \(5x + 3y \\leq 45\). Draw the feasible region (2 cm to 2 units). Profit \(P = 50x + 30y\). Use the corner point method to find maximum profit. State how many tables and chairs.",
        "solution": "Feasible region polygon. Vertices from constraint intersections. P maximum at one vertex.",
    },
    {
        "question": r"A diet needs at least 20 units protein and 30 units carbohydrates. Food A: 2 protein, 3 carb per serving. Food B: 4 protein, 2 carb. Let \(x\) = servings of A, \(y\) = B. "
        r"Write the constraint inequalities. Include \(x, y \\geq 0\). Draw the feasible region. Cost \(C = 3x + 4y\). Find the minimum cost diet. State servings of each food.",
        "solution": "2x+4y ≥ 20, 3x+2y ≥ 30. Feasible region unbounded above. Minimize C at a vertex.",
    },
    {
        "question": r"A delivery company: Depot A has 15 trucks, B has 12. At least 8 to Location 1, 10 to Location 2. Let \(x\) = trucks from A to Location 1, \(y\) = from B to Location 1. "
        r"Write inequalities and simplify. Draw the feasible region. Write the cost function. Minimize the total cost.",
        "solution": "Constraints: x ≥ 8, (15-x)+(12-y) ≥ 10, etc. Feasible region. Minimize cost function in terms of x, y.",
    },
    {
        "question": r"A factory produces A and B. A needs 2 kg material and 1 hour; B needs 3 kg and 2 hours. Maximum 60 kg material, 40 hours. Inequalities: \(2x + 3y \\leq 60\), \(x + 2y \\leq 40\), \(x, y \\geq 0\). "
        r"Draw the feasible region (2 cm to 5 units). Profit \(P = 15x + 20y\). Find vertices and profit at each. What is the optimal production plan?",
        "solution": "Plot constraints. Vertices: (0,0), (0,20), (30,0), and intersection of 2x+3y=60 and x+2y=40. Evaluate P.",
    },
    {
        "question": r"An investor has $10000. At least $2000 in X and $3000 in Y. Let \(x, y\) = amount in thousands. Constraints: \(x + y \\leq 10\), \(x \\geq 2\), \(y \\geq 3\). "
        r"Draw the feasible region. Expected return \(R = 0.08x + 0.12y\). Find the maximum return. How should the money be invested? What is the maximum return in dollars?",
        "solution": "Vertices: (2,3), (2,8), (7,3). R = 0.08x+0.12y. Maximum at (2,8): R = 1.12 thousand = $1120.",
    },
    {
        "question": r"A bakery makes cakes (\(x\)) and pies (\(y\)). Each cake: 200 g flour, 100 g sugar. Each pie: 150 g flour, 150 g sugar. Available: 3000 g flour, 2400 g sugar. "
        r"Write inequalities: \(200x + 150y \\leq 3000\), \(100x + 150y \\leq 2400\), \(x, y \\geq 0\). Draw the feasible region. Profit \(P = 8x + 6y\). Find optimal quantities and maximum profit.",
        "solution": "Simplify to 4x+3y ≤ 60, 2x+3y ≤ 48. Feasible region. Maximize P at a vertex.",
    },
    {
        "question": r"A nursery has space for at most 100 plants: roses (\(x\)) and tulips (\(y\)). \(x + y \\leq 100\), \(x \\geq 20\), \(y \\geq 30\). Roses 2 hours each, tulips 1 hour; maximum 150 hours: \(2x + y \\leq 150\). "
        r"Draw the feasible region. Profit \(P = 12x + 8y\). Determine the optimal number of each. What is the maximum profit?",
        "solution": "Vertices from constraints. Evaluate P = 12x+8y at each. Maximum at corner.",
    },
    {
        "question": r"Textile mill: cloth A (\(x\) m) and B (\(y\) m). Weaving: \(3x + 2y \\leq 120\); Dyeing: \(2x + 4y \\leq 160\); \(x \\geq 10\), \(y \\geq 15\). "
        r"Draw the feasible region (2 cm to 10 units). Revenue \(R = 25x + 30y\). Find vertices and evaluate revenue. What production maximizes revenue?",
        "solution": "Plot all constraints. Find intersection points. R maximum at a vertex.",
    },
    {
        "question": r"A company allocates budget to TV (\(x\)) and radio (\(y\)) in thousands. Total budget \(x + y \\leq 50\). Minimum TV \(x \\geq 10\), radio \(y \\geq 15\). "
        r"Reach: \(R = 2000x + 1500y\) people. Draw the feasible region. Maximize the reach. How should the budget be allocated? What is the maximum number of people reached?",
        "solution": "Feasible: triangle or polygon. Vertices: (10,15), (35,15), (10,40). Evaluate R. Maximum at (35,15) or (10,40) depending on constraint.",
    },
]

# -------- Linear Programming (A-Level) - 10 templates --------
LINEAR_PROGRAMMING_A_LEVEL_TEMPLATES = [
    {
        "question": r"A company makes products A and B. Each unit of A needs 2 h on Machine 1 and 3 h on Machine 2; each unit of B needs 4 h on Machine 1 and 2 h on Machine 2. Machine 1: 80 h/week, Machine 2: 60 h/week. "
        r"Write the inequalities. Draw the feasible region. Profit: $50 per A, $60 per B. Use the corner point method to maximize profit. State the production plan and maximum weekly profit.",
        "solution": "2x+4y ≤ 80, 3x+2y ≤ 60, x,y ≥ 0. Vertices: (0,0), (20,0), (0,30), intersection of 2x+4y=80 and 3x+2y=60. P = 50x+60y.",
    },
    {
        "question": r"A diet must provide at least 60 units vitamin A and 40 units vitamin B. Food X: 3 A, 2 B per serving, $4. Food Y: 2 A, 4 B per serving, $3. "
        r"Formulate: \(3x + 2y \\geq 60\), \(2x + 4y \\geq 40\), \(x, y \\geq 0\). Draw the feasible region (unbounded). Cost \(C = 4x + 3y\). Find the minimum cost combination.",
        "solution": "Feasible region. Minimize C at a vertex. Check all corners.",
    },
    {
        "question": r"Profit \(\pi = 30x + 40y\) subject to \(2x + 3y \\leq 120\), \(x + 2y \\leq 80\), \(x, y \\geq 0\). Draw the feasible region and find the optimal solution. "
        r"If the profit on P increases to $35, does the optimal solution change? Find the range of profit coefficients for P (Q fixed at $40) for which the current optimum remains. What if labor changes to \(2x + 3y \\leq 130\)?",
        "solution": "Sensitivity analysis: shadow prices and allowable ranges. New constraint may shift optimal vertex.",
    },
    {
        "question": r"Resources: \(4x + 3y \\leq 240\), \(2x + 5y \\leq 200\), \(x \\geq 20\), \(y \\geq 15\). Profit \(P = 25x + 30y\). Draw the feasible region. "
        r"Identify corner points and profit at each. Determine optimal quantities. If a third product C is introduced, explain the limitations of the graphical method.",
        "solution": "Three variables require 3D or simplex; graphical method only for two variables.",
    },
    {
        "question": r"Warehouse A: 50 units, B: 70 units. Store 1 needs ≥ 40, Store 2 needs ≥ 60. Let \(x\) = from A to Store 1, \(y\) = from B to Store 1. Formulate constraints and cost. Minimize total transportation cost.",
        "solution": "x+y ≥ 40, (50-x)+(70-y) ≥ 60, 0≤x≤50, 0≤y≤70. Cost = 5x+4y+6(50-x)+7(70-y) = -x-3y+790. Minimize.",
    },
    {
        "question": r"Wood: \(10x + 4y \\leq 200\); Time: \(2x + 3y \\leq 60\); \(x, y \\geq 0\). Profit \(P = 100x + 60y\). Find the optimal solution. "
        r"If \(x\) and \(y\) must be integers, find the optimal integer solution. Compare profit with the continuous optimum. How much profit is lost by restricting to integers?",
        "solution": "Continuous optimum may be non-integer. Test nearby integer lattice points. Integer solution may be (9,10) or similar.",
    },
    {
        "question": r"Maximize profit \(P = 40x + 50y\) and minimize environmental cost \(E = 3x + 2y\). Constraints: \(2x + y \\leq 100\), \(x + 3y \\leq 120\), \(x, y \\geq 0\). "
        r"Find the solution that maximizes profit. Find the solution that minimizes E. Find a compromise maximizing \(P - 10E\). Discuss trade-offs.",
        "solution": "Multi-objective: different vertices for each objective. Compromise objective P-10E gives a single vertex.",
    },
    {
        "question": r"Blending: Oil A $50/barrel, 40% high-grade; Oil B $40/barrel, 20% high-grade. Need 1000 barrels with ≥ 30% high-grade. Let \(x\) = barrels of A, \(y\) of B. "
        r"Constraints: \(x + y = 1000\), \(0.4x + 0.2y \\geq 300\). Cost \(C = 50x + 40y\). Graph (use \(y = 1000 - x\)) and find the minimum cost blend.",
        "solution": "Substitute y=1000-x into inequality. Find feasible x range. Minimize C = 50x+40(1000-x) = 10x+40000.",
    },
    {
        "question": r"Demand 3 months: 100, 150, 120. Capacity 130/month. Storage $5/unit/month, production $50/unit. Consider months 1 and 2 with \(x, y\) production. "
        r"Constraints: \(x \\leq 130\), \(y \\leq 130\), \(x \\geq 100\), \(x + y \\geq 250\). Cost \(C = 55x + 50y - 500\). Minimize cost. Extend to month 3.",
        "solution": "Feasible region for (x,y). Minimize C. Month 3: similar with cumulative demand.",
    },
    {
        "question": r"Maximize \(P = cx + 40y\) subject to \(2x + 3y \\leq 120\), \(x + 2y \\leq 80\), \(x, y \\geq 0\), where \(c\) is a parameter. "
        r"Draw the feasible region. Corner points: (0,0), (60,0), (0,40), (24,28). Calculate profit at each in terms of \(c\). For what range of \(c\) is each corner optimal? Find the critical value of \(c\) where the optimum changes.",
        "solution": "P(24,28)=24c+1120. Compare with P(60,0)=60c, P(0,40)=1600. Critical c when 24c+1120 = 60c or 1600.",
    },
]

# -------- Statistical (O-Level) - 10 templates --------
STATISTICAL_O_LEVEL_TEMPLATES = [
    {
        "question": r"The table shows favourite subjects of 100 students: Math 25, Science 30, English 20, History 15, Art 10. "
        r"Draw a bar chart using a scale of 2 cm to 10 students. Which subject is most popular? What percentage prefer Science? How many more prefer Math than History? If 5 students changed from Art to Math, redraw the chart.",
        "solution": "Bar chart: label axes, draw bars. Most popular: Science (30%). Science 30%. Math 25, History 15, so 10 more. New: Math 30, Art 5.",
    },
    {
        "question": r"60 students: transport to school — Bus 20, Walk 15, Car 18, Bicycle 7. Calculate the angle for each sector in a pie chart. Draw the pie chart (radius 4 cm). "
        r"What fraction walk to school? What percentage travel by car? If 3 more students start walking, what would the new angle be?",
        "solution": "Angles: Bus 120°, Walk 90°, Car 108°, Bicycle 42°. Fraction walk = 15/60 = 1/4. Car 18/60 = 30%. New walk 18/63; angle = (18/63)×360°.",
    },
    {
        "question": r"Heights (cm) of 50 plants: 10-20 (5), 20-30 (12), 30-40 (18), 40-50 (10), 50-60 (5). Draw a histogram. State the modal class. "
        r"How many plants are between 30 and 50 cm? What percentage are taller than 40 cm? Estimate the number taller than 35 cm.",
        "solution": "Modal class: 30-40 (highest frequency). 30-50: 18+10=28. Taller than 40: 15, so 30%. Interpolate in 30-40 for 35 cm.",
    },
    {
        "question": r"Test scores of 40 students: 0-20 (3), 20-40 (8), 40-60 (15), 60-80 (10), 80-100 (4). Find the midpoint of each class. Draw a frequency polygon using midpoints. "
        r"On the same axes, draw a histogram. Which class has the highest frequency? How many scored 60 or more?",
        "solution": "Midpoints: 10, 30, 50, 70, 90. Frequency polygon: points at (midpoint, freq). Highest: 40-60. 60 or more: 10+4=14.",
    },
    {
        "question": r"Masses (kg) of 80 students: 40-45 (8), 45-50 (15), 50-55 (22), 55-60 (20), 60-65 (10), 65-70 (5). Complete the cumulative frequency column. "
        r"Draw a cumulative frequency curve. Use your graph to estimate the median mass. Find the interquartile range. How many have mass greater than 58 kg?",
        "solution": "Cumulative: 8, 23, 45, 65, 75, 80. Ogive. Median at 40th value. Q1 at 20th, Q3 at 60th. IQR = Q3-Q1. >58: read from curve.",
    },
    {
        "question": r"Sales of two products over 5 months: Jan (50,40), Feb (55,45), Mar (60,55), Apr (65,60), May (70,50). Draw a comparative bar chart. "
        r"Which product had higher sales in March? In which month was the difference greatest? Calculate total sales for each product. Describe the trend for each.",
        "solution": "Grouped bars. March: A 60, B 55 so A higher. Difference: calculate each month. Totals: A 300, B 250. Trends: both generally increasing.",
    },
    {
        "question": r"Daily max temperatures (°C) for a week: Mon 18, Tue 20, Wed 22, Thu 21, Fri 19, Sat 17, Sun 16. Draw a line graph. On which day was it hottest? "
        r"Describe the temperature trend. What was the range of temperatures? Estimate Wednesday afternoon if it was 2°C higher than the maximum.",
        "solution": "Line graph: days on x-axis. Hottest: Wednesday (22°C). Trend: peak mid-week. Range 22-16=6°C. Wednesday afternoon ≈ 24°C.",
    },
    {
        "question": r"Ages of 20 people: 23, 27, 31, 25, 28, 34, 22, 29, 26, 30, 33, 24, 27, 31, 28, 25, 32, 29, 26, 27. Construct a stem-and-leaf diagram. "
        r"Find the median age. Find the modal age. Find the range. What percentage are aged 30 or above?",
        "solution": "Stems 2, 3. Leaf order. Median = average of 10th and 11th. Mode = 27. Range 34-22=12. 30+: count, then percentage.",
    },
    {
        "question": r"Time (minutes) on homework: 0-10 (4), 10-20 (12), 20-30 (18), 30-50 (16), 50-80 (15). Complete class width and frequency density. "
        r"Draw a histogram using frequency density. Which class has the highest frequency density? Estimate the number between 25 and 35 minutes. What is the modal class?",
        "solution": "Frequency density = freq/width. 0-10: width 10, FD 0.4; 30-50: width 20, FD 0.8; etc. Histogram: area = frequency. Modal class: highest FD or frequency.",
    },
    {
        "question": r"Marks of 30 students: Minimum 35, Lower quartile 52, Median 68, Upper quartile 81, Maximum 95. Draw a box-and-whisker plot. "
        r"What is the interquartile range? What percentage scored above 81? Is there evidence of skewness? If a student scored 90, which quartile are they in?",
        "solution": "IQR = 81-52 = 29. Above 81: 25%. Skewness: compare mean and median or tail lengths. 90 is above Q3 (upper quartile).",
    },
]

# -------- Statistical (A-Level) - 10 templates --------
STATISTICAL_A_LEVEL_TEMPLATES = [
    {
        "question": r"Times (minutes) for 100 students to complete a test: 0-10 (5), 10-20 (15), 20-30 (25), 30-40 (30), 40-60 (18), 60-100 (7). Complete class width and frequency density. "
        r"Draw a histogram with frequency density on the y-axis. Estimate the number who took between 35 and 55 minutes. Calculate an estimate of the mean. Identify the modal class. Comment on the skewness.",
        "solution": "FD = freq/width. Mean ≈ Σ(midpoint×freq)/Σfreq. Modal class: 30-40. Skewness from shape.",
    },
    {
        "question": r"Masses (kg) of 80 athletes: 50-60 (6), 60-70 (14), 70-80 (25), 80-90 (20), 90-100 (10), 100-110 (5). Complete cumulative frequency. Draw the cumulative frequency curve. "
        r"Estimate median, Q1, Q3. Calculate the IQR. Draw a box-and-whisker plot. Identify outliers using Q1 - 1.5×IQR and Q3 + 1.5×IQR. Estimate the 90th percentile.",
        "solution": "Ogive. Median, Q1, Q3 from graph. IQR = Q3-Q1. Outliers: outside [Q1-1.5IQR, Q3+1.5IQR]. 90th percentile at 72nd value.",
    },
    {
        "question": r"Exam scores: Class A 0-20 (2), 20-40 (8), 40-60 (15), 60-80 (20), 80-100 (5); Class B 0-20 (4), 20-40 (12), 40-60 (18), 60-80 (12), 80-100 (4). Draw back-to-back histograms. "
        r"Calculate the mean and standard deviation for each class (using midpoints). Which class performed better? Which has more consistent scores? Compare the distributions.",
        "solution": "Back-to-back: same classes, frequencies opposite directions. Mean = Σ(m×f)/Σf. SD = √(Σf(m-mean)²/Σf). Compare means and SDs.",
    },
    {
        "question": r"Heights (x cm) and weights (y kg) of 10 students. Draw a scatter diagram. Describe the correlation (type and strength). "
        r"Calculate the mean point (x̄, ȳ). Calculate Sxx, Syy, Sxy. Find the regression line y on x: y = a + bx. Draw the line. Predict weight for height 162 cm. "
        r"Calculate the product moment correlation coefficient r. Test whether r is significant at 5% (use critical value table).",
        "solution": "Scatter: positive correlation. b = Sxy/Sxx, a = ȳ - b x̄. Predict: y = a + 162b. r = Sxy/√(Sxx Syy). Compare |r| with critical value for n=10.",
    },
    {
        "question": r"Quarterly sales ($1000s) over 3 years. Plot the time series. Calculate 4-quarter moving averages. Plot the moving averages. Describe the trend. "
        r"Calculate seasonal variations for each quarter. Predict sales for Q1 and Q2 of Year 4 using trend and seasonal adjustments.",
        "solution": "Moving average smooths seasonality. Centered MA for even order. Seasonal = actual - trend. Forecast = trend + seasonal.",
    },
    {
        "question": r"Heights (cm) of plants: 0-5 (8), 5-15 (20), 15-25 (35), 25-40 (25), 40-70 (12). Calculate frequency density. Draw a histogram. "
        r"Estimate the mean using midpoints. Identify the class containing the median. Use linear interpolation to estimate the median. Estimate the standard deviation. Calculate the coefficient of variation.",
        "solution": "Mean = Σ(m×f)/n. Median class: cumulative freq ≥ n/2. Linear interpolation: median = L + (n/2 - F)/f × c. CV = SD/mean × 100%.",
    },
    {
        "question": r"Dataset of 20 exam scores. Find the five-number summary (min, Q1, median, Q3, max). Calculate IQR. Identify outliers (Q1 - 1.5×IQR, Q3 + 1.5×IQR). "
        r"Draw a box-and-whisker plot, marking outliers separately. Calculate mean and SD. Compare median and mean — comment on skewness. Remove outliers and recalculate mean — discuss the effect.",
        "solution": "Five-number summary. Outliers outside whiskers. Mean affected by outliers; median robust.",
    },
    {
        "question": r"Test scores for three groups: A (Min 35, Q1 52, Med 68, Q3 81, Max 95); B (42, 58, 70, 78, 88); C (30, 48, 65, 85, 98). Draw box plots for all three on the same scale. "
        r"Calculate IQR for each. Which group has the highest median? Which shows the most spread? Which is most positively skewed? Compare the distributions.",
        "solution": "IQR = Q3-Q1 for each. Compare medians, ranges, and skewness from box positions.",
    },
    {
        "question": r"Waiting times (min): 12, 15, 18, 21, 23, 25, 27, 28, 30, 32, 34, 35, 37, 38, 40, 42, 45, 48, 51, 55. Construct a stem-and-leaf diagram. "
        r"Find the median, mode, mean, range, IQR. Draw a box plot. Compare mean and median — is the distribution symmetric?",
        "solution": "Stems 1, 2, 3, 4, 5. Median = average of 10th and 11th. Mean = sum/20. Symmetric if mean ≈ median.",
    },
    {
        "question": r"Two variables x and y have correlation r = 0.85. Data given. Draw a scatter diagram. Calculate the regression line y on x and the regression line x on y. "
        r"Draw both lines on the scatter diagram. Use y on x to predict y when x = 27. Use x on y to predict x when y = 50. "
        r"Discuss: Does correlation imply causation? Give examples. Calculate r² and interpret (proportion of variance explained).",
        "solution": "Two regression lines differ unless r = ±1. Correlation does not imply causation (e.g. ice cream and drowning). r² = 0.7225: about 72% of variance in y explained by x.",
    },
]


def get_linear_o_level_question(equation_display: str):
    import random
    t = random.choice(LINEAR_O_LEVEL_TEMPLATES)
    eq = equation_display or "y = mx + c"
    q = t["question"].replace("{equation}", eq) if "{equation}" in t["question"] else t["question"]
    return {"question": q, "solution": t["solution"]}


def get_linear_a_level_question(equation_display: str):
    import random
    t = random.choice(LINEAR_A_LEVEL_TEMPLATES)
    eq = equation_display or "y = mx + c"
    q = t["question"].replace("{equation}", eq) if "{equation}" in t["question"] else t["question"]
    return {"question": q, "solution": t["solution"]}


def get_exponential_o_level_question(equation_display: str):
    import random
    t = random.choice(EXPONENTIAL_O_LEVEL_TEMPLATES)
    eq = equation_display or "ab^x"
    q = t["question"].replace("{equation}", eq) if "{equation}" in t["question"] else t["question"]
    return {"question": q, "solution": t["solution"]}


def get_exponential_a_level_question(equation_display: str):
    import random
    t = random.choice(EXPONENTIAL_A_LEVEL_TEMPLATES)
    eq = equation_display or "e^x"
    q = t["question"].replace("{equation}", eq) if "{equation}" in t["question"] else t["question"]
    return {"question": q, "solution": t["solution"]}


def get_trigonometric_o_level_question(equation_display: str):
    import random
    t = random.choice(TRIGONOMETRIC_O_LEVEL_TEMPLATES)
    eq = equation_display or "sin(x)"
    q = t["question"].replace("{equation}", eq) if "{equation}" in t["question"] else t["question"]
    return {"question": q, "solution": t["solution"]}


def get_trigonometric_a_level_question(equation_display: str):
    import random
    t = random.choice(TRIGONOMETRIC_A_LEVEL_TEMPLATES)
    eq = equation_display or "sin(x)"
    q = t["question"].replace("{equation}", eq) if "{equation}" in t["question"] else t["question"]
    return {"question": q, "solution": t["solution"]}


def get_linear_programming_o_level_question(equation_display: str):
    import random
    t = random.choice(LINEAR_PROGRAMMING_O_LEVEL_TEMPLATES)
    eq = equation_display or "P = ax + by"
    q = t["question"].replace("{equation}", eq) if "{equation}" in t["question"] else t["question"]
    return {"question": q, "solution": t["solution"]}


def get_linear_programming_a_level_question(equation_display: str):
    import random
    t = random.choice(LINEAR_PROGRAMMING_A_LEVEL_TEMPLATES)
    eq = equation_display or "P = ax + by"
    q = t["question"].replace("{equation}", eq) if "{equation}" in t["question"] else t["question"]
    return {"question": q, "solution": t["solution"]}


def get_statistical_o_level_question(equation_display: str):
    import random
    t = random.choice(STATISTICAL_O_LEVEL_TEMPLATES)
    eq = equation_display or ""
    q = t["question"].replace("{equation}", eq) if "{equation}" in t["question"] else t["question"]
    return {"question": q, "solution": t["solution"]}


def get_statistical_a_level_question(equation_display: str):
    import random
    t = random.choice(STATISTICAL_A_LEVEL_TEMPLATES)
    eq = equation_display or ""
    q = t["question"].replace("{equation}", eq) if "{equation}" in t["question"] else t["question"]
    return {"question": q, "solution": t["solution"]}


def get_template_for_graph_type(graph_type: str, level: str, equation_display: str = ""):
    """Return {question, solution} for the given graph_type and level (o_level or a_level).
    For plotted graph types (linear, quadratic, exponential, trig), the question is always
    tied to the same equation as the graph/video by appending it when not already present.
    """
    import random
    gt = (graph_type or "").strip().lower()
    lev = (level or "o_level").strip().lower()
    if lev not in ("o_level", "a_level"):
        lev = "o_level"
    eq = equation_display or ""
    # Graph types that produce a single plotted equation (same equation in image + Manim video)
    plotted_types = ("linear", "quadratic", "exponential", "exponential growth", "exponential decay",
                     "trigonometric", "trig", "trigonometry")
    out = None
    if gt == "linear":
        out = get_linear_o_level_question(eq) if lev == "o_level" else get_linear_a_level_question(eq)
    elif gt == "quadratic":
        out = get_quadratic_o_level_question(eq) if lev == "o_level" else get_quadratic_a_level_question(eq)
    elif gt in ("exponential", "exponential growth", "exponential decay"):
        out = get_exponential_o_level_question(eq) if lev == "o_level" else get_exponential_a_level_question(eq)
    elif gt in ("trigonometric", "trig", "trigonometry"):
        out = get_trigonometric_o_level_question(eq) if lev == "o_level" else get_trigonometric_a_level_question(eq)
    elif gt in ("linear programming", "linear_programming", "lp"):
        out = get_linear_programming_o_level_question(eq) if lev == "o_level" else get_linear_programming_a_level_question(eq)
    elif gt in ("statistics", "statistical", "statistics graphs"):
        out = get_statistical_o_level_question(eq) if lev == "o_level" else get_statistical_a_level_question(eq)
    else:
        out = {
            "question": f"Using the graph or equation {eq or '(given)'}, describe the key features and answer the question set.",
            "solution": "Use the equation and graph to identify intercepts, gradient, turning points, or other relevant features.",
        }

    # Consistency: for plotted types, ensure the question explicitly references the same equation as the graph and video
    if out and gt in plotted_types and eq and "{equation}" not in out.get("question", ""):
        tie_in = r" The graph above shows \(y = {equation}\). Use it to answer the questions."
        out["question"] = out["question"] + tie_in.replace("{equation}", eq)
    elif out and eq and "{equation}" in out.get("question", ""):
        out["question"] = out["question"].replace("{equation}", eq)
    return out


def equation_to_display(expr: str) -> str:
    """Convert backend expression (e.g. x**2 - 4*x + 3) to LaTeX/display form (x^2 - 4x + 3)."""
    if not expr:
        return ""
    s = expr.replace("**", "^").replace("*", " ")
    return s.strip()
