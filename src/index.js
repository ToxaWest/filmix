import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import VideoView from "./components/videoView";
// eslint-disable-next-line no-extend-native
Array.prototype.sortBy = function (key) { // eslint-disable-line no-use-before-define
    this.sort((a, b) => {
        if (a[key] > b[key]) {
            return -1
        }
        if (a[key] < b[key]) {
            return 1
        }
        return 0
    });
    return this;
};
ReactDOM.render(<VideoView/>, document.getElementById('root'));