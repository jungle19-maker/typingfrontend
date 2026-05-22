import React from 'react';

// --- Constants & Config ---

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
        { key: 'Shift', finger: 'l_pinky', width: '90px', id: 'ShiftLeft' }, { key: 'Z', finger: 'l_pinky' }, { key: 'X', finger: 'l_ring' }, { key: 'C', finger: 'l_middle' }, { key: 'V', finger: 'l_index' }, { key: 'B', finger: 'l_index' },
        { key: 'N', finger: 'r_index' }, { key: 'M', finger: 'r_index' }, { key: ',', finger: 'r_middle' }, { key: '.', finger: 'r_ring' }, { key: '/', finger: 'r_pinky' }, { key: 'Shift', finger: 'r_pinky', width: '90px', id: 'ShiftRight' }
    ],
    [
        { key: 'Space', finger: 'thumb', width: '300px' }
    ]
];

const NEON_COLORS = {
    'l_pinky': '#ff0055', 'l_ring': '#ffcc00', 'l_middle': '#00ff66', 'l_index': '#00ccff',
    'r_index': '#00ccff', 'r_middle': '#00ff66', 'r_ring': '#ffcc00', 'r_pinky': '#ff0055',
    'thumb': '#aa00ff'
};

// SVG Paths for Realistic Hands (Simplified for Code)
// Left Hand Top-Down View
const LEFT_HAND_PATHS = {
    'l_pinky': "M10,80 Q5,70 5,50 Q5,30 15,30 Q25,30 25,50 L25,80",
    'l_ring': "M30,80 L30,40 Q30,20 40,20 Q50,20 50,40 L50,80",
    'l_middle': "M55,80 L55,35 Q55,10 65,10 Q75,10 75,35 L75,80",
    'l_index': "M80,80 L80,40 Q80,20 90,20 Q100,20 100,40 L100,80",
    'thumb': "M110,80 Q130,70 140,90 Q130,110 110,100"
};

// Right Hand (Mirrored logic handled in render) 
const RIGHT_HAND_PATHS = {
    'r_pinky': "M190,80 Q195,70 195,50 Q195,30 185,30 Q175,30 175,50 L175,80", // mirrored approx
    'r_ring': "M170,80 L170,40 Q170,20 160,20 Q150,20 150,40 L150,80",
    'r_middle': "M145,80 L145,35 Q145,10 135,10 Q125,10 125,35 L125,80",
    'r_index': "M120,80 L120,40 Q120,20 110,20 Q100,20 100,40 L100,80",
    'thumb': "M90,80 Q70,70 60,90 Q70,110 90,100"
};



