#!/usr/bin/env python3
"""Mathematics Measures and Mensuration Prompts - 180 Prompts"""

UNITS = {"subtopic": "Units and Conversion", "prompts": {
    "easy": [{"id": f"MM_UC_E0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Length", "Generate km/m/cm conversion", "Convert length units"),
        (2, "Mass", "Generate kg/g conversion", "Convert mass units"),
        (3, "Volume", "Generate L/mL conversion", "Convert volume units"),
        (4, "Time", "Generate hours/minutes", "Convert time units"),
        (5, "Metric", "Generate metric prefix", "Use metric prefixes")]],
    "medium": [{"id": f"MM_UC_M0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Area", "Generate area unit conversion", "Convert area units"),
        (2, "Volume", "Generate cm³ to L", "Convert volume units"),
        (3, "Mixed", "Generate mixed unit problem", "Work with mixed units"),
        (4, "Speed", "Generate km/h to m/s", "Convert speed units"),
        (5, "Capacity", "Generate capacity conversion", "Convert capacity")]],
    "difficult": [{"id": f"MM_UC_D0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Complex", "Generate multi-step conversion", "Complex conversions"),
        (2, "Density", "Generate density conversion", "Link volume and mass"),
        (3, "Scale", "Generate scale conversion", "Apply scale"),
        (4, "Non-std", "Generate non-standard units", "Handle non-standard"),
        (5, "Rate", "Generate rate conversion", "Convert compound rates")]]
}}

PERIMETER = {"subtopic": "Perimeter of 2D Shapes", "prompts": {
    "easy": [{"id": f"MM_P2_E0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Rectangle", "Generate rectangle perimeter", "Calculate rectangle perimeter"),
        (2, "Square", "Generate square perimeter", "Calculate square perimeter"),
        (3, "Triangle", "Generate triangle perimeter", "Calculate triangle perimeter"),
        (4, "Polygon", "Generate regular polygon perimeter", "Calculate polygon perimeter"),
        (5, "Basic", "Generate basic perimeter", "Find perimeter")]],
    "medium": [{"id": f"MM_P2_M0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Finding Side", "Generate finding side from P", "Find side from perimeter"),
        (2, "Compound", "Generate compound perimeter", "Calculate compound perimeter"),
        (3, "Semicircle", "Generate perimeter with semicircle", "Include curves"),
        (4, "Word Problem", "Generate perimeter word problem", "Solve word problems"),
        (5, "Algebraic", "Generate algebraic perimeter", "Use algebra")]],
    "difficult": [{"id": f"MM_P2_D0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Complex", "Generate complex compound", "Complex compounds"),
        (2, "Arc", "Generate with arc lengths", "Include arcs"),
        (3, "Ratio", "Generate ratio problem", "Use ratios"),
        (4, "Fencing", "Generate fencing problem", "Real applications"),
        (5, "Similar", "Generate similar shapes", "Compare similar")]]
}}

AREA = {"subtopic": "Area of 2D Shapes", "prompts": {
    "easy": [{"id": f"MM_A2_E0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Rectangle", "Generate rectangle area", "Calculate rectangle area"),
        (2, "Square", "Generate square area", "Calculate square area"),
        (3, "Triangle", "Generate triangle area", "Calculate triangle area"),
        (4, "Parallelogram", "Generate parallelogram area", "Calculate parallelogram"),
        (5, "Trapezium", "Generate trapezium area", "Calculate trapezium")]],
    "medium": [{"id": f"MM_A2_M0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Compound", "Generate compound area", "Calculate compound areas"),
        (2, "Subtraction", "Generate area by subtraction", "Find by subtraction"),
        (3, "Dimension", "Generate finding dimension", "Find from area"),
        (4, "Shaded", "Generate shaded region", "Calculate shaded areas"),
        (5, "Word", "Generate word problem", "Solve word problems")]],
    "difficult": [{"id": f"MM_A2_D0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Complex", "Generate complex compound", "Complex compounds"),
        (2, "Herons", "Generate Heron's formula", "Apply Heron's"),
        (3, "Cost", "Generate cost problem", "Apply to costing"),
        (4, "Ratio", "Generate ratio problem", "Use ratios"),
        (5, "Similar", "Generate similar areas", "Calculate similar")]]
}}

