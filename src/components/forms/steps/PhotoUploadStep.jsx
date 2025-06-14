import { useState, useRef } from 'react'

export default function PhotoUploadStep({ form }) {
  const { watch, setValue } = form
  const photos = watch('photos') || []
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleFiles = (files) => {
    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(file => {
      const isImage = file.type.startsWith('image/')
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit
      return isImage && isValidSize
    })

    const newPhotos = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type
    }))

    setValue('photos', [...photos, ...newPhotos])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const removePhoto = (photoId) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId)
    setValue('photos', updatedPhotos)
  }

  const capturePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      
      // Create video element to show camera feed
      const video = document.createElement('video')
      video.srcObject = stream
      video.play()
      
      // This is a simplified version - in a real app you'd want a proper camera interface
      alert('Camera functionality would be implemented here. For now, please use the file upload option.')
      
      // Stop the stream
      stream.getTracks().forEach(track => track.stop())
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Camera access is not available. Please use the file upload option.')
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Photo Documentation
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Upload photos to document the damage. Include multiple angles and close-up shots of affected areas.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 ${
          dragActive 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-indigo-600 hover:text-indigo-500">
                Click to upload
              </span>
              {' '}or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF up to 10MB each
            </p>
          </div>
        </div>
      </div>

      {/* Camera Capture Button */}
      <div className="text-center">
        <button
          type="button"
          onClick={capturePhoto}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Use Camera
        </button>
      </div>

      {/* Photo Preview Grid */}
      {photos.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Uploaded Photos ({photos.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={photo.preview}
                    alt={photo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="mt-1 text-xs text-gray-500 truncate">
                  {photo.name}
                </div>
                <div className="text-xs text-gray-400">
                  {formatFileSize(photo.size)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo Guidelines */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Photo Guidelines</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Take photos from multiple angles (wide shots and close-ups)</li>
          <li>• Ensure good lighting and focus</li>
          <li>• Include reference objects for scale when possible</li>
          <li>• Capture serial numbers, model numbers, or brand labels</li>
          <li>• Document the surrounding area to show context</li>
          <li>• Take before and after photos if applicable</li>
        </ul>
      </div>

      {photos.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            No photos uploaded yet. Photos help provide visual evidence of the damage and can speed up claim processing.
          </p>
        </div>
      )}
    </div>
  )
}