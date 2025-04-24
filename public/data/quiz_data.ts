export interface QuizOption {
    text: string;
    correct: boolean;
}

export interface QuizSet {
    question: string;
    options: QuizOption[];
}

export type Language = 'en' | 'es';

interface QuizContent {
    en: QuizSet[];
    es: QuizSet[];
}

export const firstStageQuizSets: QuizContent = {
    en: [
        {
            question: "What is a blockchain?",
            options: [
                { text: "Type of token", correct: false },
                { text: "Trading system", correct: false },
                { text: "Shared bank", correct: true },
                { text: "Social media", correct: false },
                { text: "All of the above", correct: false }
            ]
        },
        {
            question: "What is a token?",
            options: [
                { text: "Digital property", correct: true },
                { text: "Blockchain points", correct: false },
                { text: "Physical money", correct: false },
                { text: "Trading wallet", correct: false },
                { text: "All of the above", correct: false }
            ]
        },
        {
            question: "What is a wallet?",
            options: [
                { text: "Blockchain interface app", correct: true },
                { text: "Decentralized application", correct: false },
                { text: "Trading platform", correct: false },
                { text: "Digital holdings", correct: false },
                { text: "All of the above", correct: false }
            ]
        },
        {
            question: "What is a wallet secret phrase?",
            options: [
                { text: "Bank number", correct: false },
                { text: "Wallet password", correct: true },
                { text: "Government ID", correct: false },
                { text: "Social media account", correct: false },
                { text: "All of the above", correct: false }
            ]
        },
        {
            question: "How to avoid theft?",
            options: [
                { text: "Share keys or phrase", correct: false },
                { text: "Backup seed phrase", correct: true },
                { text: "Confirm all popups", correct: false },
                { text: "Trust all links", correct: false },
                { text: "All of the above", correct: false }
            ]
        },
        {
            question: "What is blockchain gas?",
            options: [
                { text: "Transaction processing fee", correct: true },
                { text: "Bribe for trading", correct: false },
                { text: "Network computation cost", correct: true },
                { text: "Cryptocurrency mining", correct: false },
                { text: "All of the above", correct: false },
            ]
        },
        {
            question: "What is decentralization?",
            options: [
                { text: "Shared ownership", correct: false },
                { text: "Centralized control", correct: false },
                { text: "Distribution protocol", correct: true },
                { text: "Pyramid scheme", correct: false },
                { text: "All of the above", correct: false }
            ]
        }
    ],
    es: [
        {
            question: "¿Qué es una blockchain?",
            options: [
                { text: "Tipo de token", correct: false },
                { text: "Sistema de trading", correct: false },
                { text: "Banco compartido", correct: true },
                { text: "Red social", correct: false },
                { text: "Todo lo anterior", correct: false }
            ]
        },
        {
            question: "¿Qué es un token?",
            options: [
                { text: "Propiedad digital", correct: true },
                { text: "Puntos de blockchain", correct: false },
                { text: "Dinero físico", correct: false },
                { text: "Cartera de trading", correct: false },
                { text: "Todo lo anterior", correct: false }
            ]
        },
        {
            question: "¿Qué es una cartera?",
            options: [
                { text: "App de interfaz blockchain", correct: true },
                { text: "Aplicación descentralizada", correct: false },
                { text: "Plataforma de trading", correct: false },
                { text: "Tenencias digitales", correct: false },
                { text: "Todo lo anterior", correct: false }
            ]
        },
        {
            question: "¿Qué es una frase secreta de cartera?",
            options: [
                { text: "Número de banco", correct: false },
                { text: "Contraseña de cartera", correct: true },
                { text: "ID gubernamental", correct: false },
                { text: "Cuenta de red social", correct: false },
                { text: "Todo lo anterior", correct: false }
            ]
        },
        {
            question: "¿Cómo evitar el robo?",
            options: [
                { text: "Compartir claves o frase", correct: false },
                { text: "Respaldar frase semilla", correct: true },
                { text: "Confirmar todas las ventanas", correct: false },
                { text: "Confiar en todos los enlaces", correct: false },
                { text: "Todo lo anterior", correct: false }
            ]
        },
        {
            question: "¿Qué es el gas de blockchain?",
            options: [
                { text: "Tarifa de procesamiento", correct: true },
                { text: "Soborno para trading", correct: false },
                { text: "Costo de computación", correct: true },
                { text: "Minería de criptomonedas", correct: false },
                { text: "Todo lo anterior", correct: false }
            ]
        },
        {
            question: "¿Qué es la descentralización?",
            options: [
                { text: "Propiedad compartida", correct: false },
                { text: "Control centralizado", correct: false },
                { text: "Protocolo de distribución", correct: true },
                { text: "Pirámide de pirámides", correct: false },
                { text: "Todo lo anterior", correct: false }
            ]
        }
    ]
};

