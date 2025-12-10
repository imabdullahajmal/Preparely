import dotenv from 'dotenv';
dotenv.config();

// Wrapper around Google GenAI (@google/genai) to generate quiz JSON from one prompt.
// Exports: generateQuizFromGemini({ topic, difficulty, numQuestions }) => parsed JSON quiz object

let GoogleGenAI;
try{
  // lazy require to avoid hard failure when package not installed during initial dev
  // but use ES import style for compatibility
  // eslint-disable-next-line import/no-extraneous-dependencies
  GoogleGenAI = (await import('@google/genai')).GoogleGenAI;
}catch(e){
  // If the package isn't available, we'll surface a clear error when called.
  GoogleGenAI = null;
}

const KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';

function extractFirstJson(text){
  if(!text) return null;
  // try direct parse first
  try{ return JSON.parse(text); }catch(e){}
  // attempt to find a JSON object or array in the text
  const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if(jsonMatch){
    try{ return JSON.parse(jsonMatch[0]); }catch(e){}
  }
  return null;
}

export async function generateQuizFromGemini({ topic, difficulty, numQuestions }){
  if(!GoogleGenAI) throw new Error('Gemini service requires @google/genai package to be installed');
  // instantiate client
  const ai = new GoogleGenAI({ apiKey: KEY });

  const prompt = `Generate a quiz on topic: ${topic} with difficulty: ${difficulty || 'medium'} containing ${numQuestions} multiple-choice questions.
   Respond ONLY with JSON with keys: topic, difficulty, questions where each question has prompt and choices array with text and correct boolean. No additional text.`;

  const res = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  });

  // provider may return an object with `text` or an array; normalize
  let text = '';
  if(!res) throw new Error('Empty response from Gemini');
  if(typeof res.text === 'string') text = res.text;
  else if(Array.isArray(res) && res[0] && typeof res[0].text === 'string') text = res[0].text;
  else if(res.output && Array.isArray(res.output) && res.output[0] && typeof res.output[0].contents === 'string') text = res.output[0].contents;

  const parsed = extractFirstJson(text);
  if(!parsed) throw new Error('Failed to parse JSON from Gemini response');
  return parsed;
}

export default { generateQuizFromGemini };
