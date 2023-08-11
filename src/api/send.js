import pako from 'pako'
export default (socket, data) => {
    let buffer = Buffer.from(data);
    let unintArray = Uint8Array.from(buffer);

    if (unintArray.length > 256) {
        let deflatedData = pako.gzip(data);
        let deflatedArray = new Uint8Array(deflatedData.length + 1);
        deflatedArray[0] = 1;
        deflatedArray.set(deflatedData, 1);
        console.log(deflatedArray);
        socket.send(deflatedArray);
    } else {
        socket.send(unintArray);
    }
}