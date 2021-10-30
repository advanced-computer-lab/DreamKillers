import mongoose from 'mongoose';
const { Schema } = mongoose;

const airportSchema = new Schema({
    airportName: {type: String}
});

const airport = mongoose.model('Airport',airportSchema);