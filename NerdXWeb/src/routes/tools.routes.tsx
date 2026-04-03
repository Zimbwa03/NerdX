import { lazy } from 'react';
import { Route } from 'react-router-dom';

const VirtualLabHubPage = lazy(() => import('../pages/virtual-lab/VirtualLabHubPage'));
const VirtualLabSimulationPage = lazy(() => import('../pages/virtual-lab/VirtualLabSimulationPage').then((m) => ({ default: m.VirtualLabSimulationPage })));
const FormulaSheetPage = lazy(() => import('../pages/tools/FormulaSheetPage').then((m) => ({ default: m.FormulaSheetPage })));
const PastPapersPage = lazy(() => import('../pages/tools/PastPapersPage').then((m) => ({ default: m.PastPapersPage })));
const OfflineChatPage = lazy(() => import('../pages/tools/OfflineChatPage').then((m) => ({ default: m.OfflineChatPage })));
const AgentHubPage = lazy(() => import('../pages/agents/AgentHubPage').then((m) => ({ default: m.AgentHubPage })));
const AgentBuilderPage = lazy(() => import('../pages/agents/AgentBuilderPage').then((m) => ({ default: m.AgentBuilderPage })));
const ProjectAssistantHubPage = lazy(() => import('../pages/project-assistant/ProjectAssistantHubPage').then((m) => ({ default: m.ProjectAssistantHubPage })));
const ProjectAssistantChatPage = lazy(() => import('../pages/project-assistant/ProjectAssistantChatPage').then((m) => ({ default: m.ProjectAssistantChatPage })));
const NerdXLivePage = lazy(() => import('../pages/nerdx-live/NerdXLivePage').then((m) => ({ default: m.NerdXLivePage })));
const AiClassroomPage = lazy(() => import('../pages/ai-classroom/AiClassroomPage').then((m) => ({ default: m.AiClassroomPage })));

export function ToolRoutes() {
  return (
    <>
      <Route path="virtual-lab" element={<VirtualLabHubPage />} />
      <Route path="virtual-lab/:labId" element={<VirtualLabSimulationPage />} />
      <Route path="formula-sheet" element={<FormulaSheetPage />} />
      <Route path="past-papers" element={<PastPapersPage />} />
      <Route path="offline" element={<OfflineChatPage />} />
      <Route path="agents" element={<AgentHubPage />} />
      <Route path="agents/builder" element={<AgentBuilderPage />} />
      <Route path="project-assistant" element={<ProjectAssistantHubPage />} />
      <Route path="project-assistant/:projectId" element={<ProjectAssistantChatPage />} />
      <Route path="nerdx-live" element={<NerdXLivePage />} />
      <Route path="ai-classroom" element={<AiClassroomPage />} />
    </>
  );
}
