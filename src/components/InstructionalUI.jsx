import React, { useState } from 'react';

// Finger Mappings
const FINGER_KEY_MAP = {
    'l_pinky': ['`', '1', 'q', 'a', 'z', 'Tab', 'Caps', 'Shift'],
    'l_ring': ['2', 'w', 's', 'x'],
    'l_middle': ['3', 'e', 'd', 'c'],
    'l_index': ['4', '5', 'r', 't', 'f', 'g', 'v', 'b'],
    'thumb': ['Space'],
    'r_index': ['6', '7', 'y', 'u', 'h', 'j', 'n', 'm'],
    'r_middle': ['8', 'i', 'k', ','],
    'r_ring': ['9', 'o', 'l', '.'],
    'r_pinky': ['0', '-', '=', 'p', '[', ']', '\\', ';', "'", '/', 'Enter', 'Backspace']
};

const KEYBOARD_ROWS = [
    [
        { key: '`', finger: 'l_pinky' }, { key: '1', finger: 'l_pinky' }, { key: '2', finger: 'l_ring' }, { key: '3', finger: 'l_middle' }, { key: '4', finger: 'l_index' }, { key: '5', finger: 'l_index' },
        { key: '6', finger: 'r_index' }, { key: '7', finger: 'r_index' }, { key: '8', finger: 'r_middle' }, { key: '9', finger: 'r_ring' }, { key: '0', finger: 'r_pinky' }, { key: '-', finger: 'r_pinky' }, { key: '=', finger: 'r_pinky' }, { key: 'Backspace', finger: 'r_pinky', width: '60px' }
    ],
    [
        { key: 'Tab', finger: 'l_pinky', width: '60px' }, { key: 'Q', finger: 'l_pinky' }, { key: 'W', finger: 'l_ring' }, { key: 'E', finger: 'l_middle' }, { key: 'R', finger: 'l_index' }, { key: 'T', finger: 'l_index' },
        { key: 'Y', finger: 'r_index' }, { key: 'U', finger: 'r_index' }, { key: 'I', finger: 'r_middle' }, { key: 'O', finger: 'r_ring' }, { key: 'P', finger: 'r_pinky' }, { key: '[', finger: 'r_pinky' }, { key: ']', finger: 'r_pinky' }, { key: '\\', finger: 'r_pinky' }
    ],
    [
        { key: 'Caps', finger: 'l_pinky', width: '70px' }, { key: 'A', finger: 'l_pinky' }, { key: 'S', finger: 'l_ring' }, { key: 'D', finger: 'l_middle' }, { key: 'F', finger: 'l_index' }, { key: 'G', finger: 'l_index' },
        { key: 'H', finger: 'r_index' }, { key: 'J', finger: 'r_index' }, { key: 'K', finger: 'r_middle' }, { key: 'L', finger: 'r_ring' }, { key: ';', finger: 'r_pinky' }, { key: "'", finger: 'r_pinky' }, { key: 'Enter', finger: 'r_pinky', width: '80px' }
    ],
    [
        { key: 'Shift', finger: 'l_pinky', width: '90px' }, { key: 'Z', finger: 'l_pinky' }, { key: 'X', finger: 'l_ring' }, { key: 'C', finger: 'l_middle' }, { key: 'V', finger: 'l_index' }, { key: 'B', finger: 'l_index' },
        { key: 'N', finger: 'r_index' }, { key: 'M', finger: 'r_index' }, { key: ',', finger: 'r_middle' }, { key: '.', finger: 'r_ring' }, { key: '/', finger: 'r_pinky' }, { key: 'Shift', finger: 'r_pinky', width: '90px' }
    ],
    [
        { key: 'Space', finger: 'thumb', width: '300px' }
    ]
];

const FINGER_COLORS = {
    'l_pinky': 'rgba(255, 99, 71, 0.6)',
    'l_ring': 'rgba(255, 215, 0, 0.6)',
    'l_middle': 'rgba(50, 205, 50, 0.6)',
    'l_index': 'rgba(30, 144, 255, 0.6)',
    'r_index': 'rgba(30, 144, 255, 0.6)',
    'r_middle': 'rgba(50, 205, 50, 0.6)',
    'r_ring': 'rgba(255, 215, 0, 0.6)',
    'r_pinky': 'rgba(255, 99, 71, 0.6)',
    'thumb': 'rgba(128, 128, 128, 0.6)'
};

const FINGER_NAMES = {
    'l_pinky': 'Left Pinky',
    'l_ring': 'Left Ring',
    'l_middle': 'Left Middle',
    'l_index': 'Left Index',
    'r_index': 'Right Index',
    'r_middle': 'Right Middle',
    'r_ring': 'Right Ring',
    'r_pinky': 'Right Pinky',
    'thumb': 'Thums'
};

