"use client";

import { Button } from "@/components/ui/button";
import { FileArchive } from "lucide-react";
import { useEffect, useState } from "react";

export function FileDownloadPage({ shareCode }: { shareCode: string }) {
  const fileName = "example-archive.zip";

  const handleDownload = () => {
    console.log(`Downloading ${fileName}`);
  };
  const [isChecking, SetChecking] = useState(true);
  const [validShareCode, SetValidShareCode] = useState(false);
  const [downloadUrl, SetDownloadUrl] = useState("");
  useEffect(() => {
    async function CheckShareCode() {
      const data: { files: string[] } = await (
        await fetch(
          process.env.NEXT_PUBLIC_REMOTE_BUCKET_URL +
            "check.php?code=" +
            shareCode
        )
      ).json();

      if (data.files.length == 0) SetValidShareCode(false);
      else {
        SetValidShareCode(true);
        SetDownloadUrl(
          process.env.NEXT_PUBLIC_REMOTE_BUCKET_URL +
            shareCode +
            "/" +
            data.files[2]
        );
        console.log(data.files[2]);
      }
      SetChecking(false);
    }
    CheckShareCode().then(() => {
      SetChecking(false);
    });
  }, [shareCode]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      {isChecking && <div className="text-4xl text-primary">Checking...</div>}
      {validShareCode && (
        <div className="mt-10">
          <a className="cursor-pointer" href={downloadUrl}>
            <Button>
              <FileArchive size={32} className="mr-2" />
              Download
            </Button>
          </a>
        </div>
      )}
      {!isChecking && validShareCode === false && (
        <div className="mt-10 text-red-600">Invalid share code</div>
      )}
    </div>
  );
}
