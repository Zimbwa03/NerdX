# Extended graph practice templates: Linear, Exponential, Trig, Linear Programming, Statistics (O & A Level).
# Use {equation} where the generated equation should appear.
import random
from typing import Dict, List, Optional

# ---------------------------------------------------------------------------
# LINEAR - O-LEVEL (10)
# ---------------------------------------------------------------------------
LINEAR_O_LEVEL_TEMPLATES: List[Dict[str, str]] = [
    {"question": r"A straight line passes through the points A(2, 5) and B(6, 13). Calculate the gradient of the line. Determine the equation of the line in the form \(y = mx + c\). Find the coordinates where the line crosses the y-axis and the x-intercept. State whether the line has positive or negative gradient.", "solution": "Gradient \(m = (13-5)/(6-2) = 2\). Equation \(y - 5 = 2(x-2)\) so \(y = 2x + 1\). y-intercept \((0, 1)\), x-intercept \((-1/2, 0)\). Positive gradient."},
    {"question": r"Draw the graph of \(y = {equation}\) for \(-2 \leq x \leq 4\). Complete a table of values for \(x = -2, -1, 0, 1, 2, 3, 4\). Draw the graph using a scale of 2 cm to 1 unit on both axes. From your graph, find the value of \(y\) when \(x = 2.5\). Use your graph to solve the equation. State the gradient and y-intercept of the line.", "solution": "Complete table, plot points, join with straight line. Read off from graph for given \(x\); solve equation by finding x where line meets the RHS value. Gradient and intercept from equation \(y = mx + c\)."},
    {"question": r"The line \(L_1\) has equation \(y = {equation}\). Draw the graph of \(L_1\) for \(-3 \leq x \leq 3\). Write down the gradient of \(L_1\). Find the equation of the line \(L_2\) which is parallel to \(L_1\) and passes through \((0, -2)\). Find the equation of \(L_3\) which is perpendicular to \(L_1\) and passes through \((1, 5)\). Draw \(L_2\) and \(L_3\) on the same axes.", "solution": "Parallel: same gradient \(m\); perpendicular: gradient \(-1/m\). Use point–gradient form for \(L_2\) and \(L_3\)."},
    {"question": r"Consider the lines \(y = {equation}\) and \(y = -x + 7\). Draw both lines on the same axes for \(0 \leq x \leq 6\). Find the coordinates of the point of intersection graphically. Verify algebraically by solving simultaneous equations. State the range of values of \(x\) for which the first line is above the second. Calculate the area of the triangle formed by the two lines and the y-axis.", "solution": "Solve simultaneously for intersection. Inequality: where first line is above second. Area = half × base × height using intercepts."},
    {"question": r"A cyclist travels from town A to town B. The distance-time graph shows the journey. Calculate the speed during the first 2 hours if the cyclist covered 30 km. The cyclist rests for 30 minutes—show this on the graph. After the rest, the cyclist travels at 20 km/h for 1.5 hours. Complete the graph. What is the total distance covered? Calculate the average speed for the entire journey.", "solution": "Speed = distance/time. Rest: horizontal line. Distance = speed × time. Average speed = total distance / total time."},
    {"question": r"The line with equation \(3x + 4y = 12\) is given. Rearrange to the form \(y = mx + c\). State the gradient and y-intercept. Find the x- and y-intercepts. Draw the graph using the intercept method. Find the equation of a line parallel to this line passing through \((2, 5)\).", "solution": "\(y = -3x/4 + 3\); gradient \(-3/4\), y-intercept 3. x-intercept when \(y=0\). Parallel: same gradient, use point \((2,5)\)."},
    {"question": r"Plot the points P(-2, 1), Q(1, 4), and R(4, 7). Draw the line passing through these points. Calculate the gradient of the line PQR. Determine the equation of the line. Find the length of PR using the distance formula.", "solution": "Gradient \(m = (7-1)/(4-(-2)) = 1\). Equation \(y = x + 3\). Distance \(PR = \sqrt{(4-(-2))^2 + (7-1)^2} = 6\sqrt{2}\)."},
    {"question": r"A car accelerates uniformly from rest to 20 m/s in 10 s, travels at constant speed for 15 s, then decelerates uniformly to rest in 5 s. Draw the speed-time graph. Calculate the acceleration during the first 10 s. Calculate the deceleration during the last 5 s. Find the total distance travelled (area under the graph). What was the average speed?", "solution": "Acceleration = (20-0)/10 = 2 m/s². Deceleration = 20/5 = 4 m/s². Total distance = sum of areas (trapezium + rectangle + triangle). Average speed = total distance / total time."},
    {"question": r"The cost \(C\) dollars of hiring a car is given by \(C = 50 + 0.2d\), where \(d\) is the distance in km. Complete a table showing \(C\) for \(d = 0, 100, 200, 300, 400\). Draw the graph of \(C\) against \(d\). From your graph, find the cost for 250 km. What is the fixed charge? If you have $90, what is the maximum distance you can travel?", "solution": "Linear graph; fixed charge = 50 (when \(d=0\)). For $90: \(90 = 50 + 0.2d\) so \(d = 200\) km."},
    {"question": r"A line segment AB has endpoints A(-3, 2) and B(5, 8). Find the coordinates of the midpoint M of AB. Calculate the gradient of AB. Find the equation of the line AB. Find the equation of the perpendicular bisector of AB. Find where the perpendicular bisector crosses the x-axis.", "solution": "Midpoint \(M = (1, 5)\). Gradient of AB = \((8-2)/(5-(-3)) = 3/4\). Perpendicular gradient = \(-4/3\). Perpendicular bisector through M. Set \(y=0\) to find x-intercept."},
]

