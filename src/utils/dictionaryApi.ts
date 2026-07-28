import { supabase } from '../lib/supabase';

interface DictionaryApiResponse {
  word: string;
  phonetics: {
    text?: string;
    audio?: string;
  }[];
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
    }[];
  }[];
}

export async function fetchWordData(word: string) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`);
    
    if (!response.ok) {
      console.warn(`Word not found in dictionary API: ${word}`);
      return null;
    }

    const data: DictionaryApiResponse[] = await response.json();
    if (!data || data.length === 0) return null;

    const entry = data[0];
    
    // Find best phonetics (preferably with audio)
    let bestPhoneticText = '';
    let bestAudioUrl = '';
    
    for (const p of entry.phonetics) {
      if (p.text && !bestPhoneticText) bestPhoneticText = p.text;
      if (p.audio && !bestAudioUrl) {
        bestAudioUrl = p.audio;
        if (p.text) bestPhoneticText = p.text; // Audio and text from same source is best
      }
    }

    // Find first meaning
    const meaning = entry.meanings[0];
    const pos = meaning ? `(${meaning.partOfSpeech.substring(0, 3).toLowerCase()})` : '';
    
    // Find first example
    let exampleEn = '';
    if (meaning) {
      for (const def of meaning.definitions) {
        if (def.example) {
          exampleEn = def.example;
          break;
        }
      }
    }

    return {
      phonetics: bestPhoneticText || null,
      audioUrl: bestAudioUrl || null,
      pos: pos || null,
      exampleEn: exampleEn || null
    };
  } catch (error) {
    console.error("Dictionary API Error:", error);
    return null;
  }
}

// Function to auto-enrich a word in the database
export async function autoEnrichWord(wordId: string, wordText: string) {
  const apiData = await fetchWordData(wordText);
  if (!apiData) return false;

  // We only update if we got useful data
  const updates: any = {};
  if (apiData.phonetics) updates.phonetics = apiData.phonetics;
  if (apiData.audioUrl) updates.audio_url = apiData.audioUrl;
  if (apiData.pos) updates.part_of_speech = apiData.pos;
  if (apiData.exampleEn) updates.example_en = apiData.exampleEn;

  if (Object.keys(updates).length > 0) {
    await supabase.from('vocabulary').update(updates).eq('id', wordId);
    return updates; // Return the new data to update UI instantly
  }
  return false;
}
