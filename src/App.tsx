import { useState } from 'react'
import './App.css'
import { saveAs } from 'file-saver'

function App() {
  const worker = new Worker('worker.js');
  
  const [files, setFiles] = useState<File[]>([])

  const [loading, setLoading] = useState(false)

  const handleFileChange = (event: any) => {
    setFiles(Array.from(event.target.files))
  }

  const handleSave = () => {

    setLoading(true)
    
    worker.postMessage({ files });

    worker.onmessage = function (e) {
      const blobContent = e.data;
      saveAs(blobContent, "xx.zip");
      setLoading(false)
    };

    worker.onerror = function (error) {
      console.error('Error from worker:', error);
      setLoading(false)
    };
  }

  return (
    <>
      <div>
        <input type="file" multiple onChange={handleFileChange} />
        {files.length ? <button onClick={handleSave}> {loading ? '处理中' : '压缩'}</button> : null}
      </div>
    </>
  )
}

export default App
