(() => {
  const slider = document.getElementById('ba-slider');
  const overlay = document.getElementById('overlay');
  const handle = document.getElementById('handle');
  const range = document.getElementById('range');

  let dragging = false;

  function setPosition(percent){
    percent = Math.max(0, Math.min(100, percent));
    overlay.style.width = percent + '%';
    handle.style.left = percent + '%';
    if(range) range.value = percent;
    handle.setAttribute('aria-valuenow', String(Math.round(percent)));
  }

  function getRelativePercent(clientX){
    const rect = slider.getBoundingClientRect();
    const x = clientX - rect.left;
    return (x / rect.width) * 100;
  }

  // Pointer events
  handle.addEventListener('pointerdown', e => { dragging = true; handle.setPointerCapture(e.pointerId); });
  window.addEventListener('pointerup', e => { dragging = false; try{ handle.releasePointerCapture(e.pointerId) }catch(_){}});
  window.addEventListener('pointermove', e => { if(!dragging) return; setPosition(getRelativePercent(e.clientX)); });

  // Click on slider to move
  slider.addEventListener('click', e => { setPosition(getRelativePercent(e.clientX)); });

  // Range input (hidden but useful for accessibility)
  if(range) range.addEventListener('input', e => { setPosition(Number(e.target.value)); });

  // Keyboard on handle
  handle.addEventListener('keydown', e => {
    const current = Number(range ? range.value : 50);
    let v = current;
    if(e.key === 'ArrowLeft' || e.key === 'ArrowDown'){ v = v - 5; setPosition(v); e.preventDefault(); }
    if(e.key === 'ArrowRight' || e.key === 'ArrowUp'){ v = v + 5; setPosition(v); e.preventDefault(); }
    if(e.key === 'Home'){ setPosition(0); e.preventDefault(); }
    if(e.key === 'End'){ setPosition(100); e.preventDefault(); }
  });

  // Initialize to middle
  setPosition(50);

})();
