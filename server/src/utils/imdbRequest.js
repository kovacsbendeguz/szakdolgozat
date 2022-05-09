const request = require('request-promise');

const optionsTrending = {
  method: 'GET',
  url: 'https://movies-tvshows-data-imdb.p.rapidapi.com/',
  //qs: {type: 'get-trending-movies', page: '1'},
  qs: {type: 'get-popular-movies', page: '1', year: '2020'},
  headers: {
    'x-rapidapi-key': '4f9f4b1cf0mshc872305eb0a0134p1c283ejsn050dfeffd872',
    'x-rapidapi-host': 'movies-tvshows-data-imdb.p.rapidapi.com',
    useQueryString: true
  }
};

var optionsDetails = {
  method: 'GET',
  url: 'https://movies-tvshows-data-imdb.p.rapidapi.com/',
  qs: {type: 'get-movie-details', imdb: 'tt2935510'},
  headers: {
    'x-rapidapi-key': '4f9f4b1cf0mshc872305eb0a0134p1c283ejsn050dfeffd872',
    'x-rapidapi-host': 'movies-tvshows-data-imdb.p.rapidapi.com',
    useQueryString: true
  }
};

var optionsPoster = {
  method: 'GET',
  url: 'https://movies-tvshows-data-imdb.p.rapidapi.com/',
  qs: {type: 'get-movies-images-by-imdb', imdb: 'tt1375666'},
  headers: {
    'x-rapidapi-key': '4f9f4b1cf0mshc872305eb0a0134p1c283ejsn050dfeffd872',
    'x-rapidapi-host': 'movies-tvshows-data-imdb.p.rapidapi.com',
    useQueryString: true
  }
};

const optionsPopular = {
  method: 'GET',
  url: 'https://data-imdb1.p.rapidapi.com/movie/order/byPopularit/',
  qs: {page_size: '20', page: '1'},
  headers: {
    'x-rapidapi-key': '4f9f4b1cf0mshc872305eb0a0134p1c283ejsn050dfeffd872',
    'x-rapidapi-host': 'data-imdb1.p.rapidapi.com',
    useQueryString: true
  }
};

var optionsGenre = {
  method: 'GET',
  url: 'https://data-imdb1.p.rapidapi.com/movie/byGen/Drama/',
  qs: {page_size: '20', page: '1'},
  headers: {
    'x-rapidapi-key': '4f9f4b1cf0mshc872305eb0a0134p1c283ejsn050dfeffd872',
    'x-rapidapi-host': 'data-imdb1.p.rapidapi.com',
    useQueryString: true
  }
};

var optionsDetailsFast = {
  method: 'GET',
  url: 'https://data-imdb1.p.rapidapi.com/movie/id/tt1838556/',
  headers: {
    'x-rapidapi-key': '4f9f4b1cf0mshc872305eb0a0134p1c283ejsn050dfeffd872',
    'x-rapidapi-host': 'data-imdb1.p.rapidapi.com',
    useQueryString: true
  }
};

const promisifiedRequest = function(options) {
    return new Promise((resolve,reject) => {
      request(options, (error, response, body) => {
        if (response) {
          return resolve(response);
        }
        if (error) {
          return reject(error);
        }
      });
    });
  };

const usedIDsOfRooms = {"1234":[]}
const pageOfRooms = {}

const getMovieDataList = async (db, code, pref) => {
  try{
    console.log(pref)

    const genre = (pref["genre"] === undefined) ? "SKIP" :  pref["genre"]
    const list = []
    var _movieData = []

    if(!pageOfRooms[code]) {
      pageOfRooms[code] = 0
    }
    var i = 0
    var counter = 0

    while(i < db){

      if(_movieData.length === 0 || counter === (db + 10)) {
        pageOfRooms[code] = pageOfRooms[code] + 1

        if(genre === "SKIP"){
          optionsPopular.qs.page_size = db + 10
          optionsPopular.qs.page = pageOfRooms[code]
          _movieData = await promisifiedRequest(optionsPopular)
        }
        else {
          optionsGenre.qs.page_size = db + 10
          optionsGenre.qs.page = pageOfRooms[code]
          optionsGenre.url = 'https://data-imdb1.p.rapidapi.com/movie/byGen/' + genre + '/'
          _movieData = await promisifiedRequest(optionsGenre)
        }

        _movieData = JSON.parse(_movieData.body)
        _movieData = _movieData['results']
        counter = 0
      }
      else {
        imdbID = _movieData[counter].imdb_id
        counter++

        if(!usedIDsOfRooms[code]) {
          usedIDsOfRooms[code] = []
        }

        if(!usedIDsOfRooms[code].includes(imdbID)){
          
            optionsDetails.qs.imdb = imdbID
            optionsDetailsFast.url = 'https://data-imdb1.p.rapidapi.com/movie/id/' + imdbID + '/'
            var _movieDetails = await promisifiedRequest(optionsDetailsFast)

            _movieDetails = JSON.parse(_movieDetails.body)
            _movieDetails = _movieDetails[(Object.keys(_movieDetails)[0])]

            delete _movieDetails.description
            delete _movieDetails.more_like_this
            delete _movieDetails.gen
            delete _movieDetails.keywords
            console.log(_movieDetails.rating, pref['rating'])
            if(_movieDetails.rating >= pref['rating'] && _movieDetails.movie_length <= pref['length']){
              usedIDsOfRooms[code].push(_movieDetails.imdb_id) 
              i++
              list.push(_movieDetails)
          }
            
        }
      }
    }
    //console.log(list)
    return list
   
  }
  catch(e){
    console.log(e)
    return []
  }

}

const getMatchDetails = async (id) => {
  optionsDetails.qs.imdb = id
  optionsDetailsFast.url = 'https://data-imdb1.p.rapidapi.com/movie/id/' + id + '/'
  var _movieDetails = await promisifiedRequest(optionsDetailsFast)
  _movieDetails = JSON.parse(_movieDetails.body)

  _movieDetails = _movieDetails[(Object.keys(_movieDetails)[0])]
          
  delete _movieDetails.popularity
  delete _movieDetails.content_rating
  delete _movieDetails.description
  delete _movieDetails.more_like_this
  //delete _movieDetails.gen
  delete _movieDetails.keywords

  return _movieDetails
}

const removeRoom = (code) => {
   delete usedIDsOfRooms[code]
   delete pageOfRooms[code]
}
/*
getMovieDataList(10, 1234, {
  genre: "SKIP",
  rating: 7,
  length: 120,
  matchMaking: "half"
})*/


module.exports = {
    getMovieDataList,
    getMatchDetails,
    removeRoom
}