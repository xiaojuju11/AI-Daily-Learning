# 大文件上传
- 前端：前端客户端读取到用户上传的文件，然后借助文件对象当中自带的slice方法，将文件对象进行切片处理,
然后紧接着再给每一个文件片段去打上标记，就是我们说的chunk片段的名字打上标记，最终再将所有片段全部转换成放表单格式，其实就十六进制数据，然后再依次向后端发送请求

1. 用户选中一个大文件
2. 前端将大文件切分成多个小文件 （文件切片），借助文件对象自带的slice方法，使用 new FormData()创建一个实例，将文件、文件名、片段名、片段大小、片段索引添加（append）到实例中,在formData实例中的资源默认都会被转成十六进制，（base64太长了。）
    function createChunk(file, size = 5 * 1024 * 1024) {
      const chunkList = []
      let cur = 0
      while (cur < file.size) {
        chunkList.push(
          {file: file.slice(cur, cur + size)}
        )
        cur += size
      }
      return chunkList
    }
   
   function uploadChunks(chunks) {
      const formChunks = chunks.map(({file, fileName, chunkName, size, index}) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('fileName', fileName)
        formData.append('chunkName', chunkName)
        return {formData, index}
      })
   }
3. 前端将多个小文件并发上传到后端
4. 后端接收多个小文件并合并成大文件
5. 后端保存合并后的大文件

# 暂停续传
当片段传输到一半的时候，用户可以暂停上传，再次点击继续传输时，向后端发送请求，获取到后端已经接收的片段数量，前端将未上传的片段继续上传。