# ---------------------------------------------------------------------------
# LINEAR - A-LEVEL (10)
# ---------------------------------------------------------------------------
LINEAR_A_LEVEL_TEMPLATES: List[Dict[str, str]] = [
    {"question": r"The line \(L_1\) has equation \(3x + 4y = 12\). Express in the form \(y = mx + c\) and state the gradient. Find the equation of \(L_2\) perpendicular to \(L_1\) passing through \((2, -1)\). Determine the point of intersection of \(L_1\) and \(L_2\). Calculate the area of the triangle formed by \(L_1\), \(L_2\), and the x-axis. Find the distance from the origin to the point of intersection.", "solution": "Gradient of \(L_1\) is \(-3/4\); perpendicular gradient \(4/3\). Solve simultaneous for intersection. Area using intercepts; distance formula from origin."},
    {"question": r"A line is given parametrically: \(x = 2 + 3t\), \(y = 1 - 2t\). Eliminate \(t\) to find the Cartesian equation. Find the gradient. Determine the point when \(t = 0\). Find \(t\) when the line crosses the x-axis. Find the perpendicular distance from \((5, 3)\) to the line.", "solution": "From \(t = (x-2)/3\), substitute into \(y\) to get \(2x + 3y = 7\). Gradient \(-2/3\). Perpendicular distance formula \(d = |ax_0+by_0+c|/\sqrt{a^2+b^2}\)."},
    {"question": r"Consider the family of lines \(y = 2x + k\). Sketch three members for \(k = -2, 0, 3\). What do all have in common? Find \(k\) so the line passes through \((3, 10)\). Find \(k\) so the line is tangent to the circle \(x^2 + y^2 = 5\). Determine the range of \(k\) for which the line intersects the positive x- and y-axes.", "solution": "Common: gradient 2. \((3,10)\) gives \(k = 4\). Tangent: substitute into circle, set discriminant = 0. Positive axes: intercepts \(> 0\)."},
    {"question": r"The line \(y = mx + 1\) intersects the circle \(x^2 + y^2 = 25\). Substitute to obtain a quadratic in \(x\). Find the discriminant in terms of \(m\). Find the range of \(m\) for which the line: (a) intersects at two points, (b) is tangent, (c) does not intersect. For the tangent case, find the point of contact and the gradient of the diameter through it.", "solution": "\(x^2 + (mx+1)^2 = 25\); discriminant \(4 - 4(1+m^2)(-24)\). Two points: \(\Delta > 0\); tangent: \(\Delta = 0\); no points: \(\Delta < 0\)."},
    {"question": r"A line passes through P(2, 3) with gradient \(m\). Write the equation in terms of \(m\). Find \(m\) so it passes through (5, 9). Find \(m\) so it is perpendicular to \(y = 3x - 1\). The line meets the x-axis at A and y-axis at B. Express the area of triangle OAB in terms of \(m\). Find \(m > 0\) that minimizes this area.", "solution": "\(y - 3 = m(x-2)\). Perpendicular to \(y=3x-1\) gives \(m = -1/3\). Intercepts: A(\(-3/m+2, 0\)), B(0, \(3-2m\)). Area = \(|OA \cdot OB|/2\); minimize with calculus or completing the square."},
    {"question": r"Points A(1, 2) and B(4, 8) define a line. Find the vector \(\vec{AB}\). Write the vector equation \(\mathbf{r} = \mathbf{a} + \lambda\mathbf{b}\). Convert to Cartesian form. Find the position vector of the point that divides AB in the ratio 2:1. Determine whether (7, 14) lies on the line.", "solution": "\(\vec{AB} = (3, 6)\). \(\mathbf{r} = (1,2) + \lambda(3,6)\). Cartesian: \((x-1)/3 = (y-2)/6\). Division: \(\mathbf{r} = (2\mathbf{b} + \mathbf{a})/3\). (7,14) gives \(\lambda = 2\)."},
    {"question": r"Find the locus of P(x, y) such that its distance from A(2, 3) equals its distance from the line \(x = -2\). Set up the equation using the distance formula. Simplify to Cartesian form. Identify the type of curve. Sketch the locus. Find where it meets the y-axis.", "solution": "\(\sqrt{(x-2)^2+(y-3)^2} = |x+2|\). Square and simplify to parabola. y-axis: set \(x=0\)."},
    {"question": r"Lines \(L_1\) and \(L_2\) have equations \(y = 2x + 1\) and \(y = -\frac{1}{2}x + 4\). Find gradients \(m_1\), \(m_2\). Use \(\tan\theta = |(m_2-m_1)/(1+m_1 m_2)|\) to find the acute angle between the lines. Find the equations of the two angle bisectors. Verify the bisectors are perpendicular. Find where the bisectors intersect.", "solution": "\(m_1=2\), \(m_2=-1/2\); \(\tan\theta = |(-0.5-2)/(1-1)|\) (undefined) so \(\theta = 90°\). Angle bisectors: locus of points equidistant from both lines."},
    {"question": r"Data: hours studied (x) and exam score (y). Plot the scatter diagram. Calculate \(\bar{x}\) and \(\bar{y}\). Find the regression line \(y = a + bx\) using \(b = S_{xy}/S_{xx}\). Draw the line. Predict the score for 6 hours. Calculate the correlation coefficient and comment.", "solution": "\(b = S_{xy}/S_{xx}\), \(a = \bar{y} - b\bar{x}\). Correlation \(r = S_{xy}/\sqrt{S_{xx} S_{yy}}\)."},
    {"question": r"Points A(1, 2, 3) and B(4, 6, 7) in 3D. Find \(\vec{AB}\). Calculate \(|\vec{AB}|\). Find the midpoint M. Find the vector equation of the line AB. Find the point that divides AB in the ratio 1:2 from A.", "solution": "\(\vec{AB} = (3, 4, 4)\). \(|\vec{AB}| = \sqrt{9+16+16} = \sqrt{41}\). Midpoint \((2.5, 4, 5)\). Division: \(\mathbf{a} + \frac{1}{3}\vec{AB}\)."},
]

