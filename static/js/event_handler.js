
htmx.on("htmx:afterRequest", (evt) => {
  const status = evt.detail.xhr.status.toString();

  if (status.substr(0,1) == 5) {
    document.getElementById('fatal-errors').classList.toggle('hidden');
  }
  //else if (status === 404) {
  //  globalThis.location.href = "/not-found";
  //}
});
