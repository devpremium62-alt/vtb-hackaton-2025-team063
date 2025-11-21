export default function promiseAllSafe(promises: Array<Promise<any>>) {
    return Promise.all(promises.map(promises => promises.catch((e) => {
        console.error(e);
        return [];
    })));
}