import React from 'react';
import { Car, Bike, Footprints } from 'lucide-react';

const TransportModeSelector = ({ mode, setMode }) => {
    const modes = [
        { id: 'driving', label: 'Driving', icon: Car },
        { id: 'cycling', label: 'Cycling', icon: Bike },
        { id: 'walking', label: 'Walking', icon: Footprints },
    ];

    return (
        <div className="flex gap-3 mb-6">
            {modes.map((m) => (
                <div
                    key={m.id}
                    className={`transport-mode-btn flex-1 ${mode === m.id ? 'active' : ''}`}
                    onClick={() => setMode(m.id)}
                >
                    <m.icon className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">{m.label}</span>
                </div>
            ))}
        </div>
    );
};

export default TransportModeSelector;
