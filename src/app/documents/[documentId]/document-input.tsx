import { BsCloudCheck, BsCloudSlash } from "react-icons/bs";
import { Id } from "../../../../convex/_generated/dataModel";
import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";
import { useStatus } from "@liveblocks/react";
import { LoaderIcon } from "lucide-react";

interface DocumentInputProps {
  title: string;
  id: Id<"documents">;
}

export const DocumentInput = ({ title, id }: DocumentInputProps) => {
  const status = useStatus();
  const [value, setValue] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const mutate = useMutation(api.documents.updateById);

  const debounceUpdate = useDebounce((newValue: string) => {
    if (newValue === title) return;
    setIsPending(true);
    mutate({ id, title: newValue })
      .then(() => toast.success("Title updated"))
      .catch(() => toast.error("Failed to update title"))
      .finally(() => setIsPending(false));
  });

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debounceUpdate(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    mutate({ id, title: value })
      .then(() => {
        toast.success("Title updated");
        setIsEditing(false);
      })
      .catch(() => toast.error("Failed to update title"))
      .finally(() => setIsPending(false));
  };

  const showLoader =
    isPending || status === "connecting" || status === "reconnecting";
  const showError = status === "disconnected";

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="relative w-fit max-w-[50ch]">
          <span className="invisible whitespace-pre px-1.5 text-lg">
            {value || ""}
          </span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e)}
            className="absolute inset-0 text-lg text-black px-1.5 bg-transparent truncate"
            onBlur={() => setIsEditing(false)}
          />
        </form>
      ) : (
        <span
          className="text-lg px-1.5 cursor-pointer truncate"
          onClick={() => {
            setIsEditing(true);
            setTimeout(() => {
              inputRef.current?.focus();
            }, 0);
          }}
        >
          {title}
        </span>
      )}
      {showError && <BsCloudSlash className="size-4" />}
      {!showError && !showLoader && <BsCloudCheck className="size-4" />}
      {showLoader && (
        <LoaderIcon className="size-4 animate-spin text-muted-foreground" />
      )}
    </div>
  );
};
