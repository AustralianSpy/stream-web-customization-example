import React from 'react'
import useQueryString from 'lib/hooks/use-query-string'

export const AttachmentContext = React.createContext()
export const useAttachmentContext = () => React.useContext(AttachmentContext)
export const AttachmentContextProvider = ({ children }) => {
  const { shared, att, id } = useQueryString()
  const [attType, setAttType] = React.useState(att)
  const [sharing, setSharing] = React.useState(!!shared)

  return (
    <AttachmentContext.Provider
      value={{ shared, attType, id, setAttType, sharing, setSharing }}
    >
      {children}
    </AttachmentContext.Provider>
  )
}
