import React, { useRef, useState, useEffect } from 'react'
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu'

const ProfilePhotoSelecter = ({ image, setImage, size = 96, className = '' }) => {
    const inputRef = useRef(null)
    const [previewUrl, setPreviewUrl] = useState(() => {
        if (!image) return null
        return typeof image === 'string' ? image : URL.createObjectURL(image)
    })
    const objectUrlRef = useRef(null)

    useEffect(() => {
        if (!image) {
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current)
                objectUrlRef.current = null
            }
            setPreviewUrl(null)
            return
        }

        if (typeof image === 'string') {
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current)
                objectUrlRef.current = null
            }
            setPreviewUrl(image)
            return
        }

        const url = URL.createObjectURL(image)
        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = url
        setPreviewUrl(url)

        return () => {
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current)
                objectUrlRef.current = null
            }
        }
    }, [image])

    useEffect(() => {
        return () => {
            if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
        }
    }, [])

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null
        if (!file) return
        setImage(file)
    }

    const handleRemove = () => {
        setImage(null)
        if (inputRef.current) inputRef.current.value = ''
    }

    const onChoose = () => inputRef.current && inputRef.current.click()

    return (
        <div className={`flex flex-col items-center gap-2 ${className}`}>
            <div
                style={{ width: size, height: size }}
                className="rounded-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-slate-300 flex items-center justify-center shadow-md hover:shadow-xl hover:border-primary/50 transition-all duration-300 group"
            >
                {previewUrl ? (
                    <img src={previewUrl} alt="Profile preview" className="object-cover w-full h-full" />
                ) : (
                    <LuUser size={Math.round(size * 0.5)} className="text-slate-400 group-hover:text-primary/70 transition-colors" />
                )}
            </div>

            <div className="flex items-center gap-2">
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <button type="button" className="text-xs font-medium text-primary hover:text-primary-dark flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-primary/10 transition-all duration-200" onClick={onChoose}>
                    <LuUpload size={14} />
                    <span>Choose</span>
                </button>
                {previewUrl && (
                    <button type="button" className="text-xs font-medium text-red-500 hover:text-red-600 flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-all duration-200" onClick={handleRemove}>
                        <LuTrash size={14} />
                        <span>Remove</span>
                    </button>
                )}
            </div>
        </div>
    )
}

export default ProfilePhotoSelecter