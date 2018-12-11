import React from "react";

class VideoView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seasons: [],
            series: [],
            FilmArray: [],
            last: ''
        }
    }

    componentDidMount() {
        fetch('/static/films.json').then(res => res.json()).then(res => this.setState({FilmArray: res}))
    }

    selectFilm(e) {
        this.setState({seasons: [], playing: false, last: '', series: [], selectedFilm: e.target.value});
        this.filmCounter(e.target.value);
        if (localStorage.getItem(e.target.value)) {
            this.setState({last: localStorage.getItem(e.target.value)})
        }
    };

    async filmCounter(value) {
        let check = true;
        for (let i = 1; i < 100 && check; i++) {
            const query = checkAvalible(value, i);
            // eslint-disable-next-line
            await query.then(res => {
                if (res.status === 200) {
                    const key = this.state.seasons;
                    key.push(i);
                    this.setState({seasons: key});
                } else {
                    check = false;
                }
            });
        }
    }

    selectSeason = (e) => {
        this.setState({selectedSeason: e.target.value, playing: false, series: []});
        this.seasonCounter(e.target.value)
    };

    async seasonCounter(value) {
        let check = true;
        for (let i = 1; i < 500 && check; i++) {
            const query = checkAvalible(this.state.selectedFilm, value, i);
            // eslint-disable-next-line
            await query.then(res => {
                if (res.status === 200) {
                    const key = this.state.series;
                    key.push({num: i, info: res.info});
                    this.setState({series: key, url: res.url});
                } else {
                    check = false;
                }
            });
        }
    }

    getTime() {
        return this.state.series.filter(item => item.num === parseInt(this.state.selectedSeries, 0))[0].info
    }

    getFilmTitle() {
        return this.state.FilmArray.filter(item => item.url === this.state.selectedFilm)[0].title;
    }

    selectSeries = (e) => {
        this.setState({selectedSeries: e.target.value});
        checkAvalible(this.state.selectedFilm, this.state.selectedSeason, e.target.value).then(res => {
            if (res.status === 200) {
                const info = 'Последняе просмотренное: Сезон ' + this.state.selectedSeason + ', Серия ' + this.state.selectedSeries;
                localStorage.setItem(this.state.selectedFilm, info);
                this.setState({playing: res.url});
            }
        });
    };

    render() {
        const series = this.state.series.sortBy('num');
        return (
            <div className={'video'}>
                <h1>Video</h1>
                <div className={'select-wrapper'}>
                    <select defaultValue={null} onChange={(e) => this.selectFilm(e)}>
                        <option value={null}>Фильм...</option>
                        {this.state.FilmArray.map(item =>
                            <option value={item.url} key={item.title}>{item.title}</option>
                        )}
                    </select>
                    {this.state.seasons ?
                        <select defaultValue={null} onChange={this.selectSeason}>
                            <option value={null}>Сезон...</option>
                            {this.state.seasons.sort().map(item =>
                                <option value={item} key={item}>{item} сезон</option>
                            )}
                        </select>
                        : null}
                    {this.state.series ?
                        <select defaultValue={null} onChange={this.selectSeries}>
                            <option value={null}>Серия...</option>
                            {series.map(item =>
                                <option value={item.num} key={item.num}>{item.num} серия ({item.info})</option>
                            )}
                        </select>
                        : null}
                </div>
                <span>{this.state.last}</span>
                {this.state.playing ?
                    <div className={'video-wrapper'}>
                        <h1>{this.getFilmTitle()}
                            <span>{this.state.selectedSeason} сезон, {this.state.selectedSeries} серия
                            ({this.getTime()})</span></h1>
                        <video src={this.state.playing} controls="controls" autoPlay={true}/>
                    </div>
                    : null}

            </div>
        )
    }
}

async function checkAvalible(info, season, series) {
    const params = {
        headers: {'Content-Type': 'application/json'}
    };
    let url = info + 's01e01_480.mp4';
    if (season) {
        url = info + 's' + getNumb(season) + 'e01_480.mp4';
    }
    if (series) {
        url = info + 's' + getNumb(season) + 'e' + getNumb(series) + '_480.mp4';
    }
    return await fetch('http://localhost:3001/check/?id=' + url, params).then(res => res.json())
}

function getNumb(numb) {
    return numb < 10 ? '0' + numb : numb;
}

export default VideoView;