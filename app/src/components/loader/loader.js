import React from 'react';
import './loader.css';

const Loader = () => {
  return (
    <div class="loader">
      <div class="wrapper">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="shadow"></div>
        <div class="shadow"></div>
        <div class="shadow"></div>
      </div>
    </div>
  );
}
export default Loader;
