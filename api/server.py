import subprocess
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import numpy as np
from PIL import Image
import base64
from transformers import SegformerImageProcessor, SegformerForSemanticSegmentation
import torch

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

SEGFORMER_MODEL_NAME = "nvidia/segformer-b5-finetuned-cityscapes-1024-1024"
CITYSCAPES_CLASSES = [
    "road", "sidewalk", "building", "wall", "fence", "pole", "traffic light", "traffic sign",
    "vegetation", "terrain", "sky", "person", "rider", "car", "truck", "bus", "train", "motorcycle", "bicycle"
]

def process_image_with_segformer(input_path, target_class):
    image = Image.open(input_path).convert("RGB")
    processor = SegformerImageProcessor.from_pretrained(SEGFORMER_MODEL_NAME)
    model = SegformerForSemanticSegmentation.from_pretrained(SEGFORMER_MODEL_NAME)

    inputs = processor(images=image, return_tensors="pt")
    original_size = image.size

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits

    class_idx = CITYSCAPES_CLASSES.index(target_class)
    seg_mask = logits.argmax(1).squeeze().cpu()
    mask = (seg_mask == class_idx).type(torch.uint8).numpy() * 255

    mask_pil = Image.fromarray(mask)
    return mask_pil.resize(original_size, Image.NEAREST)

def generate_unique_filename(folder, base_filename, suffix, extension):
    filename = f"{base_filename}_{suffix}.{extension}"
    return os.path.join(folder, filename)


def add_noise(image, mask, noise_level=25):
    noise = np.random.normal(0, noise_level, image.shape).astype(np.uint8)
    noisy_image = image.copy()
    noisy_image[mask == 1] = np.clip(cv2.add(image[mask == 1], noise[mask == 1]), 0, 255)
    return noisy_image

def apply_blur(image, mask, ksize=(31, 31)):
    blurred_image = image.copy()
    blurred_area = cv2.GaussianBlur(image, ksize, 0)
    blurred_image[mask == 1] = blurred_area[mask == 1]
    return blurred_image

def apply_deepfill(image_path, mask_path, output_path):
    try:
        checkpoint_path = "./deepfillv2-pytorch/pretrained/states_tf_places2.pth"
        
        command = [
            "python", "./deepfillv2-pytorch/test.py",
            "--image", image_path,
            "--mask", mask_path,
            "--out", output_path,
            "--checkpoint", checkpoint_path
        ]

        result = subprocess.run(command, capture_output=True, text=True)

        if result.returncode != 0:
            raise RuntimeError(f"DeepFill error: {result.stderr}")

        return True
    except Exception as e:
        raise RuntimeError(f"DeepFill processing failed: {e}")


@app.route('/pic', methods=['POST'])
def process_image():
    try:
        image_file = request.files['image']
        action = request.form['action']
        original_filename = os.path.splitext(image_file.filename)[0]
        input_path = os.path.join(UPLOAD_FOLDER, image_file.filename)

        mask_path = generate_unique_filename(PROCESSED_FOLDER, original_filename, "mask", "png")
        output_path = generate_unique_filename(PROCESSED_FOLDER, original_filename, "output", "png")

        image_file.save(input_path)

        mask_pil = process_image_with_segformer(input_path, "building")
        mask_pil.save(mask_path)

        cv_image = cv2.imread(input_path)
        cv_mask = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)

        if cv_image is None or cv_mask is None:
            return jsonify({'error': 'Failed to load image or mask.'}), 500

        _, binary_mask = cv2.threshold(cv_mask, 127, 1, cv2.THRESH_BINARY)

        if action == "noise":
            processed_image = add_noise(cv_image, binary_mask, noise_level=25)
        elif action == "blur":
            processed_image = apply_blur(cv_image, binary_mask, ksize=(31, 31))
        elif action == "generate-ai":
            apply_deepfill(input_path, mask_path, output_path)
            processed_image = cv2.imread(output_path)  # Load the output image
        else:
            return jsonify({'error': 'Invalid action selected.'}), 400

        cv2.imwrite(output_path, processed_image)
        with open(output_path, "rb") as f:
            output_base64 = base64.b64encode(f.read()).decode('utf-8')

        return jsonify({'output_image': output_base64})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
