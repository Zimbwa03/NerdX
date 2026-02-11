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

// Phase 3 Biology labs
import { RespirationAerobicLab } from './labs/biology/RespirationAerobicLab';
import { RespirationAnaerobicLab } from './labs/biology/RespirationAnaerobicLab';
import { GasExchangeLab } from './labs/biology/GasExchangeLab';
import { DigestiveJourneyLab } from './labs/biology/DigestiveJourneyLab';
import { EcologyFoodWebLab } from './labs/biology/EcologyFoodWebLab';
import { PopulationGrowthLab } from './labs/biology/PopulationGrowthLab';
import { LimitingFactorsLab } from './labs/biology/LimitingFactorsLab';
import { XylemTransportLab } from './labs/biology/XylemTransportLab';
import { PhloemTranslocationLab } from './labs/biology/PhloemTranslocationLab';
import { ThermoregulationLab } from './labs/biology/ThermoregulationLab';
import { BloodGlucoseLab } from './labs/biology/BloodGlucoseLab';
import { KidneyFiltrationLab } from './labs/biology/KidneyFiltrationLab';
import { FloweringPlantReproductionLab } from './labs/biology/FloweringPlantReproductionLab';
import { HumanReproductionLab } from './labs/biology/HumanReproductionLab';
import { GeneticsInheritanceLab } from './labs/biology/GeneticsInheritanceLab';
import { VariationAdaptationLab } from './labs/biology/VariationAdaptationLab';
import { MicrobesDiseaseLab } from './labs/biology/MicrobesDiseaseLab';
import { EcosystemsConservationLab } from './labs/biology/EcosystemsConservationLab';

// Phase 3 Chemistry labs
import { BondingBasicsLab } from './labs/chemistry/BondingBasicsLab';
import { ReactivitySeriesLab } from './labs/chemistry/ReactivitySeriesLab';
import { NeutralisationLab } from './labs/chemistry/NeutralisationLab';
import { SaltPreparationLab } from './labs/chemistry/SaltPreparationLab';
import { RatesOfReactionLab } from './labs/chemistry/RatesOfReactionLab';
import { EnergyChangesLab } from './labs/chemistry/EnergyChangesLab';
import { ElectrochemCellsLab } from './labs/chemistry/ElectrochemCellsLab';
import { HydrocarbonsLab } from './labs/chemistry/HydrocarbonsLab';
import { AlcoholsAcidsLab } from './labs/chemistry/AlcoholsAcidsLab';
import { AirWaterLab } from './labs/chemistry/AirWaterLab';
import { IsotopesExplorerLab } from './labs/chemistry/IsotopesExplorerLab';
import { SeparationMixturesLab } from './labs/chemistry/SeparationMixturesLab';
import { RedoxBasicsLab } from './labs/chemistry/RedoxBasicsLab';
import { MoleCalculationsLab } from './labs/chemistry/MoleCalculationsLab';
import { PeriodicTrendsLab } from './labs/chemistry/PeriodicTrendsLab';
import { PolymersMaterialsLab } from './labs/chemistry/PolymersMaterialsLab';

