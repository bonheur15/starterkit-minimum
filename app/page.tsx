import { DragDropUploadComponent } from "@/components/drag-drop-upload";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <div className="fixed w-[100%] h-[100%] justify-center items-center flex">
        <DragDropUploadComponent />
      </div>
    </>
  );
}
