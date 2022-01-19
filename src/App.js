import React, {Component} from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mousex: 0,
      mousey: 0,
      lastx: 0,
      lasty: 0,
      mouseDown: false,
      cubes: null
    };
  }

  componentDidMount() {
    var width = 30;
    var height = width * window.innerHeight / window.innerWidth;

    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(-width, width, height, -height, 0.1, 2000);
    //const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    var renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    this.mount.appendChild(renderer.domElement);

    function onWindowResize(){
        var width = 30;
        var height = width * window.innerHeight / window.innerWidth;
        camera.left = -width;
        camera.right = width;
        camera.top = height;
        camera.bottom = -height;
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize, false );

    var randomRange = function (a, b) {
      return (Math.random() * (b - a)) + a;
    };

    const map = [
      "  0 000                          ",
      "  0 0 0                          ",
      "  0 000                          ",
      "0 0 0                            ",
      "000 0                            ",
      "                                 ",
      "0000      0                      ",
      "0 0 0     0                      ",
      "0 0 0 000 000  00 000  00 0 0  0 ",
      "0 0 0 0   0 0 0 0 0   0 0 0 0 0 0",
      "0 0 0 000 0 0 000 0   000 000 000",
      "                        0     0  ",
      "                      00       00"
    ];
    var baseLocations = [];
    for (var i = 0; i < map.length; i++) {
      for (var j = 0; j < map[i].length; j++) {
        if (map[i][j] === '0') {
          baseLocations.push([i, j]);
          //baseLocations.push([j - 17, 4 - i, 0]);
        }
      }
    }

    var depths = new Array(map.length).fill(0).map(() => new Array(map[0].length).fill(-1));
    var heights = new Array(map.length).fill(0).map(() => new Array(map[0].length).fill(-1));

    var isFilled = function (row, col) {
      if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) {
        return false;
      }
      return map[row][col] === '0';
    }

    var getDepth = function (row, col, d) {
      if (!isFilled(row, col)) {
        return -1;
      }
      if (!isFilled(row - 1, col) && !isFilled(row, col - 1) && !isFilled(row - 1, col - 1)) {
        if (d > heights[row][col]) {
          heights[row][col] = d;
        }
        return d;
      }
      var result = Math.max(
        getDepth(row, col - 1, d + 1),
        getDepth(row - 1, col, d + 1),
        getDepth(row - 1, col - 1, d + 1)
      );
      if (result > heights[row][col]) {
        heights[row][col] = result;
      }
      return result;
    };

    for (var loc of baseLocations) {
      depths[loc[0]][loc[1]] = getDepth(loc[0], loc[1], 0);
    }

    var locations = [];
    var range = 20;
    for (var loc of baseLocations) {
      var d = depths[loc[0]][loc[1]]
      var h = heights[loc[0]][loc[1]]
      var factor = randomRange(d / (h + 1), (d + 1) / (h + 1));
      var adjust = range * factor;
      adjust -= (range / 2);
      var temp = [loc[1] - 17 + adjust, 4 - loc[0] - adjust, -adjust];
      locations.push(temp);
    }

    const cubes = new THREE.Group();

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshStandardMaterial({color: 0xffffff});

    for (var l of locations) {
      var cube = new THREE.Mesh(geometry, material);
      cube.position.set(l[0], l[1], l[2]);
      cubes.add(cube);
    }
    cubes.position.set(25, -24, -35);
    scene.add(cubes);
    this.setState({cubes: cubes});

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(-2, 10, 20);
    dirLight.lookAt(new THREE.Vector3(0, 0, 0));

    const ambLight = new THREE.AmbientLight(0xffffff, 0.1);

    const lightHelper = new THREE.PointLightHelper(dirLight);

    scene.add(dirLight, ambLight, lightHelper);

    const cameraDistance = 4;
    camera.position.set(-cameraDistance, cameraDistance, cameraDistance);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    cubes.rotation.y = -Math.PI/4;
    var loop = function () {
      requestAnimationFrame(loop);
      cubes.rotation.y *= 0.94;
      cubes.rotation.x *= 0.94;
      renderer.render( scene, camera );
    };
    loop();

  }

  handleMouseDown = event => {
    document.getElementById("name").style.cursor = "grabbing";
    this.setState({mouseDown: true});
  }

  handleMouseUp = event => {
    document.getElementById("name").style.cursor = "grab";
    this.setState({mouseDown: false});
  }

  handleMouseOut = event => {
    document.getElementById("name").style.cursor = "grab";
    this.setState({mouseDown: false});
  }

  handleMouseMove = event => {
    var lastx = this.state.mousex;
    var lasty = this.state.mousey;
    this.setState({
      mousex: event.clientX,
      mousey: event.clientY,
      lastx: lastx,
      lasty: lasty
    });
    if (this.state.mouseDown) {
      this.state.cubes.rotation.y += (event.clientX - lastx) * 0.001;
      this.state.cubes.rotation.x += (event.clientY - lasty) * 0.001;
    }
  }

  render() {
    return (
      <div>
      <div id="name"
        ref={ref => (this.mount = ref)}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
        onMouseOut={this.handleMouseOut}
      />
      <div id="links">
        <div class="link"><a href="https://twitter.com/jpmchargue" style={{color: '#0ff'}}>Twitter</a></div>
        <div class="link"><a href="https://www.linkedin.com/in/james-mchargue-b98133180/" style={{color: '#44f'}}>LinkedIn</a></div>
        <div class="link"><a href="https://github.com/jpmchargue" style={{color: '#888'}}>GitHub</a></div>
        <div class="link"><a href="https://store.steampowered.com/app/997260/Hyper_Scuffle/" style={{color: '#ff0047'}}>Hyper Scuffle</a></div>
        <div class="link"><a href="https://jpmchargue.itch.io/recursive-repairman" style={{color: '#fc9803'}}>Recursive Repairman</a></div>
        <div class="link"><a href="https://github.com/jpmchargue/website" style={{color: 'white'}}>How I made this</a></div>
      </div>
      </div>
    );
  }
}

export default App;
