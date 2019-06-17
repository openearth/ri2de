export default function getLoadedFileContents(event) {
  return new Promise((resolve) => {
    const [file] = event.target.files
    const reader = new FileReader()

    reader.addEventListener('load', event => {
      resolve(JSON.parse(event.target.result))
    })

    reader.readAsText(file)
  })
}
