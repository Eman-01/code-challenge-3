// Your code here
document.addEventListener("DOMContentLoaded", () => {
    const baseURL = "http://localhost:3000";
    let selectedMovie; 

    const fetchMovieDetails = (id) => {
        return fetch(`${baseURL}/films/${id}`)
            .then(response => response.json());
    };

    const updateMovieDetails = (movie) => {
        const { poster, title, runtime, description, showtime, capacity, tickets_sold } = movie;
        document.getElementById("poster").src = `${poster}`;
        document.getElementById("title").textContent = `${title}`;
        document.getElementById("runtime").textContent = `${runtime} minutes`;
        document.getElementById("film-info").textContent = `${description}`;
        document.getElementById("showtime").textContent = `${showtime}`;
        document.getElementById("ticket-num").textContent = `${capacity - tickets_sold}`;
        document.getElementById("buy-ticket").disabled = `${capacity} - ${tickets_sold} === 0`;
    };

    const handleBuyTicket = () => {
        if (selectedMovie) {
            const updatedTicketsSold = selectedMovie.tickets_sold + 1;
            fetch(`${baseURL}/films/${selectedMovie.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tickets_sold: updatedTicketsSold }),
            })
            .then(() => {
                return fetch(`${baseURL}/tickets`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ film_id: selectedMovie.id, number_of_tickets: 1 }),
                });
            })
            .then(() => {
                selectedMovie.tickets_sold = updatedTicketsSold;
                updateMovieDetails(selectedMovie);
            })
            .catch(error => {
                console.error("Error buying ticket:", error);
            });
        }
    };

    const renderMovieList = () => {
        fetch(`${baseURL}/films`)
            .then(response => response.json())
            .then(movies => {
                const filmsList = document.getElementById("films");
                filmsList.innerHTML = "";
                movies.forEach((movie) => {
                    const filmItem = document.createElement("li");
                    filmItem.textContent = movie.title;
                    filmItem.classList.add("film", "item");
                    filmItem.addEventListener("click", () => {
                        fetchMovieDetails(movie.id)
                            .then(selectedMovieData => {
                                selectedMovie = selectedMovieData; 
                                updateMovieDetails(selectedMovie);
                            });
                    });
                    filmsList.appendChild(filmItem);
                });
                updateMovieDetails(movies[0]); 
            })
            .catch(error => {
                console.error("Error fetching movies:", error);
            });
    };

    document.getElementById("buy-ticket").addEventListener("click", handleBuyTicket(selectedMovie));
  
    renderMovieList();
});




// document.getElementById("buy-ticket").addEventListener("click", () => {
//     // Here, you need to define how to get the currently selected movie object
//     // For example, you can store the currently selected movie object in a variable
//     // and then pass it to the handleBuyTicket function
//     const selectedMovie = /* logic to get the currently selected movie object */;
//     handleBuyTicket(selectedMovie);
// });
