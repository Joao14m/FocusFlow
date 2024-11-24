import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home () {

    return(
        <div id="checklist">
        <input checked="" value="1" name="r" type="checkbox" id="01"></input>
        <label for="01">See Tati</label>
        <input value="2" name="r" type="checkbox" id="02"></input>
        <label for="02">See Tati</label>
        <input value="3" name="r" type="checkbox" id="03"></input>
        <label for="03">See Lissette</label>
      </div>
    )
}

export default Home;