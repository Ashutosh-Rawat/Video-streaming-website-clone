async function featured_banner() {
    var movies = await fetchMovies(getTrending('movie'))
    var num = Math.floor(Math.random()*movies.length)
    document.querySelector('#movie-title>span').innerText = movies[num].title
    document.documentElement.style.setProperty('--background-image', `url(${fetchImage(movies[num].backdrop_path)})`);
    document.querySelector('#movie-desc>p').innerText = movies[num].overview

    // featured movie button events
    document.querySelector('#add-movie>button').addEventListener('click', () => {
    const show_status = 'movie'
    window.location.href = `http://127.0.0.1:5500/movie.html?id=${movies[num].id}&show_status=${show_status}`;
    })    
}

async function toggleBG() {
    document.querySelector('#toggle-img-bg button').addEventListener('click', function() {
        var bgImgWrapper = document.querySelector('#bg-img-wrapper')
        var root_styles = getComputedStyle(document.documentElement)
        
        // get css root variable values
        let collapsed_height = root_styles.getPropertyValue('--movie-section-height-short')
        let expanded_height = root_styles.getPropertyValue('--movie-section-height-expand').trim()
        
        // getting gap values between header and featured-movie-section
        let wrapper_gap = document.querySelector('#bg-img-wrapper>.row')
        let gap_def = root_styles.getPropertyValue('--collapsed-gap')
        let gap_expanded = root_styles.getPropertyValue('--expanded-gap')

        // hiding first (chevron-down) and showing second (chevron-up) icon
        let [chevDown, chevUp] = document.querySelectorAll('#toggle-img-bg button i')
        if (bgImgWrapper.clientHeight+"px" == collapsed_height) {
            bgImgWrapper.style.height = expanded_height
            wrapper_gap.style.gap = gap_expanded
            wrapper_gap.style.transition = 'gap 0.3s ease-in-out'
            chevDown.classList.add('d-none')
            chevUp.classList.remove('d-none')
        } else {
            bgImgWrapper.style.height = collapsed_height
            wrapper_gap.style.gap = gap_def
            chevDown.classList.remove('d-none')
            chevUp.classList.add('d-none')            
        }
    })
}

async function mapMovies() {
    var movie_sections = {'netflix-originals-movies': getOriginals('movie'), 'netflix-originals-tv': getOriginals('tv'), 'trending-now-movies': getTrending('movie'), 'trending-now-tv': getTrending('tv'), 'top-rated-movies': getTopRated()}
    for(section in movie_sections) {
        await generatePoster(await fetchMovies(movie_sections[section]), document.getElementById(section))
    }
}

async function generatePoster(results, currentDiv) {
    // Check if results is an array
    if (Array.isArray(results)) {
        var currentList = currentDiv.querySelector('ul')
        results.forEach(result => {
            // console.log('results:', result)
            let currentLi = document.createElement('li')
            currentList.appendChild(currentLi)
            let imgDiv = document.createElement('img')
            imgDiv.src = fetchImage(result.poster_path)
            if(result.name)
                imgDiv.title = result.name
            else
                imgDiv.title = result.title
            currentLi.appendChild(imgDiv)
            // Add click event listener to the image
            imgDiv.addEventListener('click', function() {
                // Redirect to the new page and pass the movie's ID in the URL
                var show_status;
                if(result.name) show_status = 'tv'
                else show_status = 'movie'

                let baseUrl = window.location.origin;
                let newUrl = baseUrl + "/movie.html"+`?id=${result.id}&show_status=${show_status}`;
                console.log(newUrl)
                // window.location.href = newUrl
            });
        })
    } else {
        console.error('Error: results is not an array')
    }
}


// scroll position variables
let scrollPositions = {
    'netflix-originals-moviesX': 0,
    'netflix-originals-tvY': 0,
    'trending-now-moviesX': 0,
    'trending-now-tvY': 0,
    'top-rated-movies': 0
}

function scrollMovies() {
    document.querySelectorAll('.scroll-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // If the button is disabled, don't do anything
            if (this.classList.contains('d-none')) {
                return
            }
            const gap = 8
            const direction = this.classList.contains('right-scroll') ? 'right' : 'left'
            const scrollAmount = direction === 'right' ? 250 : -250 
            const movieList = this.parentElement.querySelector('ul')
            const movieListId = movieList.parentElement.id
            // Calculate the potential new scroll position
            let newScrollPosition = scrollPositions[movieListId] + scrollAmount
            newScrollPosition = (direction==='right') ? newScrollPosition+gap : newScrollPosition-gap 
            const movieWidth = 125
            const totalMovies = movieList.children.length
            // Calculate max scroll position where last image is fully visible on screen
            const maxScrollPosition = (totalMovies * (movieWidth + gap)) - window.innerWidth + 60

            if (newScrollPosition >= 0 && newScrollPosition < maxScrollPosition) {
                scrollPositions[movieListId] = newScrollPosition
            } else if (direction === 'right' && newScrollPosition > maxScrollPosition) {
                scrollPositions[movieListId] = maxScrollPosition
                this.classList.add('d-none')
            } else if (direction === 'left' && newScrollPosition < 0) {
                scrollPositions[movieListId] = 0
                this.classList.add('d-none')
            }
            movieList.style.transform = `translateX(-${scrollPositions[movieListId]}px)`

            // alternate button shown when one side is approached
            const otherButton = direction === 'right' ? '.left-scroll' : '.right-scroll'
            this.parentElement.querySelector(otherButton).classList.remove('d-none')
        })
    })
}

// main functionality
window.onload = async function() {
    homeButton()
    showLoader()
    // for showing featured movie .. which has a background in page
    featured_banner()
    // to toggle between expand or shrink of background image
    toggleBG()
    // maps movies with their netflix section and creates poster and results
    mapMovies()
    // enables scrolling left and right in netflix movie section
    scrollMovies()    
    // search bar
    searching()
}