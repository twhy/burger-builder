
import { Outlet } from "react-router-dom";
import { Header } from "./components";

function App() {
  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-12 pb-20">
      <Header />
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