export const secondStageQuizSets: QuizContent = {
    en: [
        {
            question: "What is DeFi (Decentralized Finance)?",
            options: [
                { text: "Financial services on blockchain", correct: true },
                { text: "Cryptocurrency trading", correct: false },
                { text: "Peer to Peer system", correct: false },
                { text: "Digital lotteries", correct: false },
                { text: "All of the above", correct: false }
            ]
        },
        {
            question: "What is a CEX?",
            options: [
                { text: "Trading system", correct: true },
                { text: "Decentralized protocol", correct: false },
                { text: "Centralized exchange", correct: true },
                { text: "Transfer platform", correct: false },
                { text: "All of the above", correct: false }
            ]
        },
        {
            question: "What is a DEX?",
            options: [
                { text: "Decentralized exchange", correct: true },
                { text: "Trading platform", correct: true },
                { text: "Blockchain Broker", correct: false },
                { text: "Cryptocurrency wallet", correct: false },
                { text: "All of the above", correct: false }
            ]
        },
        {
            question: "What is a stablecoin?",
            options: [
                { text: "Bank cryptocurrency", correct: false },
                { text: "Fixed value token", correct: true },
                { text: "Currency on blockchain", correct: false },
                { text: "Free reward", correct: false },
                { text: "All of the above", correct: false }
            ]
        },
        {
            question: "What is staking?",
            options: [
                { text: "Network protection", correct: true },
                { text: "Rewards program", correct: true },
                { text: "Investment opportunity", correct: false },
                { text: "Referral system", correct: false },
                { text: "All of the above", correct: false }
            ]
        },
        {
            question: "What are NFTs?",
            options: [
                { text: "Digital property", correct: true },
                { text: "Physical collectibles", correct: false },
                { text: "Cryptocurrency coins", correct: false },
                { text: "Gaming software", correct: false },
                { text: "All of the above", correct: true }
            ]
        },
    ],
    es: [
        {
            question: "¿Qué es DeFi (Finanzas Descentralizadas)?",
            options: [
                { text: "Servicios financieros en blockchain", correct: true },
                { text: "Trading de criptomonedas", correct: false },
                { text: "Sistema Peer to Peer", correct: false },
                { text: "Loterías digitales", correct: false },
                { text: "Todo lo anterior", correct: false }
            ]
        },
        {
            question: "¿Qué es un CEX?",
            options: [
                { text: "Sistema de trading", correct: true },
                { text: "Protocolo descentralizado", correct: true },
                { text: "Plataforma de transferencia", correct: false },
                { text: "Todo lo anterior", correct: false }
            ]
        },
        {
            question: "¿Qué es un DEX?",
            options: [
                { text: "Exchange descentralizado", correct: true },
                { text: "Plataforma de trading", correct: true },
                { text: "Broker de blockchain", correct: false },
                { text: "Cartera de criptomonedas", correct: false },
                { text: "Todo lo anterior", correct: false }
            ]
        },
        {
            question: "¿Qué es una stablecoin?",
            options: [
                { text: "Criptomoneda bancaria", correct: false },
                { text: "Token de valor fijo", correct: true },
                { text: "Moneda en blockchain", correct: false },
                { text: "Recompensa gratuita", correct: false },
                { text: "Todo lo anterior", correct: false }
            ]
        },
        {
            question: "¿Qué es el staking?",
            options: [
                { text: "Protección de red", correct: true },
                { text: "Programa de recompensas", correct: true },
                { text: "Oportunidad de inversión", correct: false },
                { text: "Sistema de referidos", correct: false },
                { text: "Todo lo anterior", correct: false }
            ]
        },
        {
            question: "¿Qué son los NFTs?",
            options: [
                { text: "Propiedad digital", correct: true },
                { text: "Coleccionables físicos", correct: false },
                { text: "Monedas de criptomoneda", correct: false },
                { text: "Software de juegos", correct: false },
                { text: "Todo lo anterior", correct: true }
            ]
        }
    ]
};

