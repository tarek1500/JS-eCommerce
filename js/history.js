const req = indexedDB.open("cart",1);

const myrow = document.querySelector('.myrow table tbody');

req.onsuccess=e => {
    const db=event.target.result

    const tx = db.transaction('Orders_History', 'readonly');
    const history = tx.objectStore("Orders_History");
    const request = history.openCursor();
 
    request.onsuccess = e =>{
        const cursor = e.target.result;

        let row = document.createElement('tr');
        let data = [document.createElement('td'),document.createElement('td'),document.createElement('td')];

        data[0].textContent = cursor.value.id;
        data[1].textContent = cursor.value.date;
        data[2].textContent = cursor.value.total;

        myrow.appendChild(row);
        data.forEach(element => {
            element.classList.add('px-5','py-3')
            row.append(element);    
        });

        cursor.continue()
    }
}

