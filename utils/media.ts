import axios from "axios";

interface ImageUploadResponse {
  imageUrl: string;
}

export function uploadImage(file: File): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    if (!file || !(file instanceof File)) {
      reject(new Error("Invalid file input"));
      return;
    }
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "https://nostrimg.com/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        resolve(response.data.data.link);
      } else {
        reject(new Error(response.data.message));
      }
    } catch (error) {
      reject(error);
    }
  });
}

export const acceptedMimeTypes: string[] = [
  "audio/aiff",
  "audio/m4a",
  "audio/mp3",
  "audio/mp4",
  "audio/mpeg",
  "audio/mpeg3",
  "audio/ogg",
  "audio/wav",
  "audio/wave",
  "audio/x-aiff",
  "audio/x-mpeg-3",
  "audio/x-wav",
];
