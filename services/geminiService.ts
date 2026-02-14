const MOCK_COMPLIMENTS = [
    "Tu risa es la melodía que le faltaba al mundo.",
    "En el arte de existir, tú eres la obra maestra.",
    "Eres ese instante perfecto que el tiempo desearía detener para siempre.",
    "Contigo, cada momento se convierte en un recuerdo imborrable.",
    "Tienes la extraña habilidad de hacer florecer sonrisas donde antes no había nada."
];
let mockIndex = 0;

export const generateCompliment = async (name: string): Promise<string> => {
    mockIndex = (mockIndex + 1) % MOCK_COMPLIMENTS.length;
    return MOCK_COMPLIMENTS[mockIndex];
};
