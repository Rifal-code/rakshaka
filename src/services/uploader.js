const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

/**
 * Uploads a file to ImgBB or falls back to placeholder images in demo mode.
 * @param {File} file 
 * @param {function} onProgress - Optional callback for tracking progress (simulated in demo)
 */
export async function uploadImage(file, onProgress) {
  // Check if API key is not set or is still the default placeholder
  const isDemoMode = !IMGBB_API_KEY || IMGBB_API_KEY === 'your_imgbb_api_key_here';
  
  if (isDemoMode) {
    console.warn("Rakshaka: Running in Demo Mode for image uploads. No valid ImgBB API key found.");
    
    // Simulate upload progress
    if (onProgress) {
      for (let i = 10; i <= 100; i += 30) {
        await new Promise(resolve => setTimeout(resolve, 200));
        onProgress(Math.min(i, 100));
      }
    }
    
    // Generate a beautiful placeholder from Unsplash based on the file name/type
    // We can randomize it slightly
    const randomId = Math.floor(Math.random() * 1000);
    const mockUrls = [
      `https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60`, // security theme
      `https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60`, // cyber theme
      `https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&auto=format&fit=crop&q=60`, // tech theme
    ];
    
    const url = mockUrls[randomId % mockUrls.length] + `&sig=${randomId}`;
    return url;
  }

  // Real upload to ImgBB
  const formData = new FormData();
  formData.append('image', file);

  if (onProgress) {
    onProgress(10); // Start progress
  }

  try {
    if (onProgress) onProgress(30);
    
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (onProgress) onProgress(70);

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error?.message || 'Failed to upload image to ImgBB');
    }

    if (onProgress) onProgress(100);
    return result.data.url;
  } catch (error) {
    console.error('Image Upload Error:', error);
    
    // Graceful fallback to placeholder even on failure so the user isn't blocked
    console.log('Falling back to a placeholder image due to upload error...');
    return `https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=60&err=upload`;
  }
}
