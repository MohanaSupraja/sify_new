// import React from 'react'

// export const Greet = () => {
//   return (
//     <div>hello</div>
//   )
// }

import React from 'react'

export const Greet = (props) => {
    console.log(props.name)
  return (
    <div>hello {props.name}</div>
  )
}