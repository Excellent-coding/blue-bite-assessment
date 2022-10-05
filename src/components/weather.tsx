import { useEffect, useState } from "react"

import CloudyIcon from '../icons/cloudy.svg';
import RainIcon from '../icons/rain.svg';

import { WeatherType } from "../app"
import { CardWrapper } from "./card";

type WeatherDataType = {
  condition: string
  conditionName: string
  lat: string
  location: string
  lon: string
  temperature: number
  unit: string
  upcomming: {
    condition: string
    conditionName: string
    day: string
  }[]
}

const Weather: React.FC<{ lat: string, lon: string, locations: string[] | undefined }> = ({ lat, lon, locations }) => {
  const [info, setInfo] = useState<WeatherDataType>()
  const [location, setLocation] = useState('')
  useEffect(() => {
    const fetchData = async () => {
      const res: {data: WeatherDataType} = await fetch(`http://localhost:3030/integration/weather?lat=${lat}&lon=${lon}`).then(res => res.json())
      setLocation(res.data.location.includes('New York') ? 'ny' : res.data.location.includes('San Francisco') ? 'ca' : 'ch')
      setInfo(res.data)
    }
    fetchData()
  }, [lat, lon])

  if (!info || (locations && !locations.includes(location))) return <></>

  return (
    <CardWrapper>
      <div className="flex p-4">
        <div className="w-50 flex">
          <img src={CloudyIcon} className="w-16 h-16" alt="cloudy" />
          <div>
            <div className="text-2xl">{info.temperature}{info.unit === 'f' ? <span>&#8457;</span> : <span>&#x2103;</span>}</div>
            <div className="text-sm">{info.conditionName}</div>
          </div>
        </div>
        <div className="w-50">
          <div className="text-right text-xs">{info.location}</div>
          <div className="flex justify-center mt-10 w-full">
            {info.upcomming.map(inf => (
              <div className="mx-1" key={inf.day}>
                <img src={inf.condition === 'cloudy' ? CloudyIcon : RainIcon} className="w-full" alt="cloud" />
                <div className="text-xs text-center">{inf.day}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardWrapper>
    
  )
}

export default Weather