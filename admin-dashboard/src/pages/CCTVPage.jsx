import React from 'react';

const CCTVPage = () => {
    const cameras = [
        { id: 1, name: 'Crossroad A - North', url: 'https://images.unsplash.com/photo-1566689601867-b43a99d70445?w=800&q=80' },
        { id: 2, name: 'Crossroad A - South', url: 'https://images.unsplash.com/photo-1542259681-d4cd7093e68e?w=800&q=80' },
        { id: 3, name: 'Crossroad B - East', url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80' },
        { id: 4, name: 'Crossroad B - West', url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80' },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-2xl font-bold mb-6 text-red-500">Live CCTV Monitoring</h1>
            <div className="grid grid-cols-2 gap-6">
                {cameras.map(cam => (
                    <div key={cam.id} className="bg-gray-800 p-2 rounded border border-gray-700">
                        <div className="flex justify-between mb-2">
                            <span className="font-bold">{cam.name}</span>
                            <span className="text-red-500 animate-pulse">● LIVE</span>
                        </div>
                        <div className="aspect-video bg-black rounded overflow-hidden relative">
                            <img src={cam.url} alt={cam.name} className="w-full h-full object-cover opacity-80" />
                            <div className="absolute bottom-2 right-2 text-xs bg-black/50 px-2 py-1 rounded">
                                {new Date().toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CCTVPage;
