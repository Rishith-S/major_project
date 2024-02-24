from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from PIL import Image
from tensorflow.keras.applications.resnet50 import preprocess_input
from tensorflow.keras.models import load_model
import io
import uvicorn
# Initialize the FastAPI app
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the pre-trained ResNet50 model
model = load_model('C:/Users/rishi/Downloads/major_project/api/resnet50_backbone.hdf5')

# Define class labels
class_labels = ['bkl', 'nv', 'df', 'mel', 'vasc', 'bcc', 'akiec']

# Define an endpoint to handle image classification

@app.get("/")
async def ping():
    return "Heyyy suppp"


@app.post("/predict")
async def predict_skin_cancer(file: UploadFile = File(...)):
    # Read the image file
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).resize((100, 75))
    image_array = np.asarray(image, dtype=np.float32) / 255.0  # Normalize
    image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension
    image_array = preprocess_input(image_array)  # Preprocess for ResNet50

    # Get the prediction label
    prediction = model.predict(image_array)
    predicted_class = np.argmax(prediction)
    predicted_label = class_labels[predicted_class]

    return {"predicted_label": predicted_label}

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=3001)