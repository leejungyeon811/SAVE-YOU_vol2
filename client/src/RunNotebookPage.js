import React from "react";

const RunNotebookPage = () => {
  const runNotebook = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/run-notebook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log("Notebook Execution Result:", result);
      if (result.error) {
        alert(`Error: ${result.error}`);
      } else {
        alert(`Output: ${result.output}`);
      }
    } catch (error) {
      console.error("Error calling Flask API:", error);
      alert("Failed to call Flask API");
    }
  };

  return (
    <div>
      <h1>Run Notebook</h1>
      <button onClick={runNotebook}>Run Notebook</button>
    </div>
  );
};

export default RunNotebookPage;
