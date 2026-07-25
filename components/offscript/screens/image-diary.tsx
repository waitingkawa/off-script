'use client'

import { useState, useRef } from 'react'
import { Sparkle, Upload, X, Loader2, Wand2 } from 'lucide-react'
import { Pebble, Meta, PillButton } from '../primitives'
import { cn } from '@/lib/utils'

export function ImageDiary() {
  const [image, setImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      setImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleGenerate = async (action: 'generate' | 'edit') => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    
    try {
      let base64Image = undefined
      if (action === 'edit' && image) {
        base64Image = image.split(',')[1] // remove data:image/jpeg;base64,
      }

      const res = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          prompt,
          base64Image
        })
      })
      
      const data = await res.json()
      if (data.image) {
        setImage(data.image)
      } else {
        alert(data.error || 'Failed to generate image')
      }
    } catch (e) {
      console.error(e)
      alert('An error occurred while generating the image.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Pebble className="p-8 group relative flex flex-col aspect-square overflow-hidden">
      <Meta className="text-[10px] mb-5">Diary Photo</Meta>
      
      <div className="flex-1 w-full bg-surface-sunken rounded-xl border border-hairline overflow-hidden relative flex flex-col items-center justify-center">
        {image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="Diary entry" className="w-full h-full object-cover" />
            <button 
              onClick={() => setImage(null)}
              className="absolute top-3 right-3 bg-background/80 backdrop-blur p-1.5 rounded-full text-foreground/70 hover:text-foreground hover:bg-background shadow-xs transition-colors"
            >
              <X className="size-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 text-muted-foreground p-6 text-center">
            <div className="size-12 rounded-full bg-surface-raised flex items-center justify-center shadow-xs border border-hairline">
              <Upload className="size-5 text-foreground/50" />
            </div>
            <div>
              <p className="text-[14px] font-medium text-foreground/80 mb-1">Upload a photo</p>
              <p className="text-[12px]">Add a photo or cutout to your diary</p>
            </div>
            <PillButton size="sm" variant="quiet" onClick={() => fileInputRef.current?.click()}>
              Choose File
            </PillButton>
          </div>
        )}
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
        />
        
        {isGenerating && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-xs flex items-center justify-center">
            <Loader2 className="size-6 text-terracotta animate-spin" />
          </div>
        )}
      </div>

      <div className="mt-5 flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={image ? "Edit image with AI..." : "Describe an image to generate..."}
          className="flex-1 bg-surface-sunken border border-hairline rounded-full px-4 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-terracotta/50 focus:ring-1 focus:ring-terracotta/50 transition-all"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleGenerate(image ? 'edit' : 'generate')
            }
          }}
        />
        <PillButton 
          onClick={() => handleGenerate(image ? 'edit' : 'generate')}
          disabled={!prompt.trim() || isGenerating}
          className={cn("shrink-0 size-9 p-0 flex items-center justify-center", !prompt.trim() && "opacity-50")}
        >
          {image ? <Wand2 className="size-4" /> : <Sparkle className="size-4" />}
        </PillButton>
      </div>
    </Pebble>
  )
}
