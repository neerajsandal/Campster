const { func } = require('joi');
const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;
const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.review } })
    }
})
const Campground = mongoose.model('Campground', CampgroundSchema)
module.exports = Campground;

