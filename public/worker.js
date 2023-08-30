let intervalId
onmessage = function(event) {
    let key = event.data.key
    let data = event.data.data
    if (key === "start") {
        intervalId = setInterval(()=> {
            postMessage(data++);
        }, 1);
    } else if (key === "stop") {
        clearInterval(intervalId);
        intervalId = null;
    }
};