import React from 'react';
import { ArrowBigRight, Clock, Milestone, Flag, LocateFixed, Home, History, Share2 } from 'lucide-react';

const NavigationSheet = ({ route, stepIndex, setStepIndex, onRecenter, onHome, onHistory, embeddedMode }) => {
    if (!route || !route.steps) return null;

    const steps = route.steps;
    const currentStep = steps[stepIndex];

    const progress = steps.length > 1 ? ((stepIndex) / (steps.length - 1)) * 100 : 0;

    const nextStep = () => {
        if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1);
    }

    const prevStep = () => {
        if (stepIndex > 0) setStepIndex(stepIndex - 1);
    }

    let remainingDist = 0;
    let remainingTime = 0;

    for (let i = stepIndex; i < steps.length; i++) {
        remainingDist += steps[i].distance || 0;
        remainingTime += steps[i].duration || 0;
    }

    const arrivalTime = new Date(Date.now() + remainingTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="w-full relative px-6 lg:px-8 mt-6 lg:mt-0 lg:py-8">

            {/* Desktop New Route Button */}
            <div className="hidden lg:flex justify-end mb-4">
                <button
                    onClick={onHome}
                    className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition bg-gray-800/50 hover:bg-gray-800 px-4 py-2 rounded-full border border-gray-700"
                >
                    <Home className="w-4 h-4" /> New Route
                </button>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h4 className="font-extrabold text-xl lg:text-3xl text-white tracking-tight">Navigation</h4>
                <div className="bg-blue-900/30 text-blue-400 px-4 py-1.5 lg:px-6 lg:py-2 rounded-full text-xs lg:text-sm font-bold border border-blue-500/30">
                    Step {stepIndex + 1} / {steps.length}
                </div>
            </div>

            {/* Instruction Card */}
            <div className="mb-6 lg:mb-8 p-6 lg:p-8 bg-[#162032] rounded-[24px] lg:rounded-[32px] border border-gray-800 shadow-xl relative overflow-hidden transition-all duration-300 hover:border-gray-700">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <div className="flex justify-start gap-6 text-sm lg:text-lg text-gray-400 mb-4 uppercase tracking-wider font-semibold">
                    <span className="flex items-center gap-2"><Milestone className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" /> {currentStep.distance}m</span>
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 lg:w-5 lg:h-5 text-purple-400" /> {Math.round(currentStep.duration || 0)}s</span>
                </div>
                <p className="font-bold text-2xl lg:text-4xl text-white leading-tight">{currentStep.instruction}</p>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 lg:h-2.5 bg-gray-800 rounded-full mb-8 lg:mb-10 overflow-hidden">
                <div
                    className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)] transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 mb-8 lg:mb-12">
                <button
                    onClick={prevStep}
                    disabled={stepIndex === 0}
                    className="flex-1 py-3 lg:py-4 px-4 border border-gray-700 text-white rounded-xl lg:rounded-2xl disabled:opacity-30 hover:bg-gray-800 font-bold text-base lg:text-lg transition tracking-wide"
                >
                    Previous
                </button>

                <button
                    onClick={onRecenter}
                    className="flex-none w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center bg-gray-800 border border-gray-700 rounded-xl lg:rounded-2xl text-blue-400 hover:text-white hover:bg-gray-700 transition"
                >
                    <LocateFixed className="w-6 h-6 lg:w-8 lg:h-8" />
                </button>

                <button
                    onClick={nextStep}
                    disabled={stepIndex === steps.length - 1}
                    className="flex-1 py-3 lg:py-4 px-4 bg-blue-600 text-white rounded-xl lg:rounded-2xl disabled:opacity-30 hover:bg-blue-700 font-bold text-base lg:text-lg transition shadow-lg shadow-blue-600/20 flex justify-center items-center gap-2 tracking-wide"
                >
                    Next <ArrowBigRight className="w-5 h-5 lg:w-8 lg:h-8" />
                </button>
            </div>

            {/* Trip Summary */}
            <div className="bg-[#162032] rounded-[32px] border border-gray-800 p-6 lg:p-8 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="font-bold text-lg lg:text-2xl text-white">Remaining</h5>
                    <span className="text-xs lg:text-sm text-blue-300 bg-blue-900/20 px-3 py-1 lg:px-4 lg:py-1.5 rounded-lg border border-blue-500/20">
                        From Step {stepIndex + 1}
                    </span>
                </div>

                <div className="space-y-4 lg:space-y-6">
                    <div className="flex justify-between items-end pb-4 border-b border-gray-700/50">
                        <span className="text-gray-400 text-sm lg:text-lg font-medium">Distance</span>
                        <span className="font-bold text-white text-xl lg:text-3xl">{(remainingDist / 1000).toFixed(1)} <span className="text-sm lg:text-xl font-normal text-gray-500">km</span></span>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-gray-400 text-sm lg:text-lg font-medium">Duration</span>
                        <span className="font-bold text-white text-xl lg:text-3xl">{Math.floor(remainingTime / 60)} <span className="text-sm lg:text-xl font-normal text-gray-500">min</span></span>
                    </div>
                    <div className="pt-2 text-right">
                        <span className="text-xs lg:text-base text-green-400 font-medium">ETA: {arrivalTime}</span>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default NavigationSheet;
