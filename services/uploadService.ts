export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Upload failed");
  }

  const data = await response.json();
  return data.url;
};

export const deleteImageFromCloudinary = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/images", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Delete failed");
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Delete image error:", error);
    return false;
  }
};

export const fetchCloudinaryImages = async (): Promise<string[]> => {
  try {
    const response = await fetch("/api/images");
    if (!response.ok) throw new Error("Failed to fetch gallery");
    const data = await response.json();
    return data.images || [];
  } catch (error) {
    console.error("Gallery fetch error:", error);
    return [];
  }
};

export const checkSystemHealth = async (): Promise<{ cloudinary: boolean, mode: 'full' | 'basic' }> => {
  try {
    const response = await fetch("/api/health");
    if (!response.ok) return { cloudinary: false, mode: 'basic' };
    return await response.json();
  } catch (error) {
    return { cloudinary: false, mode: 'basic' };
  }
};
