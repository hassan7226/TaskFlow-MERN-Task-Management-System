import react from 'react'
import {FaRegEye, FaRegEyeSlash} from 'react-icons/fa6'

const Input = ({type, placeholder, value, label, onChange, id}) => {
  const [showPassword, setShowPassword] = react.useState(false)
  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor={id || label} className='auth-input-label'>{label}</label>

      <div className="input-box relative">
        <input
          id={id || label}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          className='w-full bg-transparent outline-none placeholder-slate-400 text-slate-900'
          onChange={(e) => onChange(e)}
        />
        {type === 'password' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {showPassword ? (
              <FaRegEyeSlash size={18} className='text-slate-400 hover:text-primary cursor-pointer transition-colors' onClick={() => toggleShowPassword()} />
            ) : (
              <FaRegEye size={18} className='text-slate-400 hover:text-primary cursor-pointer transition-colors' onClick={() => toggleShowPassword()} />
            )}
          </div>
        )}

      </div>
    </div>
    );
};
export default Input


