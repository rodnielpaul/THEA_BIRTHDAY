/* ============================================================
   shared.js — background effects used by both page1.html and
   page2.html. Include this on both pages, after a container
   with id="marbleFilterSlot" (or call injectMarbleFilter()
   manually) and elements with ids "floaters" and "butterflies".
   ============================================================ */

// Injects the SVG filter that turns the flat marble gradient into
// a living, flowing texture. Call once per page, early in <body>.
function injectMarbleFilter(){
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <svg width="0" height="0" style="position:absolute" aria-hidden="true">
      <filter id="marbleFilter" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.010 0.016" numOctaves="4" seed="12" result="noise">
          <animate attributeName="baseFrequency"
                   dur="50s"
                   values="0.010 0.016; 0.016 0.010; 0.010 0.016"
                   repeatCount="indefinite" />
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="90" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </svg>`;
  document.body.prepend(wrap.firstElementChild);
}

// Builds a seamless butterfly pattern tile as an SVG data URI and
// sets it as the --butterfly-tile CSS variable used in shared.css.
function buildButterflyTile(){
  const wingColor = "#e78aa8";
  const wingColor2 = "#dd7a9c";

  function butterfly(x, y, scale, rotate, opacity){
    return `
      <g transform="translate(${x},${y}) rotate(${rotate}) scale(${scale})" opacity="${opacity}">
        <path d="M0,0 C-14,-22 -34,-20 -34,-2 C-34,12 -16,16 0,4 Z" fill="${wingColor}"/>
        <path d="M0,0 C14,-22 34,-20 34,-2 C34,12 16,16 0,4 Z" fill="${wingColor}"/>
        <path d="M0,4 C-12,20 -26,22 -24,8 C-22,-2 -10,2 0,4 Z" fill="${wingColor2}"/>
        <path d="M0,4 C12,20 26,22 24,8 C22,-2 10,2 0,4 Z" fill="${wingColor2}"/>
        <ellipse cx="0" cy="0" rx="2.4" ry="14" fill="${wingColor2}"/>
      </g>`;
  }

  const tile = `
    <svg xmlns="http://www.w3.org/2000/svg" width="280" height="280" viewBox="0 0 280 280">
      ${butterfly(40, 50, 0.9, -18, 0.9)}
      ${butterfly(200, 30, 0.7, 25, 0.75)}
      ${butterfly(130, 130, 1.15, 8, 0.95)}
      ${butterfly(30, 200, 0.75, -30, 0.7)}
      ${butterfly(230, 190, 0.95, 15, 0.85)}
      ${butterfly(250, 260, 0.6, -10, 0.6)}
      ${butterfly(10, 260, 0.55, 20, 0.55)}
    </svg>`;

  const encoded = 'data:image/svg+xml;utf8,' + encodeURIComponent(tile);
  document.documentElement.style.setProperty('--butterfly-tile', `url("${encoded}")`);
}

// Spawns a handful of softly floating butterflies drifting over the marble.
// Expects an element with id="butterflies" to exist in the page.
function spawnButterflies(){
  const container = document.getElementById('butterflies');
  if(!container) return;

  const positions = [
    {top:'10%', left:'8%',  size:34, dur:'7s',  delay:'0s',  color:'#f2a8c1'},
    {top:'18%', left:'85%', size:26, dur:'8.5s',delay:'1s',  color:'#eb90b3'},
    {top:'70%', left:'12%', size:30, dur:'9s',  delay:'0.4s',color:'#f2a8c1'},
    {top:'78%', left:'88%', size:22, dur:'6.5s',delay:'1.4s',color:'#eb90b3'},
    {top:'45%', left:'4%',  size:18, dur:'7.5s',delay:'0.8s',color:'#f6c3d6'},
    {top:'40%', left:'92%', size:20, dur:'8s',  delay:'0.6s',color:'#f6c3d6'},
  ];

  positions.forEach(p => {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 60 60");
    svg.setAttribute("width", p.size);
    svg.setAttribute("height", p.size);
    svg.style.top = p.top;
    svg.style.left = p.left;
    svg.style.animationDuration = p.dur;
    svg.style.animationDelay = p.delay;

    svg.innerHTML = `
      <g transform="translate(30,30)">
        <path d="M0,0 C-12,-19 -29,-17 -29,-2 C-29,10 -14,14 0,3 Z" fill="${p.color}"/>
        <path d="M0,0 C12,-19 29,-17 29,-2 C29,10 14,14 0,3 Z" fill="${p.color}"/>
        <ellipse cx="0" cy="0" rx="2" ry="12" fill="#c96b8e"/>
      </g>`;
    container.appendChild(svg);
  });
}

// Spawns ambient floating sparkles. Expects an element with id="floaters".
function spawnFloaters(){
  const container = document.getElementById('floaters');
  if(!container) return;

  const count = 16;
  for(let i = 0; i < count; i++){
    const s = document.createElement('span');
    const size = 3 + Math.random() * 6;
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.left = Math.random() * 100 + '%';
    s.style.bottom = (-10 - Math.random() * 20) + '%';
    s.style.animationDuration = (10 + Math.random() * 10) + 's';
    s.style.animationDelay = (Math.random() * 12) + 's';
    container.appendChild(s);
  }
}

// Call this once per page, after the DOM is ready, to set everything up.
function initBackground(){
  injectMarbleFilter();
  buildButterflyTile();
  spawnButterflies();
  spawnFloaters();
}

document.addEventListener('DOMContentLoaded', initBackground);
