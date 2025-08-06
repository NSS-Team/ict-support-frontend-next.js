const ALLOWED_ATTACHMENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/zip',
  'application/x-7z-compressed',
  'application/x-rar-compressed',
  'application/x-tar',
  'application/x-log', // optional custom mime-type
];

export async function uploadAttachment(file: File): Promise<string> {
  console.log('[uploadAttachment] Received file:', file);

  if (!ALLOWED_ATTACHMENT_TYPES.includes(file.type)) {
    console.error('[uploadAttachment] Invalid file type:', file.type);
    throw new Error('Unsupported file type. Allowed: images, PDFs, DOCs, TXT, and log archives.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'attachments');
  formData.append('folder', 'complaints');

  console.log('[uploadAttachment] FormData entries:', Array.from(formData.entries()));

  const res = await fetch('https://api.cloudinary.com/v1_1/ddrcc3pf0/auto/upload', {
    method: 'POST',
    body: formData,
  });

  console.log('[uploadAttachment] Cloudinary response status:', res.status);

  const data = await res.json();

  console.log('[uploadAttachment] Cloudinary response data:', data);

  if (data.error) {
    console.error('[uploadAttachment] Cloudinary error:', data.error);
    throw new Error(data.error.message || 'Cloudinary upload failed');
  }

  if (!data.secure_url) {
    console.error('[uploadAttachment] No secure_url returned:', data);
    throw new Error('Cloudinary upload failed: No URL returned');
  }

  console.log('[uploadAttachment] File uploaded successfully:', data.secure_url);

  return data.secure_url as string;
}
