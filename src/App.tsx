import { useState } from 'react'

import './App.css'
import jszip from 'jszip'
import { saveAs } from 'file-saver'
type FileObj = {
  name: string
  data: string
}
function App() {

  const [files, setFiles] = useState<File[]>([])
  const handleFileChange = (event: any) => {
    setFiles(Array.from(event.target.files))
  }

  const readToBase64 = (file: File): Promise<FileObj> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = e => {
        if (!e.target) {
          reject(e)
          return
        }
        const result = e.target.result as string;
        resolve({
          data: result.split(",")[1],
          name: file.name
        })
      }

      reader.readAsDataURL(file)
    })

  }

  const handleSave = () => {
    const zip = new jszip()
    const filePromises = files.map(file => {
      return readToBase64(file)
    })

    Promise.all(filePromises)
      .then(files => {
        files.forEach(file => {
          console.log(file)
          zip.file(file.name, file.data, { base64: true })
        })
      })
      .then(() => {
        return zip.generateAsync({ type: 'blob' })
      })
      .then(blobContent => {
        saveAs(blobContent, "xx.zip")
      })
  }
  return (
    <>
      <div>
        <input type="file" multiple onChange={handleFileChange} />
        {
          files.length ? <button onClick={handleSave}>压缩</button> : null
        }

      </div>
    </>
  )
}

export default App
