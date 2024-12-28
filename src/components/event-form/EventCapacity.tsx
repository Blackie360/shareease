import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface EventCapacityProps {
  form: UseFormReturn<any>;
}

export function EventCapacity({ form }: EventCapacityProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="maxAttendees"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maximum Attendees (Optional)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Leave blank for unlimited"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}