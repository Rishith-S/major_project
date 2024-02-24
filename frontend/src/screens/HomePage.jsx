import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {useNavigate} from "react-router-dom"
import { Box, Typography, Button } from "@mui/material";
import { ImageConfig } from "./ImageConfig";
import uploadImg from "../assets/cloud-upload-regular-240.png";
import axios from '../api/axios'

const HomePage = () => {
  const str = useSelector((state) => state.username);
  const capitalizedStr = str.charAt(0).toUpperCase() + str.slice(1);
  const wrapperRef = useRef(null);
  const [fileList, setFileList] = useState(null);
  
  const onFileDrop = (e) => {
    const newFile = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      // Get the Base64 string without the data URI prefix
      const base64String = reader.result.split(',')[1];
      localStorage.setItem("image",base64String)
    };

    // Read the file as a data URL (Base64 encoding)
    reader.readAsDataURL(newFile);
    setFileList(newFile);
  };

  const fileRemove = () => {
    setFileList(null);
  };

  const navigate = useNavigate()
  const [loading,setLoading] = useState(false)
  const handleSubmit = async () => {
    setLoading(true)
    const formData = new FormData();
    formData.append('file', fileList);
    const response = await axios.post('http://localhost:3001/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    
    const responseYolo = await axios.post('http://localhost:3001/object-to-img', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    
    if (fileList) {
      localStorage.setItem("result",response.data.result);
      localStorage.setItem("predictedImg",response.data.predictedImage);
      localStorage.setItem("yolo",responseYolo.data.yolo);
      navigate('/result')
      setLoading(false)
    }
  };

  useEffect(()=>{
    let timer = setTimeout(() => {
      localStorage.clear();
    }, 1000);
    return ()=>{
      clearTimeout(timer)
    }
  },[])

  return (
    <>{
      loading ? "Loading....." : (<div>
        <Typography
          variant="h3"
          style={{
            textAlign: "center",
            backgroundImage: "linear-gradient(to right, #e8133d, #134fe8)",
            color: "transparent",
            WebkitBackgroundClip: "text",
            fontWeight: 600,
            marginTop: "3rem",
          }}
        >
          Hello, {capitalizedStr}.
        </Typography>
        <Box
          sx={{
            position: "relative",
            margin: "2rem auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "20rem",
            width: { xs: "90%", sm: "80%", md: "70%", lg: "60%" },
            backgroundColor: "white",
            borderRadius: "0.5rem",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              margin: "1rem",
              color: "black",
              padding: "1rem",
              fontWeight: 650,
            }}
          >
            Drop File Input
          </Typography>
          <Box
            ref={wrapperRef}
            sx={{
              position: "relative",
              justifyContent: "center",
              alignItems: "center",
              height: "20vh",
              width: "80%",
              backgroundColor: "#ebf7fa",
              borderRadius: "0.5rem",
              border: "2px dashed #4267b2",
              color: "#4267b2",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              textAlign: "center",
            }}
          >
            <img
              src={uploadImg}
              alt=""
              style={{ width: "100px" }}
            />
            <Box sx={{ fontWeight: 600 }}>
              Drag and Drop your Files here
            </Box>
            <input
              type="file"
              value=""
              onChange={onFileDrop}
              style={{
                opacity: 0,
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                cursor: "pointer",
              }}
            />
          </Box>
          {fileList && fileList.type ? (
            <Box
              sx={{
                width: "100%",
                mt: "1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "50%", 
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                  borderRadius: "0.5rem",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom:'1rem'
                }}
              >
                <img
                  src={
                    (fileList && ImageConfig[fileList.type.split("/")[1]]) ||
                    ImageConfig["default"]
                  }
                  alt=""
                  style={{
                    backgroundColor: "var(--input-bg)",
                    padding: "15px",
                    borderRadius: "20px",
                    width: "75px",
                  }}
                />
                <div
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <Typography>{fileList.name}</Typography>
                  <Typography>{fileList.size}B</Typography>
                </div>
                <Typography
                  onClick={fileRemove}
                  sx={{
                    color: "red",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </Typography>
              </div>
              <Button
                variant="contained"
                sx={{ mt: "1rem" ,mb:'1rem'}}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Box>
          ) : null}
        </Box>
      </div>)
    }
    </>
  );
};

export default HomePage;
