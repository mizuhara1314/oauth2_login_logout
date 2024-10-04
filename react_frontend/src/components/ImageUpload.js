import React, { useState } from 'react';

const ImageUpload = ({ onUpload }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); // 设置选中的图片
        onUpload(reader.result); // 调用上传函数
      };
      reader.readAsDataURL(file); // 读取文件为 Data URL
    }
  };

  return (
    <div className="image-upload">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="file-input"
      />
      {selectedImage && (
        <img src={selectedImage} alt="Preview" className="preview-image" />
      )}
    </div>
  );
};

export default ImageUpload;
