// BoundsAccuracyLabScreen

import React from 'react';
import FixedSimulationScreen from './FixedSimulationScreen';

const BoundsAccuracyLabScreen: React.FC = () => (
  <FixedSimulationScreen
    simulationId="bounds-accuracy-lab"
    accentColor="#3949AB"
    accentIcon="locate-outline"
    accentLabel="Upper and Lower Bounds"
  />
);

export default BoundsAccuracyLabScreen;
