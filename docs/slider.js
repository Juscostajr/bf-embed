(() => {
  const slider = document.getElementById('ba-slider');
  const overlay = document.getElementById('overlay');
  const handle = document.getElementById('handle');
  const range = document.getElementById('range');
  const fileBefore = document.getElementById('file-before');
  const fileAfter = document.getElementById('file-after');
  const imgBefore = document.getElementById('img-before');
  const imgAfter = document.getElementById('img-after');

  let dragging = false;

  function setPosition(percent){
    percent = Math.max(0, Math.min(100, percent));
    overlay.style.width = percent + '%';
    handle.style.left = percent + '%';
    range.value = percent;
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

  // Range input
  range.addEventListener('input', e => { setPosition(Number(e.target.value)); });

  // Keyboard on handle
  handle.addEventListener('keydown', e => {
    let v = Number(range.value);
    if(e.key === 'ArrowLeft' || e.key === 'ArrowDown'){ v = v - 5; setPosition(v); e.preventDefault(); }
    if(e.key === 'ArrowRight' || e.key === 'ArrowUp'){ v = v + 5; setPosition(v); e.preventDefault(); }
    if(e.key === 'Home'){ setPosition(0); e.preventDefault(); }
    if(e.key === 'End'){ setPosition(100); e.preventDefault(); }
  });

  // File loaders
  function loadFileAsUrl(file, imgEl){
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => { imgEl.src = ev.target.result; imgEl.style.opacity = 1; };
    reader.readAsDataURL(file);
  }

  fileBefore.addEventListener('change', e => { loadFileAsUrl(e.target.files[0], imgBefore); });
  fileAfter.addEventListener('change', e => { loadFileAsUrl(e.target.files[0], imgAfter); });

  // Initialize
  setPosition(50);

})();
