import './canvas.scss'

const canvas = document.querySelector('.canvas')
const canvasTemplate = `
<svg class="chart" width="120" height="120" viewBox="0 0 50 50">
    <defs>
        <linearGradient id="great" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="#ffe39c"/>
            <stop offset="100%" stop-color="#ffba9c"/>
        </linearGradient>

        <linearGradient id="good" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="#bc9cff"/>
            <stop offset="100%" stop-color="#8ba4f9"/>
        </linearGradient>

        <linearGradient id="satisfy" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="#6fcf97"/>
            <stop offset="100%" stop-color="#66d2ea"/>
        </linearGradient>

        <linearGradient id="bad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="#919191"/>
            <stop offset="100%" stop-color="#3d4975"/>
        </linearGradient>
    </defs>

    <circle class="canvas__unit canvas__unit_great" r="15.9" cx="50%" cy="50%" stroke="url(#great)" stroke-dasharray="11 100" stroke-dashoffset="0"></circle>
    <circle class="canvas__unit canvas__unit_good" r="15.9" cx="50%" cy="50%" stroke="url(#good)" stroke-dasharray="11 100" stroke-dashoffset="-11"></circle>
    <circle class="canvas__unit canvas__unit_satisfy" r="15.9" cx="50%" cy="50%" stroke="url(#satisfy)" stroke-dasharray="11 100" stroke-dashoffset="-22"></circle>
    <circle class="canvas__unit canvas__unit_bad" r="15.9" cx="50%" cy="50%" stroke="url(#bad)" stroke-dasharray="11 100" stroke-dashoffset="-33"></circle>
  </svg>`

canvas.insertAdjacentHTML('beforeend', canvasTemplate)
