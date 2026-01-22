import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. Forzar método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const apiKey = process.env.GEMINI_API_KEY; 
  
  if (!apiKey) {
    return res.status(500).json({ error: "API Key no configurada en el servidor" });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { audioData, mimeType } = req.body; 

    const result = await model.generateContent([
      {
        inlineData: {
          data: audioData,
          mimeType: mimeType
        }
      },
      "Transcribe este audio detalladamente para un informe fonoaudiológico."
    ]);

    const response = await result.response;
    return res.status(200).json({ text: response.text() });

  } catch (error) {
    console.error("Error en Gemini:", error);
    return res.status(500).json({ error: "Error al procesar con Gemini" });
  }
}