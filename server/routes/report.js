const Report = require('../models/Report');
const _ = require('underscore');

module.exports = {
    getReports: (req, res) => {
        let index = req.query.index || 0;
        index = Number(index);

        let limit = req.query.limit || 10;
        limit = Number(limit);

        Report.find()
            .skip(index)
            .limit(limit)
            .exec((err, report) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Report.count((err, count) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                    res.json({
                        ok: true,
                        report,
                        count
                    });
                });
            });
    },

    postReport: (req, res) => {
        let body = req.body;

        let report = new Report({
            sentBy: req.userInfo._id,
            reason: body.reason,
        });

        report.save((err, report) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                report
            });
        });
    },

    resolveReport: (req, res) => {
        let body = _.pick(req.body, ['resolved']);

        Report.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true }, (err, report) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!report) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe ese reporte'
                    }
                });
            }

            res.json({
                ok: true,
                report
            });
        });
    }
}