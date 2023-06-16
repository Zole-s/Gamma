const ask_key = document.createElement('div');
ask_key.id = 'loader-wrapper';
ask_key.style.zIndex = "9999999";
ask_key.innerHTML = ` <div id="loader">
      <h1 id="header" style="color: white;font-family: Arial;">Gamma</h1>
      <p id="info"></p>
      <p id="details"></p>
      <input id="activation-key" type="text" placeholder="Your Activation Key" autocomplete="on">
    </div>`;
const ask_key_bg = document.createElement('div');
ask_key_bg.innerHTML = ``;
ask_key_bg.style = "z-index: 9999; width: 100%; height: 100%; position: fixed; top: 0; right: 0; left: 0; bottom: 0; background: rgba(0,0,0,0); backdrop-filter: blur(5px);";

document.documentElement.append(ask_key_bg);
document.documentElement.append(ask_key);
const info = document.getElementById("info");
const details = document.getElementById("details");
const activation_key = document.getElementById("activation-key");
const header = document.getElementById("header");

function error(text, err) {
    info.innerText = `${text}: ${err}`;
    info.classList.add("mark-error");
    details.style.display = "block";
    details.innerText = "If this keeps happening even after page reload, please report this to developers";
    return Promise.reject();
}

function key_valid(key, test = {
    firstUsage: 1
}) {
    if (test.ok) {
        info.classList.remove("mark-error");
        info.innerText = "Key has been verified.";
        clearInterval(xo);
        setTimeout(() => {
                ask_key.remove();
                ask_key_bg.remove();
            }, 500);
    } else if (test.expired) {
        info.style.display = "block";
        info.innerHTML = 'Key has expired! Get a new key at <a href="https://discord.gg/V5gS9ze278">our [Discord]</a>';
        info.classList.add("mark-error");
        clearInterval(xo);
    } else if (test.firstUsage) {
        info.style.display = "block";
        info.innerHTML = "Redeeming key...";
        info.classList.add("mark-success");
        setTimeout(() => {
            info.innerHTML = "Key redeemed successfully!";
            clearInterval(xo);
            setTimeout(() => {
                ask_key.remove();
                ask_key_bg.remove();
            }, 500);
        }, 2500);
    }
}
let xo = setInterval(() => {
    if (activation_key.value.length > 69) {
        key_valid(activation_key.value);
    }
}, 100);
const style = document.createElement("style");
style.innerHTML = `
:root {
  --primary-color: #000000;
  --secondary-color: #3b233e;
  --error-color: #f00;
}

.toggle-button {
  pointer-events: auto;
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 999;
  border: none;
  padding: 10px 20px;
  background: var(--primary-color);
  color: #fff;
  cursor: pointer;
}

.form-container {
 pointer-events:auto;
  position: absolute;
  top: 50px;
  left: 10px;
  z-index: 999;
  width: 300px;
  border: 1px solid var(--secondary-color);
  border-radius: 5px;
  padding: 10px;
  background: #fff;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  display: none;
}

.form-container label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-container input[type="number"],
.form-container input[type="text"],
.form-container input[type="submit"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid var(--secondary-color);
  border-radius: 3px;
  box-sizing: border-box;
  font-size: 16px;
}

.form-container input[type="number"]:focus,
.form-container input[type="text"]:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-container input[type="submit"] {
  border: none;
  background: var(--primary-color);
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
}

.form-container .close-button {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 18px;
  font-weight: bold;
  color: var(--secondary-color);
  cursor: pointer;
}

.form-container .close-button:hover {
  color: #000;
}

.form-container .error-message {
  color: var(--error-color);
  margin-bottom: 10px;
}
.form-input-error {
  border-color: 5px solid var(--error-color);
  animation: shake 0.5s;
}

@keyframes shake {
  0% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
  100% { transform: translateX(0); }
}
#loader-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  background: linear-gradient(to bottom right, #ff3b3b, #d847ff 50%, #205eff);
}

#header {
  font-size: 25px;
}

#info {
  font-size: 18px;
}

#activation-key {
    display: block;
    margin: 10px auto 0;
    width: 360px;
    height: 20px;
    font-size: 16px;
    color: var(--secondary-color);
    background-color: #f2f2f2;
    border: 1px solid var(--secondary-color);
    padding: 10px;
    border-radius: 10px;
    box-shadow: 1px 1px 8px 1px var(--primary-color);
}

#activation-key:focus {
  outline: none;
  border-color: #387ef5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 2px #387ef5;
}
#activation-key::placeholder {
  color: #999;
}
.mark-error {
  color: rgb(245, 55, 55);
}

.mark-success {
  color: rgb(81, 247, 59);
}

    `;
document.head.appendChild(style);

module.exports = undefined;