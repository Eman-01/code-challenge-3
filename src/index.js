document.addEventListener("DOMContentLoaded", () => {
    const baseURL = "http://localhost:3000";
    let selectedMovie;

    const fetchMovieDetails = (id) => {
        return fetch(`${baseURL}/films/${id}`)
            .then(response => response.json());
    };

    const updateMovieDetails = (movie) => {
        const { poster, title, runtime, description, showtime, capacity, tickets_sold } = movie;
        document.getElementById("poster").src = poster;
        document.getElementById("title").textContent = title;
        document.getElementById("runtime").textContent = `${runtime} minutes`;
        document.getElementById("film-info").textContent = description;
        document.getElementById("showtime").textContent = showtime;
        document.getElementById("ticket-num").textContent = capacity - tickets_sold;
        document.getElementById("buy-ticket").disabled = capacity - tickets_sold === 0;
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

    const deleteFilm = (id, listItem) => {
        fetch(`${baseURL}/films/${id}`, {
            method: "DELETE",
        })
        .then(() => {
            listItem.remove(); // Remove the film from the DOM
        })
        .catch(error => {
            console.error("Error deleting film:", error);
        });
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

                    // Create a delete button
                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Delete";
                    deleteButton.classList.add("delete-button");
                    deleteButton.addEventListener("click", (event) => {
                        event.stopPropagation(); 
                        deleteFilm(movie.id, filmItem);
                    });

                    // Append delete button to the film item
                    filmItem.appendChild(deleteButton);

                    // Add click event listener to select the movie
                    filmItem.addEventListener("click", () => {
                        fetchMovieDetails(movie.id)
                            .then(selectedMovieData => {
                                selectedMovie = selectedMovieData;
                                updateMovieDetails(selectedMovie);
                            });
                    });

                    // Append film item to the films list
                    filmsList.appendChild(filmItem);
                });
                updateMovieDetails(movies[0]);
            })
            .catch(error => {
                console.error("Error fetching movies:", error);
            });
    };

    document.getElementById("buy-ticket").addEventListener("click", handleBuyTicket);
  
    renderMovieList();
});