# ---------------------------------------------------------------------------
# EXPONENTIAL - O-LEVEL (10)
# ---------------------------------------------------------------------------
EXPONENTIAL_O_LEVEL_TEMPLATES: List[Dict[str, str]] = [
    {"question": r"The population of bacteria is given by \(P = 500 \times 2^t\), where \(t\) is time in hours. Calculate the initial population. Complete a table for \(t = 0, 1, 2, 3, 4\). Draw the graph of \(P\) against \(t\) for \(0 \leq t \leq 4\). Use your graph to estimate the population after 2.5 hours. Find the time for the population to reach 4000.", "solution": "Initial: \(t=0\) gives \(P=500\). Plot points, smooth curve. Read off graph; solve \(500 \times 2^t = 4000\) so \(2^t = 8\), \(t = 3\) hours."},
    {"question": r"The value \(V\) dollars of a car \(t\) years after purchase is \(V = 20000 \times (0.8)^t\). Find the initial value. Complete a table for \(t = 0, 1, 2, 3, 4, 5\). Draw the graph of \(V\) against \(t\). Estimate the value after 2.5 years. After how many years will the car be worth $10000? What percentage of value does the car lose each year?", "solution": "Initial 20000. Decay 20% per year. Solve \(20000(0.8)^t = 10000\) using logarithms or graph."},
    {"question": r"An investment grows as \(A = 5000 \times (1.06)^n\), \(n\) in years. Calculate \(A\) for \(n = 0, 1, 2, 3, 4, 5\). Draw the graph. Find the amount after 3.5 years from the graph. How many years for the investment to double? What is the annual interest rate?", "solution": "6% per year. Double: \(1.06^n = 2\), \(n = \ln 2/\ln 1.06 \approx 11.9\) years."},
    {"question": r"The mass \(M\) grams of a radioactive substance after \(t\) days is \(M = 80 \times (0.5)^{t/10}\). Find the initial mass. Complete a table for \(t = 0, 10, 20, 30, 40, 50\). Sketch the graph. What is the half-life? When is the mass 20 g? Estimate the mass after 25 days.", "solution": "Half-life 10 days (mass halves every 10 days). \(20 = 80(0.5)^{t/10}\) gives \(t/10 = 2\), \(t = 20\) days."},
    {"question": r"Two investments: A: \(P = 1000 \times 2^t\), B: \(P = 800 \times (2.5)^t\), \(t\) in years. Complete tables for both for \(t = 0, 1, 2, 3, 4\). Draw both graphs. Which has higher initial value? Which grows faster? When does B overtake A? For 3 years, which is better?", "solution": "A initial 1000, B initial 800. B grows faster. Solve \(1000(2^t) = 800(2.5^t)\) for crossover. Compare values at \(t=3\)."},
    {"question": r"Temperature \(T°C\) of coffee after \(t\) minutes: \(T = 20 + 60 \times (0.9)^t\). Find the initial temperature. Complete a table for \(t = 0, 5, 10, 15, 20, 25\). Draw the graph. What is the room temperature (as \(t \to \infty\))? When is the temperature 50°C? Estimate the rate of cooling at \(t = 10\) by drawing a tangent.", "solution": "Room temperature 20°C. Solve \(20 + 60(0.9)^t = 50\). Gradient of tangent at \(t=10\) gives rate of cooling."},
    {"question": r"A table shows growth following \(y = ab^x\). Given \(y = 200 \times (1.2)^x\), complete the table for \(x = 0, 1, 2, 3, 4\). Draw the graph. Find \(y\) when \(x = 2.5\) from the graph. Find \(x\) when \(y = 400\). What is the percentage increase per unit of \(x\)?", "solution": "20% increase per unit. \(400 = 200(1.2)^x\) so \(1.2^x = 2\), \(x = \ln 2/\ln 1.2\)."},
    {"question": r"Concentration \(C\) mg/L of medicine after \(t\) hours: \(C = 100 \times (0.75)^t\). Find the initial concentration. Complete a table for \(t = 0, 1, 2, 3, 4, 5, 6\). Draw the graph. When does the concentration fall below 25 mg/L? A second dose is needed when \(C = 20\) mg/L—when? What percentage is eliminated each hour?", "solution": "25% eliminated per hour. \(25 = 100(0.75)^t\) gives \(t\); \(20 = 100(0.75)^t\) gives dose time."},
    {"question": r"An exponential curve passes through (0, 5) and (2, 20). The curve has equation \(y = ab^x\). Find \(a\) and \(b\). Complete a table for \(x = 0, 1, 2, 3, 4\). Draw the graph. Find \(y\) when \(x = 1.5\). Find \(x\) when \(y = 40\). Describe what happens to \(y\) as \(x\) increases.", "solution": "\(a = 5\); \(20 = 5b^2\) so \(b = 2\). Growth: \(y \to \infty\) as \(x \to \infty\)."},
    {"question": r"A colony follows \(P = 50 \times 2^w\), \(w\) in weeks. Complete a table for \(w = 0, 1, 2, 3, 4, 5, 6\). Draw the graph. Estimate the population after 3.5 weeks. After how many weeks will the population exceed 1000? If food supports 2000 insects, in which week is this reached? Calculate the average rate of growth between week 2 and week 4.", "solution": "\(1000 = 50(2^w)\) gives \(w\). \(2000 = 50(2^w)\) gives \(w = \log_2 40\). Average rate = (P(4)-P(2))/2."},
]

