import { Button } from "@/components/ui/button";
import { Music } from "lucide-react"; // Importing the Music icon from lucide-react

export default function LoadingButton({
  pending,
  children,
  onClick,
}: {
  pending: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      className="w-full"
      type="submit"
      disabled={pending}
    >
      {pending ? (
        <div className="flex items-center justify-center">
          <Music className="animate-spin h-5 w-5 text-white mr-2" />
        </div>
      ) : (
        children
      )}
    </Button>
  );
}
