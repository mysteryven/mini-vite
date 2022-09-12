import './index.css'
import './App.css'

const render = () => {
    const root = document.querySelector('#root')!
    const img = new Image()
    img.src = '/vite.svg'

    root.innerHTML = "Hello, I am from TS"
    root.appendChild(img)
}
render()

export default render 