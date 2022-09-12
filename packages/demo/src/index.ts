import reactLogo from './assets/react.svg'
import './index.css'
import './App.css'


const render = () => {
    const root = document.querySelector('#root')!
    const img = new Image()
    const img2 = new Image()
    img.src = '/vite.svg'
    img2.src = reactLogo

    root.innerHTML = "Hello, I am from TS"
    root.appendChild(img)
    root.appendChild(img2)
}
render()

export default render 