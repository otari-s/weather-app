import { useState } from "react";
import "./app.css";
import axios from "axios";
import {
  WiHumidity,
  WiCloudy,
  WiDaySunny,
  WiDayShowers,
  WiDayStormShowers,
} from "react-icons/wi";
import { TbTemperature } from "react-icons/tb";
import { RiWindyFill } from "react-icons/ri";

interface Weather {
  name: string;
  country: string;
  img: string;
  description: string;
  temp: number;
  pressure: string;
  humidity: string;
  windSpeed: string;
}

function App() {
  const [value, setValue] = useState<string>("");
  const [errorCity, setErrorCity] = useState<boolean>(false);
  const [data, setData] = useState<Weather>({
    name: "city",
    country: "country",
    img: "Clear",
    description: "weather description",
    temp: 20,
    pressure: "pressure",
    humidity: "humidity",
    windSpeed: "wind",
  });

  const getWeatherData = async () => {
    try {
      const res = await axios(
        `https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${process.env.REACT_APP_API_KEY}&units=metric`
      );
      const weatherData = res.data;
      setData({
        ...weatherData,
        name: weatherData.name,
        country: weatherData.sys.country,
        description: weatherData.weather[0].description,

        img: weatherData.weather[0].main,
        temp: weatherData.main.temp,
        pressure: weatherData.main.pressure,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
      });
      console.log(weatherData);
    } catch (error) {
      console.log(error);
      setErrorCity(true);
    }
  };

  const onSubmit = () => {
    setValue("");
    getWeatherData();
    setErrorCity(false);
  };

  return (
    <main className="container">
      <section className="weatherAppContainer">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <input
            value={value}
            type="text"
            placeholder="search city"
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
          <button disabled={!value}>search</button>
        </form>
        {errorCity ? <div className="error">Invalid City Name</div> : null}
        <div className="main">
          <h2>
            {data.name} <span>{data.country}</span>
          </h2>
          {data.img === "Clouds" ? (
            <WiCloudy className="mainImage" />
          ) : data.img === "Clear" ? (
            <WiDaySunny className="mainImage" />
          ) : data.img === "Rain" ? (
            <WiDayShowers className="mainImage" />
          ) : data.img === "Thunderstorm" ? (
            <WiDayStormShowers className="mainImage" />
          ) : null}
          <h3>{data.description} </h3>
          <h1>{Math.floor(data.temp)}°C </h1>
          <div className="weatherInfo">
            <p>
              <TbTemperature className="icon" />
              {data.pressure}hpa
            </p>
            <p>
              <WiHumidity className="icon" />
              {data.humidity}%
            </p>
            <p>
              <RiWindyFill className="icon" />
              {data.windSpeed}m/s
            </p>
          </div>
        </div>
        <div className="line"></div>
        <div className="date">{new Date().toLocaleDateString()}</div>
      </section>
    </main>
  );
}

export default App;