// Phase 3 Physics labs
import { EnergyWorkPowerLab } from './labs/physics/EnergyWorkPowerLab';
import { PressureFluidsLab } from './labs/physics/PressureFluidsLab';
import { MomentumCollisionsLab } from './labs/physics/MomentumCollisionsLab';
import { LightReflectionLab } from './labs/physics/LightReflectionLab';
import { LightRefractionLab } from './labs/physics/LightRefractionLab';
import { LensesFocusLab } from './labs/physics/LensesFocusLab';
import { MagnetismFieldsLab } from './labs/physics/MagnetismFieldsLab';
import { ElectromagnetsLab } from './labs/physics/ElectromagnetsLab';
import { ElectricPowerLab } from './labs/physics/ElectricPowerLab';
import { HeatTransferLab } from './labs/physics/HeatTransferLab';
import { SoundWavesLab } from './labs/physics/SoundWavesLab';
import { SimpleHarmonicMotionLab } from './labs/physics/SimpleHarmonicMotionLab';
import { DensityBuoyancyLab } from './labs/physics/DensityBuoyancyLab';
import { RadioactivityLab } from './labs/physics/RadioactivityLab';
import { ForcesEquilibriumLab } from './labs/physics/ForcesEquilibriumLab';
import { CircularMotionLab } from './labs/physics/CircularMotionLab';
import { LogicGatesLab } from './labs/LogicGatesLab';

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

  // Phase 3 Biology — custom interactive simulations
  'bio-respiration-aerobic': RespirationAerobicLab,
  'bio-respiration-anaerobic': RespirationAnaerobicLab,
  'bio-gas-exchange': GasExchangeLab,
  'bio-digestive-journey': DigestiveJourneyLab,
  'bio-ecology-food-webs': EcologyFoodWebLab,
  'bio-population-growth': PopulationGrowthLab,
  'bio-photosynthesis-limiting-factors': LimitingFactorsLab,
  'bio-transport-plants-xylem': XylemTransportLab,
  'bio-transport-plants-phloem': PhloemTranslocationLab,
  'bio-homeostasis-thermoregulation': ThermoregulationLab,
  'bio-homeostasis-glucose': BloodGlucoseLab,
  'bio-excretion-kidney': KidneyFiltrationLab,
  'bio-reproduction-flowering-plants': FloweringPlantReproductionLab,
  'bio-reproduction-human': HumanReproductionLab,
  'bio-genetics-inheritance': GeneticsInheritanceLab,
  'bio-variation-adaptation': VariationAdaptationLab,
  'bio-microbes-disease': MicrobesDiseaseLab,
  'bio-ecosystems-conservation': EcosystemsConservationLab,

  // Phase 3 Chemistry — custom interactive simulations
  'chem-bonding-basics': BondingBasicsLab,
  'chem-metals-reactivity': ReactivitySeriesLab,
  'chem-acids-bases-neutralisation': NeutralisationLab,
  'chem-salts-preparation': SaltPreparationLab,
  'chem-rates-reaction': RatesOfReactionLab,
  'chem-energy-changes': EnergyChangesLab,
  'chem-electrochem-cells': ElectrochemCellsLab,
  'chem-organic-alkanes-alkenes': HydrocarbonsLab,
  'chem-organic-alcohols-acids': AlcoholsAcidsLab,
  'chem-air-water': AirWaterLab,
  'chem-atomic-structure-isotopes': IsotopesExplorerLab,
  'chem-separation-mixtures': SeparationMixturesLab,
  'chem-redox-basics': RedoxBasicsLab,
  'chem-stoichiometry-moles': MoleCalculationsLab,
  'chem-periodic-trends': PeriodicTrendsLab,
  'chem-polymers-materials': PolymersMaterialsLab,

  // Phase 3 Physics — custom interactive simulations
  'phys-energy-work-power': EnergyWorkPowerLab,
  'phys-pressure-fluids': PressureFluidsLab,
  'phys-momentum-collisions': MomentumCollisionsLab,
  'phys-light-reflection': LightReflectionLab,
  'phys-light-refraction': LightRefractionLab,
  'phys-lenses-focus': LensesFocusLab,
  'phys-magnetism-fields': MagnetismFieldsLab,
  'phys-electromagnets': ElectromagnetsLab,
  'phys-electric-power': ElectricPowerLab,
  'phys-heat-transfer': HeatTransferLab,
  'phys-sound-waves': SoundWavesLab,
  'phys-simple-harmonic-motion': SimpleHarmonicMotionLab,
  'phys-density-buoyancy': DensityBuoyancyLab,
  'phys-radioactivity-intro': RadioactivityLab,
  'phys-forces-equilibrium': ForcesEquilibriumLab,
  'phys-circular-motion': CircularMotionLab,

  // Computer Science
  'cs-logic-gates': LogicGatesLab,
};

export function getCustomLabComponent(simulationId: string): VirtualLabComponent | undefined {
  return CUSTOM_LABS[simulationId];
}
