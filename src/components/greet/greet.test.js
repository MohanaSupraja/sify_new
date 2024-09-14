// import { render,screen } from "@testing-library/react";
// import { Greet } from "./greet";
// test("Greet renders correctly",()=>{
// render(
//     <Greet/>
// )
// const text = screen.getByText(/Hello/i)
// expect(text).toBeInTheDocument()
// })




//greet should render hello and if name is passed into comp it should render hello name
import { render,screen } from "@testing-library/react"
import { Greet } from "./greet"
test("Greet renders correctly2",()=>{
    render(<Greet/>)
    const text=screen.getByText("hello")
    expect(text).toBeInTheDocument()

})

test("Greet renders correctly2",()=>{
    render(<Greet name="Supraja" />)
    const text=screen.getByText("hello Supraja")
    expect(text).toBeInTheDocument()
})