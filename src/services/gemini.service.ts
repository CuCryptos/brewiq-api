import { GoogleGenAI } from '@google/genai';
import { config } from '../config/index.js';
import { uploadService } from './upload.service.js';
import { logger } from '../utils/logger.js';

function getClient(): GoogleGenAI {
  if (!config.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  return new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });
}

export const geminiService = {
  async generateReviewImage(
    beerName: string,
    style: string,
    rating: number,
    flavorTags: string[],
  ): Promise<string> {
    const ai = getClient();

    const flavorDesc = flavorTags.length > 0 ? flavorTags.join(', ') : 'classic';
    const moodMap: Record<string, string> = {
      high: 'warm golden lighting, inviting atmosphere',
      mid: 'natural daylight, casual setting',
      low: 'moody dim lighting, rustic bar setting',
    };
    const mood = rating >= 4 ? moodMap.high : rating >= 2.5 ? moodMap.mid : moodMap.low;

    const prompt = `Generate a beautiful, photo-realistic image of a ${style} beer called "${beerName}". The beer should be poured in an appropriate glass for the style, showcasing its color and head. The flavor profile includes ${flavorDesc}. Setting: ${mood}. No text or labels in the image.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      const parts = response.candidates?.[0]?.content?.parts;
      if (!parts) {
        throw new Error('No content in Gemini response');
      }

      const imagePart = parts.find((p: any) => p.inlineData?.mimeType?.startsWith('image/'));
      if (!imagePart?.inlineData?.data) {
        throw new Error('No image data in Gemini response');
      }

      const uploaded = await uploadService.uploadImage(
        imagePart.inlineData.data,
        'brewiq/review-images',
      );

      return uploaded.url;
    } catch (error) {
      logger.error('Gemini review image generation error:', error);
      throw error;
    }
  },

  async generateAvatar(prompt: string): Promise<string> {
    const ai = getClient();

    const safePrompt = `Generate a stylized avatar illustration: ${prompt}. The style should be a clean, modern digital art portrait suitable for a profile picture. No text. Square composition.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ role: 'user', parts: [{ text: safePrompt }] }],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      const parts = response.candidates?.[0]?.content?.parts;
      if (!parts) {
        throw new Error('No content in Gemini response');
      }

      const imagePart = parts.find((p: any) => p.inlineData?.mimeType?.startsWith('image/'));
      if (!imagePart?.inlineData?.data) {
        throw new Error('No image data in Gemini response');
      }

      const uploaded = await uploadService.uploadImage(
        imagePart.inlineData.data,
        'brewiq/avatars',
      );

      return uploaded.url;
    } catch (error) {
      logger.error('Gemini avatar generation error:', error);
      throw error;
    }
  },
};
