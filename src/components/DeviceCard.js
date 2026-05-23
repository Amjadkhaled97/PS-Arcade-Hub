import { useState } from "react";

function DeviceCard({
  id,
  seconds,
  startTime,
  running,
  onToggle,
  onEndSession,
  onModeChange,
  mode,
  orders,
}) {
  const hourPrice = mode === "multi" ? 10000 : mode === "three" ? 15000 : 20000;

  /*STATES... */

  const [invoiceData, setInvoiceData] = useState({
    deviceId: 0,
    gameHours: 0,
    gameMinutes: 0,
    gameCost: 0,
    orders: [],
    ordersCost: 0,
    totalCost: 0,
  });

  const [invoiceModal, showInvoiceModal] = useState(false);
  const [paymentModal, showPaymentModal] = useState(false);
  const pad = (num) => {
    if (num < 10) return `0${num}`;
    else {
      return String(num);
    }
  };

  const calculateInvoice = () => {
    const gameHours = hours;
    const gameMinutes = minutes;
    const gameCost = Math.ceil((hours + minutes / 60) * hourPrice);
    let ordersCost = 0;
    orders.forEach((order) => {
      ordersCost += order.price * order.quantity;
    });

    const totalCost = ordersCost + gameCost;

    const endTime = startTime ? startTime + seconds * 1000 : Date.now();

    return {
      deviceId: id,
      date: Date.now(),
      startTime,
      endTime,
      gameHours,
      gameMinutes,
      gameCost,
      orders,
      ordersCost,
      totalCost: Math.ceil(totalCost),
    };
  };

  const showInvoice = () => {
    const invoice = calculateInvoice();

    if (invoice.totalCost === 0) return;
    setInvoiceData(invoice);
    showInvoiceModal(true);
  };

  const endSession = () => {
    const invoice = calculateInvoice();
    if (invoice.totalCost === 0) return;
    onEndSession(id, invoice);
  };

  /*CONVERTING SECONDS  */
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const displaySeconds = seconds % 60;

  return (
    <div>
      <div className={running ? "deviceCard running" : "deviceCard"}>
        <h2>Device {id}</h2>
        {running && <span className=" playing">PLAYING...</span>}
        <p>{`${pad(hours)}:${pad(minutes)}:${pad(displaySeconds)}`}</p>

        <select
          disabled={running}
          value={mode}
          onChange={(e) => onModeChange(id, e.target.value)}
        >
          <option value="multi">🎮 Multi</option>
          <option value="three">👥 Three</option>
          <option value="four">👨‍👩‍👧‍👦 Four</option>
        </select>

        {!running && (
          <button className="start-btn" onClick={() => onToggle(id)}>
            {running === true ? "Stop" : "Start"}
          </button>
        )}

        {/*<button onClick={()=>onReset(id)}>Reset</button>*/}
        {running && (
          <div className="btnContainer">
            <button onClick={() => showInvoice()}>Show Invoice</button>
            <button
              onClick={() => {
                showPaymentModal(true);
                const invoice = calculateInvoice();
                setInvoiceData(invoice);
              }}
            >
              Pay & Finish
            </button>
          </div>
        )}
      </div>

      {/* INVOICE MODAL  */}
      {invoiceData && invoiceModal && (
        <div className="modal" onClick={() => showInvoiceModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>🧾 Invoice - Device {invoiceData.deviceId}</h2>
            <hr />

            <div className="invoice-section">
              <h3>🎮 Game Time</h3>
              <p>
                Duration:{" "}
                <strong>
                  {pad(invoiceData.gameHours)}:{pad(invoiceData.gameMinutes)}
                </strong>
              </p>
              <p>
                Time Cost:{" "}
                <strong>{invoiceData.gameCost.toLocaleString()} SYP</strong>
              </p>
            </div>

            <hr />
            <div className="total-section">
              <h3>💰 Total: {invoiceData.gameCost.toLocaleString()} SYP</h3>
            </div>

            <button
              className="close-btn"
              onClick={() => showInvoiceModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* PAYMENT MODAL */}

      {paymentModal && (
        <div className="modal" onClick={() => showPaymentModal(false)}>
          <div
            className="modal-content payment-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="payment-icon">💳</div>

            <h2>Confirm Payment</h2>
            <p className="payment-amount">
              {invoiceData.gameCost.toLocaleString()} SYP
            </p>

            <p className="payment-question">Has the customer paid?</p>

            <div className="payment-buttons">
              <button
                className="btn-confirm"
                onClick={() => {
                  endSession();
                  showPaymentModal(false);
                }}
              >
                ✅ Confirm Payment
              </button>
              <button
                className="btn-cancel"
                onClick={() => showPaymentModal(false)}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeviceCard;
