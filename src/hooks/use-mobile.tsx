
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Verifica inicialmente
    checkIfMobile()
    
    // Adiciona listener para redimensionamento
    window.addEventListener("resize", checkIfMobile)
    
    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return isMobile
}
