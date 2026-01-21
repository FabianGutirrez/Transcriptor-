import { SYSTEM_INSTRUCTION, USER_PROMPT } from '../constants';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64String = result.split(',')[1];
      if (base64String) {
        resolve(base64String);
      } else {
        reject(new Error("Failed to read file as base64."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

const parseTranscriptionResponse = (text: string) => {
    const fielMatch = text.match(/Transcripción Fiel:([\s\S]*?)(\n\nNotas de Observación:|$)/i);
    const notasMatch = text.match(/Notas de Observación:([\s\S]*)/i);

    const transcription = fielMatch ? fielMatch[1].trim() : "No se pudo extraer la transcripción. Respuesta completa:\n" + text;
    const notes = notasMatch ? notasMatch[1].trim() : "No se pudieron extraer las notas.";

    return { transcription, notes };
};

export const transcribeMedia = async (mediaFile: File) => {
  try {
    const base64Media = await fileToBase64(mediaFile);

    // LLAMADA AL BACKEND PROXY (Vercel API)
    const response = await fetch('/api/transcribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audioData: base64Media,
        mimeType: mediaFile.type,
        // Enviamos las instrucciones para que el backend las use
        systemInstruction: SYSTEM_INSTRUCTION,
        userPrompt: USER_PROMPT
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en la respuesta del servidor');
    }

    const data = await response.json();

    if (!data.text) {
        throw new Error('La respuesta no contiene texto.');
    }

    return parseTranscriptionResponse(data.text);

  } catch (error) {
    console.error("Error en el servicio de transcripción:", error);
    throw new Error('No se pudo comunicar con el servicio. Inténtalo de nuevo más tarde.');
  }
};