self.addEventListener('message', (e) => {  // 接收主线程发送的消息

  const { imageData, width, height, quality } = e.data;

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageData, 0, 0, width, height);

  canvas.toBlob((blob) => {
    console.log(blob);
    const compressedFile = new File([blob], 'compressed.jpg', { type: blob.type });

    self.postMessage(compressedFile);  // 向主线程发送消息
  }, quality);
})