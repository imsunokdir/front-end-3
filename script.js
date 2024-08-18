class Timer {
  constructor(hh, mm, ss, onEndCallback) {
    this.hh = hh;
    this.mm = mm;
    this.ss = ss;
    this.intervalId = null;
    this.onEndCallback = onEndCallback;
  }

  start() {
    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000);
  }

  tick() {
    if (this.ss > 0) {
      this.ss--;
    } else if (this.mm > 0) {
      this.ss = 59;
      this.mm--;
    } else if (this.hh > 0) {
      this.ss = 59;
      this.mm = 59;
      this.hh--;
    } else {
      this.stop();
      this.onEndCallback();
    }
  }

  stop() {
    clearInterval(this.intervalId);
  }

  getTime() {
    return `${this.hh.toString().padStart(2, "0")}:${this.mm
      .toString()
      .padStart(2, "0")}:${this.ss.toString().padStart(2, "0")}`;
  }
}

class Counter {
  constructor() {
    this.timers = [];
    this.timersContainer = document.getElementById("current-timers");
    this.startTimerButton = document.getElementById("set-btn");
    this.alarmSound = document.getElementById("alarm-sound");
    this.noTimersMessage = document.getElementById("no-timers-message");

    this.startTimerButton.addEventListener("click", () => this.addTimer());
    this.updateNoTimersMessage();
  }

  addTimer() {
    console.log("test::::", this.startTimerButton);
    const hh = parseInt(document.getElementById("hh").value) || 0;
    const mm = parseInt(document.getElementById("mm").value) || 0;
    const ss = parseInt(document.getElementById("ss").value) || 0;

    if (hh === 0 && mm === 0 && ss === 0) {
      alert("Please set a valid time.");
      return;
    }

    const timer = new Timer(hh, mm, ss, () => this.onTimerEnd(timer));
    this.timers.push(timer);
    this.displayTimer(timer);
    timer.start();
    this.updateNoTimersMessage();
  }

  displayTimer(timer) {
    const timerElement = document.createElement("div");
    timerElement.className = "timer-div";
    timerElement.innerHTML = `
              <div class="set-time">Time Left</div>
          <div class="time">
            ${timer.getTime()}
          </div>
          <div class="set-btn-div">
            <button class="stop-button" id="set-btn">Stop</button>
          </div>
    `;
    console.log("Timer::::::", timer.getTime());

    this.timersContainer.appendChild(timerElement);

    const stopButton = timerElement.querySelector(".stop-button");
    stopButton.addEventListener("click", () => {
      timer.stop();
      clearInterval(timerElement.updateInterval);
      this.timersContainer.removeChild(timerElement);
    });

    timerElement.updateInterval = setInterval(() => {
      timerElement.querySelector(".time").textContent = timer.getTime();
    }, 1000);
    timer.domElement = timerElement;
  }

  onTimerEnd(timer) {
    timer.stop();

    clearInterval(timer.domElement.updateInterval);

    timer.domElement.style.backgroundColor = "yellow";
    timer.domElement.style.display = "flex";
    timer.domElement.style.justifyContent = "space-around";

    timer.domElement.innerHTML = `
    <div class="set-time">Timer is up!</div>
    <div class="set-btn-div">
            <button class="set-btn del-btn" id="del-btn">Delete</button>
    </div>
`;
    timer.domElement.querySelector(".set-time").style.backgroundColor =
      "yellow";
    timer.domElement.querySelector(".set-time").style.color = "#39393e";
    timer.domElement.querySelector(".set-btn-div").style.backgroundColor =
      "#39393e";
    timer.domElement.querySelector(".del-btn").style.backgroundColor =
      "#39393e";
    timer.domElement.querySelector(".del-btn").style.color = "white";

    const deleteButton = timer.domElement.querySelector(".del-btn");
    deleteButton.addEventListener("click", () => {
      this.timersContainer.removeChild(timer.domElement);
      this.removeTimer(timer);
    });

    this.alarmSound.play();
  }

  removeTimer(timer) {
    this.timers = this.timers.filter((t) => t !== timer);
    this.updateNoTimersMessage();
  }
  updateNoTimersMessage() {
    if (this.timers.length === 0) {
      this.noTimersMessage.style.display = "block";
    } else {
      this.noTimersMessage.style.display = "none";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Counter();
});
