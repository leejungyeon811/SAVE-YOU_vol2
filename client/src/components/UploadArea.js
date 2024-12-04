import React, { useState, useRef } from 'react';
import './UploadArea.css';
import './RadioButton.css'; // 스타일 통합

function UploadArea() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [outputImage, setOutputImage] = useState(null);
  const [action, setAction] = useState('blur'); // Default action is "blur"
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const outputRef = useRef(null); // Output 섹션 참조

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSelectedImage(URL.createObjectURL(file));
      setOutputImage(null); // 이미지 업로드 시 이전 output 초기화
    } else {
      alert('Please select a valid JPG or PNG file.');
    }
  };

  const handleConfirm = async () => {
    if (!selectedImage) {
      alert('Please upload an image first.');
      return;
    }

    const fileInput = document.getElementById('file-upload');
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('image', file);
    formData.append('action', action); // 선택한 라디오 버튼의 값

    try {
      setIsLoading(true); // 로딩 상태 시작
      const response = await fetch('http://127.0.0.1:5000/pic', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setOutputImage(`data:image/png;base64,${data.output_image}`);
        setTimeout(() => {
          // 스크롤 애니메이션
          outputRef.current.scrollIntoView({ behavior: 'smooth' });
        }, 100); // 약간의 지연 후 스크롤
      } else {
        alert('Image processing failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing the image.');
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  return (
    <>
      {/* 라디오 버튼 */}
      <div className="radio-inputs">
        <label className="radio">
          <input
            type="radio"
            name="action"
            value="blur"
            checked={action === 'blur'}
            onChange={() => setAction('blur')}
          />
          <span className="name">Blur</span>
        </label>
        <label className="radio">
          <input
            type="radio"
            name="action"
            value="noise"
            checked={action === 'noise'}
            onChange={() => setAction('noise')}
          />
          <span className="name">Noise</span>
        </label>
        <label className="radio">
          <input
            type="radio"
            name="action"
            value="generate-ai"
            checked={action === 'generate-ai'}
            onChange={() => setAction('generate-ai')}
          />
          <span className="name">Generate AI</span>
        </label>
      </div>
      <div className="upload-area">
        {/* 업로드 */}
        <label htmlFor="file-upload" className="file-upload-label">
          {selectedImage ? (
            <img src={selectedImage} alt="Selected" className="uploaded-image" />
          ) : (
            <div className="upload-placeholder">
              <p>Select your Picture</p>
              <span role="img" aria-label="camera">📷</span>
            </div>
          )}
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".jpg, .jpeg, .png"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
      </div>

      {/* Confirm 버튼 */}
      <button className="confirm-button" onClick={handleConfirm}>
        Confirm
      </button>

      {/* 처리된 이미지 표시 */}
      <div
        className="output-section"
        style={{
          height: selectedImage ? 'auto' : 0,
        }}
        ref={outputRef}
      >
        {isLoading ? (
          /* From Uiverse.io by abrahamcalsin */
          <div className="dot-spinner">
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
          </div>
        ) : (
          outputImage && (
            <div className="processed-output">
              <h3>Result</h3>
              <img src={outputImage} alt="Processed Output" className="processed-image" />
              {/* Save 버튼 */}
              <br/>
              <button
                className="save-button"
                onClick={() => {
                  // Extract original file name without extension
                  const fileInput = document.getElementById('file-upload');
                  const originalFileName = fileInput.files[0].name.split('.')[0]; // 파일명만 추출
                  const extension = 'png'; // 저장 확장자

                  // Append action (_blur or _noise) to the file name
                  const processedFileName = `${originalFileName}_${action}.${extension}`;

                  // Create a download link for the processed image
                  const link = document.createElement('a');
                  link.href = outputImage;
                  link.download = processedFileName; // 저장 파일명 설정
                  link.click();
                }}
              >
                Save Image
              </button>

            </div>
          )
        )}
      </div>

    </>
  );
}

export default UploadArea;
