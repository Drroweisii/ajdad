import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTutorialStore } from '../../store/tutorialStore';
import { TutorialTooltip } from './TutorialTooltip';

export function TutorialOverlay() {
  const { steps, currentStepIndex, isActive, completeTutorialStep, skipTutorial } =
    useTutorialStore();
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!isActive) return;

    const currentStep = steps[currentStepIndex];
    if (!currentStep) return;

    const targetElement = document.querySelector(currentStep.target);
    if (!targetElement) return;

    const rect = targetElement.getBoundingClientRect();
    setTooltipPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    });
  }, [currentStepIndex, isActive, steps]);

  if (!isActive) return null;

  const currentStep = steps[currentStepIndex];
  if (!currentStep) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute" style={tooltipPosition}>
        <div className="pointer-events-auto">
          <TutorialTooltip
            step={currentStep}
            onComplete={completeTutorialStep}
            onSkip={skipTutorial}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}