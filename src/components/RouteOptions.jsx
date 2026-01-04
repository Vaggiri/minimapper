import React from 'react';

const RouteOptions = ({ options, setOptions }) => {
    const toggleOption = (key) => {
        setOptions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(options).map(key => (
                <label
                    key={key}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-all select-none flex items-center gap-1
            ${options[key]
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
                        }`}
                >
                    <input
                        type="checkbox"
                        className="hidden"
                        checked={options[key]}
                        onChange={() => toggleOption(key)}
                    />
                    {key === 'avoidTolls' && 'Avoid Tolls'}
                    {key === 'avoidHighways' && 'Avoid Highways'}
                    {key === 'avoidFerries' && 'Avoid Ferries'}
                </label>
            ))}
        </div>
    );
};

export default RouteOptions;
