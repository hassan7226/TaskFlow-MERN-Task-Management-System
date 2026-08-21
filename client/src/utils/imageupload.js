import API from './axios'

export const uploadProfileImage = async (file) => {
  if (!file) return null

  const formData = new FormData()
  formData.append('image', file)
  try{
    const response = await API.post('/api/auth/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
  })

    console.log('Profile image upload response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    console.error('Error response:', error.response?.data);
    return null;
  }
}

export const uploadTaskAttachment = async (file) => {
  if (!file) return null

  const formData = new FormData()
  formData.append('file', file)
  try{
    const response = await API.post('/api/tasks/upload-attachment', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
  })

    return response.data;
  } catch (error) {
    console.error('Error uploading task attachment:', error);
    return null;
  }
}

export default uploadProfileImage