// Hindi Inscript Layout
const HINDI_KEYBOARD_ROWS = [
    [
        { key: '1', shiftKey: '!', finger: 'l_pinky' }, { key: '2', shiftKey: '@', finger: 'l_ring' }, { key: '3', shiftKey: '#', finger: 'l_middle' }, { key: '4', shiftKey: '$', finger: 'l_index' }, { key: '5', shiftKey: '%', finger: 'l_index' },
        { key: '6', shiftKey: '^', finger: 'r_index' }, { key: '7', shiftKey: '&', finger: 'r_index' }, { key: '8', shiftKey: '*', finger: 'r_middle' }, { key: '9', shiftKey: '(', finger: 'r_ring' }, { key: '0', shiftKey: ')', finger: 'r_pinky' }, { key: '-', shiftKey: '_', finger: 'r_pinky' }, { key: 'ृ', shiftKey: 'ऋ', finger: 'r_pinky' }, { key: 'Backspace', finger: 'r_pinky', width: '60px' }
    ],
    [
        { key: 'Tab', finger: 'l_pinky', width: '60px' },
        { key: 'ौ', shiftKey: 'औ', finger: 'l_pinky' }, { key: 'ै', shiftKey: 'ऐ', finger: 'l_ring' }, { key: 'ा', shiftKey: 'आ', finger: 'l_middle' }, { key: 'ी', shiftKey: 'ई', finger: 'l_index' }, { key: 'ू', shiftKey: 'ऊ', finger: 'l_index' },
        { key: 'ब', shiftKey: 'भ', finger: 'r_index' }, { key: 'ह', shiftKey: 'ङ', finger: 'r_index' }, { key: 'ग', shiftKey: 'घ', finger: 'r_middle' }, { key: 'द', shiftKey: 'ध', finger: 'r_ring' }, { key: 'ज', shiftKey: 'झ', finger: 'r_pinky' }, { key: 'ड', shiftKey: 'ढ', finger: 'r_pinky' }, { key: '़', shiftKey: 'ञ', finger: 'r_pinky' }, { key: 'ॉ', shiftKey: 'ऑ', finger: 'r_pinky' }
    ],
    [
        { key: 'Caps', finger: 'l_pinky', width: '70px' },
        { key: 'ो', shiftKey: 'ओ', finger: 'l_pinky' }, { key: 'े', shiftKey: 'ए', finger: 'l_ring' }, { key: '्', shiftKey: 'अ', finger: 'l_middle' }, { key: 'ि', shiftKey: 'इ', finger: 'l_index' }, { key: 'ु', shiftKey: 'उ', finger: 'l_index' },
        { key: 'प', shiftKey: 'फ', finger: 'r_index' }, { key: 'र', shiftKey: 'ऱ', finger: 'r_index' }, { key: 'क', shiftKey: 'ख', finger: 'r_middle' }, { key: 'त', shiftKey: 'थ', finger: 'r_ring' }, { key: 'च', shiftKey: 'छ', finger: 'r_pinky' }, { key: 'ट', shiftKey: 'ठ', finger: 'r_pinky' }, { key: 'Enter', finger: 'r_pinky', width: '80px' }
    ],
    [
        { key: 'Shift', finger: 'l_pinky', width: '90px', id: 'ShiftLeft' },
        { key: 'ॆ', shiftKey: 'ऍ', finger: 'l_pinky' }, { key: 'ं', shiftKey: 'ँ', finger: 'l_ring' }, { key: 'म', shiftKey: 'ण', finger: 'l_middle' }, { key: 'न', shiftKey: 'ऩ', finger: 'l_index' }, { key: 'व', shiftKey: 'ऴ', finger: 'l_index' },
        { key: 'ल', shiftKey: 'ळ', finger: 'r_index' }, { key: 'स', shiftKey: 'श', finger: 'r_index' }, { key: ',', shiftKey: 'ष', finger: 'r_middle' }, { key: '.', shiftKey: '।', finger: 'r_ring' }, { key: 'य', shiftKey: 'य़', finger: 'r_pinky' }, { key: 'Shift', finger: 'r_pinky', width: '90px', id: 'ShiftRight' }
    ],
    [
        { key: 'Space', finger: 'thumb', width: '300px' }
    ]
];

