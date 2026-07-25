import { GoogleGenAI, RawReferenceImage } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'fake' });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, action, base64Image, mimeType } = body;
    
    if (action === 'generate') {
      const response = await ai.models.generateImages({
        model: 'gemini-3.1-flash-image-preview',
        prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
      });
      
      const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
      if (!imageBytes) {
        throw new Error('No image generated');
      }
      
      return NextResponse.json({ image: `data:image/jpeg;base64,${imageBytes}` });
    }
    
    if (action === 'edit') {
      const refImage = new RawReferenceImage();
      refImage.referenceImage = { imageBytes: base64Image };

      const response = await ai.models.editImage({
        model: 'gemini-3.1-flash-image-preview',
        prompt,
        referenceImages: [refImage],
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
        },
      });
      
      const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
      if (!imageBytes) {
        throw new Error('No image generated');
      }
      
      return NextResponse.json({ image: `data:image/jpeg;base64,${imageBytes}` });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Image generation error:', error);
    return NextResponse.json({ error: error.message || 'Error generating image' }, { status: 500 });
  }
}
