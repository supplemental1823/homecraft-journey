
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Plus } from "lucide-react";
import { toast } from "sonner";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export const HomePhotos = () => {
  const queryClient = useQueryClient();

  // Fetch home photos
  const { data: photos, isLoading } = useQuery({
    queryKey: ['homePhotos'],
    queryFn: async () => {
      const { data: photos, error } = await supabase
        .from('home_photos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2);

      if (error) throw error;
      return photos;
    }
  });

  // Handle file upload
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('No user found');

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('home_photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('home_photos')
        .getPublicUrl(filePath);

      // Create record in home_photos table
      const { error: dbError } = await supabase
        .from('home_photos')
        .insert({
          file_path: filePath,
          title: file.name,
        });

      if (dbError) throw dbError;

      return publicUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homePhotos'] });
      toast.success('Photo uploaded successfully');
    },
    onError: (error) => {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    }
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    uploadMutation.mutate(file);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Home Photos</CardTitle>
          <Camera className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Loading photos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Home Photos</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploadMutation.isPending}
              />
              <Plus className="h-5 w-5" />
            </label>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {photos && photos.map((photo) => (
            <div key={photo.id} className="overflow-hidden rounded-md border">
              <AspectRatio ratio={16 / 9}>
                <img
                  src={supabase.storage.from('home_photos').getPublicUrl(photo.file_path).data.publicUrl}
                  alt={photo.title || 'Home photo'}
                  className="h-full w-full object-cover"
                />
              </AspectRatio>
            </div>
          ))}
          {(!photos || photos.length === 0) && (
            <div className="col-span-full text-center text-muted-foreground">
              No photos uploaded yet
            </div>
          )}
        </div>
        {photos && photos.length === 2 && (
          <div className="mt-6 text-center">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              View More Photos
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
