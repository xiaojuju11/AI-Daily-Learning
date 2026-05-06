import { useState } from 'react'
import './app.css'

export default function Calendar(props) {
  // console.log(props);
  
  const [date, setDate] = useState(new Date())

  const handlePrevMounth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))
  }

  const handleNextMounth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))
  }

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

  // 处理日期
  const daysOfMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }
  const firstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }
  const renderDates = () => {
    const days = []
    const daysCount = daysOfMonth(date.getFullYear(), date.getMonth())
    const firstDay = firstDayOfMonth(date.getFullYear(), date.getMonth())

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className='empty'></div>)
    }

    for (let j = 1; j <= daysCount; j++) {
      const clickhandler = () => {
        const curDate = new Date(date.getFullYear(), date.getMonth(), j)
        setDate(curDate)
        props.onChange?.(curDate)
      }

      if (j === date.getDate()) {
        days.push(<div key={j} className='day selected' onClick={() => clickhandler()}>{j}</div>)
      } else {
        days.push(<div key={j} className='day' onClick={clickhandler}>{j}</div>)
      }
      
    }

    
    
    return days
  }

  return (
    <div className='calendar'>
      <div className="header">
        <button onClick={handlePrevMounth}>&lt;</button>
        <div>{date.getFullYear()}年{monthNames[date.getMonth()]}</div>
        <button onClick={handleNextMounth}>&gt;</button>
      </div>
      <div className="days">
        <div className="day">日</div>
        <div className="day">一</div>
        <div className="day">二</div>
        <div className="day">三</div>
        <div className="day">四</div>
        <div className="day">五</div>
        <div className="day">六</div>
        {renderDates()}
      </div>
    </div>
  )
}
