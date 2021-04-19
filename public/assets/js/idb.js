// create variable to hold db connection
let db;

// establish a connection to IndexedDB database called 'budget-tracker' and set to verison 1
// this will create a db called 'budget-tracker' if it doesn't exist
const request = indexedDB.open('budget-tracker', 1);

// this request will emit if the database version changes
request.onupgradeneeded = function(event){
    // save reference to database
    const db = event.target.result;
    // create an object store called 'new-budget' and set it to have autoincrement key
    db.createObjectStore('new-budget', {autoIncrement: true});
};

// upon successful request
request.onsuccess = function(event){
    // when db is created successfully with its object store (from onupgradedneeded)
    db = event.target.result;

    // check if app is online, if yes run uploadBudget() function to send local data to api
        if(navigator.onLine){
            uploadBudget();
        }
};
request.onerror = function(event){
    console.log(event.target.errorCode);
};

// this function will run if no internet connection
function saveRecord(record){
    // open a new transaction with the db with read and write permissions
    // transaction is temp connection to the database
    const transaction = db.transaction(['new-budget'], 'readwrite');

    // access the object store for 'new-budget'
    const budgetObjectStore = transaction.objectStore('new-budget');

    // add record to the object store with add method
    budgetObjectStore.add(record);
    
}

// this function will run when internet connection is restored to push data to server
function uploadBudget(){
    // open a transaction on your db
    const transaction = db.transaction(['new-budget'], 'readwrite');

    // access object store for 'new-budget'
    const budgetObjectStore = transaction.objectStore('new-budget');

    // get all records for store and set to a variable
    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function(){
        // if data in indexedDB store, send it to api server
        if(getAll.result.length >0){
            
            fetch('api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if(serverResponse.message){
                    throw new Error(serverResponse);
                }
                // open one more transaction
                const transaction = db.transaction(['new-budget'], 'readwrite');
                // access the new-budget store
                const budgetObjectStore = transaction.objectStore('new-budget');
                // clear items in the store
                budgetObjectStore.clear();

                alert("Budget data has been submitted!");
            })
            .catch(err =>{
                console.log(err);
            });
        };
    };
};

// listen for app coming back online
window.addEventListener('online', uploadBudget);