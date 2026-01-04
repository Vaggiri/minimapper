import React from 'react';
import { Clock, Navigation, X } from 'lucide-react';

const HistoryModal = ({ history, onSelect, onClose }) => {
    return (
        <div className="fixed inset-0 z-[2000] flex items-end lg:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="glass-panel w-full max-w-md max-h-[80vh] flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300">
                <div className="flex justify-between items-center p-4 border-b border-gray-200/20">
                    <h3 className="text-lg font-bold text-default flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-500" /> Recent Destinations
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-full text-muted">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto p-2">
                    {history.length === 0 ? (
                        <div className="text-center py-8 text-muted">No recent history</div>
                    ) : (
                        history.map((item, idx) => (
                            <div
                                key={idx}
                                onClick={() => { onSelect(item); onClose(); }}
                                className="p-3 m-1 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer flex items-center gap-3 transition"
                            >
                                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                    <Navigation className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-default truncate">{item.display_name}</div>
                                    <div className="text-xs text-muted truncate">
                                        {new Date(item.timestamp).toLocaleDateString()} • {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryModal;
