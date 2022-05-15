// plan is to make a book tracker, with local storage
// TWO kinds of Input methods should be there
//         1) directly from the screen
//                like https://ginnerzapata.github.io/library-app/
//         2) from an pop up box
//                like https://sultanbadri.github.io/virtual-library/


// ***************************************************************
// ***************************************************************

// book class - represents a book 

class Book{
    constructor(title, author, pages, read){
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }
}

// UI class - handles UI tasks 
class UI{
    static displayBooks(){
        const books =  Store.getBooks();

        books.forEach(  ( pustak ) => UI.addBookToList( pustak ) );
    }

    static addBookToList(pustak){
        const list = document.getElementById('book-table');

        // creating row and adding book details to it
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pustak.title}</td>
            <td>${pustak.author}</td>
            <td>${pustak.pages}</td>
            <td>${pustak.read}</td>
            <td> <a href="#" class="btn btn-danger btn-sm delete"> X </a> </td> 
        `
        list.appendChild(row);
    }

    static removeBook(el){
        if( el.classList.contains('delete') ){
            el.parentElement.parentElement.remove();
        }
    }

    static showAlerts(message, className){
        // showing the Div 
        const div = document.createElement('div');
        div.className = ` alert alert-${className}`;
        div.appendChild( document.createTextNode(message) );

        const header = document.querySelector('header');
        header.insertAdjacentElement('afterend',div);


        // vanishing the div
            // anything with class .alert,  remove it in 3 seconds
        setTimeout( () => document.querySelector('.alert').remove(), 3000 );
    }

    static clearFields(){
        document.querySelector("#title").value = "";
        document.querySelector("#author").value = "";
        document.querySelector("#pages").value = "";
        document.querySelector("#read").value = " ";
    }
}

// store class - handles storage
    // local storage me objects store nai kar sakte, isliye string store karenge
class Store{
    static getBooks(){
        let books;
        if( localStorage.getItem('books') === null ){
            books = [];
        }
        else{
            books = JSON.parse( localStorage.getItem('books') );
        }

        return books;
    }

    static addBook(book){
        const books = Store.getBooks();

        books.push(book);
        localStorage.setItem( 'books', JSON.stringify(books) );
    }

    static removeBook(title){
        const books = Store.getBooks();
        books.forEach( (book,index)=>{
            if( book.title === title ){
                books.splice( index, 1 );
            }
        } )

        localStorage.setItem('books', JSON.stringify(books) );
    }

}

// event : display book
document.addEventListener('DOMContentLoaded', UI.displayBooks );

// event : add book
document.querySelector('.book-form')
    .addEventListener('submit', (e)=>{
        // prevent actual submit
        e.preventDefault();

        //getting values from form
        const title = document.querySelector("#title").value ;
        const author = document.querySelector("#author").value ;
        const pages = document.querySelector("#pages").value ;
        const abc = document.getElementById("read");
            const read = abc.options[abc.selectedIndex].text ;

        // validating inputs
        if( title==='' || author==='' || pages==='' || read===''){
            // showing error message
            UI.showAlerts('jo fields khali hai usme sabji ugana hai ?', 'danger')
        }
        else{ 
            //instantiating book
            const book = new Book(title, author, pages, read);

            // adding book to UI
            UI.addBookToList(book);

            // adding book to store
            Store.addBook(book);

            // showing success message
            UI.showAlerts('book add ho gai🎉 ', 'success');

            // clearing form fields
            UI.clearFields();
        }

    })

// event : remove book 
document.querySelector(".book-list")
    .addEventListener('click', (e)=>{
        // removing book from UI
        UI.removeBook(e.target);

        // removing book from storage
        Store.removeBook(
            e.target   // yahan delete button mila
                .parentElement.parentElement.firstChild.textContent
        )

        // showing delete book message
        UI.showAlerts('book removed ', 'success');
    });

