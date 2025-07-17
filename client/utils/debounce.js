async function debounce(func, delay) {

    let timeoutId;

    return function (...args) {
        console.log("old timeoutId", timeoutId);
        if (timeoutId) clearInterval(timeoutId);

        timeoutId = setInterval(() => {
            func(...args)

        }
            , delay)
        console.log("new timeoutId", timeoutId)

    }

}


