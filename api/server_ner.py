from flask import Flask, request, jsonify
import torch
from transformers import AutoTokenizer, AutoModelForTokenClassification
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)

save_directory = "./trained_model_ner"  # 모델이 저장된 디렉토리
model = AutoModelForTokenClassification.from_pretrained(save_directory)
tokenizer = AutoTokenizer.from_pretrained(save_directory)

id2label = model.config.id2label

def mask_sensitive_info(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    outputs = model(**inputs)

    predictions = torch.argmax(outputs.logits, dim=2)
    tokens = tokenizer.convert_ids_to_tokens(inputs["input_ids"][0])
    predicted_tags = [id2label[tag.item()] for tag in predictions[0]]

    masked_tokens = [
        "[MASK]" if tag in [f"LABEL_{i}" for i in range(1, 7)] else token
        for token, tag in zip(tokens, predicted_tags)
    ]

    return tokenizer.convert_tokens_to_string(masked_tokens)

@app.route('/ner', methods=['POST'])
def perform_ner():
    data = request.get_json()
    text = data.get('text', '')

    if not text:
        return jsonify({"message": "No text provided"}), 400

    try:
        masked_text = mask_sensitive_info(text)
        return jsonify({"message": "NER completed", "masked_text": masked_text}), 200
    except Exception as e:
        return jsonify({"message": "Error occurred", "error": str(e)}), 500

if __name__ == '__main__':
    
    app.run(port=5001, debug=True)
