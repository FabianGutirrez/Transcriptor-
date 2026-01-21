import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = {
  runtime: 'edge', // Esto hace que la respuesta sea más rápida
};

export default async function handler(req: Request) {
  // Vercel leerá GEMINI_API_KEY desde su panel de control (Environment Variables)
  const apiKey = process.env.GEMINI_API_KEY; 
  
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API Key no configurada en el servidor" }), { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { audioData, mimeType } = await req.json();

    const result = await model.generateContent([
      {
        inlineData: {
          data: audioData,
          mimeType: mimeType
        }
      },
      "Transcribe este audio detalladamente para un informe fonoaudiológico."
    ]);

    return new Response(JSON.stringify({ text: result.response.text() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error al procesar con Gemini" }), { status: 500 });
  }
}