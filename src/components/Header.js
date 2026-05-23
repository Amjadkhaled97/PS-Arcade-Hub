import { NavLink } from "react-router-dom";

 function Header(){


    return(<div className="top-header">
      <h1>PS-Hub</h1>
      <nav>
        <ul>
          <li><NavLink to="/">POS</NavLink></li>
          <li><NavLink to="weekly-invoices">Weekly Invoices</NavLink></li>
        </ul>
      </nav>
    </div>);}

    export default Header