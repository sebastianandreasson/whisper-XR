// express server that takes in audio data and saves it to a file

const express = require('express')
const app = express()
const fs = require('fs')
const formidable = require('formidable')
const { exec } = require('child_process')
const cors = require('cors')

app.use(cors())

const COMBINED_FILE = 'combined.wav'

const stitchTogetherWavFiles = (files) => {
  const command = `ffmpeg -y -i ${files.join(' -i ')} -filter_complex '${files
    .map((_, i) => `[${i}:0]`)
    .join('')}concat=n=${
    files.length
  }:v=0:a=1[out]' -map '[out]' ${COMBINED_FILE}`

  return new Promise((resolve, reject) => {
    exec(
      command,
      {
        cwd: `${__dirname}/uploads`,
      },
      (err, stdout, stderr) => {
        if (err) {
          console.error(err)
          reject(err)
        }
        resolve(true)
      }
    )
  })
}

const runWhisper = async (filePath) => {
  const command = `./main -nt ${filePath}`

  return new Promise((resolve, reject) => {
    exec(
      command,
      {
        cwd: `${__dirname}/whisper`,
      },
      (err, stdout, stderr) => {
        if (err) {
          console.error(err)
          reject(err)
        }
        resolve(stdout)
      }
    )
  })
}

let prevFiles = []
app.post('/voice', (req, res) => {
  var form = new formidable.IncomingForm({
    uploadDir: `${__dirname}/uploads`,
    keepExtensions: true,
  })
  form.parse(req, async (err, fields, files) => {
    const filePath = files.audio.filepath

    if (prevFiles.length > 1) {
      await stitchTogetherWavFiles(prevFiles)
    }

    const text = await runWhisper(
      prevFiles.length > 1 ? `${__dirname}/uploads/${COMBINED_FILE}` : filePath
    )
    console.log('text', text)

    res.send(text)
    if (prevFiles.length > 4) {
      const oldestFile = prevFiles.shift()
      fs.rmSync(oldestFile)
    }
  })
})

app.listen(3000)
