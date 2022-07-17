import { AUPredictor, AvatarPrediction } from '@quarkworks-inc/avatar-webkit'
import axios from 'axios';

export class AvatarPredictions {
  videoStream?: MediaStream
  predictor?: AUPredictor
  
    postShapes(postData:AvatarPrediction){
      //console.log(postData)
      axios.post('/blendsin', postData, //JSON.stringify(postData),
      {
          headers: {
            'content-type': "application/json"
          }
      })
    }

  async start() {
    this.videoStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width: { ideal: 640 },
        height: { ideal: 360 },
        facingMode: 'user'
      }
    })

    this.predictor = new AUPredictor({
      apiToken: process.env.REACT_APP_AVATAR_WEBKIT_AUTH_TOKEN!
    })

    this.predictor.onPredict = ((results: AvatarPrediction) => {
      this.postShapes(results)
    })

    return this.predictor.start({
      stream: this.videoStream
    })
  }

  async stop() {
    return this.predictor?.stop()
  }
}