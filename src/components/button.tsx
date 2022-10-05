import { ButtonType } from "../app";

import EyeIcon from '../icons/eye.svg'
import EyeOffIcon from '../icons/eye-off.svg'

const Button: React.FC<ButtonType> = ({ text, value, variable, setVariable, status }) => {
  return (
    <div
      className="p-4 cursor-pointer bg-primary text-white h-fill"
      onClick={() => {if (setVariable) setVariable({variable, value, status})}}
    >
      <div className="text-lg">{text}</div>
      <img src={(value === 'show') || (variable === 'location' && !status) ? EyeIcon : EyeOffIcon} className="absolute right-4 bottom-4 w-8 h-8" />
    </div>
  )
}

export default Button