CIRCLES = {"subtopic": "Circles", "prompts": {
    "easy": [{"id": f"MM_CI_E0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Circumference", "Generate C = πd", "Calculate circumference"),
        (2, "Area", "Generate A = πr²", "Calculate circle area"),
        (3, "Diameter", "Generate d = 2r", "Convert r to d"),
        (4, "Pi approx", "Generate with π ≈ 3.14", "Use π approximations"),
        (5, "Find r", "Generate finding r from C", "Find radius")]],
    "medium": [{"id": f"MM_CI_M0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "r from A", "Generate finding r from A", "Find r from area"),
        (2, "Semicircle", "Generate semicircle", "Calculate semicircle"),
        (3, "Quarter", "Generate quarter circle", "Calculate quarter"),
        (4, "Inscribed", "Generate circle in square", "Combine shapes"),
        (5, "Ring", "Generate annulus area", "Calculate ring")]],
    "difficult": [{"id": f"MM_CI_D0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Compound", "Generate complex circle", "Complex problems"),
        (2, "Inscribed", "Generate inscribed circle", "Inscribed circles"),
        (3, "Multiple", "Generate multiple circles", "Handle multiple"),
        (4, "Exact", "Generate exact answer in π", "Exact answers"),
        (5, "Optimize", "Generate optimization", "Optimize")]]
}}

ARC_SECTOR = {"subtopic": "Arc and Sector", "prompts": {
    "easy": [{"id": f"MM_AS_E0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Arc", "Generate arc length", "Calculate arc"),
        (2, "Sector", "Generate sector area", "Calculate sector"),
        (3, "Simple Arc", "Generate simple arc", "Find arc length"),
        (4, "Simple Sector", "Generate simple sector", "Find sector area"),
        (5, "Angle", "Generate finding angle", "Find angle")]],
    "medium": [{"id": f"MM_AS_M0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Perimeter", "Generate sector perimeter", "Sector perimeter"),
        (2, "Segment", "Generate segment area", "Segment area"),
        (3, "Multiple", "Generate combined sectors", "Combine sectors"),
        (4, "Radius", "Generate finding r", "Find radius"),
        (5, "Radians", "Generate using radians", "Use radians")]],
    "difficult": [{"id": f"MM_AS_D0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Complex", "Generate complex segment", "Complex segment"),
        (2, "Shaded", "Generate shaded sector", "Shaded sector"),
        (3, "Chord", "Generate arc and chord", "Arc and chord"),
        (4, "Angle", "Generate finding sector angle", "Find angle"),
        (5, "Real", "Generate real application", "Real problems")]]
}}

VOLUME = {"subtopic": "Volume of 3D Shapes", "prompts": {
    "easy": [{"id": f"MM_V3_E0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Cuboid", "Generate V = lwh", "Calculate cuboid"),
        (2, "Cube", "Generate V = s³", "Calculate cube"),
        (3, "Prism", "Generate V = Ah", "Calculate prism"),
        (4, "Cylinder", "Generate V = πr²h", "Calculate cylinder"),
        (5, "Basic", "Generate basic volume", "Find volume")]],
    "medium": [{"id": f"MM_V3_M0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Cone", "Generate V = ⅓πr²h", "Calculate cone"),
        (2, "Pyramid", "Generate V = ⅓Ah", "Calculate pyramid"),
        (3, "Dimension", "Generate finding dimension", "Find from volume"),
        (4, "Change", "Generate volume scaling", "Understand scaling"),
        (5, "Capacity", "Generate capacity", "Apply to capacity")]],
    "difficult": [{"id": f"MM_V3_D0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Sphere", "Generate V = (4/3)πr³", "Calculate sphere"),
        (2, "Hemisphere", "Generate hemisphere", "Calculate hemisphere"),
        (3, "Frustum", "Generate frustum", "Calculate frustum"),
        (4, "Composite", "Generate composite", "Calculate composite"),
        (5, "Ratio", "Generate similar volumes", "Similar solids")]]
}}

