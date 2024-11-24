import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard () {

    return (
    /* From Uiverse.io by JkHuger */ 
<div class="wrapper">
  <input class="hidden-trigger" id="toogle" type="checkbox"></input>
  <label class="circle" for="toogle">
  <svg
  x="0"
  y="0"
  viewBox="0 0 48 48"
  version="1.1"
  height="48"
  width="48"
  xmlns="http://www.w3.org/2000/svg"
  className="svg"
>
  <image href="/menuIcon.png" height="48" width="48" />
</svg>



  </label>
  
  <div class="subs">
    <button class="sub-circle">
      <input class="hidden-sub-trigger" id="sub1" type="radio" name="sub-circle" value="1"></input>
      <label for="sub1"></label>
    </button>
    <button class="sub-circle">
      <input class="hidden-sub-trigger" id="sub2" type="radio" name="sub-circle" value="1"></input>
      <label for="sub2"></label>
    </button>
    <button class="sub-circle">
      <input class="hidden-sub-trigger" id="sub3" type="radio" name="sub-circle" value="1"></input>
      <label for="sub3"></label>
    </button>
    <button class="sub-circle">
      <input class="hidden-sub-trigger" id="sub4" type="radio" name="sub-circle" value="1"></input>
      <label for="sub4"></label>
    </button>
    <button class="sub-circle">
      <input class="hidden-sub-trigger" id="sub5" type="radio" name="sub-circle" value="1"></input>
      <label for="sub5"></label>
    </button>
    <button class="sub-circle">
      <input class="hidden-sub-trigger" id="sub6" type="radio" name="sub-circle" value="1"></input>
      <label for="sub6"></label>
    </button>
    <button class="sub-circle">
      <input class="hidden-sub-trigger" id="sub7" type="radio" name="sub-circle" value="1"></input>
      <label for="sub7"></label>
    </button>
    <button class="sub-circle">
      <input class="hidden-sub-trigger" id="sub8" type="radio" name="sub-circle" value="1"></input>
      <label for="sub8"></label>
    </button>
   </div>
</div>
    );
}

export default Dashboard;