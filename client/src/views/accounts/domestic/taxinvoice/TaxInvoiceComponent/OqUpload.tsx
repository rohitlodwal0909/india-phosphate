import { Label } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { ImageUrl } from 'src/constants/contant';

const OqUpload = ({ formData, setFormData }: any) => {
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (formData.oq_upload instanceof File) {
      const objectUrl = URL.createObjectURL(formData.oq_upload);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    if (typeof formData.oq_upload === 'string' && formData.oq_upload) {
      setPreview(`${ImageUrl}uploads/oq-uploads/${formData.oq_upload}`);
    } else {
      setPreview('');
    }
  }, [formData.oq_upload]);

  return (
    <div className="grid grid-cols-12 items-center gap-4 rounded-lg border bg-white p-4">
      <div className="col-span-12 sm:col-span-4">
        <Label htmlFor="oq_upload" value="Upload PDF / Invoice Attachment" />
        <input
          type="file"
          id="oq_upload"
          accept=".pdf,application/pdf,image/*"
          className="mt-2 block w-full text-sm"
          onChange={(event) => setFormData((prev: any) => ({
            ...prev,
            oq_upload: event.target.files?.[0] || prev.oq_upload,
          }))}
        />
      </div>
      {preview && (
        <div className="col-span-12 sm:col-span-8">
          {preview.toLowerCase().includes('.pdf') ? (
            <a href={preview} target="_blank" rel="noreferrer" className="text-blue-600 underline">
              View uploaded PDF
            </a>
          ) : (
            <img src={preview} alt="Invoice attachment preview" className="max-h-28 rounded border" />
          )}
        </div>
      )}
    </div>
  );
};

export default OqUpload;
