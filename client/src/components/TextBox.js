import React, { useState } from "react";
import "./TextBox.css";

const TextBox = () => {
  const [value, setValue] = useState("");
  const [response, setResponse] = useState(""); // 서버 응답 저장

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleNER = async () => {
    if (value.trim() === "") {
      alert("Please enter some text before performing NER.");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5001/ner", { // Flask 서버 URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: value }),
      });

      if (!res.ok) throw new Error("Failed to send data to the server.");

      const data = await res.json();
      const filteredText = data.masked_text.replace("[CLS] ", "").replace(" [SEP]", ""); // [SEP] 제거
      setResponse(filteredText);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing NER.");
    }
  };


  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    alert("Success Copy!");
  };

  return (
    <div className="textbox-container">
      <textarea
        id="custom-textarea"
        value={value}
        onChange={handleChange}
        className="custom-textarea"
        placeholder="Type something..."
        rows="10"
      ></textarea>

      <button className="confirm-button" onClick={handleNER}>
        Confirm
      </button>

      {/* 서버 응답 텍스트 박스 */}
      {response && (
        <div className="response-container">
          <h3>Masked Text</h3>
          <textarea
            value={response}
            readOnly={false}
            className="response-textarea"
            rows="5"
          ></textarea>
          <button className="confirm-button" onClick={handleCopy}>
            Copy All
          </button>
        </div>
      )}
    </div>
  );
};

export default TextBox;