// Quiz options for each level
// export const levelOne_quizOptions = firstStageQuizSets.en[1];
// export const levelTwo_quizOptions = firstStageQuizSets.en[2];
// export const levelThree_quizOptions = firstStageQuizSets.en[3];
// export const levelFour_quizOptions = firstStageQuizSets.en[4];
// export const levelFive_quizOptions = firstStageQuizSets.en[5];
// export const levelSix_quizOptions = firstStageQuizSets.en[6];
// export const levelSeven_quizOptions = firstStageQuizSets.en[7];
// export const levelEight_quizOptions = firstStageQuizSets.en[8]

// export const secondStage_levelZero = (language: Language = 'en'): QuizSet => secondStageQuizSets[language][0];
// export const secondStage_levelOne = (language: Language = 'en'): QuizSet => secondStageQuizSets[language][1];
// export const secondStage_levelTwo = (language: Language = 'en'): QuizSet => secondStageQuizSets[language][2];
// export const secondStage_levelThree = (language: Language = 'en'): QuizSet => secondStageQuizSets[language][3];
// export const secondStage_levelFour = (language: Language = 'en'): QuizSet => secondStageQuizSets[language][4];
// export const secondStage_levelFive = (language: Language = 'en'): QuizSet => secondStageQuizSets[language][5];
// export const secondStage_levelSix = (language: Language = 'en'): QuizSet => secondStageQuizSets[language][6];
// export const secondStage_levelSeven = (language: Language = 'en'): QuizSet => secondStageQuizSets[language][7];
// export const secondStage_levelEight = (language: Language = 'en'): QuizSet => secondStageQuizSets[language][8];

