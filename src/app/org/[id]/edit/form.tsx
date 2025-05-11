'use client';
import { OrganizationWithSelectedRelations, User } from '@/lib/prisma';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Trash2 as RemoveIcon, Upload as UploadIcon, User2 as UserIcon } from 'lucide-react';
import { upload } from '@imagekit/next';
import { useEffect, useRef, useState } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';

import {
  UpdateOrganization,
  AddMemberToOrganization,
  RemoveMemberFromOrganization,
  GetOrgImageUploadAuth,
  UpdateOrgProfilePicture,
  RemoveOrgProfilePicture,
  UpdateOrgBannerPicture,
  RemoveOrgBannerPicture,
} from './submit';
import { Textarea } from '@/components/ui/textarea';

interface ImageKitUploadResponse {
  url: string;
  fileId: string;
}

const organizationFormSchema = z.object({
  name: z.string().min(4).max(32),
  description: z.string().max(400).optional(),
  address: z.string().min(4).max(64),
  postcode: z
    .string()
    .min(6)
    .max(8)
    .trim()
    .regex(/^([A-Z][A-HJ-Y]?\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/, {
      message: 'Invalid postcode format',
    }),
});

const addMemberFormSchema = z.object({
  memberIdentifier: z.string().min(1, { message: 'Please enter a username.' }),
});

/**
 *
 * @param {OrganizationWithSelectedRelations} param0 - organization: The organization object to display
 * @returns {Element} - Returns a form for updating the organization's information
 */
export default function EditOrganizationForm({
  organization,
  currentUser,
}: {
  organization: OrganizationWithSelectedRelations;
  currentUser: User;
}) {
  /* eslint-disable @typescript-eslint/naming-convention */

  const router = useRouter();

  const updateForm = useForm<z.infer<typeof organizationFormSchema>>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: organization.name,
      description: organization.description || '',
      address: organization.address || '',
      postcode: organization.postcode || '',
    },
  });

  /**
   * Handles the form submission
   * @param {z.infer<typeof updateForm>} values - The values from the form
   */
  async function OnSubmitUpdate(values: z.infer<typeof organizationFormSchema>) {
    const toastId = toast.loading('Saving organization changes...');

    try {
      const result = await UpdateOrganization(
        organization.id,
        values.name,
        values.description || null,
        values.address,
        values.postcode,
      );

      if (result.success) {
        toast.success(result.message, { id: toastId });
        router.refresh(); // Refresh page/data on success
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch (error: unknown) {
      console.error('Failed to update organization:', error);
      if (error instanceof Error) {
        toast.error(error.message, { id: toastId });
      } else {
        toast.error('An unexpected error occurred.', { id: toastId });
      }
    }
  }

  const addMemberForm = useForm<z.infer<typeof addMemberFormSchema>>({
    resolver: zodResolver(addMemberFormSchema),
    defaultValues: {
      memberIdentifier: '',
    },
  });

  /**
   * Handles the add member form submission.
   * @param {z.infer<typeof addMemberFormSchema>} values - The values from the add member form.
   */
  async function OnSubmitAddMember(values: z.infer<typeof addMemberFormSchema>) {
    const toastId = toast.loading(`Adding member ${values.memberIdentifier}...`);

    try {
      const result = await AddMemberToOrganization(organization.id, values.memberIdentifier);

      if (result.success) {
        toast.success(result.message, { id: toastId });
        addMemberForm.reset();
        router.refresh(); // Refresh page/data on success
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch (error: unknown) {
      console.error('Failed to add member:', error);
      if (error instanceof Error) {
        toast.error(error.message, { id: toastId });
      } else {
        toast.error('An unexpected error occurred.', { id: toastId });
      }
    }
  }

  /**
   * Handles the removal of a member from the organization.
   * @param {number} memberId - The ID of the member to be removed.
   * @param {string} memberName - The name of the member to be removed.
   */
  async function handleRemoveMember(memberId: number, memberName: string) {
    const toastId = toast.loading(`Removing ${memberName}...`);

    try {
      const result = await RemoveMemberFromOrganization(organization.id, memberId);

      if (result.success) {
        toast.success(result.message, { id: toastId });
        router.refresh(); // Refresh page/data on success
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch (error: unknown) {
      console.error('Failed to remove member:', error);
      if (error instanceof Error) {
        toast.error(error.message, { id: toastId });
      } else {
        toast.error('An unexpected error occurred.', { id: toastId });
      }
    }
  }

  // --- State and Refs for Organization Picture Uploads ---
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string | null>(
    organization.orgPictureUrl || null,
  );
  const [profileProgress, setProfileProgress] = useState(0);
  const profileFileInputRef = useRef<HTMLInputElement>(null);

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(
    organization.bannerPictureUrl || null,
  );
  const [bannerProgress, setBannerProgress] = useState(0);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  // --- Effect to clean up object URLs when files change or component unmounts ---
  useEffect(() => {
    if (profileFile) {
      const url = URL.createObjectURL(profileFile);
      setProfilePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setProfilePreviewUrl(organization.orgPictureUrl || null);
    }
    return () => {};
  }, [profileFile, organization.orgPictureUrl]);

  useEffect(() => {
    if (bannerFile) {
      const url = URL.createObjectURL(bannerFile);
      setBannerPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setBannerPreviewUrl(organization.bannerPictureUrl || null);
    }
    return () => {};
  }, [bannerFile, organization.bannerPictureUrl]);

  // --- Helper function to handle image uploads (reusable logic) ---
  const handleImageUploadProcess = async (
    file: File,
    imageType: 'profile' | 'banner',
    setProgress: (progress: number) => void,
  ): Promise<ImageKitUploadResponse | { success: false; message: string } | null> => {
    setProgress(0);
    const toastId = toast.loading(`Uploading ${imageType} picture...`);

    try {
      const authResult = await GetOrgImageUploadAuth();
      if (!authResult.success || !authResult.auth) {
        toast.error(authResult.message || `Failed to get upload auth for ${imageType} picture.`, {
          id: toastId,
        });
        setProgress(0);
        return {
          success: false,
          message: authResult.message || `Failed to get upload auth for ${imageType} picture.`,
        };
      }
      const authData = authResult.auth;

      // Add folder path for organization images
      const uploadResponse = (await upload({
        file,
        fileName: `${imageType}-${organization.id}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
        folder: `organizations/${organization.id}`,
        tags: [`organization_${organization.id}`, imageType],
        ...authData, // Spread auth parameters
        onProgress: (event: ProgressEvent) =>
          setProgress(Math.round((event.loaded / event.total) * 100)),
      })) as ImageKitUploadResponse;

      setProgress(100);

      let updateDbResult;
      if (imageType === 'profile') {
        updateDbResult = await UpdateOrgProfilePicture(
          organization.id,
          uploadResponse.url,
          uploadResponse.fileId,
        );
      } else {
        // imageType === 'banner'
        updateDbResult = await UpdateOrgBannerPicture(
          organization.id,
          uploadResponse.url,
          uploadResponse.fileId,
        );
      }

      if (updateDbResult.success) {
        toast.success(`${imageType} picture uploaded and saved successfully!`, { id: toastId });

        return uploadResponse;
      } else {
        console.error(`Failed to save ${imageType} picture URL/ID to DB after ImageKit upload.`);
        toast.error(updateDbResult.message || `Failed to save ${imageType} picture in database.`, {
          id: toastId,
        });
        setProgress(0);

        return {
          success: false,
          message: updateDbResult.message || `Failed to save ${imageType} picture in database.`,
        };
      }
    } catch (error: unknown) {
      console.error(`Error during ${imageType} picture upload process:`, error);
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred during upload.';
      toast.error(`Upload failed: ${errorMessage}`, { id: toastId });
      setProgress(0); // Reset progress on any error
      return { success: false, message: `Upload failed: ${errorMessage}` };
    }
  };

  // --- Handler for Profile Picture Upload Button ---
  const handleProfileUpload = async () => {
    if (!profileFile) {
      toast.info('Please select a file first.');
      return;
    }

    const uploadResult = await handleImageUploadProcess(profileFile, 'profile', setProfileProgress);

    // If upload and DB update were successful, refresh the page
    if (uploadResult && 'url' in uploadResult) {
      setBannerFile(null);
      setBannerPreviewUrl(null);
      router.refresh();
    }
  };

  // --- Handler for Banner Picture Upload Button ---
  const handleBannerUpload = async () => {
    if (!bannerFile) {
      toast.info('Please select a file first.');
      return;
    }
    const uploadResult = await handleImageUploadProcess(bannerFile, 'banner', setBannerProgress);

    // If upload and DB update were successful, refresh the page
    if (uploadResult && 'url' in uploadResult) {
      router.refresh();
    }
  };

  // --- Handler for Profile Picture Remove Button ---
  const handleProfileRemove = async () => {
    if (!organization.orgPictureUrl) {
      toast.info('No profile picture to remove.');
      return;
    }

    const toastId = toast.loading('Removing profile picture...');

    try {
      const result = await RemoveOrgProfilePicture(organization.id);
      if (result.success) {
        toast.success(result.message, { id: toastId });
        setProfilePreviewUrl(null); // Clear client-side preview
        setProfileFile(null); // Clear any selected file
        router.refresh(); // Refresh page/data to show updated state
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch (error: unknown) {
      console.error('Failed to remove profile picture:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred during removal.';
      toast.error(`Removal failed: ${errorMessage}`, { id: toastId });
    } finally {
      toast.dismiss(toastId);
    }
  };

  // --- Handler for Banner Picture Remove Button ---
  const handleBannerRemove = async () => {
    if (!organization.bannerPictureUrl) {
      toast.info('No banner picture to remove.');
      return;
    }

    const toastId = toast.loading('Removing banner picture...');

    try {
      const result = await RemoveOrgBannerPicture(organization.id);
      if (result.success) {
        toast.success(result.message, { id: toastId });
        setBannerPreviewUrl(null); // Clear client-side preview
        setBannerFile(null); // Clear any selected file
        router.refresh(); // Refresh page/data to show updated state
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch (error: unknown) {
      console.error('Failed to remove banner picture:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred during removal.';
      toast.error(`Removal failed: ${errorMessage}`, { id: toastId });
    } finally {
      toast.dismiss(toastId);
    }
  };

  // --- Conditional Rendering based on Ownership ---
  const isOwner = currentUser.id === organization.owner.id;

  return (
    <div className="self-center p-12 md:p-24 w-screen max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Organization Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...updateForm}>
            <form onSubmit={updateForm.handleSubmit(OnSubmitUpdate)} className="space-y-8">
              <FormField
                control={updateForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input placeholder={organization.name} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={updateForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder={organization.description || undefined} {...field} />
                    </FormControl>
                    <FormDescription>Tell us about your organization.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={updateForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder={organization.address || undefined} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={updateForm.control}
                name="postcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postcode</FormLabel>
                    <FormControl>
                      <Input placeholder={organization.postcode || undefined} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Only show Save Changes button to the owner */}
              {isOwner && (
                <Button type="submit" className="hover:cursor-pointer">
                  Save Details
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
      <Separator className="my-12" />
      {/* --- Organization Profile Picture Section --- */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Profile Picture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="org-profile-picture">Current Picture</Label>
          {/* Display current/preview profile picture */}
          <div className="flex items-center space-x-4">
            <Avatar className="size-24">
              {' '}
              {/* Adjust size as needed */}
              <AvatarImage
                src={profilePreviewUrl || organization.orgPictureUrl || undefined} // Use preview if available, otherwise DB URL
                alt={`${organization.name}'s profile picture`}
                className="object-cover"
              />
              <AvatarFallback className="size-full flex justify-center items-center bg-gray-200 text-gray-500">
                <UserIcon className="size-1/2" /> {/* Placeholder icon */}
              </AvatarFallback>
            </Avatar>
            {/* Optional: Display filename if a file is selected */}
            {profileFile && (
              <span className="text-sm text-muted-foreground">{profileFile.name}</span>
            )}
          </div>
          {/* Only show upload/remove controls to the owner */}
          {isOwner && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  id="org-profile-picture"
                  type="file"
                  ref={profileFileInputRef}
                  className="hidden"
                  accept="image/*" // Accept only image files
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setProfileFile(file);

                    setProfileProgress(0); // Reset progress on new file selection
                  }}
                />

                <Button
                  type="button"
                  onClick={() => profileFileInputRef.current?.click()}
                  variant="secondary"
                >
                  Choose Profile Picture
                </Button>
                {/* Optional: Display file name if a file is selected */}
                {profileFile && (
                  <span className="text-sm text-muted-foreground">{profileFile.name}</span>
                )}
              </div>

              {/* Upload and Remove buttons */}
              <div className="flex items-center gap-4">
                {/* Only show Upload button if a file is selected */}
                {profileFile && (
                  <Button onClick={handleProfileUpload} className="hover:cursor-pointer">
                    <UploadIcon className="mr-2 h-4 w-4" /> Upload Profile Picture
                  </Button>
                )}
                {/* Only show Remove button if there's an existing picture URL or a selected file */}
                {(organization.orgPictureUrl || profileFile) && (
                  <Button
                    variant="destructive"
                    onClick={handleProfileRemove}
                    className="hover:cursor-pointer"
                  >
                    <RemoveIcon className="mr-2 h-4 w-4" /> Remove Profile Picture
                  </Button>
                )}
              </div>

              {profileProgress > 0 && profileProgress < 100 && (
                <Progress value={profileProgress} className="h-2" />
              )}
            </div>
          )}{' '}
        </CardContent>
      </Card>
      <Separator className="my-12" /> {/* Separator */}
      {/* --- Organization Banner Picture Section --- */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Banner Picture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="org-banner-picture">Current Picture</Label>
          {/* Display current/preview banner picture */}
          <AspectRatio
            ratio={16 / 9}
            className="w-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden rounded-md relative"
          >
            {' '}
            {bannerPreviewUrl || organization.bannerPictureUrl ? (
              <Image
                src={bannerPreviewUrl || organization.bannerPictureUrl} // Use preview if available, otherwise DB URL
                alt={`${organization.name}'s banner picture`}
                fill // *** Use fill to cover the parent AspectRatio container ***
                className="object-cover" // Cover the container
              />
            ) : (
              <span>No Banner Picture</span> // Placeholder text
            )}
          </AspectRatio>
          {/* Optional: Display filename if a file is selected */}
          {bannerFile && (
            <span className="text-sm text-muted-foreground mt-2 block">{bannerFile.name}</span>
          )}
          {/* Only show upload/remove controls to the owner */}
          {isOwner && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {/* File input (hidden) */}
                <input
                  id="org-banner-picture"
                  type="file"
                  ref={bannerFileInputRef}
                  className="hidden"
                  accept="image/*" // Accept only image files
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setBannerFile(file);

                    setBannerProgress(0); // Reset progress on new file selection
                  }}
                />
                {/* Button to trigger file input click */}
                <Button
                  type="button"
                  onClick={() => bannerFileInputRef.current?.click()}
                  variant="secondary"
                >
                  Choose Banner Picture
                </Button>
                {/* Optional: Display file name if a file is selected */}
                {bannerFile && (
                  <span className="text-sm text-muted-foreground">{bannerFile.name}</span>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Only show Upload button if a file is selected */}
                {bannerFile && (
                  <Button onClick={handleBannerUpload} className="hover:cursor-pointer">
                    <UploadIcon className="mr-2 h-4 w-4" /> Upload Banner Picture
                  </Button>
                )}
                {/* Only show Remove button if there's an existing picture URL or a selected file */}
                {(organization.bannerPictureUrl || bannerFile) && (
                  <Button
                    variant="destructive"
                    onClick={handleBannerRemove}
                    className="hover:cursor-pointer"
                  >
                    <RemoveIcon className="mr-2 h-4 w-4" /> Remove Banner Picture
                  </Button>
                )}
              </div>

              {bannerProgress > 0 && bannerProgress < 100 && (
                <Progress value={bannerProgress} className="h-2" />
              )}
            </div>
          )}{' '}
        </CardContent>
      </Card>
      <Separator className="my-12" />
      {/* Separator */}
      {/* --- Member Management Section --- */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Manage Members</h2>

        {/* Display Current Members */}
        <Card>
          <CardHeader>
            {/* Add +1 to count for the owner */}
            <CardTitle>
              Current Members ({organization.members.length + (organization.owner ? 1 : 0)})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Display Owner First*/}
            {organization.owner && (
              <div className="flex items-center space-x-4">
                <Avatar className="size-12">
                  {' '}
                  {/* Adjust size as needed for member list */}
                  <AvatarImage
                    src={organization.owner.profilePictureUrl || undefined}
                    alt={`${organization.owner.username || 'Owner'}'s avatar`}
                  />
                  {/* Fallback to first letter of username/email */}
                  <AvatarFallback>
                    {organization.owner.username?.[0] || organization.owner.email?.[0] || 'O'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {organization.owner.username ||
                      organization.owner.email ||
                      `Owner ID: ${organization.owner.userId}`}
                  </p>
                  <p className="text-sm text-gray-500">Owner</p>
                </div>
                {/* No remove button for the owner */}
              </div>
            )}
            {/* Display Members (exclude owner if they were included in the members array) */}
            {organization.members
              .filter((member) => member.id !== organization.owner.id) // Filter out owner if included in members list
              .map((member) => (
                <div key={member.id} className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="size-12">
                      {' '}
                      {/* Adjust size as needed for member list */}
                      <AvatarImage
                        src={member.profilePictureUrl || undefined}
                        alt={`${member.username || 'Member'}'s avatar`}
                      />
                      {/* Fallback to first letter of username/email */}
                      <AvatarFallback>
                        {member.username?.[0] || member.email?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {member.username || member.email || `User ID: ${member.userId}`}
                      </p>
                      <p className="text-sm text-gray-500">Member</p>
                    </div>
                  </div>
                  {/* Only show remove button if current user is the owner AND the member is not the owner */}
                  {currentUser.id === organization.owner.id &&
                    member.id !== organization.owner.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleRemoveMember(
                            member.id,
                            member.username || member.email || `User ${member.id}`,
                          )
                        } // Pass member ID and name to handler
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        aria-label={`Remove ${member.username || member.email || `User ${member.id}`}`}
                      >
                        <RemoveIcon className="h-4 w-4" /> {/* Use Lucide icon */}
                      </Button>
                    )}
                </div>
              ))}

            {/* Message if no members (excluding owner) */}
            {organization.members.filter((member) => member.id !== organization.owner.id).length ===
              0 && <p className="text-gray-500 text-center mt-4">No members added yet.</p>}
          </CardContent>
        </Card>

        {/* Form to Add New Member */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Member</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...addMemberForm}>
              <form onSubmit={addMemberForm.handleSubmit(OnSubmitAddMember)} className="space-y-4">
                <FormField
                  control={addMemberForm.control}
                  name="memberIdentifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter username" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the username of the user you want to add as a member.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="hover:cursor-pointer">
                  Add Member
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
