import {Routes,Route} from 'react-router-dom';
import Pos from "./pages/Pos";
import WeeklyInvoices from "./pages/WeeklyInvoices";
import Layout from './pages/Layout';
import { InvoiceProvider } from './context/invoicesContext';
function App() {

  return (
    <InvoiceProvider>
    <Routes>
      <Route path="/" element={<Layout />}>
      <Route index element={<Pos />} />
      <Route path="weekly-invoices" element={<WeeklyInvoices />}/>
      </Route>
    </Routes>
    </InvoiceProvider>
  );
}

export default App;