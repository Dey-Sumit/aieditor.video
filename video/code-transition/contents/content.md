## !!steps example-1
!duration 180
```jsx ! Example 1 : race between promises, one resolves first
const promise1 = new Promise((resolve) => setTimeout(resolve, 100, 'first'));
const promise2 = new Promise((resolve) => setTimeout(resolve, 50, 'second'));

Promise.race([promise1, promise2])     
    .then(value => {
        // !mark[29:200] 75 30
        console.log(value); // output: "second" because the second promise resolves first
    })
    .catch(error => {
        console.error(error); 
    });
```

## !!steps example-2
!duration 180
```jsx ! Example 2 : race between promises, one rejects first
const promise1 = new Promise((resolve) => setTimeout(resolve, 100, 'first'));
const promise2 = new Promise((resolve, reject) => setTimeout(reject, 50, 'error'));

Promise.race([promise1, promise2])
    .then(value => {
        console.log(value); 
    })
    .catch(error => {
        // !mark[31:100] 75 30
        console.error(error); // output: "error" because the second promise rejects first
    });
```

## !!steps SCENE_CHANGE
!duration 50
```jsx ! 
```

## !!steps Skeleton

!duration 180 

```jsx !  Function Structure
function promiseRace(promises: Promise<any>[]): Promise<any> {

    return new Promise((resolve, reject) => {
        // This is crazy
    });
    
}
```
## !!steps loop-over-promises

!duration 180

```jsx ! 
function promiseRace(promises: Promise<any>[]): Promise<any> {
    return new Promise((resolve, reject) => {
        // !mark(1:3) 55 50
        promises.forEach(promise => {
            // logic for handling each promise will go here
        })
    });
}

```

## !!steps resolve-first-promise

!duration 180

```jsx ! 
function promiseRace(promises: Promise<any>[]): Promise<any> {
    return new Promise((resolve, reject) => {
        promises.forEach(promise => {
            // convert the value to a promise
            // !mark[38:200] 55 50
            const convertedPromise = Promise.resolve(promise);
            // Logic to handle the converted promise
        })
    });
}
```

## !!steps resolve-first-promise
!duration 180
```jsx ! 
function promiseRace(promises: Promise<any>[]): Promise<any> {
    return new Promise((resolve, reject) => {
        promises.forEach(promise => {
            const convertedPromise = Promise.resolve(promise);
            convertedPromise.then(value => {
                resolve(value);  // resolve the fastest promise
            })  
        })
    });
}
```
## !!steps Final Code
!duration 160
```jsx ! 
function promiseRace(promises: Promise<any>[]): Promise<any> {
    return new Promise((resolve, reject) => {
        promises.forEach(promise => {
            const convertedPromise = Promise.resolve(promise);
            convertedPromise.then(value => {
                resolve(value);  // resolve the fastest promise
            })
            .catch(error => {
                reject(error); // reject the fastest promise
            });

        })
    });
}
```

## !!steps SCENE_CHANGE-SHORTEN_CODE
!duration 100
```jsx ! 
function promiseRace(promises: Promise<any>[]): Promise<any> {
  return new Promise((resolve, reject) => {
    promises.forEach(p => Promise.resolve(p).then(resolve).catch(reject));
  });
}
```
