import React, { useEffect } from 'react'

import useListStore from '../store/list.js'

export default function List() {
    const list = useListStore((state) => state.list)
    const fetchList = useListStore((state) => state.fetchList)
    useEffect(() => {
        fetchList()
    }, [fetchList])
  return (
    <div>
        {
            list.map((item) => (
                <div key={item.id}>
                    {item.name}
                </div>
            ))
        }
    </div>
  )
}
