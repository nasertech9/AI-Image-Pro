import { GoogleGenAI } from "@google/genai";

export async function generateImage(prompt: string): Promise<string> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("No image was generated. The prompt may have been blocked.");
    }
    
    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;

  } catch (error) {
    console.error("Error generating image with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
}

export async function generateVideo(prompt: string, onStatusUpdate: (message: string) => void): Promise<string> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set. Please select a key for video generation.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    onStatusUpdate("Starting video generation...");
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9',
      }
    });

    onStatusUpdate("Processing request... This may take a few minutes.");
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      onStatusUpdate("Polling for video status...");
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
        throw new Error("Video generation finished, but no download link was found.");
    }
    
    onStatusUpdate("Fetching generated video...");
    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) {
        throw new Error(`Failed to fetch video data: ${videoResponse.statusText}`);
    }

    const videoBlob = await videoResponse.blob();
    const videoUrl = URL.createObjectURL(videoBlob);
    
    return videoUrl;

  } catch (error) {
    console.error("Error generating video with Gemini API:", error);
    
    // The error from the API can be an object or an Error instance.
    // Normalize it to a string to reliably check its contents.
    const errorContent = (error instanceof Error) ? error.message : JSON.stringify(error);

    if (errorContent.includes("Requested entity was not found")) {
        throw new Error("API key is invalid or missing permissions. Please select a valid key.");
    }
    
    // For other errors, re-throw with a generic prefix.
    if (error instanceof Error) {
        throw new Error(`Failed to generate video: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the video.");
  }
}