SURFACE_AREA = {"subtopic": "Surface Area", "prompts": {
    "easy": [{"id": f"MM_SA_E0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Cuboid", "Generate cuboid SA", "Cuboid SA"),
        (2, "Cube", "Generate cube SA", "Cube SA"),
        (3, "Cylinder", "Generate cylinder SA", "Cylinder SA"),
        (4, "Open", "Generate open box", "Open container"),
        (5, "Basic", "Generate basic SA", "Basic SA")]],
    "medium": [{"id": f"MM_SA_M0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Cone", "Generate cone SA", "Cone SA"),
        (2, "Pyramid", "Generate pyramid SA", "Pyramid SA"),
        (3, "Total/Curved", "Generate comparing SA", "Distinguish SA types"),
        (4, "Paint", "Generate painting problem", "Apply to covering"),
        (5, "Dimension", "Generate finding dimension", "Find from SA")]],
    "difficult": [{"id": f"MM_SA_D0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Sphere", "Generate sphere SA", "Sphere SA"),
        (2, "Hemisphere", "Generate hemisphere SA", "Hemisphere SA"),
        (3, "Composite", "Generate composite SA", "Composite SA"),
        (4, "Ratio", "Generate SA ratio", "Similar SA"),
        (5, "Frustum", "Generate frustum SA", "Frustum SA")]]
}}

PRISMS = {"subtopic": "Prisms and Cylinders", "prompts": {
    "easy": [{"id": f"MM_PC_E0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Triangular", "Generate triangular prism", "Triangular prism"),
        (2, "Cylinder", "Generate basic cylinder", "Work with cylinders"),
        (3, "Cross", "Generate cross section", "Cross sections"),
        (4, "Height", "Generate finding height", "Find dimensions"),
        (5, "Half", "Generate half cylinder", "Half cylinder")]],
    "medium": [{"id": f"MM_PC_M0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Pentagonal", "Generate pentagonal prism", "N-gon prism"),
        (2, "Hollow", "Generate hollow cylinder", "Hollow cylinder"),
        (3, "Nets", "Generate net question", "Work with nets"),
        (4, "Capacity", "Generate capacity", "Apply to capacity"),
        (5, "Cost", "Generate cost problem", "Apply to costs")]],
    "difficult": [{"id": f"MM_PC_D0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Combined", "Generate combined shapes", "Combine shapes"),
        (2, "Truncated", "Generate truncated prism", "Truncated prism"),
        (3, "Optimal", "Generate optimization", "Optimize dimensions"),
        (4, "Flow", "Generate flow problem", "Flow problems"),
        (5, "Industrial", "Generate industrial", "Industrial context")]]
}}

PYRAMIDS = {"subtopic": "Pyramids and Cones", "prompts": {
    "easy": [{"id": f"MM_PY_E0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Square", "Generate square pyramid", "Square pyramid"),
        (2, "Cone V", "Generate cone volume", "Cone volume"),
        (3, "Slant", "Generate slant height", "Slant height"),
        (4, "Triangular", "Generate triangular pyramid", "Triangular pyramid"),
        (5, "Simple", "Generate simple cone", "Work with cones")]],
    "medium": [{"id": f"MM_PY_M0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Cone SA", "Generate cone SA", "Cone SA"),
        (2, "Height", "Generate finding height", "Find height"),
        (3, "Net", "Generate cone net", "Cone nets"),
        (4, "Rect", "Generate rectangular pyramid", "Rectangular pyramid"),
        (5, "Combined", "Generate pyramid on prism", "Combine shapes")]],
    "difficult": [{"id": f"MM_PY_D0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Frustum C", "Generate cone frustum", "Cone frustum"),
        (2, "Frustum P", "Generate pyramid frustum", "Pyramid frustum"),
        (3, "Similar", "Generate similar sections", "Similar sections"),
        (4, "Optimal", "Generate optimization", "Optimize cone"),
        (5, "Real", "Generate real application", "Real problems")]]
}}

