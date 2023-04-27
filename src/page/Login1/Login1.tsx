import React from 'react'
import logo from '../../logo-420-x-108.png';
import LoginForm1 from '../../components/LoginForm1/LoginForm1';

type Props = {}

const Login1 = (props: Props) => {
  return (
    <div className='flex items-center justify-center h-screen flex-col' >
      <img src={logo} alt='logo' className='max-w-xs' />
      <LoginForm1 />
    </div>
  )
}

export default Login1