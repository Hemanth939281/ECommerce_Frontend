import Body from "./components/Body";
import Header from "./components/Header";
import {Toaster} from "react-hot-toast"


function App() {

  return (
    <>
      <div className="max-w-6xl mx-auto shadow-lg w-full">
       <Header/>
       <Body/>
       <Toaster position="top-center"/>
      </div>
    </>
  )
}

export default App
