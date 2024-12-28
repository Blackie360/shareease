import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Video, MapPinned } from "lucide-react";

interface EventLocationProps {
  form: UseFormReturn<any>;
}

export function EventLocation({ form }: EventLocationProps) {
  const isOnline = form.watch("isOnline");

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="isOnline"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                {field.value ? (
                  <Video className="w-4 h-4 inline-block mr-2" />
                ) : (
                  <MapPinned className="w-4 h-4 inline-block mr-2" />
                )}
                {field.value ? "Virtual Event" : "Physical Event"}
              </FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {!isOnline ? (
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Event location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <FormField
          control={form.control}
          name="meetingUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter virtual meeting link"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}