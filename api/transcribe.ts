import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: any, res: any) {
  // 1. Forzar método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const apiKey = process.env.GEMINI_API_KEY; 
  
  if (!apiKey) {
    return res.status(500).json({ error: "API Key no configurada en el servidor" });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // Usamos flash para mayor velocidad y menor costo
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { audioData, mimeType } = req.body; 

    if (!audioData || !mimeType) {
      return res.status(400).json({ error: "Faltan datos de audio o tipo de archivo" });
    }

    const result = await model.generateContent([
      {
        inlineData: {
          data: audioData,
          mimeType: mimeType
        }
      },
      "Transcribe este audio detalladamente para un informe fonoaudiológico. " + 
      "IMPORTANTE: Responde ÚNICAMENTE en formato JSON con dos campos: 'transcription' (el texto) y 'notes' (observaciones)."
    ]);

    const response = await result.response;
    const responseText = response.text();

    // Intentamos limpiar la respuesta por si la IA añade markdown (```json ...)
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    
    try {
      const parsed = JSON.parse(cleanJson);
      return res.status(200).json(parsed);
    } catch {
      // Si falla el parseo, enviamos el texto plano en el formato esperado
      return res.status(200).json({ 
        transcription: responseText, 
        notes: "Transcripción generada sin notas adicionales." 
      });
    }

  } catch (error: any) {
    console.error("Error en Gemini:", error);
    return res.status(500).json({ error: error.message || "Error al procesar con Gemini" });
  }
}