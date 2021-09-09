import React, {Component} from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      yeet: "yeet! :P"
    };
  }

  componentDidMount() {
    var width = 8;
    var height = width * window.innerHeight / window.innerWidth;

    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(-width, width, height, -height, 0.1, 2000);
    //const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    var renderer = new THREE.WebGLRenderer();

    renderer.setSize( window.innerWidth, window.innerHeight );
    this.mount.appendChild(renderer.domElement);

    const locations = [
      [0, 0], [0, 1], [1, 0], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4]
    ];
    var cubes = [];

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshStandardMaterial({color: 0xffffff});
    for (var l of locations) {
      var cube = new THREE.Mesh(geometry, material);
      cube.position.set(l[0], l[1], 0);
      cubes.push(cube);
      scene.add(cube);
    }

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(-0.2, 2, 1);
    dirLight.target = cube;

    const ambLight = new THREE.AmbientLight(0xffffff, 0.1);

    const lightHelper = new THREE.PointLightHelper(dirLight);

    scene.add(dirLight, ambLight, lightHelper);


    //camera.position.set(-2.1, 2.1, 2.1);
    const cameraDistance = 4;
    camera.position.set(-4, 4, 4);
    camera.rotation.set(-Math.PI/5, -Math.PI/4, 0, 'YXZ');
    //camera.rotation.set(-Math.PI/2, 0, 0);
    //camera.rotation.set(-Math.PI/4, -Math.PI/4, Math.PI/4);

    //var rotateSpeed = 0.002;
    var loop = function () {
      requestAnimationFrame(loop);

      //camera.rotation.y -= 0.01;
      //cube.rotation.x += rotateSpeed;
      //cube.rotation.y += rotateSpeed;
      renderer.render( scene, camera );
    };
    loop();

  }

  render() {
    return (
      <div id="name" ref={ref => (this.mount = ref)} />
    );
  }
}

export default App;