SPHERES = {"subtopic": "Spheres", "prompts": {
    "easy": [{"id": f"MM_SP_E0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Volume", "Generate sphere V", "Sphere volume"),
        (2, "SA", "Generate sphere SA", "Sphere SA"),
        (3, "Radius", "Generate finding r", "Find radius"),
        (4, "Hemi V", "Generate hemisphere V", "Hemisphere volume"),
        (5, "Hemi SA", "Generate hemisphere SA", "Hemisphere SA")]],
    "medium": [{"id": f"MM_SP_M0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Hollow", "Generate hollow sphere", "Hollow sphere"),
        (2, "In Cyl", "Generate sphere in cylinder", "Relate to cylinder"),
        (3, "Combined", "Generate hemisphere + cone", "Combine shapes"),
        (4, "Density", "Generate density", "Apply density"),
        (5, "Great", "Generate great circle", "Great circles")]],
    "difficult": [{"id": f"MM_SP_D0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "In Cone", "Generate sphere in cone", "Inscribed sphere"),
        (2, "Cap", "Generate spherical cap", "Spherical cap"),
        (3, "Earth", "Generate Earth problem", "Globe problems"),
        (4, "Packing", "Generate sphere packing", "Packing problems"),
        (5, "Ratio", "Generate V:SA ratio", "Analyze ratios")]]
}}

SIMILAR = {"subtopic": "Similar Shapes", "prompts": {
    "easy": [{"id": f"MM_SS_E0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Linear", "Generate linear scale factor", "Find scale factor"),
        (2, "Triangles", "Generate similar triangles", "Similar triangles"),
        (3, "Scale", "Generate scale factor", "Use scale factors"),
        (4, "Corr", "Generate corresponding sides", "Corresponding sides"),
        (5, "Basic", "Generate basic similarity", "Similarity basics")]],
    "medium": [{"id": f"MM_SS_M0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Area", "Generate area scale (k²)", "Apply area scale"),
        (2, "Find A", "Generate finding area", "Calculate areas"),
        (3, "Volume", "Generate volume scale (k³)", "Apply volume scale"),
        (4, "Find V", "Generate finding volume", "Calculate volumes"),
        (5, "k from A", "Generate finding k from A", "Find scale from area")]],
    "difficult": [{"id": f"MM_SS_D0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "k from V", "Generate finding k from V", "Find scale from volume"),
        (2, "Mixed", "Generate combining A and V", "Combine area/volume"),
        (3, "Mass", "Generate mass similarity", "Apply to mass"),
        (4, "Capacity", "Generate capacity similarity", "Apply to capacity"),
        (5, "Cost", "Generate cost problem", "Apply to costing")]]
}}

COMPOUND = {"subtopic": "Compound Shapes", "prompts": {
    "easy": [{"id": f"MM_CS_E0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "L-Shape", "Generate L-shape", "L-shape"),
        (2, "T-Shape", "Generate T-shape", "T-shape"),
        (3, "Two Rect", "Generate joined rectangles", "Combine rectangles"),
        (4, "Rect+Tri", "Generate house shape", "Combine shapes"),
        (5, "Simple", "Generate basic compound", "Compound shapes")]],
    "medium": [{"id": f"MM_CS_M0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Semicircle", "Generate with semicircle", "Combine curves"),
        (2, "Cutout", "Generate with cutout", "Shapes with holes"),
        (3, "3D", "Generate compound 3D", "Combine 3D"),
        (4, "Multi", "Generate multi-part", "Multiple parts"),
        (5, "Real", "Generate real compound", "Real situations")]],
    "difficult": [{"id": f"MM_CS_D0{i}", "subtopic": s, "prompt": p, "learning_objective": l} for i, s, p, l in [
        (1, "Complex 2D", "Generate complex 2D", "Complex 2D"),
        (2, "Complex 3D", "Generate complex 3D", "Complex 3D"),
        (3, "Optimize", "Generate optimization", "Optimize"),
        (4, "Arch", "Generate architectural", "Architecture"),
        (5, "Eng", "Generate engineering", "Engineering")]]
}}

MENSURATION_PROMPTS = [UNITS, PERIMETER, AREA, CIRCLES, ARC_SECTOR, VOLUME, SURFACE_AREA, PRISMS, PYRAMIDS, SPHERES, SIMILAR, COMPOUND]

def get_prompt_count():
    return sum(len(s["prompts"]["easy"]) + len(s["prompts"]["medium"]) + len(s["prompts"]["difficult"]) for s in MENSURATION_PROMPTS)

def get_all_prompts():
    return MENSURATION_PROMPTS
