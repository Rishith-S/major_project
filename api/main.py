from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import base64
from base64 import b64encode
from json import dumps
import numpy as np
from io import BytesIO
from PIL import Image
import cv2
import tensorflow as tf
import io
import torch
import json
from starlette.responses import Response


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

model = tf.keras.models.load_model("./resnet50_backbone.hdf5")

# CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

img_class={
    0: (127,127,127),
    1: (200 ,143, 142),
    2: (238 ,122 ,118),
    3: (213 ,83 ,153),
    4: (186 ,183 ,92),
    5: (189, 253, 80),
    6: (236 ,98 ,43),
    7: (234, 51, 35),
    8: (255 ,255 ,84),
    9: (188, 253, 190),
    10: (242 ,164 ,167),
    11: (17 ,49, 123),
    12: (106 ,76 ,21),
    13: (255, 255, 255)
}



@app.get("/")
async def ping():
    return "Heyyy suppp"

def new_annotations(numpydata):
    new_np = np.zeros((len(numpydata),len(numpydata[0]),3)).astype('uint8')
    for i in range(len(numpydata)):
        for j in range(len(numpydata[0])):
            val=numpydata[i][j]
            new_np[i][j]=img_class[val]
    # img =cv2.cvtColor(new_np, cv2.COLOR_BGR2RGB)
    img = cv2.resize(new_np, (854, 480))
    # cv2.imwrite('C:/Users/rishi/Downloads/major_project/api/result.png',img)
    return img

def result(org_img,result_img):
    original = cv2.resize(org_img, (854, 480))
    # result_img = cv2.imread('C:/Users/rishi/Downloads/major_project/api/result.png')
    inp = np.zeros((480,854,3)).astype('uint8')
    for x in range(480):
        for y in range(854):
            inp[x][y][0]=original[x][y][0]/2+ result_img[x][y][0]/2
            inp[x][y][1]=original[x][y][1]/2+ result_img[x][y][1]/2
            inp[x][y][2]=original[x][y][2]/2+ result_img[x][y][2]/2
    img =cv2.cvtColor(inp, cv2.COLOR_BGR2RGB)
    img = cv2.resize(inp, (854, 480))
    # cv2.imwrite('C:/Users/rishi/Downloads/major_project/api/help.png',img)
    print(type(img))
    return img

def read_file_as_image(data):
    image = Image.open(BytesIO(data))
    return image


def imgToBase64(img):
    image_pil = Image.fromarray(img)
    image_stream = io.BytesIO()
    image_pil.save(image_stream, format='PNG')
    image_stream.seek(0)
    base64_image = base64.b64encode(image_stream.read()).decode('utf-8')
    return base64_image

def get_yolov5():
    model = torch.hub.load('./yolov5', 'custom', path='best_new_surgical.pt', source='local' ,force_reload=True) 
    model.conf = 0.5
    return model

def get_image_from_bytes(binary_image, max_size=1024):
    input_image = Image.open(io.BytesIO(binary_image)).convert("RGB").resize((640,640))
    return input_image

def get_image_from_bytes_for_segmentation(binary_image):
    input_image = Image.open(io.BytesIO(binary_image)).convert("RGB")
    print(input_image.size)
    input_image.save("tempinp.png")



model_yolo = get_yolov5()


@app.post("/object-to-json")
async def detect_return_json_result(file: bytes = File(...)):
    input_image = get_image_from_bytes(file)
    results = model_yolo(input_image)
    print(results)
    detect_res = results.pandas().xyxy[0].to_json(orient="records") 
    detect_res = json.loads(detect_res)
    return {"result": detect_res}


@app.post("/object-to-img")
async def detect_return_base64_img(file: bytes = File(...)):
    input_image = get_image_from_bytes(file)
    results = model_yolo(input_image)
    detect_res = results.pandas().xyxy[0].to_json(orient="records") 
    detect_res = json.loads(detect_res)
    results.render() 
    li=set() 
    for i in detect_res:
        li.add(i["name"])
    print(li)
    # for img in results.ims:
    pil_img=Image.fromarray(results.ims[0]).resize((832,480))
    pil_img.save("temp.png")
    with open('temp.png', 'rb') as open_file:
        byte_content = open_file.read()
    base64_bytes = b64encode(byte_content)
    base64_string = base64_bytes.decode('utf-8')
    # raw_data = {"image": base64_string}
    # json_data = dumps(raw_data, indent=2)
    return {"yolo":base64_string}


@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):
    x = read_file_as_image(await file.read())
    test_img = np.array(x)
    test_img = cv2.cvtColor(test_img,cv2.COLOR_BGR2RGB)
    test_img = cv2.resize(test_img, (128, 128))
    test_img = Image.fromarray(test_img)
    test_img = np.array(test_img)
    test_img_input=np.expand_dims(test_img, 0)
    prediction = (model.predict(test_img_input))
    predicted_img=np.argmax(prediction, axis=3)[0,:,:]
    result_img=new_annotations(predicted_img)
    img=result(np.array(x),result_img)
    result_b64 = imgToBase64(img)
    predicted_b64 = imgToBase64(result_img)
    # #yolov5
    # input_image = get_image_from_bytes(file)
    # results = model_yolo(input_image)
    # detect_res = results.pandas().xyxy[0].to_json(orient="records") 
    # detect_res = json.loads(detect_res)
    # results.render() 
    # li=set() 
    # for i in detect_res:
    #     li.add(i["name"])
    # print(li)
    # # for img in results.ims:
    # pil_img=Image.fromarray(results.ims[0]).resize((832,480))
    # pil_img.save("temp.png")
    # with open('temp.png', 'rb') as open_file:
    #     byte_content = open_file.read()
    # base64_bytes = b64encode(byte_content)
    # base64_string = base64_bytes.decode('utf-8')
    # # raw_data = {"image": base64_string}
    # # json_data = dumps(raw_data, indent=2)
    # # return {"result": li, "img":Response(content=json_data, media_type="image/jpeg")}
    
    return {
        'result' : result_b64,
        'predictedImage' : predicted_b64
    }

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=3001)
