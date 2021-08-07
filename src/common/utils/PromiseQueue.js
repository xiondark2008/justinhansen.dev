/*NOTE: Found this code on the internet (https://medium.com/@karenmarkosyan/how-to-manage-promises-into-dynamic-queue-with-vanilla-javascript-9d0d1f8d4df5)
 * but made the small modification to add the delay for making multiple REST calls.
 */
export default class PromiseQueue {
    static queue = [];
    static pendingPromise = false;

    static enqueue(promise, delay=0) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                promise,
                delay,
                resolve,
                reject,
            });
            this.dequeue();
        });
    }

    static dequeue() {
        if (this.workingOnPromise) {
            return false;
        }
        const item = this.queue.shift();
        if (!item) {
            return false;
        }
        this.workingOnPromise = true;
        setTimeout(( ()=>{
            try {
                item.promise()
                    .then((value) => {
                        this.workingOnPromise = false;
                        item.resolve(value);
                        this.dequeue();
                    })
                    .catch(err => {
                        this.workingOnPromise = false;
                        item.reject(err);
                        this.dequeue();
                    })
            } catch (err) {
                this.workingOnPromise = false;
                item.reject(err);
                this.dequeue();
            }
        } ).bind(this), item.delay)
        
        return true;
    }
}