const InstructionalUI = ({ activeChar }) => {
    const [hoveredFinger, setHoveredFinger] = useState(null);

    // Determine active finger based on char or hover
    const getFingerForChar = (char) => {
        if (!char) return null;
        const upperChar = char.toUpperCase();
        if (char === ' ') return 'thumb';

        for (let row of KEYBOARD_ROWS) {
            for (let k of row) {
                if (k.key === upperChar) return k.finger;
            }
        }
        return null;
    };

    const activeFinger = hoveredFinger || getFingerForChar(activeChar);

    // SVG Hand Paths (Simplified Schematic)
    // Coords approximate 2 hands
    const handPaths = [
        // Left Hand
        { id: 'l_pinky', d: "M 50 120 L 50 80 Q 50 70 60 70 L 70 70 Q 80 70 80 80 L 80 120 Z", label: "LP" }, // Pinky
        { id: 'l_ring', d: "M 90 120 L 90 60 Q 90 50 100 50 L 110 50 Q 120 50 120 60 L 120 120 Z", label: "LR" }, // Ring
        { id: 'l_middle', d: "M 130 120 L 130 40 Q 130 30 140 30 L 150 30 Q 160 30 160 40 L 160 120 Z", label: "LM" }, // Middle
        { id: 'l_index', d: "M 170 120 L 170 50 Q 170 40 180 40 L 190 40 Q 200 40 200 50 L 200 120 Z", label: "LI" }, // Index
        { id: 'thumb', d: "M 220 120 L 240 100 Q 250 100 260 110 L 250 140 Z", label: "T" }, // Thumb (L+R shared logical, here visual L)

        // Right Hand (Mirrored-ish)
        { id: 'r_index', d: "M 440 120 L 440 50 Q 440 40 450 40 L 460 40 Q 470 40 470 50 L 470 120 Z", label: "RI" },
        { id: 'r_middle', d: "M 480 120 L 480 40 Q 480 30 490 30 L 500 30 Q 510 30 510 40 L 510 120 Z", label: "RM" },
        { id: 'r_ring', d: "M 520 120 L 520 60 Q 520 50 530 50 L 540 50 Q 550 50 550 60 L 550 120 Z", label: "RR" },
        { id: 'r_pinky', d: "M 560 120 L 560 80 Q 560 70 570 70 L 580 70 Q 590 70 590 80 L 590 120 Z", label: "RP" }
    ];

    return (
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

            {/* Hint Text - Removed as per feedback */}
            <div style={{ minHeight: '10px' }}></div>

            {/* Realistic Hands SVG */}
            <div style={{ marginBottom: '20px' }}>
                <svg width="640" height="150" viewBox="0 0 640 150" style={{ filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.1))' }}>
                    {/* Palms (decor) */}
                    <path d="M 50 120 L 220 120 Q 230 180 50 180 Z" fill="#e0caaf" />
                    <path d="M 420 120 L 590 120 Q 420 180 600 180 Z" fill="#e0caaf" />

                    {handPaths.map((finger) => {
                        const isActive = activeFinger === finger.id;
                        return (
                            <path
                                key={finger.id}
                                d={finger.d}
                                fill={isActive ? FINGER_COLORS[finger.id] : "#f0d9c0"} // Skin tone vs Active Color
                                stroke={isActive ? "#333" : "#dcbfa3"}
                                strokeWidth="2"
                                onMouseEnter={() => setHoveredFinger(finger.id)}
                                onMouseLeave={() => setHoveredFinger(null)}
                                onClick={() => setHoveredFinger(prev => prev === finger.id ? null : finger.id)} // Toggle on click
                                style={{
                                    cursor: 'pointer',
                                    transition: 'fill 0.2s',
                                    transform: isActive ? 'translateY(-5px)' : 'none'
                                }}
                            />
                        );
                    })}
                </svg>
            </div>

            {/* Keyboard */}
            <div className="virtual-keyboard" style={{
                display: 'inline-flex',
                flexDirection: 'column',
                gap: '6px',
                background: '#e9ecef',
                padding: '20px',
                borderRadius: '15px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
                marginTop: '-10px',
                position: 'relative',
                zIndex: 2
            }}>
                {KEYBOARD_ROWS.map((row, rIndex) => (
                    <div key={rIndex} style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                        {row.map((k, kIndex) => {
                            // Check if key belongs to active finger
                            const isFingerActive = activeFinger === k.finger;
                            // Check if key is the specific active char (typing target)
                            const isTargetKey = (activeChar && k.key === activeChar.toUpperCase()) || (activeChar === ' ' && k.key === 'Space');

                            const isActive = isFingerActive || isTargetKey;

                            // Color logic: 
                            // If target key: Strong highlight
                            // If just finger active (hover): Soft highlight matching finger color
                            const bgColor = isTargetKey ? '#333' : (isFingerActive ? FINGER_COLORS[k.finger] : '#fff');
                            const textColor = isTargetKey ? '#fff' : (isFingerActive ? 'rgba(0,0,0,0.7)' : '#555');

                            return (
                                <div key={kIndex} style={{
                                    width: k.width || '50px',
                                    height: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: bgColor,
                                    borderRadius: '8px',
                                    color: textColor,
                                    fontWeight: '600',
                                    fontSize: '1rem',
                                    borderBottom: isTargetKey ? 'none' : '4px solid #ced4da',
                                    transform: isTargetKey ? 'translateY(2px)' : 'none',
                                    boxShadow: isTargetKey ? 'inset 0 2px 4px rgba(0,0,0,0.3)' : 'none',
                                    transition: 'all 0.1s'
                                }}>
                                    {k.key === 'Space' ? '' : k.key}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InstructionalUI;
