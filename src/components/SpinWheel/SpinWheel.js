import React, { useState, useEffect, useRef, memo } from 'react';
import { useNavigate } from "react-router-dom";
import { Chart, registerables } from 'chart.js'
import { Doughnut } from 'react-chartjs-2';
import ModalHowToPlay from './ModalHowToPlay';
import ModalWinner from './ModalWinner';

Chart.register(...registerables)
const ChartDonut = React.memo(({ data, chartRef, plugins }) => {
  return <Doughnut ref={chartRef} data={data} plugins={plugins} className="max-h-[400px] max-w-[400px] flex justify-center items-center bg-[url('../../assets/spin_wheel/wheel.webp')] bg-cover" style={{ padding: '12px 12px 20px 16px' }} />;
});

const SpinWheel = ({ players }) => {
  const navigate = useNavigate();
  const [isModalHowToPlayVisible, setModalHowToPlayVisible] = useState(false);
  const [isModalWinnerVisible, setModalWinnerVisible] = useState(false);

  const winnerUsername = "Hero123";
  const prizePool = "$1000";

  const openWinnerModal = () => {
    setModalWinnerVisible(true);
  };

  const closeWinnerModal = () => {
    setModalWinnerVisible(false);
  };

  const openModalHowToPlay = () => {
    setModalHowToPlayVisible(true);
  };

  const closeModalHowToPlay = () => {
    setModalHowToPlayVisible(false);
  };

  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: '',
      data: [0],
      hoverOffset: 20,
      rotation: 0,
    }],
  });

  const spinPointer = {
    id: 'spinPointer',
    afterDatasetsDraw(chart, args, plugins) {
      const { ctx, chartArea: { top } } = chart;
      const xCenter = chart.getDatasetMeta(0).data[0].x;
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = 'black';
      ctx.moveTo(xCenter, top + 30);
      ctx.lineTo(xCenter - 15, top);
      ctx.lineTo(xCenter + 15, top);
      ctx.fill();
    }
  }

  useEffect(() => {
    chartData.datasets[0].cutout = 82;
    chartData.datasets[0].borderWidth = 0;
    chartData.datasets[0].data = players.map(player => player.points);
    chartData.datasets[0].backgroundColor = players.map(player => player.bg);
    setChartData(chartData);

  }, [chartData, players]);

  function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const spinWheel = () => {
    const chart = chartRef.current;
    const data = chart.config.data.datasets[0].data;
    const random = Math.floor(Math.random() * data.length);
    const valueWinner = data[random];
    console.log("value", valueWinner)
    let winnerAngle = 0
    const label = chart.config.data.labels;
    var total = 0;
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      total += element;
    }

    let dataNew = []

    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      const maxAngle = index > 0 ? (element / total) * 360 + Math.abs(dataNew[index - 1].maxAngle) : (element / total) * 360;
      const minAngle = index > 0 ? Math.abs(dataNew[index - 1].maxAngle) : 0;
      dataNew.push(
        {
          index: index,
          value: element,
          minAngle: minAngle,
          maxAngle: maxAngle,
        }
      );

      if (element === valueWinner) {
        winnerAngle = randomIntFromInterval(dataNew[index].minAngle, dataNew[index].maxAngle)
        console.log("winnerAngle " + winnerAngle + " Label: " + label[index])
      }
    }

    let currentRotation = chart.config.data.datasets[0].rotation || 0;
    let finalAngle = 360 - winnerAngle
    let finalRotation = Math.floor(2 * 3600) + finalAngle; // Simulate multiple rotations
    let rotationSpeed = 20;

    const animateSpin = () => {
      if (finalRotation - currentRotation <= 50) {
        rotationSpeed = 0.1
      } else if (finalRotation - currentRotation <= 100) {
        rotationSpeed = 0.5
      } else if (finalRotation - currentRotation <= 400) {
        rotationSpeed = 2
      } else if (finalRotation - currentRotation <= 900) {
        rotationSpeed = 5
      }

      currentRotation += rotationSpeed;
      if (currentRotation < finalRotation) {
        chart.config.data.datasets[0].rotation = currentRotation;
        chart.update();
        requestAnimationFrame(animateSpin);
      } else {
        openWinnerModal()
        // console.log(currentRotation % 360)

        // const selectedSlice = getSliceByAngle(currentRotation / 360);
        // console.log(selectedSlice)
        // console.log(slices[selectedSlice])
        // setResult(slices[selectedSlice]);
        // if (onSpin) onSpin(slices[selectedSlice]);
      }
    };

    animateSpin();
  };

  const reset = () => {
    window.location.reload(false);
  }



  const handleClick = () => {
    navigate("/history")
  }


  return (
    <div className='h-full w-full xl:w-1/3 flex flex-col justify-center items-center order-1 xl:order-2 mt-16 xl:mt-0 p-4 xl:p-0'>
      <ChartDonut data={chartData} chartRef={chartRef} plugins={[spinPointer]} />
      <button className='bg-dark-blue p-4 rounded-lg text-white mt-4' onClick={openModalHowToPlay}>How To Play</button>
      {/* <div className='flex items-center justify-center gap-6 my-4 flex-col md:flex-row'>
          <button className='bg-dark-blue py-1.5 px-4 lg:py-2.5 lg:px-4 rounded-lg text-white' onClick={spinWheel}>Spin</button>
          <button className='bg-dark-blue py-1.5 px-4 lg:py-2.5 lg:px-4 rounded-lg text-white' onClick={reset}>RESET</button>
          <button className='bg-dark-blue py-1.5 px-4 lg:py-2.5 lg:px-4 rounded-lg text-white' onClick={openWinnerModal}>Winner Modal</button>
          <button className='bg-dark-blue py-1.5 px-4 lg:py-2.5 lg:px-4 rounded-lg text-white' onClick={handleClick}>History</button>
        </div> */}

      <ModalHowToPlay isVisible={isModalHowToPlayVisible} onClose={closeModalHowToPlay} />
      <ModalWinner
        isVisible={isModalWinnerVisible}
        onClose={closeWinnerModal}
        winnerUsername={winnerUsername}
        prizePool={prizePool}
      />
    </div>
  );
};

export default SpinWheel;
