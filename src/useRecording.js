import { useEffect, useMemo } from 'react'
import axios from 'axios'

const useMediaRecorder = (activated, callback) => {
  let memo = useMemo(() => ({ ranOnce: false }), [])

  useEffect(() => {
    if (!activated) return
    if (memo.ranOnce) return
    const run = async () => {
      memo.ranOnce = true
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            volume: 1,
            channelCount: 1,
          },
          video: false,
        })
        const recordAudio = RecordRTC(mediaStream, {
          type: 'audio',
          mimeType: 'audio/webm',
          sampleRate: 44100,
          desiredSampRate: 16000,
          recorderType: StereoAudioRecorder,
          numberOfAudioChannels: 1,
          timeSlice: 2000,
          ondataavailable: callback,
        })
        recordAudio.startRecording()
      } catch (e) {
        alert('Error: ' + e.message)
      }
    }
    run()
  }, [activated])
}

const useWhisper = (activated, callback) => {
  useMediaRecorder(activated, (audioBuffer) => {
    const formData = new FormData()
    formData.append('audio', audioBuffer, 'audio.wav')
    axios
      .post('http://192.168.0.34:3000/voice', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        callback(res.data)
      })
  })

  return []
}

export default useWhisper
