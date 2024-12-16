/** @format */

class Book {
	constructor(title, author,pages, year, isRead) {
		this.title = title
		this.author = author
		this.pages = pages
		this.year = year
		this.isRead = isRead
	}

	toggleReadStatus() {
		this.isRead = !this.isRead
	}
}

class Library {
	constructor() {
		const booksData = JSON.parse(localStorage.getItem("books")) || []
		this.books = booksData.map(
			book => new Book(book.title, book.author,book.pages, book.year, book.isRead)
		)
	}

	saveToLocalStorage() {
		localStorage.setItem("books", JSON.stringify(this.books))
	}

	addBooks(book) {
		this.books.push(book)
		this.saveToLocalStorage()
	}

	removeBook(title) {
		this.books = this.books.filter(book => book.title !== title)
		this.saveToLocalStorage()
	}

	toggleReadStatus(title) {
		const book = this.books.find(b => b.title === title)
		if (book) {
			book.toggleReadStatus()
			this.saveToLocalStorage()
		}
	}

	getUnreadBooks() {
		return this.books.filter(book => !book.isRead)
	}
}

const addBookForm = document.querySelector("#addBookForm")
const bookList = document.querySelector("#bookList")
const showUnreadBooksBtn = document.querySelector("#showUnreadBooks")

const library = new Library()
let showingUnreadBooks = false

function updateBookList(filteredBooks = null) {
	bookList.innerHTML = ""
	const booksToDisplay = filteredBooks || library.books

	booksToDisplay.forEach(book => {
		const row = document.createElement("tr")
		row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.pages}</td>
      <td>${book.year}</td>
      <td class="${book.isRead ? "read" : "unread"}">${
			book.isRead ? "Окулду" : "Окула элек"
		}</td>
      <td>
        <button onclick="toggleRead('${book.title}')">Абалды өзгөртүү</button>
        <button onclick="removeBook('${book.title}')">Өчүрүү</button>
      </td>
    `
		bookList.appendChild(row)
	})
}

addBookForm.addEventListener("submit", e => {
	e.preventDefault()
	const title = document.querySelector("#title").value
	const author = document.querySelector("#author").value
	const pages = document.querySelector("#pages").value
	const year = document.querySelector("#year").value
	const isRead = document.querySelector("#isRead").checked

	const newBook = new Book(title, author,pages, year, isRead)
	library.addBooks(newBook)

	updateBookList()

	addBookForm.reset()
})

function toggleRead(title) {
	library.toggleReadStatus(title)

	if (showingUnreadBooks) {
		const unreadBooks = library.getUnreadBooks()
		updateBookList(unreadBooks)
		localStorage.setItem("unreadBooks", JSON.stringify(unreadBooks))
	} else {
		updateBookList()
	}
}

function removeBook(title) {
	library.removeBook(title)

	if (showingUnreadBooks) {
		const unreadBooks = library.getUnreadBooks()
		localStorage.setItem("unreadBooks", JSON.stringify(unreadBooks))
		updateBookList(unreadBooks)
	} else {
		updateBookList()
	}
}

showUnreadBooksBtn.addEventListener("click", () => {
	showingUnreadBooks = !showingUnreadBooks

	if (showingUnreadBooks) {
		const unreadBooks = library.getUnreadBooks()
		localStorage.setItem("unreadBooks", JSON.stringify(unreadBooks))
		updateBookList(unreadBooks)
		showUnreadBooksBtn.textContent = "Бардык китептерди көрсөтүү"
	} else {
		updateBookList()
		showUnreadBooksBtn.textContent = "Тек гана окулбаган китептерди көрсөтүү"
	}
})

updateBookList()
