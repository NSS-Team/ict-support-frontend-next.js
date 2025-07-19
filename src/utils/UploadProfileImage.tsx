const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

export async function uploadProfileImage(file: File): Promise<string> {
  console.log('[uploadProfileImage] Received file:', file);

  // Check if file is an allowed image type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    console.error('[uploadProfileImage] Invalid file type:', file.type);
    throw new Error('Only image files (jpg, jpeg, png, webp) are allowed.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'frontend');
  formData.append('folder', 'profile_pictures');

  console.log('[uploadProfileImage] FormData entries:', Array.from(formData.entries()));

  const res = await fetch('https://api.cloudinary.com/v1_1/ddrcc3pf0/image/upload', {
    method: 'POST',
    body: formData,
  });

  console.log('[uploadProfileImage] Cloudinary response status:', res.status);

  const data = await res.json();

  console.log('[uploadProfileImage] Cloudinary response data:', data);

  if (data.error) {
    console.error('[uploadProfileImage] Cloudinary error:', data.error);
    throw new Error(data.error.message || 'Cloudinary upload failed');
  }

  if (!data.secure_url) {
    console.error('[uploadProfileImage] No secure_url returned:', data);
    throw new Error('Cloudinary upload failed: No URL returned');
  }

  console.log('[uploadProfileImage] Image uploaded successfully:', data.secure_url);

  return data.secure_url as string;
}