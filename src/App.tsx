import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { FittingRoom, FittingConfig } from './components/FittingRoom';
import { PhotoBoothCabin, PhotoBoothResult } from './components/PhotoBoothCabin';
import { PhotoStripPrinter } from './components/PhotoStripPrinter';
import { GARMENTS } from './data/garments';

type AppScreen = 'landing' | 'fitting' | 'booth' | 'strip';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('landing');
  const [currentConfig, setCurrentConfig] = useState<FittingConfig | null>(null);
  const [boothResult, setBoothResult] = useState<PhotoBoothResult | null>(null);

  // Transition: Landing -> Fitting Room
  const handleEnterStore = () => {
    setCurrentScreen('fitting');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Transition: Fitting Room -> Photobooth Cabin
  const handleEnterBooth = (config: FittingConfig) => {
    setCurrentConfig(config);
    setCurrentScreen('booth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Transition: Photobooth Cabin -> V-Print Photo Strip
  const handlePhotosCaptured = (result: PhotoBoothResult) => {
    setBoothResult(result);
    setCurrentScreen('strip');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Retake within Photobooth
  const handleRetakePhotos = () => {
    setCurrentScreen('booth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to Fitting Room
  const handleGoToFitting = () => {
    setCurrentScreen('fitting');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1E1B18] font-sans antialiased">
      {currentScreen === 'landing' && (
        <LandingPage onEnterStore={handleEnterStore} />
      )}

      {currentScreen === 'fitting' && (
        <FittingRoom onEnterBooth={handleEnterBooth} />
      )}

      {currentScreen === 'booth' && currentConfig && (
        <PhotoBoothCabin
          config={currentConfig}
          onPhotosCaptured={handlePhotosCaptured}
          onBackToFitting={handleGoToFitting}
        />
      )}

      {currentScreen === 'strip' && boothResult && (
        <PhotoStripPrinter
          result={boothResult}
          onRetake={handleRetakePhotos}
          onGoToFitting={handleGoToFitting}
        />
      )}
    </div>
  );
}
