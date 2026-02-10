import type { ComponentType } from 'react';
import type { SimulationMetadata } from '../../data/virtualLab';
import { AtomBuilderLab } from './labs/AtomBuilderLab';
import { BalanceSheetBuilderLab } from './labs/BalanceSheetBuilderLab';
import { CashFlowStatementLab } from './labs/CashFlowStatementLab';
import { CellExplorerLab } from './labs/CellExplorerLab';
import { CircuitBuilderLab } from './labs/CircuitBuilderLab';
import { CompassBearingLab } from './labs/CompassBearingLab';
import { ContourLinesLab } from './labs/ContourLinesLab';
import { CorrectionOfErrorsLab } from './labs/CorrectionOfErrorsLab';
import { CrossSectionLab } from './labs/CrossSectionLab';
import { DatabaseLabEditorLab } from './labs/DatabaseLabEditorLab';
import { ElectrolysisSimulatorLab } from './labs/ElectrolysisSimulatorLab';
import { EnzymeActionLab } from './labs/EnzymeActionLab';
import { EquationBalancerLab } from './labs/EquationBalancerLab';
import { FoodTestLab } from './labs/FoodTestLab';
import { GeoMapsLab } from './labs/GeoMapsLab';
import { HeartPumpLab } from './labs/HeartPumpLab';
import { IncomeStatementBuilderLab } from './labs/IncomeStatementBuilderLab';
import { JobInterviewLab } from './labs/JobInterviewLab';
import { MapLayersLab } from './labs/MapLayersLab';
import { MapWorkLab } from './labs/MapWorkLab';
import { MarketNegotiationLab } from './labs/MarketNegotiationLab';
import { ManufacturingAccountLab } from './labs/ManufacturingAccountLab';
import { MotionGrapherLab } from './labs/MotionGrapherLab';
import { NewtonsLawsLab } from './labs/NewtonsLawsLab';
import { NotForProfitLab } from './labs/NotForProfitLab';
import { OsmosisLab } from './labs/OsmosisLab';
import { PHScaleExplorerLab } from './labs/PHScaleExplorerLab';
import { PartnershipAppropriationLab } from './labs/PartnershipAppropriationLab';
import { PhotosynthesisReactorLab } from './labs/PhotosynthesisReactorLab';
import { ProjectGatesLab } from './labs/ProjectGatesLab';
import { ProgrammingLabEditorLab } from './labs/ProgrammingLabEditorLab';
import { ProjectileMotionLab } from './labs/ProjectileMotionLab';
import { ScaleDistanceLab } from './labs/ScaleDistanceLab';
import { SixFigureGridLab } from './labs/SixFigureGridLab';
import { ThermalExpansionLab } from './labs/ThermalExpansionLab';
import { TitrationMasterLab } from './labs/TitrationMasterLab';
import { TranspirationTrackerLab } from './labs/TranspirationTrackerLab';
import { WavePropertiesLab } from './labs/WavePropertiesLab';
import { WebDesignLabEditorLab } from './labs/WebDesignLabEditorLab';
import { ComplexNumbersLab } from './labs/math/ComplexNumbersLab';
import { DifferentiationLab } from './labs/math/DifferentiationLab';
import { IntegrationLab } from './labs/math/IntegrationLab';
import { LinearProgrammingLab } from './labs/math/LinearProgrammingLab';
import { LogarithmsLab } from './labs/math/LogarithmsLab';
import { MatrixSandboxLab } from './labs/math/MatrixSandboxLab';
import { ProbabilitySimulatorLab } from './labs/math/ProbabilitySimulatorLab';
import { QuadraticExplorerLab } from './labs/math/QuadraticExplorerLab';
import { SequencesSeriesLab } from './labs/math/SequencesSeriesLab';
import { SimultaneousEquationsLab } from './labs/math/SimultaneousEquationsLab';
import { StatisticsExplorerLab } from './labs/math/StatisticsExplorerLab';
import { TrigFunctionsLab } from './labs/math/TrigFunctionsLab';
import { VectorVisualizerLab } from './labs/math/VectorVisualizerLab';

export type VirtualLabComponent = ComponentType<{ simulation: SimulationMetadata }>;

const CUSTOM_LABS: Record<string, VirtualLabComponent> = {
  // Phase 1 custom interactive simulations
  'cell-explorer': CellExplorerLab,
  'osmosis-adventure': OsmosisLab,
  'atom-builder': AtomBuilderLab,
  'equation-balancer': EquationBalancerLab,
  'circuit-builder': CircuitBuilderLab,
  'projectile-motion': ProjectileMotionLab,

  // Phase 2 custom interactive simulations
  'food-test-lab': FoodTestLab,
  'photosynthesis-reactor': PhotosynthesisReactorLab,
  'enzyme-action-lab': EnzymeActionLab,
  'transpiration-tracker': TranspirationTrackerLab,
  'heart-pump': HeartPumpLab,
  'titration-master': TitrationMasterLab,
  'ph-scale-explorer': PHScaleExplorerLab,
  'electrolysis-simulator': ElectrolysisSimulatorLab,
  'motion-grapher': MotionGrapherLab,
  'newtons-laws-lab': NewtonsLawsLab,
  'thermal-expansion': ThermalExpansionLab,
  'wave-properties': WavePropertiesLab,

  // Editors
  'programming-lab': ProgrammingLabEditorLab,
  'web-design-lab': WebDesignLabEditorLab,
  'database-lab': DatabaseLabEditorLab,

  // Project planning + logic
  'project-gates-lab': ProjectGatesLab,

  // Accounting - AI-driven questions
  'accounting-balance-sheet-lab': BalanceSheetBuilderLab,
  'accounting-income-statement-lab': IncomeStatementBuilderLab,
  'accounting-partnership-appropriation-lab': PartnershipAppropriationLab,
  'accounting-cash-flow-lab': CashFlowStatementLab,
  'accounting-manufacturing-lab': ManufacturingAccountLab,
  'accounting-correction-of-errors-lab': CorrectionOfErrorsLab,
  'accounting-not-for-profit-lab': NotForProfitLab,

  // Mathematics - interactive simulations
  'differentiation-lab': DifferentiationLab,
  'integration-lab': IntegrationLab,
  'quadratic-explorer': QuadraticExplorerLab,
  'complex-numbers-lab': ComplexNumbersLab,
  'trig-functions-lab': TrigFunctionsLab,
  'vector-visualizer': VectorVisualizerLab,
  'matrix-sandbox': MatrixSandboxLab,
  'linear-programming-lab': LinearProgrammingLab,
  'logarithms-lab': LogarithmsLab,
  'probability-simulator': ProbabilitySimulatorLab,
  'sequences-series-lab': SequencesSeriesLab,
  'statistics-explorer': StatisticsExplorerLab,
  'simultaneous-equations-lab': SimultaneousEquationsLab,

  // English - dialogue-based roleplays
  'eng-market-negotiation': MarketNegotiationLab,
  'eng-job-interview': JobInterviewLab,

  // Geography - Map work & fieldwork
  'map-work-grid-scale': MapWorkLab,
  'six-figure-grid-refs': SixFigureGridLab,
  'compass-bearing': CompassBearingLab,
  'contour-lines': ContourLinesLab,
  'scale-distance': ScaleDistanceLab,
  'cross-section-lab': CrossSectionLab,
  'map-layers': MapLayersLab,
  'geo-maps-lab': GeoMapsLab,
};

export function getCustomLabComponent(simulationId: string): VirtualLabComponent | undefined {
  return CUSTOM_LABS[simulationId];
}