# ---------------------------------------------------------------------------
# EXPONENTIAL - A-LEVEL (10)
# ---------------------------------------------------------------------------
EXPONENTIAL_A_LEVEL_TEMPLATES: List[Dict[str, str]] = [
    {"question": r"A substance decays as \(N = N_0 e^{-0.05t}\), \(N_0 = 200\) g. State the initial amount. Calculate the amount remaining after 10 years (3 s.f.). Sketch \(N\) against \(t\). Find the half-life. After how many years is the amount 50 g?", "solution": "Half-life: \(e^{-0.05t} = 0.5\), \(t = \ln 2/0.05\). \(50 = 200 e^{-0.05t}\) gives \(t\)."},
    {"question": r"On the same axes, sketch \(y = 2^x\), \(y = 3^x\), and \(y = (1/2)^x\) for \(-2 \leq x \leq 3\). Complete tables. Which represent growth and which decay? Where does each cross the y-axis? For what \(x\) does \(2^x = 8\)? Solve graphically: \(3^x = 2^x\).", "solution": "\(2^x = 8 \Rightarrow x = 3\). \(3^x = 2^x \Rightarrow x = 0\) only."},
    {"question": r"Solve: (a) \(2^x = 16\), (b) \(5^x = 100\), (c) \(e^{2x} = 20\), (d) \(3^{x+1} = 27\), (e) \(2^{2x} - 5(2^x) + 4 = 0\) (let \(y = 2^x\)). Sketch \(y = 2^x\) to verify (a).", "solution": "(a) \(x = 4\); (b) \(x = \log_5 100\); (c) \(x = \ln 20/2\); (d) \(x = 2\); (e) \(y = 2^x\), solve \(y^2 - 5y + 4 = 0\), then \(x\)."},
    {"question": r"The curve \(C_1\) has equation \(y = e^x\). Describe the transformations to obtain: \(C_2: y = e^{x+2}\), \(C_3: y = e^x - 3\), \(C_4: y = 2e^x\), \(C_5: y = -e^x\). Sketch all five. State any asymptotes.", "solution": "C2: shift left 2; C3: shift down 3; C4: stretch factor 2 in y; C5: reflection in x-axis. Asymptote \(y = 0\) for all except C3 (\(y = -3\))."},
    {"question": r"Sketch \(y = \ln x\) and \(y = e^x\) for \(x > 0\). What is the relationship? Solve graphically: \(\ln x = 2\). Find the gradient of \(y = \ln x\) at \(x = 1\). State domain and range of each.", "solution": "Reflections in \(y = x\). \(\ln x = 2 \Rightarrow x = e^2\). Gradient of \(\ln x\) at 1 is 1. Domain/range: \(\ln x\): \((0,\infty) \to \mathbb{R}\); \(e^x\): \(\mathbb{R} \to (0,\infty)\)."},
    {"question": r"Investment: \(A = P(1 + r/n)^{nt}\), \(P = 5000\), \(r = 0.06\), \(n = 4\). Calculate \(A\) for \(t = 0, 1, 2, 3, 4, 5\). Sketch the graph. How long to double? Compare with continuous compounding \(A = Pe^{rt}\). Find the effective annual rate.", "solution": "Double: \((1.015)^{4t} = 2\). Effective rate = \((1 + 0.06/4)^4 - 1\)."},
    {"question": r"Population: \(P = 1000/(1 + 9e^{-0.5t})\). Calculate \(P\) for \(t = 0, 2, 4, 6, 8, 10\). Sketch the graph. What is the initial population? What is \(P\) as \(t \to \infty\)? When does \(P\) reach 800? How does this differ from simple exponential growth?", "solution": "Initial \(P = 100\). Carrying capacity 1000. Logistic: bounded growth; exponential unbounded."},
    {"question": r"Newton's Law of Cooling: \(T = T_a + (T_0 - T_a)e^{-kt}\), \(T_a = 20\), \(T_0 = 100\), \(k = 0.05\). Calculate \(T\) for \(t = 0, 10, 20, 30, 40, 50\). Sketch the graph. When is \(T = 50°C\)? Find the rate of cooling at \(t = 0\). Interpret the horizontal asymptote.", "solution": "\(dT/dt = -k(T_0 - T_a)e^{-kt}\); at \(t=0\), rate = \(-k(T_0 - T_a)\). Asymptote \(T = T_a\) (room temperature)."},
    {"question": r"Sketch \(y = (0.5)^x\), \(y = 2^x\), \(y = 3^x\), \(y = e^x\) on the same axes. Which are growth and which decay? Common point? For \(a > 1\), what happens as \(a\) increases? Solve graphically: \(2^x = 3^{x-1}\). Find \(a\) such that \(a^2 = e\).", "solution": "All pass through (0, 1). \(a = e^{1/2}\)."},
    {"question": r"The function \(f(x) = e^{2x+1}\). Find the inverse \(f^{-1}(x)\) in terms of \(\ln\). State domain and range of \(f\) and \(f^{-1}\). Sketch \(y = f(x)\) and \(y = f^{-1}(x)\) and \(y = x\). Find where \(f(x) = f^{-1}(x)\). Verify \(f(f^{-1}(x)) = x\).", "solution": "\(f^{-1}(x) = (\ln x - 1)/2\), \(x > 0\). Intersection on \(y = x\): solve \(e^{2x+1} = x\)."},
]

# ---------------------------------------------------------------------------
# TRIGONOMETRIC - O-LEVEL (10)
# ---------------------------------------------------------------------------
TRIG_O_LEVEL_TEMPLATES: List[Dict[str, str]] = [
    {"question": r"Consider \(y = \sin(x)\) for \(0° \leq x \leq 360°\). Complete a table of values at 30° intervals. Draw the graph. State the maximum and minimum values. Use your graph to solve \(\sin(x) = 0.5\). State the period.", "solution": "Max 1, min -1. Period 360°. \(\sin x = 0.5\) at \(x = 30°, 150°\)."},
    {"question": r"Draw the graph of \(y = \cos(x)\) for \(0° \leq x \leq 360°\). Make a table at 30° intervals. Write down the coordinates of the maximum and minimum points. Solve \(\cos(x) = -0.5\). State the period and amplitude. Compare with \(y = \sin(x)\).", "solution": "Max at (0°, 1) and (360°, 1); min at (180°, -1). \(\cos x = -0.5\) at 120°, 240°. Cosine is sine shifted 90°."},
    {"question": r"Sketch \(y = \tan(x)\) for \(0° \leq x \leq 360°\). Complete a table. Identify where the function is undefined. Draw the graph showing vertical asymptotes. Solve \(\tan(x) = 1\). State the period.", "solution": "Undefined at 90°, 270°. Asymptotes there. \(\tan x = 1\) at 45°, 225°. Period 180°."},
    {"question": r"Draw \(y = \sin(x)\) and \(y = 3\sin(x)\) on the same axes for \(0° \leq x \leq 360°\). State the amplitude of each. What is the effect of the coefficient 3? Solve \(3\sin(x) = 2\). For what \(x\) is \(3\sin(x) > \sin(x)\)?", "solution": "Amplitudes 1 and 3. Solve \(\sin x = 2/3\). \(3\sin x > \sin x\) when \(\sin x > 0\), i.e. \(0° < x < 180°\)."},
    {"question": r"Consider \(y = \sin(2x)\) for \(0° \leq x \leq 360°\). Complete a table at 30° intervals. Draw the graph. How many complete cycles in 0° to 360°? State the period. Compare with \(y = \sin(x)\). Solve \(\sin(2x) = 0.5\).", "solution": "Two cycles. Period 180°. \(\sin(2x) = 0.5\) when \(2x = 30°, 150°, 390°, 510°\) so \(x = 15°, 75°, 195°, 255°\)."},
    {"question": r"Draw \(y = \sin(x)\) and \(y = \sin(x) + 2\) for \(0° \leq x \leq 360°\). Describe the transformation. State the maximum and minimum of \(y = \sin(x) + 2\). Solve \(\sin(x) + 2 = 2.5\). What is the range of \(y = \sin(x) + 2\)?", "solution": "Translation 2 units up. Max 3, min 1. \(\sin x = 0.5\). Range [1, 3]."},
    {"question": r"The function \(y = 2\sin(x) + 1\) for \(0° \leq x \leq 360°\). Complete a table at 45° intervals. Draw the graph. State the amplitude. Write down the maximum and minimum values. Solve \(2\sin(x) + 1 = 2\). Describe the transformations from \(y = \sin(x)\).", "solution": "Amplitude 2. Max 3, min -1. Stretch factor 2 in y, then shift up 1."},
    {"question": r"Draw \(y = -\cos(x)\) for \(0° \leq x \leq 360°\). How does it differ from \(y = \cos(x)\)? State the maximum and minimum. Solve \(-\cos(x) = 0.5\). Describe the transformation.", "solution": "Reflection in x-axis. Max 1 (at 180°), min -1 (at 0°, 360°). \(\cos x = -0.5\)."},
    {"question": r"On the same axes, draw \(y = \sin(x)\) and \(y = \cos(x)\) for \(0° \leq x \leq 360°\). Solve \(\sin(x) = \cos(x)\). For what \(x\) is \(\sin(x) > \cos(x)\)? State the intersection points. Verify one solution algebraically.", "solution": "\(\sin x = \cos x\) at 45°, 225°. Intersections at those points. \(\sin x > \cos x\) for \(45° < x < 225°\)."},
    {"question": r"The height \(h\) m of water is modelled by \(h = 5 + 3\sin(30t)°\), \(t\) in hours. Complete a table for \(t = 0, 2, 4, 6, 8, 10, 12\). Draw \(h\) against \(t\). What are the maximum and minimum heights? At what times is the water at 6 m? When is high tide and low tide?", "solution": "Max 8 m, min 2 m. \(6 = 5 + 3\sin(30t)\) gives \(\sin(30t) = 1/3\). High/low tide at max/min of sine."},
]

