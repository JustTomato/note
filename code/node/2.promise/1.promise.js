const STATUS = {
    PENDING: 'PENDING',
    FULFILLED: 'FULFILLED',
    REJECTED: 'REJECTED'
}
function resolvePromise(x, promise2, resolve, reject) {
    if (x === promise2) {
        throw TypeError('type error');
    }
    if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
        let called;
        try {
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x, (y) => {
                    if (called) return;
                    called = true;
                    resolvePromise(y, promise2, resolve, reject)
                }, r => {
                    if (called) return;
                    called = true;
                    reject(r)
                })
            } else {
                resolve(x);
            }
        } catch (err) {
            if (called) return;
            called = true;
            reject(err)
        }
    } else {
        resolve(x)
    }
}
class Promise {
    constructor(executor) {
        this.status = STATUS.PENDING;
        this.val = undefined;
        this.reason = undefined;
        this.onResolveCallbacks = [];
        this.onRejectCallbacks = [];
        const resolve = val => {
            if (val instanceof Promise) {
                return val.then(resolve, reject)
            }
            if (this.status === STATUS.PENDING) {
                this.status = STATUS.FULFILLED;
                this.val = val;
                this.onResolveCallbacks.forEach(fn => fn());
            }
        }
        const reject = reason => {
            if (this.status === STATUS.PENDING) {
                this.status = STATUS.REJECTED;
                this.reason = reason;
                this.onRejectCallbacks.forEach(fn => fn());
            }
        }
        try {
            executor(resolve, reject)
        } catch (err) {
            reject(err)
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : x => x;
        onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === STATUS.FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.val);
                        resolvePromise(x, promise2, resolve, reject)
                    } catch (err) {
                        reject(err)
                    }
                }, 0);
            }
            if (this.status === STATUS.REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(x, promise2, resolve, reject)
                    } catch (err) {
                        reject(err)
                    }
                }, 0);
            }
            if (this.status === STATUS.PENDING) {
                this.onResolveCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.val);
                            resolvePromise(x, promise2, resolve, reject)
                        } catch (err) {
                            reject(err)
                        }
                    }, 0);
                })
                this.onRejectCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(x, promise2, resolve, reject)
                        } catch (err) {
                            reject(err)
                        }
                    }, 0);
                })
            }
        })
        return promise2;
    }
    catch(err) {
        return this.then(null, err)
    }

    finally(callback) {
        return this.then(data => {
            return Promise.resolve(callback()).then(() => data)
        }, err => {
            return Promise.resolve(callback()).then(() => { throw err })
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
            function processData(index, val) {
                result[index] = val;
                if (++times === promises.length) {
                    resolve(result);
                }
            }
            for (let i = 0; i < promises.length; i++) {
                let p = promises[i];
                if (p && typeof p.then == 'function') {
                    p.then((data) => {
                        processData(i, data);// 普通值
                    }, reject)
                } else {
                    processData(i, p);
                }
            }
        })
    }
    static race(promises) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < promises.length; i++) {
                let currentVal = promises[i];
                if (currentVal && typeof currentVal.then === 'function') {
                    currentVal.then(resolve, reject)
                } else {
                    resolve(currentVal)
                }
            }
        })
    }
    static allSettledl(promises) {
        return Promise.all(promises.map(p => {
            Promise.resolve(p).then(res => {
                return { status: 'fulfilled', value: res }
            }, err => {
                return { status: 'rejected', reason: err }
            })
        }));
    }
}
Promise.defer = Promise.deferred = function () {
    let dfd = {}
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    })
    return dfd;
}
module.exports = Promise
