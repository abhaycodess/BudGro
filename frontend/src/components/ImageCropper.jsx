import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { Box, Button, Slider, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

function getCroppedImg(imageSrc, crop) {
  // Utility to crop image from canvas
  return new Promise((resolve) => {
    const image = new window.Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
      resolve(canvas.toDataURL('image/jpeg'));
    };
  });
}

const ImageCropper = ({ open, image, onClose, onCropDone }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropDone = async () => {
    if (!croppedAreaPixels) return;
  const croppedImg = await getCroppedImg(image, croppedAreaPixels);
    onCropDone(croppedImg);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Crop your profile picture</DialogTitle>
      <DialogContent>
        <Box sx={{ position: 'relative', width: '100%', height: 300, bgcolor: '#222', borderRadius: 2 }}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(_, value) => setZoom(value)}
            aria-labelledby="Zoom"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleCropDone} variant="contained" color="primary">Crop & Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageCropper;
