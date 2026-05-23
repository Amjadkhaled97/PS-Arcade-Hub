import { useInvoice } from "../context/invoicesContext";

function WeeklyInvoices() {
  const { weekInvoices, deleteDayInvoices } = useInvoice();

  console.log(weekInvoices);

  const formatDate = (dateString) => {
    const date = new Date(dateString).toISOString().split("T")[0];
    return date;
  };

  const pad = (num) => {
    if (num < 10) return `0${num}`;
    else {
      return String(num);
    }
  };
  let totalDayCost = 0;
  const calc = (s) => {
    totalDayCost += s;
  };

  /*print function */

  /*Print all table FUNCTOIN */

  const printAllTables = () => {
    if (weekInvoices.length === 0) return;

    let tablesHTML = "";

    weekInvoices.forEach((dayInvoice, i) => {
      const date = new Date(dayInvoice[0].date).toISOString().split("T")[0];
      const table = document.getElementById(`table-${i}`);
      if (table) {
        tablesHTML += `<h2 style="margin-top:30px;">${date}</h2>`;
        tablesHTML += table.outerHTML;
      }
    });

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
    <html>
      <head>
        <title>Weekly Invoices Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; margin-bottom: 5px; }
          h2 { text-align: center; color: #333; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: center; }
          th { background-color: #f0f0f0; }
          @media print {
            
            h2:first-child { page-break-before: avoid; }
          }
        </style>
      </head>
      <body>
        <h1>🎮 PS Arcade Hub</h1>
        <p style="text-align:center;">Weekly Invoices Report</p>
        ${tablesHTML}
      </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div>
      {weekInvoices.length === 0 ? (
        <div className="empty-state">
          <h2>No Invoices Found....</h2>
          <p>
            You haven't recorded any daily closures yet. Please come back later
            after closing your workday.
          </p>
        </div>
      ) : (
        weekInvoices.map((dayInvoice, index) => {
          totalDayCost = 0;
          return (
            <table key={index} className="day-invoice" id={`table-${index}`}>
              <thead>
                <tr>
                  <th>Device</th>
                  <th>Game Time</th>
                  <th>Time cost</th>
                </tr>
              </thead>
              <tbody>
                {dayInvoice.map((invoice, index) => (
                  <tr key={index}>
                    <td>{invoice.deviceId}</td>
                    <td>
                      {pad(invoice.gameHours) + ":" + pad(invoice.gameMinutes)}
                    </td>
                    <td>
                      {calc(invoice.gameCost)}
                      {invoice.gameCost}
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <td style={{ textAlign: "center" }}>
                    Invoice Day : {formatDate(dayInvoice[0].date)}
                  </td>
                  <td>
                    <button
                      className="no-print"
                      onClick={() => deleteDayInvoices(index)}
                      style={{ marginLeft: "25%" }}
                    >
                      DELETE
                    </button>
                  </td>

                  <td style={{ textAlign: "center" }}>TOTAL: {totalDayCost}</td>
                </tr>
              </tfoot>
            </table>
          );
        })
      )}

      {weekInvoices.length > 0 && (
        <button className="printall-btn" onClick={printAllTables}>
          🖨️ Print All Week
        </button>
      )}
    </div>
  );
}

export default WeeklyInvoices;