# ---------------------------------------------------------------------------
# TRIGONOMETRIC - A-LEVEL (10)
# ---------------------------------------------------------------------------
TRIG_A_LEVEL_TEMPLATES: List[Dict[str, str]] = [
    {"question": r"The function \(f(x) = 3\sin(2x) + 1\) for \(0° \leq x \leq 360°\). State the amplitude and period. Write down the maximum and minimum values. Sketch the graph showing two complete cycles. Solve \(3\sin(2x) + 1 = 2.5\) for \(0° \leq x \leq 360°\) (1 d.p.).", "solution": "Amplitude 3, period 180°. Max 4, min -2. \(\sin(2x) = 0.5\); \(2x = 30°, 150°, 390°, 510°\); \(x = 15°, 75°, 195°, 255°\)."},
    {"question": r"Consider \(f(x) = \sin(x)\) and \(g(x) = \sin(x - 60°)\) for \(0° \leq x \leq 360°\). Sketch both. Describe the transformation from \(f\) to \(g\). State where each crosses the x-axis. Solve \(\sin(x - 60°) = 0.5\). Find the phase shift. How would \(\sin(x + 30°)\) compare?", "solution": "Phase shift 60° to the right. \(x - 60° = 30°, 150°\) so \(x = 90°, 210°\). \(\sin(x+30°)\) is 30° left."},
    {"question": r"The function \(h(x) = 2\cos(x) - \sin(2x)\) for \(0 \leq x \leq 2\pi\). Complete a table at \(\pi/6\) intervals. Sketch the graph. Find the maximum and minimum values. Solve \(h(x) = 0\). Describe the symmetry. State the period.", "solution": "Use calculus or graph for max/min. \(h(x) = 0\): solve numerically or algebraically. Period \(2\pi\)."},
    {"question": r"Sketch \(y = \mathrm{cosec}(x) = 1/\sin(x)\) for \(-2\pi \leq x \leq 2\pi\). First sketch \(y = \sin(x)\). Identify vertical asymptotes (where \(\sin(x) = 0\)). Complete a table. State the range of cosec(x). Compare with \(y = \sec(x)\).", "solution": "Asymptotes at \(x = 0, \pm\pi, \pm 2\pi\). Range \((-\infty, -1] \cup [1, \infty)\)."},
    {"question": r"On the same axes, sketch \(y = \tan(x)\) and \(y = 2\cos(x)\) for \(0 \leq x \leq 2\pi\). Find graphically the approximate solutions to \(\tan(x) = 2\cos(x)\). Verify one solution. How many solutions in the interval? Rearrange to \(\sin(x) = 2\cos^2(x)\) and solve algebraically.", "solution": "\(\tan x = 2\cos x \Rightarrow \sin x = 2\cos^2 x\). Solve for \(x\)."},
    {"question": r"Sketch \(y = \sin(x)\) for \(-\pi/2 \leq x \leq \pi/2\) and \(y = \arcsin(x)\) for \(-1 \leq x \leq 1\). Plot both and the line \(y = x\). What is the relationship? State domain and range of each. Verify \(\sin(\arcsin(0.5)) = 0.5\).", "solution": "Reflections in \(y = x\). arcsin: domain \([-1,1]\), range \([-\pi/2, \pi/2]\)."},
    {"question": r"Express \(f(x) = 3\sin(x) + 4\cos(x)\) in the form \(R\sin(x + \alpha)\), \(R > 0\), \(0 < \alpha < 90°\). Find \(R\) and \(\alpha\) (\(R = \sqrt{3^2+4^2}\), \(\tan\alpha = 4/3\)). Sketch the graph for \(0° \leq x \leq 360°\). State the maximum and minimum. Solve \(3\sin(x) + 4\cos(x) = 2\).", "solution": "\(R = 5\), \(\alpha \approx 53.1°\). Max 5, min -5. Solve \(5\sin(x+\alpha) = 2\)."},
    {"question": r"A mass oscillates as \(y = 5\cos(2\pi t/3)\) cm, \(t\) in seconds. Sketch \(y\) against \(t\) for \(0 \leq t \leq 6\). What is the amplitude and period? Find the times when \(y = 2.5\) cm in the first period. What is the frequency? Find \(v = dy/dt\) and sketch.", "solution": "Amplitude 5, period 3 s. Frequency 1/3 Hz. \(2.5 = 5\cos(2\pi t/3)\) gives \(\cos(2\pi t/3) = 0.5\). \(v = -\frac{10\pi}{3}\sin(2\pi t/3)\)."},
    {"question": r"On the same axes, sketch \(y = \sin(x)\), \(y = \sin(2x)\), \(y = \sin(3x)\) for \(0° \leq x \leq 360°\). How does the coefficient affect the number of cycles? Solve \(\sin(2x) = \sin(x)\). State the period of each.", "solution": "Periods 360°, 180°, 120°. \(\sin(2x) = \sin(x)\): \(2x = x + 360k\) or \(2x = 180 - x + 360k\); \(x = 0°, 60°, 180°, 300°, 360°\)."},
    {"question": r"The function \(g(x) = 2\tan(x/2) - 1\) for \(-2\pi < x < 2\pi\). Identify the vertical asymptotes. State the period. Sketch at least two complete cycles. Find \(g(\pi/2)\). Solve \(g(x) = 1\). Describe the transformations from \(y = \tan(x)\).", "solution": "Asymptotes where \(x/2 = \pm\pi/2\), i.e. \(x = \pm\pi\). Period \(2\pi\). Stretch factor 2 in y, stretch factor 1/2 in x, shift down 1."},
]

