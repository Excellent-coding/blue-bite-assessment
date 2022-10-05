import styled from 'styled-components';
import { ButtonType, ConditionType, ImageType, WeatherType } from '../app';
import Button from './button';
import Weather from './weather';

export const CardWrapper = styled.div`
  width: 100%;
  max-width: 360px;
  height: 160px;
  margin: 16px auto;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, .2);
  position: relative;
`

type CardProps = {
  type: string
  options: ImageType | WeatherType | ButtonType
  condition: ConditionType[] | undefined
  handleVariable: ({variable, value} : {variable: string, value: string}) => void
}

const Card: React.FC<CardProps> = ({ type, options, handleVariable, condition }) => {
  const show = condition?.find(({ variable }) => variable === `show_${type}`)?.value
  const locations = condition?.filter(({ variable }) => variable === 'location').length ? condition?.filter(({ status, variable }) => status && variable === 'location').map(({ value }) => value) : undefined
  if (show === 'hide') return <></>
  
  if (type === 'button') {
    let status = true

    if ((options as ButtonType).variable !== 'location') {
      const status = condition?.find(({ variable }) => variable === (options as ButtonType).variable)?.value
      if (status === (options as ButtonType).value) return <></>
    } else {
      status = condition?.find(({ variable, value }) => variable === (options as ButtonType).variable && value === (options as ButtonType).value)?.status || false
    }
    return (
      <CardWrapper>
        <Button {...options as ButtonType} setVariable={handleVariable} status={status} />
      </CardWrapper>
    )
  }

  if (type === 'image') {
    const src = (options as ImageType).src
    const imageLocation = src.includes('new-york') ? 'ny' : src.includes('san-francisco') ? 'ca' : 'ch'
    
    if (condition && locations && !locations.includes(imageLocation)) return <></>
    
    return (
      <CardWrapper>
        <img className='w-full h-full object-cover' {...options as ImageType} />
      </CardWrapper>
    )
  }

  if (type === 'weather') {
    return <Weather {...options as WeatherType} locations={locations} />
  }

  return <></>
}

export default Card