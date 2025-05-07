'use client';

import { useEffect, useRef, useState } from 'react';
import { upload } from '@imagekit/next';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';

interface UploadAuthResponse {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
}

interface ProfilePictureResponse {
  profilePictureUrl: string | null;
}

// interface UploadResponse {
//   url: string;
//   fileId: string;
//   name: string;
//   size: number;
//   type: string;
//   height?: number;
//   width?: number;
// }

// eslint-disable-next-line @typescript-eslint/naming-convention
const ProfileImageUpload = () => {
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Fetch current profile image
  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const res = await fetch('/api/user/profile-picture', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch profile picture');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data: ProfilePictureResponse = await res.json();
        if (data.profilePictureUrl) {
          setPreviewUrl(data.profilePictureUrl);
        }
      } catch (error) {
        console.error(error);
      }
    };

    void fetchProfilePicture();
  }, []);

  // Handle file upload
  const handleUpload = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput?.files?.length) {
      alert('Please select a file');
      return;
    }

    const file = fileInput.files[0];

    const authRes = await fetch('/api/upload-auth');
    const authData = (await authRes.json()) as UploadAuthResponse;

    const uploadResponse = await upload({
      file,
      fileName: file.name,
      ...authData,
      onProgress: (event: ProgressEvent) => setProgress((event.loaded / event.total) * 100),
    });

    const updateRes = await fetch('/api/user/profile-picture', {
      method: 'PUT',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: uploadResponse.url, fileId: uploadResponse.fileId }),
    });

    if (!updateRes.ok) {
      console.error('Failed to update profile picture in DB');
    } else {
      setPreviewUrl(uploadResponse.url ?? null);
      router.refresh(); // Refresh UI to show updated profile
    }
  };

  // Handle file removal
  const handleRemove = async () => {
    try {
      const res = await fetch('/api/user/profile-picture', {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to remove profile picture');

      setPreviewUrl(null);
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="space-y-2">
        <Label>Profile Picture</Label>
        <div className="flex items-center gap-4">
          <input
            id="profile-picture"
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={() => {
              const file = fileInputRef.current?.files?.[0];
              if (file) {
                setPreviewUrl(URL.createObjectURL(file));
              }
            }}
          />
          <Button type="button" onClick={() => fileInputRef.current?.click()} variant="secondary">
            Choose Image
          </Button>
          <span className="text-sm text-muted-foreground">
            {fileInputRef.current?.files?.[0]?.name ?? 'No file selected'}
          </span>
        </div>
      </div>

      <Button onClick={handleUpload}>Save</Button>
      {progress > 0 && <Progress value={progress} className="h-2" />}
      {previewUrl && (
        <div className="pt-4">
          <p className="text-sm text-muted-foreground mb-2">Current:</p>
          <div className="flex items-center gap-4">
            <Image
              src={previewUrl}
              alt="Profile Preview"
              width={128}
              height={128}
              className="w-32 h-32 rounded-full object-cover border shadow-sm"
            />
            <Button variant="destructive" onClick={handleRemove}>
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileImageUpload;
