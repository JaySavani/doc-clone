import { useEditorStore } from "@/store/use-editor-store";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Link2Icon } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function LinkButton() {
  const { editor } = useEditorStore();
  const [url, setUrl] = useState("");

  const onChange = (href: string) => {
    editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setUrl("");
  };
  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open) {
          setUrl(editor?.getAttributes("link").href || "");
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
          <Link2Icon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
        <Input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button onClick={() => onChange(url)}>Apply</Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
