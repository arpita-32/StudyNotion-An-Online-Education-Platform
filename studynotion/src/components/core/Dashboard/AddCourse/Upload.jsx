import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import { Player } from "video-react";
import "video-react/dist/video-react.css";

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  );
  const inputRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      previewFile(file);
      setSelectedFile(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [".mp4"] },
    onDrop,
    multiple: false,
    noClick: false,
    noKeyboard: false
  });

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  useEffect(() => {
    register(name, { required: true });
  }, [register, name]);

  useEffect(() => {
    setValue(name, selectedFile);
  }, [selectedFile, setValue, name]);

  const handleBrowseClick = (e) => {
    e.stopPropagation();
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>
      <div
        {...getRootProps()}
        className={`${
          isDragActive ? "bg-gray-100" : "bg-white"
        } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 transition-colors duration-200 hover:border-blue-500`}
      >
        {previewSource ? (
          <div className="flex w-full flex-col p-6">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <Player aspectRatio="16:9" playsInline src={previewSource} />
            )}
            {!viewData && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewSource("");
                  setSelectedFile(null);
                  setValue(name, null);
                }}
                className="mt-3 text-gray-600 underline hover:text-gray-800"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center p-6">
            <input {...getInputProps()} ref={inputRef} />
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-gray-100">
              <FiUploadCloud className="text-2xl text-blue-500" />
            </div>
            <p className="mt-2 max-w-[200px] text-center text-sm text-gray-600">
              Drag and drop an {!video ? "image" : "video"}, or{" "}
              <button
                type="button"
                onClick={handleBrowseClick}
                className="font-semibold text-blue-500 hover:text-blue-600"
              >
                Browse
              </button>{" "}
              a file
            </p>
            <ul className="mt-10 flex list-disc justify-between space-x-12 text-center text-xs text-gray-500">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024x576</li>
            </ul>
          </div>
        )}
      </div>
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-red-500">
          {label} is required
        </span>
      )}
    </div>
  );
}