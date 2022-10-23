const STATUS = {
    PENDING: 'PENDING',
    FULFILLED: 'FULFILLED',
    REJECTED: 'REJECTED'
}
function resolvePromise(x, promise2, resolve, reject) {
    if (x === promise2) {
        throw TypeError('typeError')
    }
    if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
        let called;
        try {
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x, res => {
                    if (called) return
                    called = true
                    resolvePromise(res, promise2, resolve, reject)
                }, err => {
                    if (called) return
                    called = true
                    reject(err)
                })
            } else {
                resolve(x);
            }
        } catch (e) {
            if (called) return
            called = true
            reject(e)
        }
    } else {
        resolve(x)
    }
}

class Promise {
    constructor(excutor) {
        this.status = STATUS.PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onResolve = [];
        this.onReject = [];
        const resolve = (val) => {
            if (val instanceof Promise) {
                return val.then(resolve, reject);
            }
            if (this.status == STATUS.PENDING) {
                this.status = STATUS.FULFILLED;
                this.value = val;
                this.onResolve.forEach(fn => fn())
            }
        }
        const reject = (reason) => {
            if (this.status == STATUS.PENDING) {
                this.status = STATUS.REJECTED;
                this.reason = reason;
                this.onReject.forEach(fn => fn())
            }
        }
        try {
            excutor(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : x => x;
        onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === STATUS.FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        resolvePromise(x, promise2, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }

                }, 0);

            }
            if (this.status === STATUS.REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(x, promise2, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)

            }
            if (this.status == STATUS.PENDING) {
                this.onResolve.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(x, promise2, resolve, reject);
                        } catch (e) {
                            reject(e)
                        }
                    }, 0);

                })
                this.onReject.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(x, promise2, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0);
                })
            }
        })
        return promise2
    }
    catch(err) {
        return this.then(null, err)
    }
    finally(cb) {
        return this.then(res => {
            return Promise.resolve(cb()).then(() => res);
        }, err => {
            return Promise.resolve(cb()).then(() => { throw err })
        })
    }
    static resolve(val) {
        return new Promise((resolve, reject) => {
            resolve(val)
        })
    }
    static reject(reason) {
        return new Promise((resolve, reject) => {
            reject(reason)
        })
    }
    static all(promises) {
        return new Promise((resolve, reject) => {
            let result = [];
            let times = 0;
            function ProcessData(index, val) {
                result[index] = val
                if (++times === promises.length) {
                    resolve(result)
                }
            }
            for (let i = 0; i < promises.length; i++) {
                let p = promises[i];
                if (p && typeof p.then === 'function') {
                    p.then(res => {
                        ProcessData(i, res);
                    }, reject)
                } else {
                    ProcessData(i, p)
                }
            }
        })
    }
}
Promise.defer = Promise.deferred = function () {
    let dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;

    })
    return dfd
}

module.exports = Promise;