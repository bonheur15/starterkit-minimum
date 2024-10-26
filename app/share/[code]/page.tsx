import { FileDownloadPage } from "@/components/file-download-page";
import React from "react";

export default function Page({
  params,
}: {
  params: {
    code?: string;
  };
}) {
  return (
    <div>
      <FileDownloadPage shareCode={params.code ?? ""} />
    </div>
  );
}
