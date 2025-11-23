import React from 'react';

const EmergencyTable = ({ cases }) => {
    if (!cases || cases.length === 0) {
        return <div className="text-gray-400 text-sm p-4">No active emergencies.</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Priority</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Ambulance</th>
                    </tr>
                </thead>
                <tbody>
                    {cases.map((c) => (
                        <tr key={c.id} className="bg-gray-800 border-b border-gray-700">
                            <td className="px-4 py-2 font-medium text-white">{c.id}</td>
                            <td className="px-4 py-2">
                                <span className={`px-2 py-0.5 rounded text-xs ${c.priority === 'high' ? 'bg-red-900 text-red-300' : 'bg-yellow-900 text-yellow-300'}`}>
                                    {c.priority}
                                </span>
                            </td>
                            <td className="px-4 py-2">{c.status}</td>
                            <td className="px-4 py-2">{c.assignedAmbulanceId || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmergencyTable;
