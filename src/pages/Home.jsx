import React from "react";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Loader from "react-loader-spinner";

import { configData } from "../config/staging";
import { useFetch } from "../hooks/fetchDataHooks";
import styles from "./Home.module.css";
function Home() {
  const [storiesNumber, setStoriesNumber] = useState(10);
  const [chartData, setChartData] = useState({});
  const [inputError, setInputError] = useState("");
  const { data, scores, descendants, error, status } = useFetch(
    configData.MAIN_API_URL,
    configData.BASE_URL,
    storiesNumber
  );

  //re-calculate the chart
  useEffect(() => {
    if (scores?.length > 0 && descendants?.length > 0) {
      const data = {
        labels: scores,
        datasets: [
          {
            label: "Hacker News",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "blue",
            data: descendants,
          },
        ],
      };
      setChartData(data);
    }
  }, [status, scores, descendants]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = e.target.search.value;
    if (query) {
      if (query < 1 || query > 50) {
        setInputError("Please enter a valid number between 1:50");
        return;
      }
      setStoriesNumber(query);
      e.target.search.value = "";
      setInputError("");
    }
  };
  console.log("status: ", status);
  return (
    <div className={styles.Home}>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          pattern="[0-9]*"
          inputmode="numeric"
          autoFocus
          autoComplete="off"
          name="search"
          placeholder="Number of stories"
        />
        <button> Search </button>
      </form>
      <div className={styles.Home__errorContainer}>
        <span style={{ color: "red" }}>{inputError}</span>
      </div>
      {status === "fetching" ? (
        <Loader type="Puff" color="#00BFFF" height={100} width={100} />
      ) : (
        <Line
          data={chartData}
        />
      )}
    </div>
  );
}

export default Home;
