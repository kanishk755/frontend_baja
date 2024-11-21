import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [inputJSON, setInputJSON] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleInputChange = (e) => {
    setInputJSON(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      setError("");
      setResponse(null);

      // Parse input JSON to validate
      const parsedJSON = JSON.parse(inputJSON);

      // Backend API call
      const res = await axios.post("http://localhost:5000/bfhl", parsedJSON); // Backend URL
      setResponse(res.data);
    } catch (err) {
      setError("Invalid JSON input or server error.");
    }
  };

  const handleOptionChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedOptions((prev) => [...prev, value]);
    } else {
      setSelectedOptions((prev) => prev.filter((opt) => opt !== value));
    }
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    let filteredResponse = {};
    if (selectedOptions.includes("Alphabets")) {
      filteredResponse.Alphabets = response.alphabets;
    }
    if (selectedOptions.includes("Numbers")) {
      filteredResponse.Numbers = response.numbers;
    }
    if (selectedOptions.includes("Highest Lowercase Alphabet")) {
      filteredResponse["Highest Lowercase Alphabet"] =
        response.highest_lowercase_alphabet;
    }

    return (
      <div style={{ marginTop: "20px" }}>
        <h3>Filtered Response:</h3>
        <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>API Input</h1>
      <textarea
        rows="6"
        cols="50"
        placeholder="Enter JSON input here"
        value={inputJSON}
        onChange={handleInputChange}
        style={{ marginBottom: "10px", fontSize: "16px" }}
      />
      <br />
      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Submit
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {response && (
        <>
          <h3>Multi Filter</h3>
          <div style={{ marginBottom: "10px" }}>
            <label>
              <input
                type="checkbox"
                value="Alphabets"
                checked={selectedOptions.includes("Alphabets")}
                onChange={handleOptionChange}
              />{" "}
              Alphabets
            </label>
            <label style={{ marginLeft: "15px" }}>
              <input
                type="checkbox"
                value="Numbers"
                checked={selectedOptions.includes("Numbers")}
                onChange={handleOptionChange}
              />{" "}
              Numbers
            </label>
            <label style={{ marginLeft: "15px" }}>
              <input
                type="checkbox"
                value="Highest Lowercase Alphabet"
                checked={selectedOptions.includes("Highest Lowercase Alphabet")}
                onChange={handleOptionChange}
              />{" "}
              Highest Lowercase Alphabet
            </label>
          </div>

          {/* Textbox to show the selected options */}
          <div style={{ marginTop: "10px" }}>
            <input
              type="text"
              value={selectedOptions.join(", ")} // Show selected options here
              readOnly
              style={{
                padding: "5px",
                width: "300px",
                fontSize: "16px",
                marginBottom: "20px",
              }}
            />
          </div>

          {renderFilteredResponse()}
        </>
      )}
    </div>
  );
};

export default App;
