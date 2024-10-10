importScripts('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js');

self.onmessage = async function (e) {
  const files = e.data.files;

  const zip = new JSZip();
  const filePromises = files.map(file => {
    return readToBase64(file);
  });

  const processedFiles = await Promise.all(filePromises);

  processedFiles.forEach(file => {
    zip.file(file.name, file.data, { base64: true });
  });

  const blobContent = await zip.generateAsync({ type: 'blob' });

  // 发送生成的压缩文件回到主线程
  self.postMessage(blobContent);
};

function readToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      if (!e.target) {
        reject(e);
        return;
      }
      const result = e.target.result;
      resolve({
        data: result.split(",")[1],
        name: file.name
      });
    };

    reader.readAsDataURL(file);
  });
}
