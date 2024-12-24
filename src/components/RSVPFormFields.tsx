import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface RSVPFormData {
  phoneNumber: string;
  dietaryPreferences: string;
  accessibilityRequirements: string;
  numberOfGuests: number;
  additionalNotes: string;
}

interface RSVPFormFieldsProps {
  form: UseFormReturn<RSVPFormData>;
}

export function RSVPFormFields({ form }: RSVPFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Enter your phone number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dietaryPreferences"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dietary Preferences (Optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Any dietary requirements or preferences?"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="accessibilityRequirements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Accessibility Requirements (Optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Any accessibility requirements we should know about?"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="numberOfGuests"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Guests</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="additionalNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Notes (Optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Any additional information you'd like to share?"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}