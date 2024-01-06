const api_key = '68b110f84aebccac87f228da521fd707'
const baseLink = `http://127.0.0.1:5500`
const getTrending = (status) => {
    return `https://api.themoviedb.org/3/trending/${status}/week?api_key=${api_key}`
}
const getOriginals = (status) => {
    return `https://api.themoviedb.org/3/discover/${status}?api_key=${api_key}`
}
const getTopRated = () => {
    return `https://api.themoviedb.org/3/movie/top_rated?api_key=${api_key}`
}
const searchQuery = showName => {
    showName = showName.split(' ')
    showName = showName.join('+')
    return `https://api.themoviedb.org/3/search/movie?query=${showName}&api_key=${api_key}`
}

// starts single movie detail functions
const fetchImage = path => {
    return `https://image.tmdb.org/t/p/original${path}`
}
const getShowURL = (movieId, show_status) => {
    return url = `https://api.themoviedb.org/3/${show_status}/${movieId}?api_key=${api_key}`
}
const getMovieReleaseDatesLocalURL = (movie_id) => {
    return `https://api.themoviedb.org/3/movie/${movie_id}/release_dates?api_key=${api_key}`
}
const getMovieCertificationURL = (id, show_status) => {
    if(show_status==='movie') return `https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${api_key}`
    else return `https://api.themoviedb.org/3/tv/${id}/content_ratings?api_key=${api_key}`
}
const getCrewDetailsURL = (id, show_status) => {
    return `https://api.themoviedb.org/3/${show_status}/${id}/credits?api_key=${api_key}`
}

// for fetching multiple movies
const fetchMovies = async movie_url => {
    try {
        const response = await fetch(movie_url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.results
    } catch (error) {
        console.error('Error:', error);
    }
}
// for fetching details for a single movie using ID
const getMovieInfo = async movie_url => {
    try {
        const response = await fetch(movie_url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result
    } catch (error) {
        console.error('Error:', error);
    }
}

const fetchGenericURL = async (url) => {
    const fetchResponse = await fetch(url)
    if(!fetchResponse.ok) return null 
    response = await fetchResponse.json()
    return response.results
}

const fetchJSON = async (url) => {
    const fetchResponse = await fetch(url)
    response = await fetchResponse.json()
    return response
}

const homeButton = () => {
    document.querySelector('#logo-container>img').addEventListener('click', () => {
        var currentPath = window.location.pathname
        var pathComponents = currentPath.split('/')
        pathComponents.pop()
        pathComponents.push('home.html')
         
        const newLink = baseLink+pathComponents.join('/')
        window.location.href = newLink
    })
}