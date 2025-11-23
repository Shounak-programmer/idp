import React from 'react';

const StepList = ({ steps }) => {
    if (!steps || steps.length === 0) return null;

    return (
        <div className="bg-white p-4 rounded-lg shadow-md max-h-60 overflow-y-auto">
            <h3 className="font-bold mb-2 text-gray-800">Route Steps</h3>
            <ul className="space-y-2">
                {steps.map((step, index) => (
                    <li key={index} className="flex items-start border-b border-gray-100 pb-2 last:border-0">
                        <span className="font-mono text-blue-600 mr-2">{index + 1}.</span>
                        <span className="text-sm text-gray-700">{step.maneuver?.instruction || step.name || "Continue"}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StepList;
