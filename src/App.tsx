import { useState } from 'react'
import './App.css'
import { saveAs } from 'file-saver'

function App() {
  const [files, setFiles] = useState<File[]>([])

  const handleFileChange = (event: any) => {
    setFiles(Array.from(event.target.files))
  }

  const handleSave = () => {
    
    const worker = new Worker('worker.js');
    worker.postMessage({ files });

    worker.onmessage = function (e) {
      const blobContent = e.data;
      saveAs(blobContent, "xx.zip");
    };

    worker.onerror = function (error) {
      console.error('Error from worker:', error);
    };
  }

  return (
    <>
      <div>
        <input type="file" multiple onChange={handleFileChange} />
        {files.length ? <button onClick={handleSave}>Compress</button> : null}
      </div>
    </>
  )
}

export default App
