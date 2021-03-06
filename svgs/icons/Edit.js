import * as React from "react"

function SvgComponent(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="prefix__h-5 prefix__w-5"
      viewBox="0 0 20 20"
      fill="orange"
      width={30}
      {...props}
    >
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-2.207 2.207L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  )
}

export default SvgComponent
