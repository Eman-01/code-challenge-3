document.addEventListener("DOMContentLoaded", () => {
    const BASE_URL = "http://localhost:3000";

    const fetchMovieDetails = (id) => {
      return fetch(`${BASE_URL}/films/${id}`)
        .then(response => response.json())
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

    const handleBuyTicket = (movie) => {
      const updatedTicketsSold = movie.tickets_sold + 1;
      fetch(`${baseURL}/films/${movie.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tickets_sold: updatedTicketsSold }),
      })
      .then(() => {
          return fetch(`${BASE_URL}/tickets`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ film_id: movie.id, number_of_tickets: 1 }),
          });
      })
      .then(() => {
          movie.tickets_sold = updatedTicketsSold;
          updateMovieDetails(movie);
      })
    
    };

    const renderMovieList = () => {
      fetch(`${BASE_URL}/films`)
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
                .then(selectedMovie => {
                  updateMovieDetails(selectedMovie);
                });
            });
            filmsList.appendChild(filmItem);
          });
          updateMovieDetails(movies[0]); 
        }) 
    };

    document.getElementById("buy-ticket").addEventListener("click", () => {
        document.preventDefault()
        handleBuyTicket(selectedMovie);
    });
  
    renderMovieList();
});
