import { Outlet } from "react-router-dom";
import Header from '../components/Header.js'

function Layout(){


    return(<div>
        <Header />
        
         <Outlet />
            </div> );
}

export default Layout