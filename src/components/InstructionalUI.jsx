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

// Neon Colors
const NEON_COLORS = {
    'l_pinky': '#ff0055', // Pink
    'l_ring': '#ffcc00',  // Yellow
    'l_middle': '#00ff66', // Green
    'l_index': '#00ccff', // Blue
    'r_index': '#00ccff',
    'r_middle': '#00ff66',
    'r_ring': '#ffcc00',
    'r_pinky': '#ff0055',
    'thumb': '#aa00ff'   // Purple
};

const InstructionalUI = ({ activeChar }) => {
    const [hoveredFinger, setHoveredFinger] = useState(null);

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

    return (
        <div className="neon-keyboard-container" style={{
            marginTop: '3rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            opacity: 0.9
        }}>
            {/* Keyboard */}
            <div className="virtual-keyboard" style={{
                display: 'inline-flex',
                flexDirection: 'column',
                gap: '8px',
                background: 'rgba(20, 20, 23, 0.9)',
                padding: '25px',
                borderRadius: '20px',
                boxShadow: '0 0 30px rgba(0, 0, 0, 0.5), inset 0 0 5px rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                position: 'relative'
            }}>
                {/* Decorative Top Glow */}
                <div style={{
                    position: 'absolute',
                    top: -2, left: '20%', right: '20%',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #00f2ea, transparent)',
                    opacity: 0.7
                }} />

                {KEYBOARD_ROWS.map((row, rIndex) => (
                    <div key={rIndex} style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        {row.map((k, kIndex) => {
                            const isFingerActive = activeFinger === k.finger;
                            const isTargetKey = (activeChar && k.key === activeChar.toUpperCase()) || (activeChar === ' ' && k.key === 'Space');
                            const isActive = isFingerActive || isTargetKey;

                            // Dynamic Neon Styles
                            const activeColor = NEON_COLORS[k.finger] || '#fff';

                            const keyStyle = {
                                width: k.width || '55px',
                                height: '55px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: isActive ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.3)',
                                borderRadius: '8px',
                                color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                                fontWeight: '600',
                                fontSize: '1rem',
                                border: `1px solid ${isActive ? activeColor : 'rgba(255,255,255,0.05)'}`,
                                boxShadow: isTargetKey
                                    ? `0 0 15px ${activeColor}, inset 0 0 10px ${activeColor}40`
                                    : (isActive ? `0 0 8px ${activeColor}40` : '0 4px 6px rgba(0,0,0,0.2)'),
                                transform: isTargetKey ? 'translateY(1px)' : 'none',
                                transition: 'all 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                textShadow: isTargetKey ? `0 0 10px ${activeColor}` : 'none'
                            };

                            return (
                                <div key={kIndex} style={keyStyle}>
                                    {k.key === 'Space' ? '' : k.key}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Helper Text */}
            {activeChar && (
                <div style={{
                    marginTop: '20px',
                    color: NEON_COLORS[getFingerForChar(activeChar)] || '#fff',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    textShadow: '0 0 10px currentColor'
                }}>
                    Use {FINGER_KEY_MAP[getFingerForChar(activeChar)] ? getFingerForChar(activeChar).replace('_', ' ') : 'Finger'}
                </div>
            )}
        </div>
    );
};

export default InstructionalUI;
