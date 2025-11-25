"""
Auto-integrate Knowledge Map into DashboardScreen
This script safely adds the Knowledge Map widget to the Dashboard
"""

import os
import re

DASHBOARD_PATH = r'NerdXApp\src\screens\DashboardScreen.tsx'

def integrate_knowledge_map():
    """Apply Knowledge Map integration to Dashboard"""
    
    if not os.path.exists(DASHBOARD_PATH):
        print(f"❌ Error: {DASHBOARD_PATH} not found")
        return False
    
    with open(DASHBOARD_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Step 1: Add imports
    print("Step 1: Adding imports...")
    import_pattern = r"(import { gamificationService, UserProgress, Badge } from '\.\./services/GamificationService';)"
    import_addition = r"""\1
import { dktService, KnowledgeMap } from '../services/api/dktApi';
import { KnowledgeMapWidget } from '../components/KnowledgeMapWidget';"""
    
    if 'KnowledgeMapWidget' not in content:
        content = re.sub(import_pattern, import_addition, content)
        print("✅ Imports added")
    else:
        print("⏭️  Imports already exist")
    
    # Step 2:  Add state variables
    print("\nStep 2: Adding state variables...")
    state_pattern = r"(const \[userProgress, setUserProgress\] = useState<UserProgress \| null>\(null\);)"
    state_addition = r"""\1
  const [knowledgeMap, setKnowledgeMap] = useState<KnowledgeMap | null>(null);
  const [loadingKnowledgeMap, setLoadingKnowledgeMap] = useState(false);"""
    
    if 'knowledgeMap' not in content:
        content = re.sub(state_pattern, state_addition, content)
        print("✅ State variables added")
    else:
        print("⏭️  State variables already exist")
    
    # Step 3: Add knowledge map loading in useEffect
    print("\nStep 3: Adding knowledge map loading...")
    useeffect_pattern = r"(const progress = await gamificationService\.getProgress\(\);\s+setUserProgress\(progress\);)"
    useeffect_addition = r"""\1

        // Load DKT knowledge map
        try {
          setLoadingKnowledgeMap(true);
          const map = await dktService.getKnowledgeMap();
          setKnowledgeMap(map);
        } catch (error) {
          console.error('Failed to load knowledge map:', error);
        } finally {
          setLoadingKnowledgeMap(false);
        }"""
    
    if 'dktService.getKnowledgeMap' not in content:
        content = re.sub(useeffect_pattern, useeffect_addition, content)
        print("✅ Knowledge map loading added")
    else:
        print("⏭️  Knowledge map loading already exists")
    
    # Step 4: Add Knowledge Map widget in render
    print("\nStep 4: Adding Knowledge Map widget to render...")
    render_pattern = r"(\{renderProgressWidget\(\)\})"
    render_addition = r"""\1

          {/* Knowledge Map Widget */}
          <KnowledgeMapWidget
            knowledgeMap={knowledgeMap}
            loading={loadingKnowledgeMap}
            onSkillPress={(skillId) => {
              console.log('Practice skill:', skillId);
              // TODO: Navigate to practice this specific skill
            }}
          />"""
    
    if 'KnowledgeMapWidget' not in content or content.count('KnowledgeMapWidget') < 2:
        content = re.sub(render_pattern, render_addition, content, count=1)
        print("✅ Knowledge Map widget added to render")
    else:
        print("⏭️  Knowledge Map widget already in render")
    
    # Check if anything changed
    if content == original_content:
        print("\n✅ All Knowledge Map integrations already present!")
        return True
    
    # Save the file
    try:
        with open(DASHBOARD_PATH, 'w', encoding='utf-8') as f:
            f.write(content)
        print("\n✅ Successfully integrated Knowledge Map into Dashboard!")
        print(f"📝 File saved: {DASHBOARD_PATH}")
        return True
    except Exception as e:
        print(f"\n❌ Error saving file: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting Knowledge Map Integration for Dashboard\n")
    print("="*60)
    
    success = integrate_knowledge_map()
    
    print("="*60)
    if success:
        print("\n🎉 Integration complete!")
        print("\nWhat was added:")
        print("1. ✅ DKT service and KnowledgeMapWidget imports")
        print("2. ✅ State variables for knowledge map data")
        print("3. ✅ Auto-loading of knowledge map on mount")
        print("4. ✅ Widget displayed between progress and subjects")
        print("\nNext steps:")
        print("1. Run the app and view Dashboard")
        print("2. Answer some quiz questions")
        print("3. Return to Dashboard to see your knowledge map!")
    else:
        print("\n❌ Integration failed - check errors above")
