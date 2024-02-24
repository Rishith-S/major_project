import { Typography,Grid,Box} from '@mui/material'
import React, { useEffect,useState } from 'react'

const LegendItem = ({ title, color }) => {
    const cust_style = {
        backgroundColor: color,
    };

    return (
        <React.Fragment>
            <Box  style={{ paddingBottom: "2px" ,padding:'5px'}}>
                <Box item sx={{}} style={{ display: 'flex', width:'10rem', justifyContent: "center",backgroundColor:color,color:'#0f2623',fontWeight:'600' }}>
                    {title}
                </Box>
                {/* <Box item sx={2}>
                    <Box sx={{ p: 2 }} style={cust_style}> </Box>
                </Box> */}
            </Box>
        </React.Fragment>
    );
}

const Legend = () => {
    return (
        <div>
            <Grid container direction="column" spacing={0}>
                <LegendItem title="Black Background" color="gray" />
                <LegendItem title="Abdominal" color="#D28C8C" />
                <LegendItem title="Liver" color="#FF7272" />
                <LegendItem title="Gastrointestinal Tract" color="#E7469C" />
                <LegendItem title="Fat" color="#BAB74B" />
                <LegendItem title="Grasper" color="#AAFF00" />
                <LegendItem title="Connective Tissue" color="#FF5500" />
                <LegendItem title="Blood" color="#FF0000" />
                <LegendItem title="Cystic Duct" color="#ffff00" />
                <LegendItem title="L-hook Electrocautery" color="#A9FFB8" />
                <LegendItem title="Gallbladder" color="#FFA0A5" />
                <LegendItem title="Hepatic Vein" color="#003280" />
                <LegendItem title="Liver Ligament" color="#6F4A00" />
            </Grid>
        </div >
    );
}



function Result() {

    const [fileList,setFileList] = useState(null)
    const [result,setResult] = useState(null)
    const [yolo,setYolo] = useState(null)
    const [predictedImage,setPredictedImage] = useState(null)

    useEffect(()=>{
        const storedImage = localStorage.getItem("image");
        if (storedImage) {
        setFileList(storedImage);
        }
        const storedResult = localStorage.getItem("result");
        if (storedResult) {
            setResult(storedResult)
        }
        const storedPredictedImage = localStorage.getItem("predictedImg");
        if (storedPredictedImage) {
            setPredictedImage(storedPredictedImage)
        }
        const yoloImage = localStorage.getItem("yolo");
        if (storedPredictedImage) {
            setYolo(yoloImage)
        }
    },[])
    return (
        <div>
            {fileList && (
                <>
                    <div
                        style={{
                            width:"50vw",
                            height:"50vh"
                        }}
                    > 
                        <Typography variant='h5'>Original Image</Typography>
                        <img style={{
                            width:"50vw",
                            height:"50vh"
                        }} src={`data:image/png;base64,${fileList}`} alt="Uploaded" />
                    </div>
                    <div style={{
                        display: 'inline-list-item'
                    }}>
                        <div 
                            style={{
                                marginTop:"2rem",
                                width:"50vw",
                                height:"50vh"
                            }}
                        >
                            <Typography variant='h5'>Segemnted Image</Typography>
                            <div style={{
                                display:'flex'
                            }}>
                                
                                <img style={{
                                    width:"50vw",
                                    height:"50vh"
                                }} src={`data:image/png;base64,${predictedImage}`} alt="Uploaded" />
                                <Legend style={{
                                    width:"50vw",
                                    height:"50vh"
                                }}/>
                            </div>
                        </div>
                        <div style={{
                            marginTop:"2rem",
                            width:"50vw",
                            height:"50vh"
                        }}>
                            <Typography variant='h5'>Result Image</Typography>
                            <img style={{   
                                width:"50vw",
                                height:"50vh"
                            }} src={`data:image/png;base64,${result}`} alt="Uploaded" />
                        </div>
                        <div style={{
                            marginTop:"2rem",
                            width:"50vw",
                            height:"50vh"
                        }}>
                            <Typography variant='h5'>Yolo Image</Typography>
                            <img style={{   
                                width:"50vw",
                                height:"50vh"
                            }} src={`data:image/png;base64,${yolo}`} alt="Uploaded" />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Result