# ---------------------------------------------------------------------------
# LINEAR PROGRAMMING - O-LEVEL (10)
# ---------------------------------------------------------------------------
LINEAR_PROGRAMMING_O_LEVEL_TEMPLATES: List[Dict[str, str]] = [
    {"question": r"A farmer has 20 ha for maize (x) and beans (y). Constraints: \(x + y \leq 20\), \(x \geq 5\), \(y \geq 3\), \(x, y \geq 0\). Profit \(P = 300x + 400y\). Draw the inequalities and shade the feasible region. Identify the vertices. Calculate the profit at each vertex. Determine the optimal strategy and maximum profit.", "solution": "Plot lines, shade feasible region. Evaluate P at each vertex; maximum at a vertex."},
    {"question": r"A company makes tables (x) and chairs (y). Time: \(5x + 3y \leq 45\). Minimum tables 2, chairs 4. Draw the feasible region (2 cm to 2 units). Profit \(P = 50x + 30y\). Use the corner point method to find maximum profit. State how many tables and chairs to make.", "solution": "Vertices: (2,4), (2, 35/3), (6,5), etc. Evaluate P at each."},
    {"question": r"Diet: at least 20 units protein, 30 units carbohydrates. Food A: 2 protein, 3 carb per serving; Food B: 4 protein, 2 carb. Let x = servings of A, y of B. Write constraint inequalities and \(x, y \geq 0\). Draw the feasible region. Cost \(C = 3x + 4y\). Find the minimum cost diet and servings.", "solution": "\(2x + 4y \geq 20\), \(3x + 2y \geq 30\). Minimize C over the feasible region."},
    {"question": r"Delivery: Depot A has 15 trucks, B has 12. At least 8 to Location 1, 10 to Location 2. Let x = trucks from A to Location 1, y from B to Location 1. Write inequalities. Draw the feasible region. Write the cost function. Minimize total cost.", "solution": "Constraints on x, y from supply and demand. Cost depends on distances; minimize."},
    {"question": r"Factory: Product A needs 2 kg material, B needs 3 kg; max 60 kg. A takes 1 hour, B takes 2 hours; max 40 hours. Write inequalities \(2x + 3y \leq 60\), \(x + 2y \leq 40\), \(x, y \geq 0\). Draw the feasible region (2 cm to 5 units). Profit \(P = 15x + 20y\). Find vertices and optimal production.", "solution": "Corner points: (0,0), (30,0), (0,20), intersection of lines. Evaluate P."},
    {"question": r"Investor has $10000. At least $2000 in X, $3000 in Y. Let x, y = amount in thousands. Write constraints \(x + y \leq 10\), \(x \geq 2\), \(y \geq 3\). Draw the feasible region. Return \(R = 0.08x + 0.12y\). Find maximum return and how to invest.", "solution": "Maximize R at a vertex of the feasible region."},
    {"question": r"Bakery: Cakes (x) need 200 g flour, 100 g sugar; Pies (y) need 150 g flour, 150 g sugar. Available: 3000 g flour, 2400 g sugar. Write inequalities. Draw the feasible region. Profit \(P = 8x + 6y\). Find optimal quantities and maximum profit.", "solution": "\(200x + 150y \leq 3000\), \(100x + 150y \leq 2400\). Simplify and plot."},
    {"question": r"Nursery: at most 100 plants; roses (x) ≥ 20, tulips (y) ≥ 30. Roses 2 h care each, tulips 1 h; max 150 hours: \(2x + y \leq 150\). Draw the feasible region. Profit \(P = 12x + 8y\). Determine optimal numbers and maximum profit.", "solution": "Vertices from constraints; evaluate P."},
    {"question": r"Textile: Cloth A (x m) and B (y m). Weaving: \(3x + 2y \leq 120\); Dyeing: \(2x + 4y \leq 160\); \(x \geq 10\), \(y \geq 15\). Draw the feasible region (2 cm to 10 units). Revenue \(R = 25x + 30y\). Find vertices and production that maximizes revenue.", "solution": "Corner point method for R."},
    {"question": r"Budget: TV ads (x) and radio (y) in thousands; \(x + y \leq 50\), \(x \geq 10\), \(y \geq 15\). Reach: \(R = 2000x + 1500y\). Draw the feasible region. Maximize the reach. How to allocate the budget? Maximum people reached?", "solution": "Maximize R; optimal at a vertex."},
]

# ---------------------------------------------------------------------------
# LINEAR PROGRAMMING - A-LEVEL (10)
# ---------------------------------------------------------------------------
LINEAR_PROGRAMMING_A_LEVEL_TEMPLATES: List[Dict[str, str]] = [
    {"question": r"Products A and B: A needs 2 h Machine 1, 3 h Machine 2; B needs 4 h Machine 1, 2 h Machine 2. Machine 1: 80 h/week, Machine 2: 60 h/week. Write inequalities. Draw the feasible region. Profit $50 per A, $60 per B. Use the corner point method to maximize profit. State production plan and maximum weekly profit.", "solution": "\(2x + 4y \leq 80\), \(3x + 2y \leq 60\). Vertices; maximize \(50x + 60y\)."},
    {"question": r"Diet: at least 60 units vitamin A, 40 units B. Food X: 3 A, 2 B per serving, $4; Food Y: 2 A, 4 B, $3. Formulate constraints \(3x + 2y \geq 60\), \(2x + 4y \geq 40\), \(x, y \geq 0\). Draw the feasible region. Cost \(C = 4x + 3y\). Find the minimum cost combination and minimum cost.", "solution": "Unbounded region; minimum at a vertex."},
    {"question": r"Profit \(\pi = 30x + 40y\); labor \(2x + 3y \leq 120\); machine \(x + 2y \leq 80\); \(x, y \geq 0\). Draw the feasible region and find the optimal solution. If profit on P increases to $35, does the optimum change? Find the range of profit coefficients for P for which the current optimum remains. What if labor becomes \(2x + 3y \leq 130\)?", "solution": "Sensitivity: shadow prices and allowable ranges."},
    {"question": r"Resources: \(4x + 3y \leq 240\), \(2x + 5y \leq 200\); \(x \geq 20\), \(y \geq 15\). Profit \(P = 25x + 30y\). Draw the feasible region. Identify all corner points. Calculate profit at each. Determine optimal quantities. If a third product C is introduced, explain limitations of the graphical method.", "solution": "Two variables only; three would need simplex or 3D."},
    {"question": r"Warehouses A (50 units) and B (70 units). Store 1 needs ≥ 40, Store 2 needs ≥ 60. Let x = units from A to Store 1, y from B to Store 1. Formulate constraints. Cost function. Minimize total transportation cost. Draw the feasible region and find optimal distribution.", "solution": "Balance constraints; minimize cost expression."},
    {"question": r"Carpenter: Wood \(10x + 4y \leq 200\); Time \(2x + 3y \leq 60\); \(x, y \geq 0\). Profit \(P = 100x + 60y\). Find the optimal solution. If x and y must be integers, find the optimal integer solution. Compare profits.", "solution": "Integer solution: round or check adjacent lattice points."},
    {"question": r"Profit \(P = 40x + 50y\); Environmental cost \(E = 3x + 2y\). Constraints \(2x + y \leq 100\), \(x + 3y \leq 120\). Find the solution that maximizes profit. Find the solution that minimizes E. Find a compromise maximizing \(P - 10E\). Discuss trade-offs.", "solution": "Multi-objective: different objectives give different vertices."},
    {"question": r"Blending: Oil A $50/barrel, 40% high-grade; Oil B $40/barrel, 20% high-grade. Need 1000 barrels with ≥ 30% high-grade. Let x = barrels of A, y of B. Constraints \(x + y = 1000\), \(0.4x + 0.2y \geq 300\). Cost \(C = 50x + 40y\). Find the minimum cost blend.", "solution": "Substitute \(y = 1000 - x\); reduce to one variable."},
    {"question": r"Production scheduling: Demand 100, 150, 120 over 3 months; capacity 130/month. Storage $5/unit/month. Consider months 1 and 2 with x, y production. Constraints. Cost \(C = 55x + 50y - 500\). Minimize. Extend to month 3.", "solution": "Cumulative demand constraints; minimize cost."},
    {"question": r"Maximize \(P = cx + 40y\) subject to \(2x + 3y \leq 120\), \(x + 2y \leq 80\), \(x, y \geq 0\), where c is a parameter. Draw the feasible region. Identify corner points including (24, 28). Calculate profit at each in terms of c. For what range of c is each corner optimal? Find the critical value of c.", "solution": "Slope of objective: \(-c/40\). Critical c where optimal vertex changes."},
]

