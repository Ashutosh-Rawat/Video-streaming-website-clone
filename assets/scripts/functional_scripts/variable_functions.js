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
const fetchPersonProfile = person_id => {
    return `https://www.themoviedb.org/person/${person_id}`
}
const getShowURL = (movieId, show_status) => {
    return `https://api.themoviedb.org/3/${show_status}/${movieId}?api_key=${api_key}`
}
const getCrewDetailsURL = (id, show_status) => {
    return `https://api.themoviedb.org/3/${show_status}/${id}/credits?api_key=${api_key}`
}
const getReviewsURL = (id, show_status) => {
    return `https://api.themoviedb.org/3/${show_status}/${id}/reviews?api_key=${api_key}`
}
// const getImdbCrewDetails = (imdb_id) => {
//     const imdb_api = `k_9l353587`
//     return `https://imdb-api.com/en/API/FullCast/${imdb_api}/${imdb_id}`
// }
// generic info urls
const movieReleaseDatesLocal = async(movie_id) => {
    let req_url = `https://api.themoviedb.org/3/movie/${movie_id}/release_dates?api_key=${api_key}`
    let releaseDates = await fetchGenericURL(req_url)
    let indiaRelease = releaseDates.find(country => country.iso_3166_1 === 'IN')
    if(indiaRelease) {
        indiaRelease = indiaRelease.release_dates[0].release_date
        let num = indiaRelease.split('T')[0]
        num = num.split('-').reverse()
        return num.join('/')
    }
    else {
        return null
    }
}
const getMovieCertification = async(id, show_status) => {
    let req_url;
    if(show_status==='movie') req_url = `https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${api_key}`
    else req_url = `https://api.themoviedb.org/3/tv/${id}/content_ratings?api_key=${api_key}`
    
    const data = await fetchJSON(req_url)   
    if(show_status==='movie') {
        const releases = data.results
        const indiaRelease = releases.find(release => release.iso_3166_1 === 'IN')
        var usRelease;
        if (!indiaRelease) usRelease = releases.find(release => release.iso_3166_1 === 'US')            
        for (const release of releases) {
            const validRelease = release.release_dates[0].certification;
            if (validRelease) return validRelease;
        }
        return indiaRelease ? indiaRelease.release_dates[0].certification : usRelease.release_dates[0].certification;
    }
    else return data.results[0].rating 
}
const getMovieCast = async(id, show_status) => {
    const resultSet = await fetchJSON(getCrewDetailsURL(id, show_status))
    return {'cast': resultSet.cast, 'crew': resultSet.crew}
}
const getShowMedia = async(show_id, show_status) => {
    let media_url = `https://api.themoviedb.org/3/${show_status}/${show_id}/images?api_key=${api_key}`
    let media = await fetchJSON(media_url)
    return [media.backdrops, media.logos, media.posters]
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
const displayCircularProgress = (vote_average) => {
    // user ratings
    const user_rating = Math.round(vote_average*10)
    document.documentElement.style.setProperty('--rating-value', user_rating)
    $('#circle').circleProgress({
        startAngle: -Math.PI / 2,
        value: user_rating / 100,
        size: 60,
        fill: {
            color: 'blue'
        }
    }).on('circle-animation-progress', function(event, progress) {
        $('#value').html(Math.round(user_rating * progress))
    })
}
const goToCastPage = (movie_id, name, show_status) => {
    const movie_name = ((name.toLowerCase()).split(' ')).join('-')
    window.location.href = `https://www.themoviedb.org/${show_status}/${movie_id}-${movie_name}/cast`
}
const networkPage = network_id => {
    return `https://www.themoviedb.org/network/${network_id}`
}
const goToMediaPage = (show_status, show_id, name, media_type) => {
    const movie_name = ((name.toLowerCase()).split(' ')).join('-')
    window.location.href = `https://www.themoviedb.org/${show_status}/${show_id}-${movie_name}/images/${media_type}`
}
const goToUser = username => {
    return `https://www.themoviedb.org/u/${username}`
}
const seeMoreReviewsPage = (show_status,show_id,show_name) => {
    const processedName = (show_name.split(' ')).join('-')
    return `https://www.themoviedb.org/${show_status}/${show_id}-${processedName}/reviews`
}
const goToCurrentReview = review_id => {
    return `https://www.themoviedb.org/review/${review_id}`
}
const processDate = input_date_time => {
    const filteredDate = input_date_time.split('T')[0]
    const [year, month, date] = filteredDate.split('-')
    const typeNum = {'year':year, 'month':month, 'day':date}
    let months = {1:'January', 2:'February', 3:'March', 4:'April', 5:'May', 6:'June', 7:'July', 8:'August', 9:'September', 10:'October', 11:'November', 12:'December'}
    const typeName = {'year':year, 'month':months[Number(month)], 'date':date}
    return [typeNum, typeName]
}