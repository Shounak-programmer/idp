import React from 'react';

const SignalList = ({ signals }) => {
    if (!signals || signals.length === 0) return null;

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
            <h3 className="font-bold mb-2 text-gray-800">Upcoming Signals</h3>
            <ul className="space-y-2">
                {signals.map((sig) => (
                    <li key={sig.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                            <div className="font-semibold text-sm">{sig.name || sig.id}</div>
                            <div className="text-xs text-gray-500">ETA: {sig.eta}s</div>
                        </div>
                        <div className="text-xs font-bold text-yellow-600 uppercase">
                            {sig.direction || "Approaching"}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SignalList;
