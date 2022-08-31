const largeShipThrusters = {
    largeIon: {
        name: "Large Ion Thruster",
        weight: 43200,
        thrust: 4320000,
        power: 33600,
        fuel: null
    },
    smallIon: {
        name: "Ion Thruster",
        weight: 4380,
        thrust: 345600,
        power: 3360,
        fuel: null
    },
    largeHydrogen: {
        name: "Large Hydrogen Thruster",
        weight: 6940,
        thrust: 7200000,
        power: 7500,
        fuel: 4820
    },
    smallHydrogen: {
        name: "Hydrogen Thruster",
        weight: 1420,
        thrust: 1080000,
        power: 1250,
        fuel: 803
    },
    largeAtmospheric: {
        name: "Large Atmospheric Thruster",
        weight: 32970,
        thrust: 6480000,
        power: 16800,
        fuel: null
    },
    smallAtmospheric: {
        name: "Atmospheric Thruster",
        weight: 4000,
        thrust: 648000,
        power: 2400,
        fuel: null
    },
  }

  const smallShipThrusters = {
    largeIon: {
        name: "Large Ion Thruster",
        weight: 721,
        thrust: 172800,
        power: 2400,
        fuel: null,
        imagefile: 'large_ion_thruster.png'
    },
    smallIon: {
        name: "Ion Thruster",
        weight: 121,
        thrust: 14400,
        power: 200,
        fuel: null,
        imagefile: 'ion_thruster.png'
    },
    largeHydrogen: {
        name: "Large Hydrogen Thruster",
        weight: 1222,
        thrust: 480000,
        power: 600,
        fuel: 386,
        imagefile: 'large_hydrogen_thruster.png'
    },
    smallHydrogen: {
        name: "Hydrogen Thruster",
        weight: 334,
        thrust: 98400,
        power: 125,
        fuel: 80,
        imagefile: 'hydrogen_thruster.png'
    },
    largeAtmospheric: {
        name: "Large Atmospheric Thruster",
        weight: 2948,
        thrust: 576000,
        power: 2400,
        fuel: null,
        imagefile: 'large_atmospheric_thruster.png'
    },
    smallAtmospheric: {
        name: "Atmospheric Thruster",
        weight: 699,
        thrust: 96000,
        power: 600,
        fuel: null,
        imagefile: 'atmospheric_thruster.png'
    },
  }

  var isSmall = true;

function Setup(){
    scrollTo(0,0);
    SmallGrid();
}

function SmallGrid(){
    document.getElementById("SmallGrid").style.backgroundColor = "black";
    document.getElementById("SmallGrid").style.color = "white";

    document.getElementById("LargeGrid").style.backgroundColor = "";
    document.getElementById("LargeGrid").style.color = "";

    isSmall = true;

    Calculate();
}

function LargeGrid(){
    document.getElementById("LargeGrid").style.backgroundColor = "black";
    document.getElementById("LargeGrid").style.color = "white";

    document.getElementById("SmallGrid").style.backgroundColor = "";
    document.getElementById("SmallGrid").style.color = "";

    isSmall = false;

    Calculate();
}

function Calculate(){
    var mass = document.getElementById("mass").value;
    var gravity = document.getElementById("gravity").value;
    var acceleration = document.getElementById("acceleration").value;

    if (acceleration == ""){
        acceleration = 0;
    }

    if (mass == ""|| gravity == "") {
        scrollTo(0,0);
        disableScroll();
        document.getElementById("thrusters").style.visibility = "hidden";
        return;
    }

    document.getElementById("thrusters").style.visibility = "visible";
    enableScroll();

    let ThrusterSpecs;
    if (isSmall){
      ThrusterSpecs = smallShipThrusters
    }
    else{
      ThrusterSpecs = largeShipThrusters
    }

    var thrusterIndex = 0;
    for (var key in ThrusterSpecs){
        console.log(key);
        var thruster = ThrusterSpecs[key];
        var thrust = thruster.thrust;
        var power = thruster.power;
        var fuel = thruster.fuel;
        var weight = thruster.weight;
        var name = thruster.name;
        var imagefile = thruster.imagefile;

        var ThrustCount = ThrusterCount(gravity, mass, acceleration, thrust, weight);

        console.log(document.getElementById("thrusters").getElementsByTagName("h1"));
        document.getElementById("thrusters").getElementsByTagName("div")[thrusterIndex].getElementsByTagName("h1")[0].innerText = name;
        document.getElementById("thrusters").getElementsByTagName("div")[thrusterIndex].getElementsByTagName("h2")[0].innerText = ThrustCount;
        document.getElementById("thrusters").getElementsByTagName("div")[thrusterIndex].getElementsByTagName("p1")[0].innerText = "Mass (Kg): " + weight * ThrustCount;
        document.getElementById("thrusters").getElementsByTagName("div")[thrusterIndex].getElementsByTagName("p1")[1].innerText = "Power needed (MW): " + power * ThrustCount;
        var forceByGravity = mass * gravity * 9.81;
        var forceByThrust = thrust * ThrustCount;
        var netForce = forceByThrust - forceByGravity;
        document.getElementById("thrusters").getElementsByTagName("div")[thrusterIndex].getElementsByTagName("p1")[2].innerText = "Lift (m/s): " + netForce/mass;
        thrusterIndex++;
    }
}

function ThrusterCount(Gs, mass, acceleration,thrust,thrusterMass){
    var gravity = 9.81*parseFloat(Gs);
    var weight = parseFloat(mass)*gravity;
    var neededForce = (weight)+(parseFloat(acceleration) * mass);
    console.log("unfloored " + neededForce/thrust);
    var ThrustCount = Math.floor(parseFloat(neededForce / thrust)) + 1;
    console.log("Floored " +ThrustCount);

    return ThrustCount;

    //check if the weight of the thruster is too heavy for the ship
    if (Math.floor(neededForce + (ThrustCount*parseFloat(thrusterMass))/thrust) > ThrustCount){
        return ThrusterCount(Gs, mass + (ThrustCount*parseFloat(thrusterMass)), acceleration, thrust, thrusterMass)
    }
    return ThrustCount;
}

var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

/////For editing scrolling allowed/////

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; } 
  }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}