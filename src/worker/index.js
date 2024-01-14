import planeInit from './components/setWorker.js'
let sendParams = null
addEventListener('message', async e => {
    const { data } = e;
    let imageBitmaps = await planeInit();
    switch (data.type) {
        case 'init':
            sendParams = {
                images: imageBitmaps
            };
            break;
        default:
            break;
    }
    setTimeout(() => {
        return postMessage(sendParams)
    })
})
