import { useContext } from 'react'
import FileNameList from './FileNameList'
import Editor from './Editor'
import { PlaygroundContext } from '../../ReactPlayground/PlaygroundContext'
import { debounce } from 'lodash-es'


export default function CodeEditor() {
  const { files, selectedFileName, setFiles } = useContext(PlaygroundContext)
  
  const file = files[selectedFileName]  // App.tsx 的文件对象


  // 编辑器内容变化回调
  const onEditorChange = (value: string | undefined) => {
    console.log('编辑器内容变化', value);
    // 将 value 存在文件对象中
    files[file.name].value = value || ''
    setFiles({...files})
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <FileNameList/>
      <Editor file={file} onChange={debounce(onEditorChange, 500)} />
    </div>
  )
}
