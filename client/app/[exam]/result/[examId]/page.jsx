"use client";
import React, { useEffect, useState } from "react";
import Header from "../../../../components/Header";
import axios from "axios";
import SERVER_URL from "../../../../config/serverUrl";
import { useParams } from "next/navigation";
import { Doughnut, Bar } from "react-chartjs-2";
import Confetti from "react-confetti";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
ChartJS.register(
  ArcElement,
  LinearScale,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function Page() {
  const { examId } = useParams();
  const [confettiParticle, setCofettiParticle] = useState(1000);
  const [showConfetti, setShowConfetti] = useState(true);
  const [marks, setMarks] = useState({
    mathematics: 0,
    physics: 0,
    chemistry: 0,
  });
  const [analysis, setAnalysis] = useState({
    mathematics: { attended: 0, notAttended: 0, right: 0, wrong: 0 },
    physics: { attended: 0, notAttended: 0, right: 0, wrong: 0 },
    chemistry: { attended: 0, notAttended: 0, right: 0, wrong: 0 },
  });

  useEffect(() => {
    if (showConfetti) {
      const particleReducer = setInterval(() => {
        setCofettiParticle((prev) => prev - 40);
      }, 300);
      const displayTimer = setTimeout(() => {
        setShowConfetti(false);
      }, 10000);
      return () => {
        clearTimeout(displayTimer);
        clearInterval(particleReducer);
      };
    }
  }, [showConfetti]);

  const PieChartData = (subject) => {
    if (!analysis.mathematics) {
      return [0, 0, 0];
    }
    if (subject === "total") {
      return [
        analysis.mathematics.right +
        analysis.physics.right +
        analysis.chemistry.right,
        analysis.mathematics.wrong +
        analysis.physics.wrong +
        analysis.chemistry.wrong,
        analysis.mathematics.notAttended +
        analysis.physics.notAttended +
        analysis.chemistry.notAttended,
      ];
    }
    return [
      analysis[subject]?.right,
      analysis[subject]?.wrong,
      analysis[subject]?.notAttended,
    ];
  };
  const BarChartData = (purpose) => {
    if (!marks.mathematics) {
      return [0, 0, 0];
    }
    if (purpose == "mark") {
      return [marks.mathematics, marks.physics, marks.chemistry];
    }
    if (purpose == "percentile") {
      return [
        analysis.mathematics.attended,
        analysis.physics.attended,
        analysis.chemistry.attended,
      ];
    }
    return [0, 0, 0];
  };

  const PieConfigData = (subject) => ({
    labels: ["Right", "Wrong", "Not Attended"],
    datasets: [
      {
        data: PieChartData(subject),
        backgroundColor: [
          "rgb(10, 255, 40)",
          "rgb(255, 12, 35)",
          "rgb(220,100 , 225)",
        ],
        hoverOffset: 6,
        borderColor: "#000000",
      },
    ],
  });

  const BarConfigData = (purpose) => ({
    labels: ["mathematics", "physics", "chemistry"],
    datasets: [
      {
        label: "Graph - Subject Wise "+purpose,
        data: BarChartData(purpose),
        backgroundColor: [
          "rgba(255, 99, 132)",
          "rgba(54, 162, 235)",
          "rgba(255, 206, 86)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
      },
    ],
  });

  const options = {
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  useEffect(() => {
    axios
      .get(SERVER_URL + "/result/" + examId, { withCredentials: true })
      .then(({ data }) => {
        console.log(data);
        if (data.success) {
          setMarks(data.marks);
          setAnalysis(data.analysis);
        }
      });
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-10 p-10 pt-20">
      {showConfetti && 
        <div className="w-full h-screen fixed top-0 left-0 z-100 flex justify-center items-center">
          <div className="rounded-md border text-[#259ac4] border-primary w-[40rem] h-[25rem] backdrop-blur-lg flex flex-col justify-center items-center z-1000 font-bold text-4xl text-center"> Rank : 234 <br/>  Percentile : 99.32</div>
          <Confetti
            gravity={0.25}
            numberOfPieces={confettiParticle}
            width={window.innerWidth}
            height={window.innerHeight}
          />
        </div>
      }
      <Header />
      <div>
        <h1 className="text-center font-semibold text-2xl">Overview</h1>
        <div className="flex gap-2 h-[17rem] items-center">
          <Doughnut data={PieConfigData("total")} options={options} />
          <table
            border="10"
            className=" h-fit gap-2 p-2 rounded-md border border-blue-400 "
          >
            <tbody>
              <tr>
                <th className="p-2 text-center border border-blue-400">
                  Subject
                </th>
                <th className="p-2 text-center border border-blue-400">
                  Attended Questions
                </th>
                <th className="p-2 text-center border border-blue-400">
                  Gained Mark
                </th>
                <th className="p-2 text-center border border-blue-400">
                  Right
                </th>
                <th className="p-2 text-center border border-blue-400">
                  Wrong
                </th>
                <th className="p-2 text-center border border-blue-400">
                  Not Attended
                </th>
                <th className="p-2 text-center border border-blue-400">
                  Total Questions
                </th>
                <th className="p-2 text-center border border-blue-400">
                  Percentile
                </th>
                <th className="p-2 text-center border border-blue-400">Rank</th>
              </tr>
              <tr>
                <th className="p-2 text-center border border-blue-400">
                  Mathematics
                </th>
                <td className="p-2 text-center border border-blue-400">
                  {analysis.mathematics.attended}
                </td>
                <td className="p-2 text-center border border-blue-400">
                  {marks.mathematics}
                </td>
                <td className="p-2 text-center border border-blue-400">
                  {analysis.mathematics.right}
                </td>
                <td className="p-2 text-center border border-blue-400">
                  {analysis.mathematics.wrong}
                </td>
                <td className="p-2 text-center border border-blue-400">
                  {analysis.mathematics.notAttended}
                </td>
                <td className="p-2 text-center border border-blue-400">30</td>
                <td className="p-2 text-center border border-blue-400">
                  97.3452
                </td>
                <td className="p-2 text-center border border-blue-400">98</td>
              </tr>
              <tr>
                <th className="p-2 text-center border border-blue-400">
                  Physics
                </th>
                <td className="p-2 text-center border border-blue-400">
                  {analysis.physics.attended}
                </td>
                <td className="p-2 text-center border border-blue-400">
                  {marks.physics}
                </td>
                <td className="p-2 text-center border border-blue-400">
                  {analysis.physics.right}
                </td>
                <td className="p-2 text-center border border-blue-400">
                  {analysis.physics.wrong}
                </td>
                <td className="p-2 text-center border border-blue-400">
                  {analysis.physics.notAttended}
                </td>
                <td className="p-2 text-center border border-blue-400">30</td>
                <td className="p-2 text-center border border-blue-400">
                  97.3452
                </td>
                <td className="p-2 text-center border border-blue-400">219</td>
              </tr>
              <tr>
                <th className="p-2 text-center border border-blue-400">
                  Chemistry
                </th>
                <td className="p-2 text-center border border-blue-400">
                  {analysis.chemistry.attended}
                </td>
                <td className="p-2 text-center border border-blue-400">
                  {marks.chemistry}
                </td>
                <td className="p-2 text-center border border-blue-400">
                  {analysis.chemistry.right}
                </td>
                <td className="p-2 text-center border border-blue-400">
                  {analysis.chemistry.wrong}
                </td>
                <td className="p-2 text-center border border-blue-400">
                  {analysis.chemistry.notAttended}
                </td>
                <td className="p-2 text-center border border-blue-400">30</td>
                <td className="p-2 text-center border border-blue-400">
                  97.3452
                </td>
                <td className="p-2 text-center border border-blue-400">119</td>
              </tr>
              <tr>
                <th className="p-2 text-center border border-blue-400">
                  Total
                </th>
                <th className="p-2 text-center border border-blue-400">
                  {analysis.chemistry.attended +
                    analysis.mathematics.attended +
                    analysis.physics.attended}
                </th>
                <th className="p-2 text-center border border-blue-400">
                  {marks.mathematics + marks.physics + marks.chemistry}
                </th>
                <th className="p-2 text-center border border-blue-400">
                  {analysis.mathematics.right +
                    analysis.physics.right +
                    analysis.chemistry.right}
                </th>
                <th className="p-2 text-center border border-blue-400">
                  {analysis.mathematics.wrong +
                    analysis.physics.wrong +
                    analysis.chemistry.wrong}
                </th>
                <th className="p-2 text-center border border-blue-400">
                  {analysis.mathematics.notAttended +
                    analysis.physics.notAttended +
                    analysis.chemistry.notAttended}
                </th>
                <th className="p-2 text-center border border-blue-400">90</th>
                <th className="p-2 text-center border border-blue-400 text-[#259ac4] font-semibold">
                  99.3452
                </th>
                <th className="p-2 text-center border border-blue-400 font-semibold text-[#259ac4]">229</th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-center flex flex-col gap-10 ">
        <h1 className="font-semibold text-3xl">Subject Wise Analysis</h1>
        <div className="flex gap-4 justify-around h-72">
          <Doughnut data={PieConfigData("mathematics")} options={options} />
          <Doughnut data={PieConfigData("physics")} options={options} />
          <Doughnut data={PieConfigData("chemistry")} options={options} />
        </div>
      </div>
      <h1 className="text-3xl font-semibold">Total Analysis</h1>
      <div className="h-[17rem] flex gap-20 justify-center w-full">
        <Bar data={BarConfigData("mark")} />
        <Bar data={BarConfigData("percentile")} />
      </div>
    </div >
  );
}

export default Page;
