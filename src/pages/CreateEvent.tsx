import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventBasicInfo } from "@/components/event-form/EventBasicInfo";
import { EventDateTime } from "@/components/event-form/EventDateTime";
import { EventLocation } from "@/components/event-form/EventLocation";
import { EventCapacity } from "@/components/event-form/EventCapacity";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface EventFormData {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  category: string;
  isOnline: boolean;
  meetingUrl?: string;
  maxAttendees?: number;
  bannerImage?: FileList;
}

export default function CreateEvent() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("basic-info");

  const form = useForm<EventFormData>({
    defaultValues: {
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      location: "",
      category: "Conference",
      isOnline: false,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      form.setValue("bannerImage", e.target.files as FileList);
    }
  };

  const onSubmit = async (data: EventFormData) => {
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to create an event");
      }

      let bannerUrl = null;
      if (data.bannerImage?.[0]) {
        const file = data.bannerImage[0];
        const fileExt = file.name.split(".").pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from("event-images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("event-images")
          .getPublicUrl(filePath);

        bannerUrl = urlData.publicUrl;
      }

      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .insert({
          title: data.title,
          description: data.description,
          start_time: data.startTime,
          end_time: data.endTime,
          location: data.isOnline ? null : data.location,
          category: data.category,
          is_online: data.isOnline,
          meeting_url: data.isOnline ? data.meetingUrl : null,
          max_attendees: data.maxAttendees,
          banner_url: bannerUrl,
          is_published: true,
          created_by: user.id,
        })
        .select()
        .single();

      if (eventError) throw eventError;

      const { error: ticketError } = await supabase
        .from("tickets")
        .insert({
          event_id: eventData.id,
          name: "General Admission",
          description: "Standard entry ticket",
          price: 0,
          quantity: data.maxAttendees || null,
        });

      if (ticketError) throw ticketError;

      toast({
        title: "Success!",
        description: "Your event has been created.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleNext = () => {
    switch (activeTab) {
      case "basic-info":
        setActiveTab("date-time");
        break;
      case "date-time":
        setActiveTab("location");
        break;
      case "location":
        setActiveTab("capacity");
        break;
    }
  };

  const handleBack = () => {
    switch (activeTab) {
      case "date-time":
        setActiveTab("basic-info");
        break;
      case "location":
        setActiveTab("date-time");
        break;
      case "capacity":
        setActiveTab("location");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <Tabs value={activeTab} onValueChange={handleTabChange}>
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="basic-info">Details</TabsTrigger>
                      <TabsTrigger value="date-time">Date and Time</TabsTrigger>
                      <TabsTrigger value="location">Location</TabsTrigger>
                      <TabsTrigger value="capacity">Capacity</TabsTrigger>
                    </TabsList>

                    <div className="mt-8">
                      <TabsContent value="basic-info">
                        <EventBasicInfo form={form} />
                      </TabsContent>

                      <TabsContent value="date-time">
                        <EventDateTime form={form} />
                      </TabsContent>

                      <TabsContent value="location">
                        <EventLocation form={form} />
                      </TabsContent>

                      <TabsContent value="capacity">
                        <EventCapacity form={form} />
                      </TabsContent>
                    </div>
                  </Tabs>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Event Banner</Label>
                        <p className="text-sm text-muted-foreground">
                          Add a banner image to make your event stand out
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.querySelector<HTMLInputElement>("#banner")?.click()
                        }
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>
                    </div>
                    <Input
                      id="banner"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    {previewUrl && (
                      <div className="mt-4">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full max-w-md rounded-lg"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-6">
                    <div>
                      {activeTab !== "basic-info" && (
                        <Button type="button" variant="outline" onClick={handleBack}>
                          Back
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/dashboard")}
                      >
                        Cancel
                      </Button>
                      {activeTab === "capacity" ? (
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? "Creating..." : "Create Event"}
                        </Button>
                      ) : (
                        <Button type="button" onClick={handleNext}>
                          Next
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}