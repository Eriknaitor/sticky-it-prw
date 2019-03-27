const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    resolved: {
        type: Boolean,
        default: false,
    },
    reason: {
        type: String,
        trim: true,
        required: [true, 'Tienes que introducir una razón para el reporte']
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const Report = mongoose.model('Report', ReportSchema);
ReportSchema.set('autoIndex', false);

module.exports = Report;