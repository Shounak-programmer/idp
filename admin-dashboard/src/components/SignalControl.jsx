import React from 'react';
import { forceClearSignal } from '../services/controlService';

const SignalControl = ({ signal }) => {
    const isPreempted = signal.incoming?.ambulanceId;

    let statusColor = 'bg-gray-400';
    if (signal.status === 'green') statusColor = 'bg-green-500';
    if (signal.status === 'yellow') statusColor = 'bg-yellow-500';
    if (signal.status === 'red') statusColor = 'bg-red-500';
    if (signal.status === 'preempted') statusColor = 'bg-blue-500 animate-pulse';

    return (
        <div className="bg-gray-800 p-3 rounded-lg mb-2 border border-gray-700">
            <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-white">{signal.name || signal.id}</span>
                <div className={`w-4 h-4 rounded-full ${statusColor}`}></div>
            </div>

            {isPreempted && (
                <div className="text-xs text-blue-300 mb-2">
                    Incoming: {signal.incoming.ambulanceId} ({signal.incoming.direction})
                </div>
            )}

            <div className="flex space-x-2">
                <button
                    onClick={() => forceClearSignal(signal.id, "force_green")}
                    className="flex-1 bg-green-700 hover:bg-green-600 text-xs py-1 rounded text-white"
                >
                    Force Green
                </button>
                <button
                    onClick={() => forceClearSignal(signal.id, "force_red")}
                    className="flex-1 bg-red-700 hover:bg-red-600 text-xs py-1 rounded text-white"
                >
                    Force Red
                </button>
            </div>
        </div>
    );
};

export default SignalControl;