const InstructionalUI = React.memo(({ activeChar, difficulty, language }) => {
    const isAdvanced = difficulty === 'advanced';
    const isHindi = language === 'hindi';

    // Choose Layout
    const rows = isHindi ? HINDI_KEYBOARD_ROWS : KEYBOARD_ROWS;

    const getFingerForChar = (char) => {
        if (!char) return null;
        if (char === ' ') return 'thumb';

        // For English, we match uppercase. For Hindi, we match exact char (normal or shift)
        const checkChar = isHindi ? char : char.toUpperCase();

        for (let row of rows) {
            for (let k of row) {
                if (k.key === checkChar || (k.shiftKey === checkChar)) {
                    return k.finger;
                }
            }
        }
        return null;
    };

    // Determine Logic
    let targetFinger = getFingerForChar(activeChar);

    // Determine Target Key Label
    let targetKeyLabel = null;
    let requiresShift = false;

    if (activeChar === ' ') {
        targetKeyLabel = 'Space';
    } else if (activeChar) {
        if (isHindi) {
            // Find the key object
            for (let row of rows) {
                for (let k of row) {
                    if (k.key === activeChar) {
                        targetKeyLabel = k.key;
                        requiresShift = false;
                        break;
                    }
                    if (k.shiftKey === activeChar) {
                        targetKeyLabel = k.shiftKey;
                        requiresShift = true;
                        break;
                    }
                }
                if (targetKeyLabel) break;
            }
        } else {
            // English Logic
            targetKeyLabel = activeChar.toUpperCase();
            requiresShift = activeChar !== activeChar.toUpperCase() && /^[A-Z~!@#$%^&*()_+{}|:"<>?]$/.test(activeChar);
            // Wait, standard English check:
            // If activeChar is Shift version.
            // Simplification:
            requiresShift = /[A-Z~!@#$%^&*()_+{}|:"<>?]/.test(activeChar);
        }
    }

    // Shift Logic: Opposite hand
    let shiftFinger = null;
    let shiftKeyId = null;
    if (requiresShift) {
        if (targetFinger && targetFinger.startsWith('l_')) {
            shiftFinger = 'r_pinky';
            shiftKeyId = 'ShiftRight';
        } else {
            shiftFinger = 'l_pinky';
            shiftKeyId = 'ShiftLeft';
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>

            {/* Hands Visualization */}
            <div style={{ display: 'flex', gap: '50px', marginBottom: '20px', height: '150px' }}>
                {/* Left Hand SVG */}
                <svg width="150" height="150" viewBox="0 0 150 150" style={{ filter: 'drop-shadow(0 0 10px rgba(0,242,234,0.2))' }}>
                    <path d="M10,80 Q5,120 40,140 L110,140 L110,100" fill="rgba(255,255,255,0.05)" stroke="none" /> {/* Palm Base */}
                    {Object.entries(LEFT_HAND_PATHS).map(([finger, path]) => {
                        const isActive = targetFinger === finger || shiftFinger === finger;
                        return (
                            <path
                                key={finger}
                                d={path}
                                fill={isActive ? NEON_COLORS[finger] : 'rgba(255,255,255,0.1)'}
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth="2"
                                style={{ transition: 'fill 0.1s' }}
                            />
                        );
                    })}
                </svg>

                {/* Right Hand SVG */}
                <svg width="200" height="150" viewBox="0 0 200 150" style={{ filter: 'drop-shadow(0 0 10px rgba(0,242,234,0.2))' }}>
                    <path d="M190,80 Q195,120 160,140 L90,140 L90,100" fill="rgba(255,255,255,0.05)" stroke="none" />
                    {Object.entries(RIGHT_HAND_PATHS).map(([finger, path]) => {
                        const isActive = targetFinger === finger || shiftFinger === finger;
                        return (
                            <path
                                key={finger}
                                d={path}
                                fill={isActive ? NEON_COLORS[finger] : 'rgba(255,255,255,0.1)'}
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth="2"
                                style={{ transition: 'fill 0.1s' }}
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
                background: 'rgba(20, 20, 23, 0.95)',
                padding: '20px',
                borderRadius: '15px',
                border: '1px solid rgba(255,255,255,0.05)',
                position: 'relative',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
                {rows.map((row, rIndex) => (
                    <div key={rIndex} style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                        {row.map((k, kIndex) => {
                            // Check if this key is the target
                            // For Hindi, matches if k.normal or k.shift is text
                            let isTarget = false;

                            if (activeChar === ' ' && k.key === 'Space') isTarget = true;
                            else if (activeChar) {
                                if (isHindi) {
                                    isTarget = (k.key === activeChar || k.shiftKey === activeChar);
                                } else {
                                    isTarget = k.key.toUpperCase() === targetKeyLabel;
                                }
                            }

                            const isShiftTarget = k.id === shiftKeyId;
                            const isActive = isTarget || isShiftTarget;

                            const showLabel = !isAdvanced || isActive || isHindi; // Always show Hindi labels for clarity? Or respect difficulty? Let's respect difficulty but maybe isHindi we want to help user learn layout.

                            const activeColor = NEON_COLORS[k.finger] || '#fff';

                            return (
                                <div key={kIndex} style={{
                                    width: k.width || '50px',
                                    height: '50px',
                                    display: 'flex',
                                    flexDirection: 'column', // Stack for Hindi shift/normal
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: isActive ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.4)',
                                    borderRadius: '6px',
                                    border: `1px solid ${isActive ? activeColor : 'rgba(255,255,255,0.05)'}`,
                                    boxShadow: isActive ? `0 0 15px ${activeColor}60` : 'none',
                                    color: isActive ? '#fff' : 'rgba(255,255,255,0.3)',
                                    transform: isActive ? 'scale(0.95)' : 'none',
                                    transition: 'all 0.1s',
                                    fontSize: isHindi ? '0.8rem' : '0.9rem',
                                    fontWeight: 'bold',
                                    lineHeight: '1.1'
                                }}>
                                    {showLabel ? (
                                        k.key === 'Space' || k.key.length > 1 ? k.key : (
                                            isHindi ? (
                                                <>
                                                    <span style={{ fontSize: '0.7em', color: isActive ? '#fff' : '#888' }}>{k.shiftKey}</span>
                                                    <span>{k.key}</span>
                                                </>
                                            ) : k.key
                                        )
                                    ) : ''}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Instruction Text */}
            {(!isAdvanced || isHindi) && (
                <div style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {requiresShift && (
                        <span style={{ color: '#aaa000', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ fontSize: '1.2rem' }}>⇧</span> HOLD SHIFT
                        </span>
                    )}
                    {activeChar && <span>Type <strong>{activeChar === ' ' ? 'Space' : activeChar}</strong> with {FINGER_KEY_MAP[targetFinger] ? targetFinger.replace('_', ' ') : 'Finger'}</span>}
                </div>
            )}
        </div>
    );
});

export default InstructionalUI;
