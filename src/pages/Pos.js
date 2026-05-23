import DeviceCard from "../components/DeviceCard";
import { useState, useEffect } from "react";
import { useInvoice } from "../context/invoicesContext";
import { useNavigate } from "react-router-dom";

function Pos() {
  //.....STATES.....
  const [device, setDevice] = useState({
    1: {
      seconds: 0,
      running: false,
      startTime: null,
      mode: "multi",
    },
    2: {
      seconds: 0,
      running: false,
      startTime: null,
      mode: "multi",
    },
    3: {
      seconds: 0,
      running: false,
      startTime: null,
      mode: "multi",
    },
  });
  const [todayInvoices, setTodayInvoices] = useState(() => {
    const saved = localStorage.getItem("todayInvoices");
    return saved ? JSON.parse(saved) : [];
  });
  const { addInvoices } = useInvoice();

  const [showForm, setShowForm] = useState(false);
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [orders, setOrders] = useState([]);
  const [ordersmodal, showOrdersModal] = useState(false);
  const [confirmModal, showConfirmModal] = useState(false);
  function formatDate(dateString) {
    const date = new Date(dateString).toISOString().split("T")[0];
    return date;
  }

  //..........
  const navigate = useNavigate();
  //..........

  //.......TIMER.......
  useEffect(() => {
    const interval = setInterval(() => {
      setDevice((prev) => {
        const newDevice = {};
        for (let i = 1; i <= 3; i++) {
          if (prev[i].running && prev[i].startTime) {
            const elapsed = Math.floor((Date.now() - prev[i].startTime) / 1000);
            newDevice[i] = { ...prev[i], seconds: elapsed };
          } else {
            newDevice[i] = { ...prev[i] };
          }
        }

        return newDevice;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /*LOCAL STORAGE........... */
  useEffect(() => {
    localStorage.setItem(
      "todayInvoices",
      JSON.stringify(todayInvoices) || "[]",
    );
  }, [todayInvoices]);

  /*calc total invoices cost */
  const totalIncome = todayInvoices.reduce((tot, inv) => tot + inv.gameCost, 0);

  //HANDLING FUNCTIONS....

  const handleToggle = (id) => {
    setDevice((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        running: !prev[id].running,
        startTime: Date.now() - prev[id].seconds * 1000,
      },
    }));
  };

  const handleReset = (id) => {
    setDevice((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        running: false,
        seconds: 0,
        startTime: null,
        orders: [],
        mode: "multi",
      },
    }));
  };

  const handleAddOrder = (product, price, quantity) => {
    const order = {
      product,
      price: Number(price),
      quantity: Number(quantity),
    };
    setOrders((prev) => [...prev, order]);

    setPrice("");
    setProduct("");
    setQuantity("");
  };

  const handleEndSession = (id, invoice) => {
    handleReset(id);
    setTodayInvoices((prev) => [...prev, invoice]);
  };

  const handleModeChange = (id, mod) => {
    setDevice((prev) => ({
      ...prev,
      [id]: { ...prev[id], mode: mod },
    }));
  };

  const handleEndDay = () => {
    addInvoices(todayInvoices);
    setTodayInvoices([]);
    navigate("/weekly-invoices");
  };

  const clacOrdersCost = () => {
    let ordersCost = 0;
    orders.forEach((order) => {
      ordersCost += order.price * order.quantity;
    });
    return ordersCost;
  };

  return (
    <div>
      <div className="container">
        <div className="income-details">
          <div className="income">Income: {totalIncome} SYP</div>
          <div className="profit">
            Profit: {Math.floor(totalIncome / 3)} SYP
          </div>
        </div>

        <DeviceCard
          id={3}
          seconds={device[3].seconds}
          running={device[3].running}
          mode={device[3].mode}
          startTime={device[3].startTime}
          onToggle={handleToggle}
          onEndSession={handleEndSession}
          onModeChange={handleModeChange}
          orders={orders}
        />

        <DeviceCard
          id={2}
          seconds={device[2].seconds}
          running={device[2].running}
          mode={device[2].mode}
          startTime={device[2].startTime}
          onToggle={handleToggle}
          onEndSession={handleEndSession}
          onModeChange={handleModeChange}
          orders={orders}
        />

        <DeviceCard
          id={1}
          seconds={device[1].seconds}
          running={device[1].running}
          mode={device[1].mode}
          startTime={device[1].startTime}
          onToggle={handleToggle}
          onEndSession={handleEndSession}
          onModeChange={handleModeChange}
          orders={orders}
        />
      </div>
      <div className="motion">
        <div className="solar-system">
          <div className="sun">
            <div className="corona"></div>
          </div>

          <div className="orbit mercury-orbit">
            <div className="planet mercury"></div>
          </div>

          <div className="orbit venus-orbit">
            <div className="planet venus"></div>
          </div>

          <div className="orbit earth-orbit">
            <div className="planet earth">
              <div className="moon"></div>
            </div>

            <div className="iss">
              <div className="iss-panels"></div>
            </div>
          </div>

          <div className="orbit mars-orbit">
            <div className="planet mars"></div>
          </div>

          <div className="stars">
            <div className="star star-1"></div>
            <div className="star star-2"></div>
            <div className="star star-3"></div>
            <div className="star star-4"></div>
            <div className="star star-5"></div>
          </div>
        </div>
      </div>
      <br />
      <div className="ordersBtn-container">
        <button onClick={() => setShowForm(true)}>ADD ORDERS</button>
        <button
          style={{ marginLeft: "10px" }}
          onClick={() => showOrdersModal(true)}
        >
          SHOW ORDERS
        </button>
      </div>
      <hr />

      <div className="today-invoices">
        <header>
          <h2>INVOICES OF TODAY</h2>
        </header>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Game Cost</th>
              <th>Device Id</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>

          <tbody>
            {todayInvoices.length === 0 ? (
              <tr>
                <td>No Invoices Yet</td>
              </tr>
            ) : (
              todayInvoices.map((invoice, index) => (
                <tr key={index}>
                  <td>{formatDate(invoice.date)}</td>
                  <td>{invoice.gameCost}</td>
                  <td>{invoice.deviceId}</td>

                  <td>
                    {new Date(invoice.startTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>

                  <td>
                    {new Date(invoice.endTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Adding Orders Form (byDefault is hidden) */}

        {showForm && (
          <div className="modal">
            <form>
              <label for="product">Product</label>
              <input
                value={product}
                id="product"
                required
                type="text"
                onChange={(e) => setProduct(e.target.value)}
              />

              <label for="price">Price</label>
              <input
                value={price}
                id="price"
                required
                type="text"
                onChange={(e) => setPrice(e.target.value)}
              />

              <label for="quantity">Quantity</label>
              <input
                value={quantity}
                id="quantity"
                required
                type="text"
                onChange={(e) => setQuantity(e.target.value)}
              />
              <div
                className="formBtnContainer"
                style={{ gridColumn: "span 2" }}
              >
                <button onClick={() => setShowForm(false)}>Cancel</button>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddOrder(product, price, quantity);
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}

        {/*  ORDERS MODAL*/}
        {ordersmodal && (
          <div className="modal" onClick={() => showOrdersModal(false)}>
            <div
              className="invoice-section modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ textAlign: "center" }}>🍔 Orders</h3>
              {orders.length === 0 ? (
                <p>No orders</p>
              ) : (
                <ul className="orders-list">
                  {orders.map((order, index) => (
                    <li key={index}>
                      <span>{order.product}</span>
                      <span>{order.quantity}</span>
                      <span>
                        {(order.price * order.quantity).toLocaleString()} SYP
                      </span>
                    </li>
                  ))}
                  <span> total: {clacOrdersCost().toLocaleString()} SYP</span>
                </ul>
              )}
              <div
                className="ordersBtn-container"
                style={{
                  display: "flex",
                }}
              >
                <button
                  className="orderModal-btn"
                  onClick={() => showOrdersModal(false)}
                >
                  Close
                </button>
                <button
                  className="orderModal-btn"
                  style={{
                    backgroundColor: "red",
                  }}
                  onClick={() => {
                    if (orders.length > 0) showConfirmModal(true);
                  }}
                >
                  ACOUNTING
                </button>
              </div>
            </div>
          </div>
        )}
        {/*CONFIRMATION MODAL */}
        {confirmModal && (
          <div className="modal">
            <div className="modal-content">
              <h1 style={{ textAlign: "center" }}>CONFIRMATION!!!</h1>
              <p>Are You Sure You Want To Accounting</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <button
                  onClick={() => showConfirmModal(false)}
                  className="orderModal-btn"
                >
                  no
                </button>
                <button
                  onClick={() => {
                    setOrders([]);
                    showConfirmModal(false);
                  }}
                  className="orderModal-btn"
                >
                  YES
                </button>
              </div>
            </div>
          </div>
        )}

        <button onClick={() => handleEndDay()} className="end-day-btn">
          END THE DAY && Move The Invoices
        </button>
      </div>
    </div>
  );
}

export default Pos;
