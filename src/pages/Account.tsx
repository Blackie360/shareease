import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, Phone, AtSign, FileText, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ProfileFormData {
  username: string;
  full_name: string;
  phone_number: string;
  bio: string;
}

export default function Account() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const form = useForm<ProfileFormData>();

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "No user found. Please log in again.",
          });
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (profile) {
          form.reset({
            username: profile.username || "",
            full_name: profile.full_name || "",
            phone_number: profile.phone_number || "",
            bio: profile.bio || "",
          });
          setAvatarUrl(profile.avatar_url);
        }
      } catch (error: any) {
        console.error("Error loading profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile: " + error.message,
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [form, toast]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", data.username)
        .neq("id", user.id)
        .maybeSingle();

      if (existingUser) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Username is already taken",
        });
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          username: data.username,
          full_name: data.full_name,
          phone_number: data.phone_number,
          bio: data.bio,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your profile has been updated",
      });
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1F0FB]">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F0FB]">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Settings className="w-8 h-8 text-[#9b87f5]" />
            <h1 className="text-3xl font-bold text-[#1A1F2C]">Account Settings</h1>
          </div>

          <Card className="mb-8">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={avatarUrl || undefined} />
                  <AvatarFallback className="bg-[#E5DEFF] text-[#9b87f5]">
                    <User className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl text-[#1A1F2C]">Profile Information</CardTitle>
                  <CardDescription>Update your personal information and profile settings</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AtSign className="w-4 h-4 text-[#9b87f5]" />
                      <Label htmlFor="username" className="text-[#1A1F2C]">Username</Label>
                    </div>
                    <Input
                      id="username"
                      {...form.register("username", { required: true })}
                      placeholder="Enter your username"
                      className="border-[#E5DEFF] focus:border-[#9b87f5]"
                    />
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#9b87f5]" />
                      <Label htmlFor="full_name" className="text-[#1A1F2C]">Full Name</Label>
                    </div>
                    <Input
                      id="full_name"
                      {...form.register("full_name")}
                      placeholder="Enter your full name"
                      className="border-[#E5DEFF] focus:border-[#9b87f5]"
                    />
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#9b87f5]" />
                      <Label htmlFor="phone_number" className="text-[#1A1F2C]">Phone Number</Label>
                    </div>
                    <Input
                      id="phone_number"
                      {...form.register("phone_number")}
                      placeholder="Enter your phone number"
                      className="border-[#E5DEFF] focus:border-[#9b87f5]"
                    />
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#9b87f5]" />
                      <Label htmlFor="bio" className="text-[#1A1F2C]">Bio</Label>
                    </div>
                    <Textarea
                      id="bio"
                      {...form.register("bio")}
                      placeholder="Tell us about yourself"
                      className="h-32 border-[#E5DEFF] focus:border-[#9b87f5]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white px-6"
              >
                {isSaving ? (
                  "Saving..."
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}