# ---------------------------------------------------------------------------
# STATISTICAL GRAPHS - O-LEVEL (10)
# ---------------------------------------------------------------------------
STATISTICAL_O_LEVEL_TEMPLATES: List[Dict[str, str]] = [
    {"question": r"The table shows favourite subjects of 100 students (Math 25, Science 30, English 20, History 15, Art 10). Draw a bar chart using a scale of 2 cm to 10 students. Which subject is most popular? What percentage prefer Science? How many more prefer Math than History? If 5 students change from Art to Math, redraw the chart.", "solution": "Bar chart: label axes, scale. Science 30%. Math − History = 10. New bars: Math 30, Art 5."},
    {"question": r"60 students: transport (Bus 20, Walk 15, Car 18, Bicycle 7). Calculate the angle for each sector of a pie chart. Draw the pie chart (radius 4 cm). What fraction walk? What percentage travel by car? If 3 more students walk, what is the new angle for walk?", "solution": "Angle = (frequency/60) × 360°. Walk 15/60 = 1/4. New walk angle = (18/63)×360°."},
    {"question": r"Heights (cm) of 50 plants: 10–20 (5), 20–30 (12), 30–40 (18), 40–50 (10), 50–60 (5). Draw a histogram. State the modal class. How many plants between 30 and 50 cm? What percentage are taller than 40 cm? Estimate the number taller than 35 cm.", "solution": "Modal class 30–40. Between 30–50: 28 plants. > 40 cm: 15, so 30%. Interpolate for 35 cm."},
    {"question": r"Test scores of 40 students (0–20: 3, 20–40: 8, 40–60: 15, 60–80: 10, 80–100: 4). Find the midpoint of each class. Draw a frequency polygon using midpoints. On the same axes draw a histogram. Which class has the highest frequency? How many scored ≥ 60?", "solution": "Midpoints 10, 30, 50, 70, 90. Frequency polygon: points at (midpoint, freq). ≥ 60: 14 students."},
    {"question": r"Masses (kg) of 80 students in classes. Complete the cumulative frequency column. Draw a cumulative frequency curve. Use the graph to estimate the median mass. Find the interquartile range. How many have mass > 58 kg?", "solution": "Cumulative frequency: running total. Median and quartiles from curve. IQR = Q3 − Q1. Read off at 58 kg."},
    {"question": r"Sales of two products over 5 months (table given). Draw a comparative bar chart. Which product had higher sales in March? In which month was the difference greatest? Calculate total sales for each product. Describe the trend for each.", "solution": "Grouped bars per month. Compare bars. Totals: sum over months. Describe increasing/decreasing."},
    {"question": r"Daily maximum temperatures for a week (table). Draw a line graph. On which day was it hottest? Describe the trend. What was the range of temperatures? Estimate the temperature on Wednesday afternoon if 2°C higher than the maximum.", "solution": "Plot points, join with lines. Range = max − min. Wednesday + 2°C."},
    {"question": r"Ages of 20 people (list given). Construct a stem-and-leaf diagram. Find the median, mode, range. What percentage are aged 30 or above?", "solution": "Stems: 2, 3; leaves: units. Median: average of 10th and 11th. Mode: most frequent. Range = max − min."},
    {"question": r"Time (minutes) on homework: 0–10 (4), 10–20 (12), 20–30 (18), 30–50 (16), 50–80 (15). Complete class width and frequency density. Draw a histogram using frequency density. Which class has the highest frequency density? Estimate the number between 25 and 35 minutes. Modal class?", "solution": "Frequency density = frequency / class width. Area = frequency. Interpolate for 25–35."},
    {"question": r"Marks summary: Min 35, Q1 52, Median 68, Q3 81, Max 95. Draw a box-and-whisker plot. What is the IQR? What percentage scored above 81? Is there skewness? If a student scored 90, which quartile?", "solution": "IQR = 29. Above 81: 25%. Upper quartile. Positively skewed if mean > median. 90 is above Q3."},
]

