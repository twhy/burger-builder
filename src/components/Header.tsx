import { useNavigate, useLocation } from "react-router-dom";
import { delToken } from '../utils'
import logo from "../assets/logo.png";

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const showLogoutLink =  ['/builder'].includes(location.pathname)

  function logout() {
    delToken()
    navigate('/login')
  }

  return (
    <header className="text-3xl sm:text-4xl text-orange-600 font-semibold py-2 sm:py-5 border-b flex items-center -mx-6 px-6 sm:-mx-12 sm:px-12">
      <img src={logo} className="w-12 h-12 sm:w-16 sm:h-16 mr-4 sm:mr-6" />
      <h1 className="flex-1">Burger Builder</h1>
      { showLogoutLink ? <span onClick={logout} className="text-base text-orange-600 font-medium cursor-pointer">Logout</span> : null }
    </header>
  );
}