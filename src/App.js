import React, {Component} from 'react';
import _ from 'lodash';
import FaceDetector from './ml/faceDetection';
import EmotionDetector from './ml/emotionDetection';
import AgeGenderDetector from './ml/ageGender';
import './App.css';
import Result from "./Result";

class App extends Component {
  faceDetector = new FaceDetector();
  emotionDetector = new EmotionDetector();
  ageGenderDetector = new AgeGenderDetector();
  webcam = React.createRef();
  canvas = React.createRef();

  state = {
    emotionPredictions: [],
    gender: null,
    modelsLoaded: false,
    webcamAllowed: null,
  };

  delay = ms => new Promise(_ => setTimeout(_, ms));

  connectToWebcam = () => {
    if (navigator.mediaDevices.getUserMedia) {
      return navigator.mediaDevices.getUserMedia({video: true})
        .then((stream) => {
          this.webcam.current.srcObject = stream;
          this.setState({ webcamAllowed: true });
        })
        .catch(err => {
          console.log(err);
          this.setState({ webcamAllowed: false })
          throw new Error('webc')
        });
    }
  };

  componentDidMount() {
    Promise.all([
      this.faceDetector.loadModel(),
      this.emotionDetector.loadModel(),
      this.ageGenderDetector.loadModel(),
    ])
      .then(() => this.setState({ modelsLoaded: true }))
      .then(this.connectToWebcam)
      // wait for it to initialize and start capturing
      .then(() => this.delay(1000))
      // use throttling to reduce the load on the client
      .then(_.throttle(this.detectFace, 50))
      .catch(console.log)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  detectFace = async () => {
    try {
      const face = await this.faceDetector.detectFace(this.webcam.current);
      if (face.length > 0) {
        const emotionPredictions = await this.emotionDetector.predict(face[0]);
        const [genderPrediction] = await this.ageGenderDetector.predict(face[0]);
        if (emotionPredictions != null) {
          this.setState({ emotionPredictions })
        }
        if (genderPrediction != null) {
          // if the confidence is less than 60% just ignore it
          if (genderPrediction > 0.40 && genderPrediction < 0.60) {
            return this.detectFace();
          }
          const gender = genderPrediction < 0.50 ? 'Male' : 'Female';
          this.setState({ gender });
        }
      }
      return this.detectFace();
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  renderApp = (color) => {
    if (!this.state.webcamAllowed) {
      return null;
    }
    return (
      <div className="result-wrapper">
        {this.state.gender && (
          <div>
            <span>Gender: </span>
            <span style={{color}}>{this.state.gender}</span>
          </div>
        )}
        {this.state.emotionPredictions.map(({ label, value }) => <Result key={label} label={label} value={value}/>)}
      </div>
    );
  }

  render() {
    const color = this.state.gender === 'Male' ? '#00a8ff' : '#e056fd';
    return (
      <div className="App">
        <div className="App-container">
          {this.state.webcamAllowed === false && <h4 style={{ color: '#EA2027' }}>To run this application you need to allow webcam access</h4>}
          <h2 style={{color: 'orange'}}>Emotion & Gender prediction demo</h2>
          <div id="container">
            {this.state.modelsLoaded ? <video autoPlay width={640} height={480} ref={this.webcam} id="videoElement" /> : <span>Downloading models...</span>}
            {this.renderApp(color)}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
