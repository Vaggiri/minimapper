import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import axios from 'axios';

const DestinationInput = ({ onSelect, initialValue, placeholder = "Where to go?" }) => {
    const [query, setQuery] = useState(initialValue || '');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (initialValue) setQuery(initialValue);
    }, [initialValue]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length > 2) {
                try {
                    const res = await axios.get(`https://photon.komoot.io/api/?q=${query}&limit=5`);
                    setSuggestions(res.data.features);
                    setShowSuggestions(true);
                } catch (e) {
                    console.error("Search failed", e);
                }
            } else {
                setShowSuggestions(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (feature) => {
        const p = feature.properties;
        const name = [p.name, p.city, p.country].filter(Boolean).join(', ');

        setQuery(name);
        setShowSuggestions(false);

        onSelect({
            display_name: name,
            lat: feature.geometry.coordinates[1],
            lon: feature.geometry.coordinates[0],
            type: p.osm_value || 'place'
        });
    };

    return (
        <div className="relative mb-4 z-[50]">
            <label className="block text-sm font-medium text-gray-400 mb-1 ml-1">{placeholder}</label>
            <div className="relative">
                <input
                    type="text"
                    className="form-control"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length > 2 && setShowSuggestions(true)}
                />
                {query.length === 0 && <Search className="absolute right-3 top-3 text-gray-500 w-5 h-5" />}
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-box">
                    {suggestions.map((feature, i) => {
                        const p = feature.properties;
                        const primary = p.name || p.street || p.city;
                        const secondary = [p.city, p.state, p.country].filter(x => x && x !== primary).join(', ');

                        return (
                            <div
                                key={i}
                                className="suggestion-item text-left"
                                onClick={() => handleSelect(feature)}
                            >
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-blue-400 mt-1 shrink-0" />
                                    <div className="overflow-hidden">
                                        <div className="font-medium text-white truncate">{primary}</div>
                                        <div className="text-xs text-gray-400 truncate">{secondary}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default DestinationInput;
