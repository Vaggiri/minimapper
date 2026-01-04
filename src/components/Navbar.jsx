import React from 'react';
import { Home, History, Map, Share2 } from 'lucide-react';

const Navbar = ({ view, setView, showHistory, toggleMapLayer, hideDesktop = false }) => {
    return (
        <>
            {/* Desktop Navbar (Top) */}
            {!hideDesktop && (
                <nav className="hidden lg:flex fixed top-0 left-0 right-0 h-16 app-navbar items-center justify-between px-6 transition-colors duration-300">
                    <div
                        className="flex items-center gap-2 font-bold text-xl text-white cursor-pointer"
                        onClick={() => setView('home')}
                    >
                        <div className="bg-blue-600 p-1.5 rounded-lg animate-float-icon">
                            <Map className="w-5 h-5 text-white" />
                        </div>
                        <span className="tracking-tight">MiniMapper</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={showHistory}
                            className="flex items-center gap-2 text-gray-300 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/10 transition"
                        >
                            <History className="w-5 h-5" />
                            <span>History</span>
                        </button>

                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert("Trip link copied to clipboard!");
                            }}
                            className="flex items-center gap-2 text-gray-300 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/10 transition"
                            title="Share Trip"
                        >
                            <Share2 className="w-5 h-5" />
                            <span>Share Trip</span>
                        </button>
                    </div>
                </nav>
            )}

            {/* Mobile Navbar (Bottom) */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 app-navbar flex items-center justify-around px-2 pb-safe">
                <button
                    onClick={() => setView('home')}
                    className={`flex flex-col items-center justify-center w-full h-full gap-1 ${view === 'home' ? 'text-blue-400' : 'text-gray-500'}`}
                >
                    <Home className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Home</span>
                </button>

                <button
                    onClick={showHistory}
                    className="flex flex-col items-center justify-center w-full h-full gap-1 text-gray-500 hover:text-gray-300 transition"
                >
                    <History className="w-6 h-6" />
                    <span className="text-[10px] font-medium">History</span>
                </button>

                <button
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Trip link copied to clipboard!");
                    }}
                    className="flex flex-col items-center justify-center w-full h-full gap-1 text-gray-500 hover:text-gray-300 transition"
                >
                    <Share2 className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Share</span>
                </button>
            </nav>
        </>
    );
};

export default Navbar;
