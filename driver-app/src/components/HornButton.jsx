import React, { useState } from 'react';

const HornButton = ({ onHorn }) => {
    const [isPressed, setIsPressed] = useState(false);

    const handlePress = () => {
        setIsPressed(true);
        onHorn();
        setTimeout(() => setIsPressed(false), 200);
    };

    return (
        <button
            onClick={handlePress}
            className={`
        w-32 h-32 rounded-full border-4 border-white shadow-lg flex items-center justify-center
        transition-all duration-100 transform active:scale-95
        ${isPressed ? 'bg-red-600 shadow-red-500/50' : 'bg-red-500 hover:bg-red-400'}
      `}
        >
            <span className="text-4xl select-none">📢</span>
        </button>
    );
};

export default HornButton;