# ---------------------------------------------------------------------------
# STATISTICAL GRAPHS - A-LEVEL (10)
# ---------------------------------------------------------------------------
STATISTICAL_A_LEVEL_TEMPLATES: List[Dict[str, str]] = [
    {"question": r"Times (minutes) for 100 students to complete a test (grouped). Complete the table with class width and frequency density. Draw a histogram using frequency density. Estimate the number who took between 35 and 55 minutes. Estimate the mean time. Identify the modal class. Comment on skewness.", "solution": "Frequency density = freq / width. Mean: use midpoints × frequency. Modal class: highest frequency density. Skewness from shape."},
    {"question": r"Masses (kg) of 80 athletes (grouped). Complete the cumulative frequency column. Draw a cumulative frequency curve. Estimate median, Q1, Q3. Calculate the IQR. Draw a box-and-whisker plot. Identify outliers using Q3 + 1.5×IQR and Q1 − 1.5×IQR. Estimate the 90th percentile.", "solution": "Cumulative curve; read off percentiles. Outliers outside [Q1−1.5×IQR, Q3+1.5×IQR]. 90th percentile from curve."},
    {"question": r"Exam scores for two classes (grouped). Draw back-to-back histograms. Calculate the mean and standard deviation for each class. Which class performed better? Which has more consistent scores? Compare the distributions.", "solution": "Back-to-back: same scale, opposite directions. Mean and SD from midpoints and frequencies."},
    {"question": r"Heights (x) and weights (y) of 10 students (table). Draw a scatter diagram. Describe the correlation. Calculate the mean point. Calculate S_xx, S_yy, S_xy. Find the regression line y on x: y = a + bx. Draw the line. Predict weight for height 162 cm. Calculate the correlation coefficient r. Test significance at 5%.", "solution": "b = S_xy/S_xx, a = ȳ − b x̄. r = S_xy/√(S_xx S_yy). Use critical value table for n = 10."},
    {"question": r"Quarterly sales over 3 years (table). Plot the time series. Calculate 4-quarter moving averages. Plot moving averages. Describe the trend. Calculate seasonal variations. Predict sales for Q1 and Q2 of Year 4.", "solution": "Moving average smooths seasonality. Seasonal = actual − trend. Forecast = trend + seasonal."},
    {"question": r"Heights of plants (unequal classes). Calculate frequency density. Draw a histogram. Estimate the mean using midpoints. Identify the class containing the median. Use linear interpolation to estimate the median. Estimate the standard deviation. Coefficient of variation.", "solution": "Median class: where cumulative frequency reaches n/2. Linear interpolation within class. CV = SD/mean × 100%."},
    {"question": r"20 exam scores (list). Find the five-number summary. Calculate IQR. Identify outliers (Q1 − 1.5×IQR, Q3 + 1.5×IQR). Draw a box plot with outliers marked. Mean and SD. Compare median and mean for skewness. Remove outliers and recalculate mean.", "solution": "Five-number: min, Q1, median, Q3, max. Outliers plotted separately. Effect of outliers on mean."},
    {"question": r"Three groups: summary statistics (min, Q1, median, Q3, max) for each. Draw comparative box plots on the same scale. IQR for each. Which has the highest median? Most spread? Most positively skewed? Compare distributions.", "solution": "Spread: IQR or range. Skewness: compare mean and median, or tail length."},
    {"question": r"Waiting times (minutes) at a clinic (list). Construct a stem-and-leaf diagram. Find the median, mode, mean, range, IQR. Draw a box plot. Compare mean and median—symmetric?", "solution": "Stem-and-leaf for shape. Mean ≈ median suggests symmetry."},
    {"question": r"Two variables x and y with r = 0.85 (table). Draw a scatter diagram. Calculate the regression line y on x and x on y. Draw both lines. Predict y when x = 27; predict x when y = 50. Does correlation imply causation? Calculate r² and interpret.", "solution": "Two regression lines differ unless r = ±1. r² = proportion of variance explained. Correlation ≠ causation."},
]


def _pick(equation_display: str, templates: List[Dict[str, str]], use_equation: bool = True) -> Dict[str, str]:
    t = random.choice(templates)
    q = t["question"]
    if use_equation and "{equation}" in q:
        q = q.replace("{equation}", equation_display or "")
    return {"question": q, "solution": t["solution"]}


def get_linear_o_level_question(equation_display: str) -> Dict[str, str]:
    return _pick(equation_display, LINEAR_O_LEVEL_TEMPLATES)


def get_linear_a_level_question(equation_display: str) -> Dict[str, str]:
    return _pick(equation_display, LINEAR_A_LEVEL_TEMPLATES)


def get_exponential_o_level_question(equation_display: str) -> Dict[str, str]:
    return _pick(equation_display, EXPONENTIAL_O_LEVEL_TEMPLATES)


def get_exponential_a_level_question(equation_display: str) -> Dict[str, str]:
    return _pick(equation_display, EXPONENTIAL_A_LEVEL_TEMPLATES)


def get_trig_o_level_question(equation_display: str) -> Dict[str, str]:
    return _pick(equation_display, TRIG_O_LEVEL_TEMPLATES)


def get_trig_a_level_question(equation_display: str) -> Dict[str, str]:
    return _pick(equation_display, TRIG_A_LEVEL_TEMPLATES)


def get_linear_programming_o_level_question(_equation_display: str) -> Dict[str, str]:
    return _pick("", LINEAR_PROGRAMMING_O_LEVEL_TEMPLATES, use_equation=False)


def get_linear_programming_a_level_question(_equation_display: str) -> Dict[str, str]:
    return _pick("", LINEAR_PROGRAMMING_A_LEVEL_TEMPLATES, use_equation=False)


def get_statistical_o_level_question(_equation_display: str) -> Dict[str, str]:
    return _pick("", STATISTICAL_O_LEVEL_TEMPLATES, use_equation=False)


def get_statistical_a_level_question(_equation_display: str) -> Dict[str, str]:
    return _pick("", STATISTICAL_A_LEVEL_TEMPLATES, use_equation=False)


def get_template_for_graph_type(graph_type: str, level: str, equation_display: str) -> Optional[Dict[str, str]]:
    """Return {question, solution} for the given graph_type and level (o_level / a_level)."""
    gt = (graph_type or "").strip().lower()
    lev = (level or "o_level").strip().lower()
    if lev not in ("o_level", "a_level"):
        lev = "o_level"
    eq = equation_display or ""

    getters = {
        "linear": (get_linear_o_level_question, get_linear_a_level_question),
        "quadratic": (None, None),  # handled in main templates file
        "exponential": (get_exponential_o_level_question, get_exponential_a_level_question),
        "trigonometric": (get_trig_o_level_question, get_trig_a_level_question),
        "linear_programming": (get_linear_programming_o_level_question, get_linear_programming_a_level_question),
        "statistics": (get_statistical_o_level_question, get_statistical_a_level_question),
        "statistical": (get_statistical_o_level_question, get_statistical_a_level_question),
    }
    pair = getters.get(gt)
    if not pair:
        return None
    getter_o, getter_a = pair
    if getter_o is None:
        return None
    return getter_a(eq) if lev == "a_level" else getter_o(eq)
