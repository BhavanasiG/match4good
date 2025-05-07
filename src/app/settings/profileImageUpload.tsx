'use client';

/** @typedef {import('react').JSX} JSX */

import { useEffect, useRef, useState } from 'react';
import { upload } from '@imagekit/next';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { IconUser } from '@tabler/icons-react';

interface UploadAuthResponse {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
}

interface ProfilePictureResponse {
  profilePictureUrl: string | null;
}

/**
 * @returns {JSX.Element} Returns a JSX element containing the profile image upload component
 * @description This component allows users to upload, preview, and remove their profile images.
 * It fetches the current profile image from the server and displays it.
 * Users can select a new image, which will be uploaded to ImageKit and the URL will be saved in the database.
 * The component also provides a progress bar to indicate the upload status.
 * The component uses the `useRouter` hook from Next.js to refresh the page after a successful upload.
 */
export default function ProfileImageUpload() {
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
      <div className="space-y-5">
        <Label>Picture</Label>
        <CommonAvatar size={30} src={previewUrl} />
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

      <div className="space-x-5">
        <Button variant="destructive" onClick={handleRemove} className="cursor-pointer">
          Remove
        </Button>
        <Button onClick={handleUpload} className="cursor-pointer">
          Save
        </Button>
      </div>

      {progress > 0 && progress < 100 && <Progress value={progress} className="h-2" />}
    </div>
  );
}

/**
 *
 * @param {object} param0 - Props containing size and src
 * @param {number} param0.size - The size of the avatar
 * @param {string | null} param0.src - The source URL for the image
 * @description This component renders an avatar image with a fallback icon.
 * It uses the `Avatar`, `AvatarImage`, and `AvatarFallback` components from Radix UI.
 * The avatar displays the user's profile picture if available, or a default user icon if not.
 * The size of the avatar is determined by the `size` prop.
 * The `src` prop is used to set the image source, and if it's not provided, it fetches the current profile picture from the server.
 * @returns {JSX.Element} A user avatar image or a fallback icon if no image is available.
 */
export function CommonAvatar({ size, src }: { size: number; src?: string | null }) {
  const [pfp, setPfp] = useState<string | null>(null);

  // Fetch current profile image
  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const res = await fetch('/api/user/profile-picture', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch profile picture');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data: ProfilePictureResponse = await res.json();
        if (data.profilePictureUrl) {
          setPfp(data.profilePictureUrl);
        }
      } catch (error) {
        console.error(error);
      }
    };

    void fetchProfilePicture();
  }, []);

  return (
    <Avatar className={`bg-accent size-${size} justify-center items-center`}>
      <AvatarImage src={src ?? pfp ?? ''} className="object-cover" alt="profile picture" />
      <AvatarFallback className="size-full flex justify-center items-center">
        <IconUser className="size-3/4" />
      </AvatarFallback>
    </Avatar>
  );
}
