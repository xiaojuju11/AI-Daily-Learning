import { useState } from "react";

export default function Control() {
  const [message, setMessgae] = useState('123')

  function changeHandler(e) {
    console.log(e.target.value);
    setMessgae(e.target.value)
  }

  return (
    <div>
      <input type="text" value={message} onChange={changeHandler}/>
    </div>
  )
}
