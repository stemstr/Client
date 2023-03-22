interface ImageUploadResponse {
  imageUrl: string;
}

export function uploadImage(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    if (!file || !(file instanceof File)) {
      reject(new Error("Invalid file input"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string); // Resolve with the result as a string
    };
    reader.onerror = (error) => {
      reject(new Error(`Error reading file: ${error}`)); // Reject the Promise with an error message
    };
    reader.readAsDataURL(file);
  });
}
