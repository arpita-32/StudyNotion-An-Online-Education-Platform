// This will prevent authenticated users from accessing this route
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

function OpenRoute({ children }) {
  const { token } = useSelector((state) => state.auth)

  if (token === null || token !== null) {
    return children
  } 
  if(token !== null){
   <Navigate to = "/dashboard/my-profile"/>
  }
}

export default OpenRoute