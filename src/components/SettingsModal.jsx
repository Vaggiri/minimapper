import React from 'react';
import { X, Moon, Sun, Map as MapIcon, RotateCcw } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="glass-panel w-full max-w-sm rounded-3xl p-6 relative animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Settings</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <MapIcon className="w-5 h-5" />
                            </div>
                            <span className="font-medium text-gray-700">Map Style</span>
                        </div>
                        <select className="bg-transparent text-sm font-semibold text-blue-600 outline-none cursor-pointer">
                            <option>Standard</option>
                            <option>Satellite</option>
                            <option>Hybrid</option>
                        </select>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                <Sun className="w-5 h-5" />
                            </div>
                            <span className="font-medium text-gray-700">Theme</span>
                        </div>
                        <div className="flex bg-gray-200 rounded-lg p-1">
                            <button className="p-1.5 bg-white rounded-md shadow-sm"><Sun className="w-4 h-4 text-orange-500" /></button>
                            <button className="p-1.5"><Moon className="w-4 h-4 text-gray-400" /></button>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button className="w-full py-3 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                            <RotateCcw className="w-4 h-4" /> Reset App
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
