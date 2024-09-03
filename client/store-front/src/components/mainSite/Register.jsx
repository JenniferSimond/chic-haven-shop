import React from 'react';
import windowResize from '../shared/hooks/windowResize';
import RegisterWeb from './registerViews/RegisterWeb';
import RegisterMobile from './registerViews/RegisterMobile';


const Register = () => {

    const {width} = windowResize()

   return width <= 950 ? <RegisterMobile /> : <RegisterWeb />
};


export default Register;
