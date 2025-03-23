// timestamp.js

export function getCurrentTimestamp() {
    return new Date().toLocaleString();
  }
  
  export function updateTimestampElement(id) {
    const el = document.getElementById(`timestamp-${id}`);
    if (el) {
      el.textContent = `Last updated: ${getCurrentTimestamp()}`;
    }
  }
  