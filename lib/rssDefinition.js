var striptags = require('striptags');
var us = require('underscore.string');

var Feed = function () {
    this.title = null;
    this.description = null;
    this.introduction = null;
    this.items = [];
};

Feed.prototype.hasIntroduction = function () {
    return (this.introductionAudioURL !== undefined && this.introductionAudioURL !== null);
};

Feed.prototype.newItem = function(title, audioURL, description) {
    return new FeedItem(title, audioURL, description);
};

Feed.prototype.addItem = function (item) {
    this.items.push(item);
};

Feed.prototype.item = function (index) {
    return this.items[index];
};

Feed.prototype.cardURL = function () {
    return this.imageURL;
};

Feed.prototype.uniqueID = function () {
    return cleanId(this.title);
};

Feed.prototype.length = function () {
    return this.items.length;
};

var FeedItem = function (title, audioURL, description) {
    this.title = title;

    // Auto-convert http to https, but print out a warning
    if (audioURL.startsWith('http:')) {
        // console.error('Invalid URL: ' + audioURL + " Will automatically try as https");
        audioURL = audioURL.replace('http', 'https');
    }

    if (description !== null) {
        this.description = description.trim();
        this.description = striptags(this.description);
    }

    //if (description.startsWith('[['))
    this.audioURL = audioURL;
};

FeedItem.prototype.uniqueID = function () {
    return cleanId(this.title);
};

FeedItem.prototype.scanAudioURL = function(callback) {
    if (this.summaryAudioURL !== undefined) {
        callback(null, this.summaryAudioURL);
    } else {
        callback(null, "https://s3.amazonaws.com/streamer-bucket/NoSummaryAvailable.mp3");
    }
};

var cleanId = function(value) {
    var id = us.replaceAll(value, ' ', '');
    id = us.replaceAll(id, '-', '');
    id = us.replaceAll(id, '\\.', '');
    id = us.replaceAll(id, '/', '');
    id = us.replaceAll(id, ':', '');
    id = us.replaceAll(id, '\\(', '');
    id = us.replaceAll(id, '\\)', '');
    id = us.replaceAll(id, '\'', '');
    return id;
};

exports.Feed = Feed;
exports.FeedItem = FeedItem;



