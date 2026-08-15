import API from './axios'

export const uploadProfileImage = async (file) => {
  if (!file) return null

  const formData = new FormData()
  formData.append('image', file)
  try{
    const response = await API.post('/auth/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
  })

    return response.data;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return null;
  }
}

export default uploadProfileImage
