export default function initControlTooltips() {
  const $drawButton = document.querySelector('.mapbox-gl-draw_ctrl-draw-btn')
  const $zoomInButton = document.querySelector('.mapboxgl-ctrl-zoom-in')
  const $zoomOutButton = document.querySelector('.mapboxgl-ctrl-zoom-out')
  const $compassButton = document.querySelector('.mapboxgl-ctrl-compass')

  const drawLabel = 'Draw an area around your infrastructure'
  $drawButton.setAttribute('title', drawLabel)
  $drawButton.classList.add('control-tooltip', 'control-tooltip--right')

  ;[$zoomInButton, $zoomOutButton, $compassButton].forEach($el => {
    $el.classList.add('control-tooltip', 'control-tooltip--left')
  })
}
