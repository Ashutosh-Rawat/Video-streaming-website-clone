const youtubePlayer = async function onYouTubeIframeAPIReady(title) {
    try {
        const url = `https://api.themoviedb.org/3/${show_status}/${Id}/videos?api_key=${api_key}`
        const response = await (await fetch(url)).json()
        // if there is not result in results .. then the remove the play trailer button from the youtube
        if(Array.isArray(response.results) && response.results.length===0) {
            document.getElementById('play-trailer').style.display = 'None'
            return
        }
        // Filter the results to match the movie name or contain 'official trailer'
        var filteredResults = response.results.filter(result => 
            result.name.toLowerCase() === title.toLowerCase() || 
            result.name.toLowerCase().includes('official trailer') ||
            result.name.toLowerCase().includes('trailer') ||
            result.name.toLowerCase().includes('promo' || 'promos')
        );
        var keywords = ['official trailer', 'trailer', title.toLowerCase(), 'promo', 'promos'];

        var sortedResults = filteredResults.sort((a, b) => {
            var scoreA = keywords.reduce((score, keyword) => score + (a.name.toLowerCase().includes(keyword) ? 1 : 0), 0);
            var scoreB = keywords.reduce((score, keyword) => score + (b.name.toLowerCase().includes(keyword) ? 1 : 0), 0);
            return scoreB - scoreA;
        });
        if(Array.isArray(filteredResults) && filteredResults.length===0) {
            sortedResults = filteredResults = response.results[0]
        }
        var videoId;
        if(sortedResults[0]) videoId = sortedResults[0].key
        else if(sortedResults) videoId = sortedResults.key
        document.querySelector('#play-trailer>button').addEventListener('click', () => {
            document.querySelector('#playerWrap').classList.remove('d-none');
            document.querySelector('#player-movie-info').textContent = `${title} - Trailer`;

            // Create YouTube players
            player = new YT.Player('player', {
                videoId: videoId,
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            })
        })

        document.querySelector('.close-button').addEventListener('click', () => {
            document.querySelector('#playerWrap').classList.add('d-none');
            player.stopVideo();
        })
    } catch (error) {
        console.error('Error:', error)
    }
}

function onPlayerReady(event) {
    event.target.playVideo()
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        player.stopVideo();
    }
}
