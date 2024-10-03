"use client"

import { useEffect, useState, useRef } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select";



export default function Home() {
  const [selectedCoin, setSelectedCoin] = useState("ethusdt");
  const [loading, setLoading] = useState(false);
  const [interval, setInterval] = useState("1m");
  const [chartData, setChartData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [marketDominanceData, setMarketDominanceData] = useState([45, 30, 25]); // Example pie chart data
  const ws = useRef(null);

  useEffect(() => {
    const savedData = localStorage.getItem(selectedCoin);
    if (savedData) {
      setChartData(JSON.parse(savedData));
    }
    startWebSocket(selectedCoin, interval);

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [selectedCoin, interval]);

  const startWebSocket = (symbol, interval) => {
    if (ws.current) ws.current.close();

    ws.current = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol}@kline_${interval}`
    );

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const newCandle = message.k;

      if (newCandle.x) {
        // Completed candlestick
        setChartData((prev) => {
          const updatedData = [
            ...prev,
            {
              time: newCandle.t,
              open: newCandle.o,
              high: newCandle.h,
              low: newCandle.l,
              close: newCandle.c,
              volume: newCandle.v, // Example for volume
            },
          ];

          localStorage.setItem(selectedCoin, JSON.stringify(updatedData));
          return updatedData;
        });
      }
    };
  };

  const formatChartData = () => {
    const labels = chartData.map((c) => new Date(c.time).toLocaleTimeString());
    const closePrices = chartData.map((c) => parseFloat(c.close));
    const volume = chartData.map((c) => parseFloat(c.volume));

    return {
      labels,
      datasets: [
        {
          label: `Price (${selectedCoin.toUpperCase()})`,
          data: closePrices,
          borderColor: "#4caf50",
          backgroundColor: "rgba(76, 175, 80, 0.2)",
          fill: true,
        },
      ],
    };
  };

  const formatVolumeData = () => {
    const labels = chartData.map((c) => new Date(c.time).toLocaleTimeString());
    const volume = chartData.map((c) => parseFloat(c.volume));

    return {
      labels,
      datasets: [
        {
          label: `Volume (${selectedCoin.toUpperCase()})`,
          data: volume,
          backgroundColor: "#ff5722",
        },
      ],
    };
  };

  const marketDominanceChartData = {
    labels: ["ETH", "BNB", "DOT"],
    datasets: [
      {
        label: "Market Dominance (%)",
        data: marketDominanceData,
        backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56"],
      },
    ],
  };


  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">
        Binance Market Data
      </h1>

      {/* Cryptocurrency Select Dropdown */}
      <div className="flex justify-center mb-6">
        <Select onValueChange={setSelectedCoin}>
          <SelectTrigger className="w-[180px] mr-4">
            <SelectValue placeholder="Select Cryptocurrency" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Cryptocurrency</SelectLabel>
              <SelectItem value="ethusdt">ETH/USDT</SelectItem>
              <SelectItem value="bnbusdt">BNB/USDT</SelectItem>
              <SelectItem value="dotusdt">DOT/USDT</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Time Interval Select Dropdown */}
        <Select onValueChange={setInterval}>
          <SelectTrigger className="w-[180px] ml-4">
            <SelectValue placeholder="Select Interval" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Interval</SelectLabel>
              <SelectItem value="1m">1 Minute</SelectItem>
              <SelectItem value="3m">3 Minutes</SelectItem>
              <SelectItem value="5m">5 Minutes</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Line Chart for Price */}
      
        <div className="w-full md:w-3/4 lg:w-1/2 mx-auto bg-white p-6 rounded shadow-md mb-10">
          <Line
            data={formatChartData()}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                tooltip: {
                  enabled: true,
                },
              },
            }}
          />
        </div>

      {/* Bar Chart for Volume */}
      
        <div className="w-full md:w-3/4 lg:w-1/2 mx-auto bg-white p-6 rounded shadow-md mb-10">
          <Bar
            data={formatVolumeData()}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                tooltip: {
                  enabled: true,
                },
              },
            }}
          />
        </div>

      {/* Doughnut Chart for Market Dominance */}
  
        <div className="w-full md:w-3/4 lg:w-1/2 mx-auto bg-white p-6 rounded shadow-md">
          <Doughnut
            data={marketDominanceChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
              },
            }}
          />
        </div>

      <div className="text-center mt-6">
        <Button
          className="bg-blue-500 text-white"
          onClick={() => setLoading(true)}
        >
          Refresh Data
        </Button>
      </div>
    </div>
  );
}
