import { useEffect, useState } from "react";
import CurrenceySelect from "./CurrenceySelect";

function Converter() {
  const [fromCurrencey, setFromCurrencey] = useState("USD");
  const [toCurrencey, setToCurrencey] = useState("BDT");
  const [amount, setAmount] = useState(100);
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSwapCurrency = () => {
    setFromCurrencey(toCurrencey);
    setToCurrencey(fromCurrencey);
  };

  const getExchangeRate = async () => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrencey}/${toCurrencey}`;

    setIsLoading(true);

    try {
      const response = await fetch(API_URL);

      if (!response.ok) throw Error("Something went wrong!");

      const data = await response.json();
      const rate = (data.conversion_rate * amount).toFixed(2);

      setResult(`${amount} ${fromCurrencey} = ${rate} ${toCurrencey}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => getExchangeRate, []);

  const handleForm = (event) => {
    event.preventDefault();
    getExchangeRate();
  };

  return (
    <form className="currency-form" onSubmit={handleForm}>
      <div className="input-group">
        <label>Enter Amount :</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="select-section">
        <div className="select-box">
          <div className="select-label">
            <label>From</label>
            <CurrenceySelect
              selectedCurrencey={fromCurrencey}
              handleCurrency={(e) => setFromCurrencey(e.target.value)}
            />
          </div>
        </div>
        <div className="swap-icon" onClick={handleSwapCurrency}>
          <svg
            width="16"
            viewBox="0 0 20 19"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.13 11.66H.22a.22.22 0 0 0-.22.22v1.62a.22.22 0 0 0 .22.22h16.45l-3.92 4.94a.22.22 0 0 0 .17.35h1.97c.13 0 .25-.06.33-.16l4.59-5.78a.9.9 0 0 0-.7-1.43zM19.78 5.29H3.34L7.26.35A.22.22 0 0 0 7.09 0H5.12a.22.22 0 0 0-.34.16L.19 5.94a.9.9 0 0 0 .68 1.4H19.78a.22.22 0 0 0 .22-.22V5.51a.22.22 0 0 0-.22-.22z"
              fill="#fff"
            />
          </svg>
        </div>
        <div className="select-box">
          <div className="select-label">
            <label>To</label>
            <CurrenceySelect
              selectedCurrencey={toCurrencey}
              handleCurrency={(e) => setToCurrencey(e.target.value)}
            />
          </div>
        </div>
      </div>
      <button
        className={`${isLoading ? "loading" : ""} exchange-btn`}
        type="submit"
      >
        get exchange rate
      </button>
      <p className="exchange-rate-result">
        {isLoading ? "Getting Exchange Rate" : result}
      </p>
    </form>
  );
}

export default Converter;
