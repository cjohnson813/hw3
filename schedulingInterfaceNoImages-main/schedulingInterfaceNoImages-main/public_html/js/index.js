
// get a URL and put the server's reply into results
async function getAndShow(url) {
  const results = document.getElementById('results');
  try {
    const res = await fetch(url, { method: 'GET' });
    const text = await res.text();
    results.textContent = text;
  } catch (err) {
    results.textContent = 'Request failed. Please try again.';
    console.error(err);
  }
}

function val(id) {
  return document.getElementById(id).value.trim();
}

document.addEventListener('DOMContentLoaded', () => {
  const scheduleBtn = document.getElementById('scheduleBtn');
  const cancelBtn   = document.getElementById('cancelBtn');
  const checkBtn    = document.getElementById('checkBtn');

  scheduleBtn.addEventListener('click', () => {
    const name = encodeURIComponent(val('name'));
    const day  = encodeURIComponent(val('day'));
    const time = encodeURIComponent(val('time'));
    getAndShow(`/schedule?name=${name}&day=${day}&time=${time}`);
  });

  cancelBtn.addEventListener('click', () => {
    const name = encodeURIComponent(val('name'));
    const day  = encodeURIComponent(val('day'));
    const time = encodeURIComponent(val('time'));
    getAndShow(`/cancel?name=${name}&day=${day}&time=${time}`);
  });

  checkBtn.addEventListener('click', () => {
    const day  = encodeURIComponent(val('day'));
    const time = encodeURIComponent(val('time'));
    getAndShow(`/check?day=${day}&time=${time}`);
  });
});