export const thirdStageQuizSets: QuizContent = {
    en: [
        {
            question: "What is a portfolio?",
            options: [
                { text: "Token collection", correct: true },
                { text: "Lending platform", correct: true },
                { text: "Investment tracker", correct: false },
                { text: "Wallet utility", correct: false },
                { text: "All of the above", correct: false }
            ]
        },
        {
                question: "What is an airdrop?",
            options: [
                { text: "Token gift distribution", correct: true },
                { text: "Blockchain transaction", correct: false },
                { text: "Token giveaway", correct: true },
                { text: "All of the above", correct: false }
            ]
        },
        {
            question: "What is a market cap?",
            options: [
                { text: "Total project value", correct: true },
                { text: "Price indicator", correct: false },
                { text: "Supply and demand", correct: false },
                { text: "Token utility", correct: false },
                { text: "All of the above", correct: false }
            ]
        },
        {
            question: "Which one is self custody?",
            options: [
                { text: "Blockchain wallet", correct: true },
                { text: "Multi-signature smart contract", correct: true },
                { text: "Centralized exchange wallet", correct: false},
                { text: "Cold storage", correct: true},
                { text: "All of the above", correct: false }
            ]
        },
        {
            question: "What is a node?",
            options: [
                { text: "Blockchain computer", correct: true },
                { text: "Token validator", correct: false },
                { text: "Permission gateway", correct: false},
                { text: "Investor", correct: false},
                { text: "All of the above", correct: false }
            ]
        },
        {
            question: "Are transactions reversible?",
            options: [
                { text: "Yes, sometimes", correct: false },
                { text: "Yes, always", correct: false },
                { text: "Contacting support", correct: false },
                { text: "No, never", correct: true },
                { text: "All of the above", correct: false }
            ]
        }
    ],
    es: [   
        {
            question: "¿Qué es un portfolio?",
            options: [
                { text: "Colección de tokens", correct: true },
                { text: "Plataforma de préstamos", correct: true },
                { text: "Seguimiento de inversiones", correct: false },
                { text: "Utilidad de cartera", correct: false },
                { text: "Todo lo anterior", correct: false }
            ]
        },
        {
            question: "¿Qué es un airdrop?",
            options: [
                { text: "Distribución de tokens gratuita", correct: true },
                { text: "Transacción de blockchain", correct: false },
                { text: "Sorteo de tokens", correct: true },
                { text: "Todo lo anterior", correct: false }
            ]
        },
        {
            question: "¿Qué es un market cap?",
            options: [
                { text: "Valor total del proyecto", correct: true },
                { text: "Indicador de precio", correct: false },
                { text: "Oferta y demanda", correct: false },
                { text: "Utilidad del token", correct: false },
                { text: "Todo lo anterior", correct: false }
            ]
        },
        {
            question: "Cual es auto custodio?",
            options: [
                { text: "Cartera de CEX", correct: true },
                { text: "Contrato inteligente de firma múltiple", correct: false},
                { text: "Capas de terceros", correct: false},
                { text: "Almacenamiento frío", correct: true},
                { text: "Todo lo anterior", correct: false}
            ]
        },
        {
            question: "¿Qué es un nodo?",
            options: [
                { text: "Computadora de blockchain", correct: true },
                { text: "Validador de tokens", correct: false },
                { text: "Puerta de entrada de permisos", correct: false},
                { text: "Inversor", correct: false},
                { text: "Todo lo anterior", correct: false }
            ]
        },
        {
            question: "¿Son las transacciones reversibles?",
            options: [
                { text: "Sí, a veces", correct: false },
                { text: "Sí, siempre", correct: false },
                { text: "Contactando al soporte", correct: false },
                { text: "No, nunca", correct: true },
                { text: "Todo lo anterior", correct: false }
            ]
        }
    ]
}
    export const old_thirdStageQuizSets: QuizContent = {
    en: [
        {
            question: "What is a zero-knowledge proof?",
            options: [
                { text: "Cryptographic verification method", correct: true },
                { text: "Proof without revealing data", correct: true },
                { text: "Empty blockchain block", correct: false },
                { text: "Type of private key", correct: false },
                { text: "All of the above", correct: false }
            ]
        },
        {
            question: "What is MEV (Maximal Extractable Value)?",
            options: [
                { text: "Block ordering profit", correct: true },
                { text: "Mining reward", correct: false },
                { text: "Transaction frontrunning", correct: true },
                { text: "Network fee", correct: false },
                { text: "All of the above", correct: false }
            ]
        },
        {
            question: "What is a rollup?",
            options: [
                { text: "Layer 2 scaling solution", correct: true },
                { text: "Transaction bundling", correct: true },
                { text: "Smart contract collection", correct: false },
                { text: "Blockchain merger", correct: false },
                { text: "All of the above", correct: false }
            ]
        },
        {
            question: "What is composability in DeFi?",
            options: [
                { text: "Protocol interoperability", correct: true },
                { text: "Smart contract linking", correct: true },
                { text: "Money Lego building", correct: true },
                { text: "Token creation", correct: false },
                { text: "All of the above", correct: true }
            ]
        },
        {
            question: "What is a flash loan?",
            options: [
                { text: "Uncollateralized loan", correct: true },
                { text: "Single-transaction loan", correct: true },
                { text: "Instant approval loan", correct: false },
                { text: "Long-term loan", correct: false },
                { text: "All of the above", correct: false }
            ]
        },
        {
            question: "What is a sidechain?",
            options: [
                { text: "Independent blockchain", correct: true },
                { text: "Connected to mainnet", correct: true },
                { text: "Alternative consensus", correct: true },
                { text: "Backup network", correct: false },
                { text: "All of the above", correct: false }
            ]
        },
        {
            question: "What is account abstraction?",
            options: [
                { text: "Smart contract wallets", correct: true },
                { text: "Simplified user experience", correct: true },
                { text: "Custom transaction logic", correct: true },
                { text: "Account privacy", correct: false },
                { text: "All of the above", correct: false }
            ]
        },
        {
            question: "What is a state channel?",
            options: [
                { text: "Off-chain transactions", correct: true },
                { text: "Direct participant link", correct: true },
                { text: "Reduced gas fees", correct: true },
                { text: "Network partition", correct: false },
                { text: "All of the above", correct: false }
            ]
        },
        {
            question: "What is a recursive zero-knowledge proof?",
            options: [
                { text: "Proof verifying proofs", correct: true },
                { text: "Scalability solution", correct: true },
                { text: "Complex computation proof", correct: true },
                { text: "Transaction privacy", correct: false },
                { text: "All of the above", correct: false }
            ]
        }
    ],
    es: [
        {
            question: "¿Qué es una prueba de conocimiento cero?",
            options: [
                { text: "Método de verificación criptográfica", correct: true },
                { text: "Prueba sin revelar datos", correct: true },
                { text: "Bloque blockchain vacío", correct: false },
                { text: "Tipo de clave privada", correct: false },
                { text: "Todo lo anterior", correct: false }
            ]
        },
        {
            question: "¿Qué es MEV (Valor Máximo Extraíble)?",
            options: [
                { text: "Beneficio de ordenación de bloques", correct: true },
                { text: "Recompensa de minería", correct: false },
                { text: "Robo de transacción frontal", correct: true },
                { text: "Comisión de red", correct: false },
                { text: "Todo lo anterior", correct: false }
            ]
        },
        {
            question: "¿Qué es un rollup?",
            options: [
                { text: "Solución de escalabilidad de Capa 2", correct: true },
                { text: "Empaquetado de transacciones", correct: true },
                { text: "Colección de contratos inteligentes", correct: false },
                { text: "Unión de blockchain", correct: false },
                { text: "Todo lo anterior", correct: false }
            ]
        },
        {
            question: "¿Qué es la composabilidad en DeFi?",
            options: [
                { text: "Interoperabilidad de protocolo", correct: true },
                { text: "Vinculación de contratos inteligentes", correct: true },
                { text: "Construcción de Lego con dinero", correct: true },
                { text: "Creación de tokens", correct: false },
                { text: "Todo lo anterior", correct: true }
            ]
        },
        {
            question: "¿Qué es un préstamo flash?",
            options: [
                { text: "Préstamo no garantizado", correct: true },
                { text: "Préstamo de una sola transacción", correct: true },
                { text: "Préstamo de aprobación instantánea", correct: false },
                { text: "Préstamo a largo plazo", correct: false },
                { text: "Todo lo anterior", correct: false }
            ]
        },
        {
            question: "¿Qué es una sidechain?",
            options: [
                { text: "Blockchain independiente", correct: true },
                { text: "Conectado a la mainnet", correct: true },
                { text: "Consenso alternativo", correct: true },
                { text: "Red de respaldo", correct: false },
                { text: "Todo lo anterior", correct: false }
            ]
        },
        {
            question: "¿Qué es la abstracción de cuenta?",
            options: [
                { text: "Carteras de contrato inteligente", correct: true },
                { text: "Experiencia de usuario simplificada", correct: true },
                { text: "Lógica de transacción personalizada", correct: true },
                { text: "Privacidad de la cuenta", correct: false },
                { text: "Todo lo anterior", correct: false }
            ]
        },
        {
            question: "¿Qué es un canal de estado?",
            options: [
                { text: "Transacciones off-chain", correct: true },
                { text: "Vínculo directo de participante", correct: true },
                { text: "Bajas tarifas de gas", correct: true },
                { text: "Partición de red", correct: false },
                { text: "Todo lo anterior", correct: false }
            ]
        },
        {
            question: "¿Qué es una prueba de conocimiento cero recursiva?",
            options: [
                { text: "Prueba verificando pruebas", correct: true },
                { text: "Solución de escalabilidad", correct: true },
                { text: "Prueba de cómputo complejo", correct: true },
                { text: "Privacidad de transacción", correct: false },
                { text: "Todo lo anterior", correct: false }
            ]
        }
    ]
};

