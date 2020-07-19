import React, {useEffect, useRef, useState} from 'react'
import {RelayPaginationProp} from 'react-relay'

const useLoadMoreOnScrollBottom = (
  relay: RelayPaginationProp,
  options?: IntersectionObserverInit
) => {
  const {loadMore, hasMore, isLoading} = relay
  const [intersectionObserver] = useState(() => {
    return new IntersectionObserver((entries) => {
      const [entry] = entries
      if (entry.intersectionRatio > 0) {
        if (!hasMore() || isLoading()) return
        loadMore(20)
      }
    }, options)
  })
  const lastItemRef = useRef<HTMLDivElement>()
  useEffect(() => {
    return () => {
      intersectionObserver.disconnect()
    }
  }, [])
  return (
    <div
      ref={(c) => {
        if (c) {
          intersectionObserver.observe(c)
          lastItemRef.current = c
        } else if (lastItemRef.current) {
          intersectionObserver.unobserve(lastItemRef.current)
        }
      }}
    />
  )
}

export default useLoadMoreOnScrollBottom
