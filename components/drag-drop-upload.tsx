"use client";

import { useState, useCallback } from "react";
import { Upload, X, CheckCircle } from "lucide-react";

export function DragDropUploadComponent() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [folderName, setFolderName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<
    Record<string, "uploading" | "success" | "error">
  >({});

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleUpload = useCallback((files: FileList) => {
    if (files.length === 0) return;

    // Initialize progress tracking array
    const progressArray = Array.from(files).map(() => 0);
    setUploadProgress(progressArray);

    const formData = new FormData();

    Array.from(files).forEach((file, index) => {
      formData.append("upload[]", file);
    });

    setIsUploading(true);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", process.env.NEXT_PUBLIC_REMOTE_BUCKET_URL + "index.php");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentCompleted = Math.round((event.loaded / event.total) * 100);
        setUploadProgress((prevProgress) =>
          prevProgress.map((prog, idx) => (idx === 0 ? percentCompleted : prog))
        );
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        setFolderName(response.folderName); // Assuming PHP returns the folder name
        setIsUploading(false);
      } else {
        console.error("Upload failed");
        setIsUploading(false);
      }
    };

    xhr.onerror = () => {
      console.error("Upload error");
      setIsUploading(false);
    };

    xhr.send(formData);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      // setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
      // droppedFiles.forEach((file) => handleUpload(file));

      handleUpload(e.dataTransfer.files);
    },
    [handleUpload]
  );

  const onFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleUpload(e.target.files);
      }
    },
    [handleUpload]
  );

  const removeFile = useCallback((fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
    setUploadStatus((prev) => {
      const newStatus = { ...prev };
      delete newStatus[fileToRemove.name];
      return newStatus;
    });
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      {!isUploading && !folderName && (
        <>
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop files here, or click to select files
            </p>
            <input
              type="file"
              multiple
              onChange={onFileInputChange}
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Select Files
            </label>
          </div>
        </>
      )}

      <div>
        {isUploading && (
          <div>
            <h3>Upload Progress</h3>
            <ul>
              {uploadProgress.map((progress, index) => {
                if (index > 0) return null;
                return (
                  <li key={index}>
                    File {index + 1}: {progress}%
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {folderName && (
          <div>
            <h3>Upload Complete</h3>
            <p>Share name: {folderName}</p>
            <p className="text-nowrap">
              Share url:{" "}
              <a
                className="text-nowrap"
                href={process.env.NEXT_PUBLIC_URL + "share/" + folderName}
              >
                {process.env.NEXT_PUBLIC_URL}share/{folderName}?share
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