// Add these exports
export const thirdStage_levelZero = (language: Language = 'en'): QuizSet => thirdStageQuizSets[language][0];
export const thirdStage_levelOne = (language: Language = 'en'): QuizSet => thirdStageQuizSets[language][1];
export const thirdStage_levelTwo = (language: Language = 'en'): QuizSet => thirdStageQuizSets[language][2];
export const thirdStage_levelThree = (language: Language = 'en'): QuizSet => thirdStageQuizSets[language][3];
export const thirdStage_levelFour = (language: Language = 'en'): QuizSet => thirdStageQuizSets[language][4];
export const thirdStage_levelFive = (language: Language = 'en'): QuizSet => thirdStageQuizSets[language][5];
export const thirdStage_levelSix = (language: Language = 'en'): QuizSet => thirdStageQuizSets[language][6];
export const thirdStage_levelSeven = (language: Language = 'en'): QuizSet => thirdStageQuizSets[language][7];
export const thirdStage_levelEight = (language: Language = 'en'): QuizSet => thirdStageQuizSets[language][8];

export const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    
    // Find "All of the above" option if it exists
    const allOfAboveIndex = shuffled.findIndex((item: any) => 
        item.text?.toLowerCase().includes("all") && 
        (item.text?.toLowerCase().includes("option") || (item.text?.toLowerCase().includes("above") || item.text?.toLowerCase().includes("anterior")))
    );

    if (allOfAboveIndex !== -1) {
        // Remove "All of the above" and store it
        const allOfAbove = shuffled.splice(allOfAboveIndex, 1)[0];
        
        // Shuffle remaining items
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        // Add "All of the above" back at the end
        shuffled.push(allOfAbove);
    } else {
        // Regular shuffle if no "All of the above" option
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
    }
    
    return shuffled;
};

export const getQuizByIndex = (index: number, language: Language = 'en'): QuizSet => {
    const quizzes = firstStageQuizSets[language];
    return quizzes[index % quizzes.length];
};

// Helper to get quiz options by level name
export const getQuizByLevel = (level: string, language: Language = 'en'): QuizSet => {
    const quizzes = firstStageQuizSets[language];
    switch(level) {
        case "zero": return quizzes[0];
        case "one": return quizzes[1];
        case "two": return quizzes[2];
        case "three": return quizzes[3];
        case "four": return quizzes[4];
        case "five": return quizzes[5];
        case "six": return quizzes[6];
        // case "seven": return quizzes[7];
        default: return quizzes[0];
    }
};

export const verifyLevelProgression = () => {
    const level1Time = parseInt(localStorage.getItem('level1_completion') || '0');
    const level2Time = parseInt(localStorage.getItem('level2_completion') || '0');
    const level3Time = parseInt(localStorage.getItem('level3_completion') || '0');
    const level4Time = parseInt(localStorage.getItem('level4_completion') || '0');
    const level5Time = parseInt(localStorage.getItem('level5_completion') || '0');
    const level6Time = parseInt(localStorage.getItem('level6_completion') || '0');
    // const level7Time = parseInt(localStorage.getItem('level7_completion') || '0');
    // const level8Time = parseInt(localStorage.getItem('level8_completion') || '0');

    // Verify timestamps are in chronological order
    if (level1Time === 0 || level2Time === 0 || level3Time === 0 || 
        level4Time === 0 || level5Time === 0 || level6Time === 0
        // || level7Time === 0 || level8Time === 0
    ) {
        return false;
    }

    return (
        level1Time < level2Time &&
        level2Time < level3Time &&
        level3Time < level4Time &&
        level4Time < level5Time &&
        level5Time < level6Time
        // && level6Time < level7Time &&
        // level7Time < level8Time
    );
}; 